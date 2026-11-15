"""Unit tests for AstroTrack Personal Baseline Anomaly Detection Engine.

Tests z-score computation, activation threshold (>= 7 readings), insufficient history fallback,
standard deviation edge cases, vital absolute safety priority, and the Day 90 warning scenario.
"""

import os
import sys
import unittest
from unittest.mock import patch

_REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
_BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if _REPO_ROOT not in sys.path:
    sys.path.insert(0, _REPO_ROOT)
if _BACKEND_DIR not in sys.path:
    sys.path.insert(0, _BACKEND_DIR)

from app.services.baseline import (
    calculate_baseline_stats,
    evaluate_baseline,
)
from app.services.evaluator import evaluate


class TestBaselineEvaluator(unittest.TestCase):
    """Test suite for personal baseline mode and z-score anomaly detection."""

    def test_activation_threshold(self):
        """Baseline mode requires at least 7 historical readings; otherwise falls back to reference."""
        # 6 readings -> Reference Mode
        short_history = [64.0, 65.0, 64.5, 65.2, 64.8, 65.0]
        self.assertEqual(len(short_history), 6)
        res_short = evaluate("heart_rate", 64.0, history=short_history)
        self.assertEqual(res_short.mode, "reference")

        # 7 readings -> Personal Baseline Mode
        full_history = [64.0, 65.0, 64.5, 65.2, 64.8, 65.0, 64.9]
        self.assertEqual(len(full_history), 7)
        res_full = evaluate("heart_rate", 64.0, history=full_history)
        self.assertEqual(res_full.mode, "baseline")

    def test_insufficient_or_none_history_fallback(self):
        """Empty or None history cleanly falls back to reference mode."""
        res_none = evaluate("heart_rate", 70.0, history=None)
        self.assertEqual(res_none.mode, "reference")

        res_empty = evaluate("heart_rate", 70.0, history=[])
        self.assertEqual(res_empty.mode, "reference")

    def test_zero_variance_history_no_zero_division(self):
        """Zero variance (identical history readings) safely uses epsilon std without raising ZeroDivisionError."""
        flat_history = [70.0, 70.0, 70.0, 70.0, 70.0, 70.0, 70.0]
        mean, std = calculate_baseline_stats(flat_history)
        self.assertEqual(mean, 70.0)
        self.assertGreater(std, 0.0)

        # Same value -> normal
        res_same = evaluate("heart_rate", 70.0, history=flat_history)
        self.assertEqual(res_same.status, "normal")
        self.assertEqual(res_same.mode, "baseline")

        # Deviation from flat history -> detects deviation safely
        res_diff = evaluate("heart_rate", 75.0, history=flat_history)
        self.assertIn(res_diff.status, ["warning", "critical"])
        self.assertEqual(res_diff.mode, "baseline")

    def test_vital_absolute_danger_limit_overrides_baseline(self):
        """Vital indicators outside warning limits are ALWAYS critical, even with adapted baseline."""
        # Baseline with high resting heart rate of 115 bpm
        high_hr_history = [115.0, 116.0, 114.0, 115.5, 116.2, 115.1, 114.8, 115.0]
        # 125 bpm exceeds reference warning range (50-120 bpm) -> MUST be critical
        res = evaluate("heart_rate", 125.0, history=high_hr_history)
        self.assertEqual(res.status, "critical")
        self.assertIn("absolute safety limit", res.reason.lower())

        # Low vital below absolute minimum: systolic blood pressure < 80 mmHg
        low_bp_history = [85.0, 84.0, 86.0, 85.5, 84.8, 85.2, 85.0]
        res_bp = evaluate("blood_pressure_systolic", 75.0, history=low_bp_history)
        self.assertEqual(res_bp.status, "critical")
        self.assertIn("absolute safety limit", res_bp.reason.lower())

    def test_sleep_and_mood_directionality(self):
        """Higher sleep or elevated mood is normal; only significant drops are flagged."""
        # Realistic sleep history: mean ~7.1h, std ~0.62h
        sleep_history = [6.1, 7.9, 6.4, 7.8, 7.0, 7.1, 6.3, 7.7, 7.5, 6.8]

        # Extra sleep (8.5 h) is positive, should evaluate to normal
        res_extra_sleep = evaluate("sleep_hours", 8.5, history=sleep_history)
        self.assertEqual(res_extra_sleep.status, "normal")

        # Sleep drop to 5.7h (z ~ -2.2) triggers warning
        res_low_sleep = evaluate("sleep_hours", 5.7, history=sleep_history)
        self.assertEqual(res_low_sleep.status, "warning")
        self.assertIn("below your", res_low_sleep.reason)

        # Severe sleep deprivation (4.0 h, z ~ -4.9) triggers critical
        res_deprived = evaluate("sleep_hours", 4.0, history=sleep_history)
        self.assertEqual(res_deprived.status, "critical")

        # Mood increase (9.5) is normal
        mood_history = [7.0, 9.0, 7.5, 8.8, 7.9, 8.2, 7.4, 8.5, 7.8, 8.1]
        res_high_mood = evaluate("mood_score", 9.5, history=mood_history)
        self.assertEqual(res_high_mood.status, "normal")

        # Mood drop to 6.8 (z ~ -2.0) triggers warning
        res_low_mood = evaluate("mood_score", 6.8, history=mood_history)
        self.assertEqual(res_low_mood.status, "warning")

    def test_sleep_and_mood_no_absolute_danger_limits(self):
        """Sleep and mood do not have artificial absolute danger thresholds."""
        # Sleep at 5.7h with realistic personal baseline evaluates to warning (not critical)
        sleep_history = [6.1, 7.9, 6.4, 7.8, 7.0, 7.1, 6.3, 7.7, 7.5, 6.8]
        res = evaluate("sleep_hours", 5.7, history=sleep_history)
        self.assertEqual(res.status, "warning")

    def test_day_90_story_scenario(self):
        """Verify the Day 90 workload/sleep debt story produces a WARNING status."""
        from data.simulator.generate import RANDOM_SEED, generate_mission_data

        records = generate_mission_data(RANDOM_SEED)
        by_ind = {}
        for r in records:
            by_ind.setdefault(r["indicator"], {})[r["day"]] = r["value"]

        # Days 60-89 history
        sleep_hist = [by_ind["sleep_hours"][d] for d in range(60, 90)]
        hr_hist = [by_ind["heart_rate"][d] for d in range(60, 90)]
        mood_hist = [by_ind["mood_score"][d] for d in range(60, 90)]

        # Day 90 readings
        day90_sleep = evaluate("sleep_hours", by_ind["sleep_hours"][90], history=sleep_hist)
        day90_hr = evaluate("heart_rate", by_ind["heart_rate"][90], history=hr_hist)
        day90_mood = evaluate("mood_score", by_ind["mood_score"][90], history=mood_hist)

        # On Day 90, each of these must be 'warning' (not critical, not normal)
        self.assertEqual(day90_sleep.status, "warning")
        self.assertEqual(day90_hr.status, "warning")
        self.assertEqual(day90_mood.status, "warning")

    def test_direct_evaluate_baseline_validation(self):
        """Direct invocation of evaluate_baseline must reject invalid values and insufficient history."""
        valid_history = [65.0, 64.0, 66.0, 65.5, 64.8, 65.2, 66.1]

        # Rejects boolean value
        with self.assertRaises(ValueError):
            evaluate_baseline("heart_rate", True, history=valid_history)  # type: ignore

        # Rejects NaN
        with self.assertRaises(ValueError):
            evaluate_baseline("heart_rate", float("nan"), history=valid_history)

        # Rejects infinite values
        with self.assertRaises(ValueError):
            evaluate_baseline("heart_rate", float("inf"), history=valid_history)

    def test_invalid_history_entries(self):
        """History containing any invalid element (None, bool, NaN, inf, str) must raise ValueError."""
        base = [65.0, 64.0, 66.0, 65.5, 64.8, 65.2, 66.1]

        with self.assertRaises(ValueError):
            evaluate_baseline("heart_rate", 65.0, history=base + [None])  # type: ignore

        with self.assertRaises(ValueError):
            evaluate_baseline("heart_rate", 65.0, history=base + [True])  # type: ignore

        with self.assertRaises(ValueError):
            evaluate_baseline("heart_rate", 65.0, history=base + [float("nan")])

        with self.assertRaises(ValueError):
            evaluate_baseline("heart_rate", 65.0, history=base + [float("inf")])

        with self.assertRaises(ValueError):
            evaluate_baseline("heart_rate", 65.0, history=base + ["corrupted"])  # type: ignore

    def test_tuple_and_sequence_input(self):
        """Tuples and generic sequences of numbers must be accepted."""
        tuple_history = (65.0, 64.0, 66.0, 65.5, 64.8, 65.2, 66.1)
        res = evaluate_baseline("heart_rate", 65.0, history=tuple_history)
        self.assertEqual(res.status, "normal")
        self.assertEqual(res.mode, "baseline")

        mean, std = calculate_baseline_stats(tuple_history)
        self.assertAlmostEqual(mean, sum(tuple_history) / len(tuple_history))
        self.assertGreater(std, 0.0)

    def test_unsupported_history_types(self):
        """Strings, bytes, and non-sequence types must raise TypeError."""
        with self.assertRaises(TypeError):
            evaluate_baseline("heart_rate", 65.0, history="65.0,64.0,66.0,65.0,64.0,66.0,65.0")  # type: ignore

        with self.assertRaises(TypeError):
            evaluate_baseline("heart_rate", 65.0, history=b"1234567")  # type: ignore

        with self.assertRaises(TypeError):
            evaluate_baseline("heart_rate", 65.0, history=12345)  # type: ignore

        with self.assertRaises(TypeError):
            evaluate_baseline("heart_rate", 65.0, history={"data": [65.0] * 7})  # type: ignore

    def test_minimum_valid_reading_requirements(self):
        """Must reject history with fewer than 7 valid readings."""
        with self.assertRaises(ValueError):
            evaluate_baseline("heart_rate", 65.0, history=[65.0, 66.0, 64.0, 65.0, 64.0, 66.0])

        # Exactly 7 valid readings succeeds
        res = evaluate_baseline("heart_rate", 65.0, history=[65.0, 66.0, 64.0, 65.0, 64.0, 66.0, 65.0])
        self.assertEqual(res.mode, "baseline")

    def test_baseline_wording_accuracy(self):
        """Explanation reasons must accurately reference reading counts instead of days."""
        hist_10 = [65.0, 64.0, 66.0, 65.5, 64.8, 65.2, 66.1, 65.0, 64.5, 65.5]

        # Normal vital
        res_norm = evaluate_baseline("heart_rate", 65.0, history=hist_10)
        self.assertIn("based on your last 10 readings", res_norm.reason)
        self.assertNotIn("-day", res_norm.reason)
        self.assertNotIn("30-day", res_norm.reason)

        # Warning vital
        res_warn = evaluate_baseline("heart_rate", 72.0, history=hist_10)
        self.assertIn("based on your last 10 readings", res_warn.reason)
        self.assertNotIn("-day", res_warn.reason)

        # Sleep hours drop
        sleep_hist = [6.1, 7.9, 6.4, 7.8, 7.0, 7.1, 6.3, 7.7, 7.5, 6.8]
        res_sleep = evaluate_baseline("sleep_hours", 5.7, history=sleep_hist)
        self.assertIn("based on your last 10 readings", res_sleep.reason)
        self.assertNotIn("-day", res_sleep.reason)

    def test_extreme_values_in_direct_stats_calculation(self):
        """Direct calculate_baseline_stats must raise ValueError on extreme values that overflow mean or variance."""
        # Arithmetic overflow in mean (1e308 + 1e308 -> inf)
        with self.assertRaises(ValueError):
            calculate_baseline_stats([1e308] * 7)

        # Arithmetic overflow in variance (diff**2 -> OverflowError)
        with self.assertRaises(ValueError):
            calculate_baseline_stats([1e200, -1e200, 1e200, -1e200, 1e200, -1e200, 1e200])

    def test_extreme_values_in_historical_readings(self):
        """evaluate_baseline must raise ValueError when history contains extreme values causing arithmetic overflow."""
        with self.assertRaises(ValueError):
            evaluate_baseline("heart_rate", 65.0, history=[1e308] * 7)

        with self.assertRaises(ValueError):
            evaluate_baseline(
                "sleep_hours",
                7.0,
                history=[1e200, -1e200, 1e200, -1e200, 1e200, -1e200, 1e200],
            )

    def test_extreme_current_measurement_values(self):
        """evaluate_baseline must raise ValueError when measurement value causes z-score calculation overflow."""
        import sys
        max_float = sys.float_info.max

        with self.assertRaises(ValueError):
            evaluate_baseline("sleep_hours", max_float, history=[7.0] * 7)

        with self.assertRaises(ValueError):
            evaluate_baseline("mood_score", -max_float, history=[8.0] * 7)

    def test_normal_valid_calculations_unchanged(self):
        """Ensure normal valid historical and current values remain completely unchanged."""
        history = [65.0, 64.0, 66.0, 65.5, 64.8, 65.2, 66.1]
        mean, std = calculate_baseline_stats(history)
        expected_mean = sum(history) / len(history)
        self.assertAlmostEqual(mean, expected_mean)
        self.assertGreater(std, 0.0)

        # Standard normal evaluation
        res = evaluate_baseline("heart_rate", 65.0, history=history)
        self.assertEqual(res.status, "normal")
        self.assertEqual(res.mode, "baseline")

    def test_direct_calculate_baseline_stats_independent_validation(self):
        """calculate_baseline_stats must perform complete independent validation when called directly."""
        # Rejects None
        with self.assertRaises(ValueError):
            calculate_baseline_stats(None)  # type: ignore

        # Rejects string
        with self.assertRaises(TypeError):
            calculate_baseline_stats("invalid")  # type: ignore

        # Rejects empty sequence
        with self.assertRaises(ValueError):
            calculate_baseline_stats([])

        # Rejects None element
        with self.assertRaises(ValueError):
            calculate_baseline_stats([10.0, None, 20.0])  # type: ignore

        # Rejects boolean element
        with self.assertRaises(ValueError):
            calculate_baseline_stats([10.0, True, 20.0])  # type: ignore

        # Rejects NaN
        with self.assertRaises(ValueError):
            calculate_baseline_stats([10.0, float("nan"), 20.0])

        # Rejects inf
        with self.assertRaises(ValueError):
            calculate_baseline_stats([10.0, float("inf"), 20.0])

        # Valid direct call computes accurate statistics
        mean, std = calculate_baseline_stats([10.0, 20.0, 30.0])
        self.assertEqual(mean, 20.0)
        import math
        self.assertAlmostEqual(std, math.sqrt(200.0 / 3.0))


    @patch.dict("app.services.baseline.MIN_STD", {}, clear=True)
    def test_z_score_boundary_fp_regression(self):
        """Regression: z=2.5 and z=1.5 exact boundary values must land in warning, not critical/normal.

        Runs without the per-indicator SD floor (so std = EPSILON_STD) and around
        105 bpm, i.e. outside the normal reference range, so the "never critical
        inside the normal range" rule does not mask the z-score bands under test.

        IEEE 754 representation of values like mean + 2.5 * epsilon_std can produce a
        z-score of 2.5000000000005684 due to catastrophic cancellation in subtraction.
        Without rounding, this falls into the critical band. The fix (round(z_score, 10))
        must keep conceptually exact boundary values in the correct band.

        Tested with flat history (std=0, clamped to EPSILON_STD=0.01) because that is the
        only configuration where the FP drift is large enough to cross the boundary.
        """
        from app.services.baseline import EPSILON_STD

        # Flat history of 7 identical values -> std=0.0, clamped to EPSILON_STD (0.01)
        h_flat = [105.0] * 7
        mean = 105.0
        eps = EPSILON_STD  # 0.01

        # --- Upper bound: z = +2.5 (vitals branch, both directions) ---
        # Value that produces the problematic z = 2.5000000000005684 without the fix
        val_z2p5_exact = mean + 2.5 * eps  # = 65.025 (stored as 65.02500000000000568...)

        # z just below 2.5 -> warning
        val_below_2p5 = mean + (2.5 - 1e-9) * eps
        res_below = evaluate_baseline("heart_rate", val_below_2p5, history=h_flat)
        self.assertEqual(res_below.status, "warning",
                         f"z just below 2.5 must be warning, got {res_below.status}")

        # z = 2.5 (exact representation boundary) -> warning, not critical
        res_at = evaluate_baseline("heart_rate", val_z2p5_exact, history=h_flat)
        self.assertEqual(res_at.status, "warning",
                         f"z=2.5 exact must be warning, got {res_at.status} "
                         f"(FP regression: 65.025-65.0 yields z>2.5 without round())")

        # z just above 2.5 -> critical
        val_above_2p5 = mean + (2.5 + 1e-6) * eps
        res_above = evaluate_baseline("heart_rate", val_above_2p5, history=h_flat)
        self.assertEqual(res_above.status, "critical",
                         f"z clearly above 2.5 must be critical, got {res_above.status}")

        # --- Negative direction: z = -2.5 (vitals branch, below mean) ---
        val_neg_z2p5 = mean - 2.5 * eps  # = 64.975
        res_neg_at = evaluate_baseline("heart_rate", val_neg_z2p5, history=h_flat)
        self.assertEqual(res_neg_at.status, "warning",
                         f"z=-2.5 exact must be warning, got {res_neg_at.status}")

        val_neg_above = mean - (2.5 + 1e-6) * eps
        res_neg_above = evaluate_baseline("heart_rate", val_neg_above, history=h_flat)
        self.assertEqual(res_neg_above.status, "critical",
                         f"z clearly below -2.5 must be critical, got {res_neg_above.status}")

        # --- Upper bound: z = +1.5 (vitals branch, normal/warning boundary) ---
        val_z1p5_exact = mean + 1.5 * eps  # = 65.015

        # z just below 1.5 -> normal
        val_below_1p5 = mean + (1.5 - 1e-9) * eps
        res_norm = evaluate_baseline("heart_rate", val_below_1p5, history=h_flat)
        self.assertEqual(res_norm.status, "normal",
                         f"z just below 1.5 must be normal, got {res_norm.status}")

        # z = 1.5 exact -> warning (1.5 <= abs_z <= 2.5)
        res_at_1p5 = evaluate_baseline("heart_rate", val_z1p5_exact, history=h_flat)
        self.assertEqual(res_at_1p5.status, "warning",
                         f"z=1.5 exact must be warning, got {res_at_1p5.status}")

        # z just above 1.5 -> warning
        val_above_1p5 = mean + (1.5 + 1e-6) * eps
        res_above_1p5 = evaluate_baseline("heart_rate", val_above_1p5, history=h_flat)
        self.assertEqual(res_above_1p5.status, "warning",
                         f"z just above 1.5 must be warning, got {res_above_1p5.status}")

        # --- Sleep/mood branch: z = -2.5 boundary (only drops count) ---
        h_sleep_flat = [6.5] * 7
        mean_s = 6.5

        val_sleep_z2p5 = mean_s - 2.5 * eps  # z = -2.5 exact
        res_sleep_at = evaluate_baseline("sleep_hours", val_sleep_z2p5, history=h_sleep_flat)
        self.assertEqual(res_sleep_at.status, "warning",
                         f"sleep z=-2.5 exact must be warning, got {res_sleep_at.status}")

        val_sleep_above = mean_s - (2.5 + 1e-6) * eps
        res_sleep_above = evaluate_baseline("sleep_hours", val_sleep_above, history=h_sleep_flat)
        self.assertEqual(res_sleep_above.status, "critical",
                         f"sleep z clearly below -2.5 must be critical, got {res_sleep_above.status}")



