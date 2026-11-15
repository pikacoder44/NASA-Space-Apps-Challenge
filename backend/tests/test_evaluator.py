"""Unit tests for AstroTrack Reference Range Evaluator.

Tests boundary conditions, normal/warning/critical thresholds across all 7 indicators,
unknown indicator validation, and non-numeric value rejection.
"""

import os
import sys
import unittest

_REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
_BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if _REPO_ROOT not in sys.path:
    sys.path.insert(0, _REPO_ROOT)
if _BACKEND_DIR not in sys.path:
    sys.path.insert(0, _BACKEND_DIR)

from app.services.evaluator import evaluate
from app.services.reference_data import REFERENCE_RANGES


class TestReferenceEvaluator(unittest.TestCase):
    """Test suite for reference mode evaluation logic and boundaries."""

    def test_supported_indicators_count(self):
        """Verify exactly 7 health indicators are configured."""
        self.assertEqual(len(REFERENCE_RANGES), 7)
        expected = {
            "heart_rate",
            "blood_pressure_systolic",
            "blood_pressure_diastolic",
            "body_temp",
            "blood_sugar",
            "sleep_hours",
            "mood_score",
        }
        self.assertEqual(set(REFERENCE_RANGES.keys()), expected)

    def test_heart_rate_boundaries(self):
        """Test exact boundary transitions for heart rate (normal: 60-100, warning: 50-120)."""
        # Normal bounds: 60 to 100
        self.assertEqual(evaluate("heart_rate", 60.0).status, "normal")
        self.assertEqual(evaluate("heart_rate", 75.0).status, "normal")
        self.assertEqual(evaluate("heart_rate", 100.0).status, "normal")

        # Warning upper bound: 101 to 120
        self.assertEqual(evaluate("heart_rate", 100.1).status, "warning")
        self.assertEqual(evaluate("heart_rate", 120.0).status, "warning")

        # Warning lower bound: 50 to 59.9
        self.assertEqual(evaluate("heart_rate", 59.9).status, "warning")
        self.assertEqual(evaluate("heart_rate", 50.0).status, "warning")

        # Critical boundaries: < 50 or > 120
        self.assertEqual(evaluate("heart_rate", 49.9).status, "critical")
        self.assertEqual(evaluate("heart_rate", 120.1).status, "critical")
        self.assertEqual(evaluate("heart_rate", 150.0).status, "critical")

    def test_blood_pressure_systolic_boundaries(self):
        """Test systolic blood pressure (normal: 90-120, warning: 80-140)."""
        self.assertEqual(evaluate("blood_pressure_systolic", 115.0).status, "normal")
        self.assertEqual(evaluate("blood_pressure_systolic", 90.0).status, "normal")
        self.assertEqual(evaluate("blood_pressure_systolic", 120.0).status, "normal")

        self.assertEqual(evaluate("blood_pressure_systolic", 125.0).status, "warning")
        self.assertEqual(evaluate("blood_pressure_systolic", 85.0).status, "warning")

        self.assertEqual(evaluate("blood_pressure_systolic", 79.0).status, "critical")
        self.assertEqual(evaluate("blood_pressure_systolic", 145.0).status, "critical")

    def test_blood_pressure_diastolic_boundaries(self):
        """Test diastolic blood pressure (normal: 60-80, warning: 50-90)."""
        self.assertEqual(evaluate("blood_pressure_diastolic", 70.0).status, "normal")
        self.assertEqual(evaluate("blood_pressure_diastolic", 85.0).status, "warning")
        self.assertEqual(evaluate("blood_pressure_diastolic", 45.0).status, "critical")
        self.assertEqual(evaluate("blood_pressure_diastolic", 95.0).status, "critical")

    def test_body_temp_boundaries(self):
        """Test body temperature (normal: 36.1-37.2, warning: 35.5-38.0)."""
        self.assertEqual(evaluate("body_temp", 36.6).status, "normal")
        self.assertEqual(evaluate("body_temp", 36.1).status, "normal")
        self.assertEqual(evaluate("body_temp", 37.2).status, "normal")

        self.assertEqual(evaluate("body_temp", 37.5).status, "warning")
        self.assertEqual(evaluate("body_temp", 35.8).status, "warning")

        self.assertEqual(evaluate("body_temp", 35.0).status, "critical")
        self.assertEqual(evaluate("body_temp", 38.5).status, "critical")

    def test_blood_sugar_boundaries(self):
        """Test blood sugar (normal: 70-140, warning: 60-180)."""
        self.assertEqual(evaluate("blood_sugar", 95.0).status, "normal")
        self.assertEqual(evaluate("blood_sugar", 160.0).status, "warning")
        self.assertEqual(evaluate("blood_sugar", 55.0).status, "critical")
        self.assertEqual(evaluate("blood_sugar", 190.0).status, "critical")

    def test_sleep_hours_boundaries(self):
        """Test sleep hours in reference mode (normal: 7-9, warning: 6-10)."""
        self.assertEqual(evaluate("sleep_hours", 8.0).status, "normal")
        self.assertEqual(evaluate("sleep_hours", 6.5).status, "warning")
        self.assertEqual(evaluate("sleep_hours", 5.0).status, "critical")

    def test_mood_score_boundaries(self):
        """Test mood score in reference mode (normal: 6-10, warning: 4-10)."""
        self.assertEqual(evaluate("mood_score", 8.0).status, "normal")
        self.assertEqual(evaluate("mood_score", 5.0).status, "warning")
        self.assertEqual(evaluate("mood_score", 3.0).status, "critical")

    def test_invalid_and_unknown_indicators(self):
        """Ensure unknown indicator names raise ValueError."""
        with self.assertRaises(ValueError):
            evaluate("unknown_metric", 50.0)

        with self.assertRaises(ValueError):
            evaluate("", 50.0)

    def test_invalid_values_rejected(self):
        """Ensure non-numeric, NaN, and Infinite values raise ValueError."""
        with self.assertRaises(ValueError):
            evaluate("heart_rate", None)  # type: ignore

        with self.assertRaises(ValueError):
            evaluate("heart_rate", float("nan"))

        with self.assertRaises(ValueError):
            evaluate("heart_rate", float("inf"))

        with self.assertRaises(ValueError):
            evaluate("heart_rate", True)  # type: ignore

        with self.assertRaises(ValueError):
            evaluate("heart_rate", False)  # type: ignore

        with self.assertRaises(ValueError):
            evaluate("heart_rate", "not_a_number")  # type: ignore

    def test_result_structure_and_mode(self):
        """Verify returned EvalResult dataclass attributes."""
        res = evaluate("heart_rate", 72.0)
        self.assertEqual(res.status, "normal")
        self.assertEqual(res.mode, "reference")
        self.assertIn("Heart Rate", res.reason)
        self.assertIn("bpm", res.reason)

    def test_history_none_dispatches_reference(self):
        """None history must dispatch to reference mode."""
        res = evaluate("heart_rate", 72.0, history=None)
        self.assertEqual(res.status, "normal")
        self.assertEqual(res.mode, "reference")

    def test_history_empty_dispatches_reference(self):
        """Empty list or tuple history must dispatch to reference mode."""
        res_list = evaluate("heart_rate", 72.0, history=[])
        self.assertEqual(res_list.mode, "reference")

        res_tuple = evaluate("heart_rate", 72.0, history=())
        self.assertEqual(res_tuple.mode, "reference")

    def test_history_under_seven_dispatches_reference(self):
        """Valid sequences with fewer than 7 readings must dispatch to reference mode."""
        res_3 = evaluate("heart_rate", 72.0, history=[65.0, 64.0, 66.0])
        self.assertEqual(res_3.mode, "reference")

        res_6 = evaluate("heart_rate", 72.0, history=(65.0, 64.0, 66.0, 65.5, 64.8, 65.2))
        self.assertEqual(res_6.mode, "reference")

    def test_history_seven_or_more_dispatches_baseline(self):
        """Valid sequences with 7 or more readings must dispatch to baseline mode."""
        res_7 = evaluate("heart_rate", 65.0, history=[65.0, 64.0, 66.0, 65.5, 64.8, 65.2, 66.1])
        self.assertEqual(res_7.mode, "baseline")

        res_10 = evaluate("heart_rate", 65.0, history=(65.0, 64.0, 66.0, 65.5, 64.8, 65.2, 66.1, 65.0, 64.9, 65.1))
        self.assertEqual(res_10.mode, "baseline")

    def test_invalid_history_entries_rejected(self):
        """If history contains any invalid entry, reject immediately with ValueError rather than falling back."""
        base_6 = [65.0, 64.0, 66.0, 65.5, 64.8, 65.2]

        # None element
        with self.assertRaises(ValueError):
            evaluate("heart_rate", 65.0, history=base_6 + [None])  # type: ignore

        # Boolean elements (True and False)
        with self.assertRaises(ValueError):
            evaluate("heart_rate", 65.0, history=base_6 + [True])  # type: ignore

        with self.assertRaises(ValueError):
            evaluate("heart_rate", 65.0, history=base_6 + [False])  # type: ignore

        # String element
        with self.assertRaises(ValueError):
            evaluate("heart_rate", 65.0, history=base_6 + ["invalid_string"])  # type: ignore

        # NaN element
        with self.assertRaises(ValueError):
            evaluate("heart_rate", 65.0, history=base_6 + [float("nan")])

        # Positive and negative infinity
        with self.assertRaises(ValueError):
            evaluate("heart_rate", 65.0, history=base_6 + [float("inf")])

        with self.assertRaises(ValueError):
            evaluate("heart_rate", 65.0, history=base_6 + [-float("inf")])

        # Even with < 7 elements, invalid element must raise ValueError, not fall back to reference mode
        with self.assertRaises(ValueError):
            evaluate("heart_rate", 65.0, history=[65.0, None, 64.0])  # type: ignore

    def test_unsupported_history_types_rejected(self):
        """Unsupported container types (str, bytes, dict, int) must raise TypeError."""
        with self.assertRaises(TypeError):
            evaluate("heart_rate", 65.0, history="65.0,64.0,66.0")  # type: ignore

        with self.assertRaises(TypeError):
            evaluate("heart_rate", 65.0, history=b"65.0,64.0")  # type: ignore

        with self.assertRaises(TypeError):
            evaluate("heart_rate", 65.0, history={"readings": [65.0] * 7})  # type: ignore

        with self.assertRaises(TypeError):
            evaluate("heart_rate", 65.0, history=12345)  # type: ignore

    def test_extreme_large_int_overflow_rejected(self):
        """Extremely large integers that overflow float conversion must raise ValueError."""
        huge_int = 10**400

        # In current measurement value
        with self.assertRaises(ValueError):
            evaluate("heart_rate", huge_int)

        # In historical reading
        with self.assertRaises(ValueError):
            evaluate("heart_rate", 65.0, history=[65.0, 64.0, 66.0, 65.5, 64.8, 65.2, huge_int])


if __name__ == "__main__":
    unittest.main()