class TestBaselineCalibration(unittest.TestCase):
    """SD floor and 'never critical inside the normal reference range' rule."""

    def test_small_change_on_stable_history_is_normal(self):
        # Flat 65 bpm history: +2 bpm used to be "extreme deviation" (std clamped to 0.01).
        res = evaluate_baseline("heart_rate", 67.0, history=[65.0] * 10)
        self.assertEqual(res.status, "normal")

    def test_value_inside_normal_range_is_never_critical(self):
        res = evaluate_baseline("heart_rate", 95.0, history=[65.0] * 10)  # z = 12, but 95 is in 60-100
        self.assertEqual(res.status, "warning")
        self.assertIn("normal reference range", res.reason)
        res = evaluate_baseline("body_temp", 37.1, history=[36.5] * 10)
        self.assertEqual(res.status, "warning")

    def test_large_deviation_outside_normal_range_is_still_critical(self):
        self.assertEqual(evaluate_baseline("heart_rate", 110.0, history=[65.0] * 10).status, "critical")
        self.assertEqual(evaluate_baseline("sleep_hours", 4.0, history=[7.5] * 10).status, "critical")

    def test_absolute_vital_limits_unchanged(self):
        self.assertEqual(evaluate_baseline("heart_rate", 130.0, history=[110.0] * 10).status, "critical")

    def test_simulated_mission_has_few_critical_days_and_day_90_is_warning(self):
        from app.routers.dashboard import _load_fallback_mission_data, compute_dashboard_summary
        overall = {
            d: compute_dashboard_summary(indicator_data=_load_fallback_mission_data(day=d), mission_day=d).overall_status
            for d in range(1, 181)
        }
        self.assertEqual(overall[90], "warning")
        self.assertEqual([overall[d] for d in (42, 43, 44)], ["critical"] * 3)  # infection event
        self.assertLessEqual(sum(1 for v in overall.values() if v == "critical"), 10)

if __name__ == "__main__":
    unittest.main()
