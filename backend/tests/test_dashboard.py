"""Unit tests for AstroTrack Dashboard Router and Schemas.

Tests overall status priority aggregation, sequential sparkline trend generation,
strict telemetry validation, deliberate handling of missing indicators,
and simulator data path resolution / fallback behavior.
"""

import json
import os
import sys
import unittest
from unittest.mock import mock_open, patch

_REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
_BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if _REPO_ROOT not in sys.path:
    sys.path.insert(0, _REPO_ROOT)
if _BACKEND_DIR not in sys.path:
    sys.path.insert(0, _BACKEND_DIR)

from app.routers.dashboard import (
    DEMO_FALLBACK_DATA,
    SIMULATOR_ENV_VAR,
    _load_fallback_mission_data,
    calculate_trend,
    compute_dashboard_summary,
    get_dashboard_summary,
    get_simulator_data_path,
)
from app.schemas.dashboard import DashboardSummaryResponse, IndicatorSummary
from app.services.reference_data import REFERENCE_RANGES, get_display_name


def _build_valid_indicator_data(**overrides):
    """Helper to generate a complete, valid dictionary with all 7 indicators."""
    base = {
        "heart_rate": {"latest": 70.0, "history": [70.0] * 10},
        "blood_pressure_systolic": {"latest": 115.0, "history": [115.0] * 10},
        "blood_pressure_diastolic": {"latest": 75.0, "history": [75.0] * 10},
        "body_temp": {"latest": 36.6, "history": [36.6] * 10},
        "blood_sugar": {"latest": 90.0, "history": [90.0] * 10},
        "sleep_hours": {"latest": 7.5, "history": [7.5] * 10},
        "mood_score": {"latest": 8.0, "history": [8.0] * 10},
    }
    base.update(overrides)
    return base


class TestDashboardSummary(unittest.TestCase):
    """Test suite for the dashboard summary computation and schema."""

    def test_dashboard_response_schema(self):
        """Verify dashboard response matches DashboardSummaryResponse schema."""
        summary = compute_dashboard_summary(astronaut_id="astro-42")
        self.assertIsInstance(summary, DashboardSummaryResponse)
        self.assertEqual(summary.astronaut_id, "astro-42")
        self.assertEqual(summary.mission_day, 90)
        self.assertIn(summary.overall_status, ["normal", "warning", "critical"])
        self.assertEqual(len(summary.indicators), 7)
        self.assertTrue(len(summary.disclaimer) > 10)

        expected_indicators = set(REFERENCE_RANGES.keys())
        returned_indicators = {ind.indicator for ind in summary.indicators}
        self.assertEqual(returned_indicators, expected_indicators)

        for ind in summary.indicators:
            self.assertIsInstance(ind, IndicatorSummary)
            self.assertIsInstance(ind.name, str)
            self.assertEqual(ind.name, get_display_name(ind.indicator))
            self.assertIsInstance(ind.value, (int, float))
            self.assertIsInstance(ind.latest_value, (int, float))
            self.assertEqual(ind.value, ind.latest_value)
            self.assertIsInstance(ind.unit, str)
            self.assertIn(ind.status, ["normal", "warning", "critical"])
            self.assertTrue(len(ind.reason) > 5)
            self.assertEqual(ind.message, ind.reason)
            self.assertIn(ind.trend, ["up", "down", "stable"])
            self.assertIsInstance(ind.trend_7d, list)
            self.assertLessEqual(len(ind.trend_7d), 7)
            self.assertIn(ind.mode, ["baseline", "reference"])

    def test_overall_status_priority_critical_over_warning(self):
        """Critical status anywhere must override warning and normal."""
        test_data = _build_valid_indicator_data(
            heart_rate={"latest": 140.0, "history": [65.0] * 10},  # Critical (> 120 bpm)
            sleep_hours={"latest": 5.6, "history": [7.1] * 10},    # Warning
        )
        res = compute_dashboard_summary(astronaut_id="1", indicator_data=test_data)
        self.assertEqual(res.overall_status, "critical")

    def test_overall_status_priority_warning_over_normal(self):
        """Warning status anywhere must override normal when no critical exists."""
        test_data = _build_valid_indicator_data(
            sleep_hours={"latest": 5.7, "history": [6.1, 7.9, 6.4, 7.8, 7.0, 7.1, 6.3, 7.7, 7.5, 6.8]},
        )
        res = compute_dashboard_summary(astronaut_id="1", indicator_data=test_data)
        self.assertEqual(res.overall_status, "warning")

    def test_overall_status_all_normal(self):
        """When all indicators are normal, overall status must be normal."""
        test_data = _build_valid_indicator_data()
        res = compute_dashboard_summary(astronaut_id="1", indicator_data=test_data)
        self.assertEqual(res.overall_status, "normal")

    def test_seven_day_trend_generation(self):
        """Trend must capture the last 7 sequential chronological points ending with latest_value."""
        # 10 historical values + 1 latest value
        hr_history = [60.0, 61.0, 62.0, 63.0, 64.0, 65.0, 66.0, 67.0, 68.0, 69.0]
        latest_hr = 70.0
        test_data = _build_valid_indicator_data(
            heart_rate={"latest": latest_hr, "history": hr_history}
        )
        res = compute_dashboard_summary(astronaut_id="1", indicator_data=test_data)
        hr_summary = next(ind for ind in res.indicators if ind.indicator == "heart_rate")

        # Trend should be exactly the last 7 values: [64.0, 65.0, 66.0, 67.0, 68.0, 69.0, 70.0]
        self.assertEqual(len(hr_summary.trend_7d), 7)
        self.assertEqual(hr_summary.trend_7d[-1], latest_hr)
        self.assertEqual(hr_summary.trend_7d, [64.0, 65.0, 66.0, 67.0, 68.0, 69.0, 70.0])

        # Short history (< 7 items): trend has len(history) + 1 items
        short_sleep_history = [7.0, 7.2]
        test_short = _build_valid_indicator_data(
            sleep_hours={"latest": 6.8, "history": short_sleep_history}
        )
        res_short = compute_dashboard_summary(astronaut_id="1", indicator_data=test_short)
        sleep_summary = next(ind for ind in res_short.indicators if ind.indicator == "sleep_hours")
        self.assertEqual(sleep_summary.trend_7d, [7.0, 7.2, 6.8])

    def test_missing_and_partial_indicator_data_rejected(self):
        """Missing or partial indicator data must raise ValueError rather than substituting fake healthy defaults."""
        # Completely empty dictionary
        with self.assertRaises(ValueError) as ctx_empty:
            compute_dashboard_summary(astronaut_id="1", indicator_data={})
        self.assertIn("Missing required indicator", str(ctx_empty.exception))

        # Partial dictionary (only heart_rate provided)
        partial_data = {"heart_rate": {"latest": 72.0, "history": [70.0, 71.0]}}
        with self.assertRaises(ValueError) as ctx_partial:
            compute_dashboard_summary(astronaut_id="1", indicator_data=partial_data)
        self.assertIn("Missing required indicator", str(ctx_partial.exception))

        # Indicator record missing 'latest'
        missing_latest_data = _build_valid_indicator_data()
        del missing_latest_data["heart_rate"]["latest"]
        with self.assertRaises(ValueError) as ctx_latest:
            compute_dashboard_summary(astronaut_id="1", indicator_data=missing_latest_data)
        self.assertIn("Missing 'latest' measurement", str(ctx_latest.exception))

        # Non-dictionary indicator_data
        with self.assertRaises(ValueError):
            compute_dashboard_summary(astronaut_id="1", indicator_data=["invalid"])  # type: ignore

    def test_invalid_and_non_numeric_measurements_rejected(self):
        """Booleans, strings, NaN, infinity, and malformed history must be rejected."""
        # Boolean rejected in latest
        bool_data = _build_valid_indicator_data(heart_rate={"latest": True, "history": [70.0] * 7})
        with self.assertRaises(ValueError):
            compute_dashboard_summary(astronaut_id="1", indicator_data=bool_data)

        # String rejected in latest
        str_data = _build_valid_indicator_data(heart_rate={"latest": "72.0", "history": [70.0] * 7})
        with self.assertRaises(ValueError):
            compute_dashboard_summary(astronaut_id="1", indicator_data=str_data)

        # NaN rejected in latest
        nan_data = _build_valid_indicator_data(heart_rate={"latest": float("nan"), "history": [70.0] * 7})
        with self.assertRaises(ValueError):
            compute_dashboard_summary(astronaut_id="1", indicator_data=nan_data)

        # Infinity rejected in latest
        inf_data = _build_valid_indicator_data(heart_rate={"latest": float("inf"), "history": [70.0] * 7})
        with self.assertRaises(ValueError):
            compute_dashboard_summary(astronaut_id="1", indicator_data=inf_data)

        # Boolean rejected in history
        bool_hist_data = _build_valid_indicator_data(heart_rate={"latest": 72.0, "history": [70.0, True, 71.0]})
        with self.assertRaises(ValueError):
            compute_dashboard_summary(astronaut_id="1", indicator_data=bool_hist_data)

        # NaN rejected in history
        nan_hist_data = _build_valid_indicator_data(heart_rate={"latest": 72.0, "history": [70.0, float("nan")]})
        with self.assertRaises(ValueError):
            compute_dashboard_summary(astronaut_id="1", indicator_data=nan_hist_data)

        # Non-sequence history rejected
        str_hist_data = _build_valid_indicator_data(heart_rate={"latest": 72.0, "history": "not-a-sequence"})
        with self.assertRaises(TypeError):
            compute_dashboard_summary(astronaut_id="1", indicator_data=str_hist_data)

    def test_simulator_data_loading_and_fallback(self):
        """Test simulator data path resolution, missing file handling, and demo fallback without requiring disk file."""
        # 1. Fallback to canonical repository path when no candidate paths exist on disk
        with patch("os.path.exists", return_value=False):
            with patch.dict(os.environ, {}, clear=True):
                default_path = get_simulator_data_path()
                self.assertTrue(default_path.endswith("mission_data.json"))

        # 2. Candidate discovery when container mount exists
        with patch("os.path.exists", side_effect=lambda p: p == "/data/simulator/mission_data.json"):
            with patch.dict(os.environ, {}, clear=True):
                self.assertEqual(get_simulator_data_path(), "/data/simulator/mission_data.json")

        # 3. Custom SIMULATOR_DATA_PATH environment variable override
        with patch.dict(os.environ, {SIMULATOR_ENV_VAR: "/custom/path/mission_data.json"}):
            self.assertEqual(get_simulator_data_path(), "/custom/path/mission_data.json")

        # 4. Successful mocked data loading independent of repository disk file
        mock_records = [
            {"day": 1, "indicator": ind, "value": 70.0}
            for ind in REFERENCE_RANGES.keys()
        ]
        with patch("app.routers.dashboard.get_simulator_data_path", return_value="/mock/mission_data.json"):
            with patch("os.path.exists", return_value=True):
                with patch("builtins.open", mock_open(read_data=json.dumps(mock_records))):
                    loaded = _load_fallback_mission_data(day=1)
                    self.assertEqual(set(loaded.keys()), set(REFERENCE_RANGES.keys()))
                    self.assertEqual(loaded["heart_rate"]["latest"], 70.0)
                    self.assertEqual(loaded["heart_rate"]["history"], [])

        # 5. Missing file raises FileNotFoundError with actionable message when fallback disabled
        with patch("app.routers.dashboard.get_simulator_data_path", return_value="/nonexistent/path.json"):
            with patch("os.path.exists", return_value=False):
                with self.assertRaises(FileNotFoundError) as ctx:
                    _load_fallback_mission_data(day=90, allow_demo_fallback=False)
                self.assertIn("Simulated mission data file not found", str(ctx.exception))
                self.assertIn("SIMULATOR_DATA_PATH", str(ctx.exception))

                # 6. When allow_demo_fallback=True, documented demo data is returned
                demo_data = _load_fallback_mission_data(day=90, allow_demo_fallback=True)
                self.assertEqual(demo_data, DEMO_FALLBACK_DATA)

        # 7. Invalid day numbers must raise ValueError
        with self.assertRaises(ValueError):
            _load_fallback_mission_data(day=0)
        with self.assertRaises(ValueError):
            _load_fallback_mission_data(day=181)
        with self.assertRaises(ValueError):
            _load_fallback_mission_data(day=True)  # type: ignore

    def test_malformed_simulator_records_rejected(self):
        """Malformed simulator records must raise ValueError with clear descriptive messages."""
        def _test_record_rejection(bad_record, expected_msg):
            mock_json = json.dumps([bad_record])
            with patch("app.routers.dashboard.get_simulator_data_path", return_value="/mock/data.json"):
                with patch("os.path.exists", return_value=True):
                    with patch("builtins.open", mock_open(read_data=mock_json)):
                        with self.assertRaises(ValueError) as ctx:
                            _load_fallback_mission_data(day=1)
                        self.assertIn(expected_msg, str(ctx.exception))

        # Top-level records is not a list
        with patch("app.routers.dashboard.get_simulator_data_path", return_value="/mock/data.json"):
            with patch("os.path.exists", return_value=True):
                with patch("builtins.open", mock_open(read_data=json.dumps({"not": "a list"}))):
                    with self.assertRaises(ValueError) as ctx:
                        _load_fallback_mission_data(day=1)
                    self.assertIn("expected JSON list", str(ctx.exception))

        # Record is not a dictionary
        _test_record_rejection("not-a-dict", "expected dict")
        _test_record_rejection(12345, "expected dict")

        # Missing required keys ('day', 'indicator', 'value')
        _test_record_rejection({"indicator": "heart_rate", "value": 72.0}, "missing required keys")
        _test_record_rejection({"day": 1, "value": 72.0}, "missing required keys")
        _test_record_rejection({"day": 1, "indicator": "heart_rate"}, "missing required keys")

        # Invalid or unknown indicator
        _test_record_rejection({"day": 1, "indicator": "unknown_metric", "value": 72.0}, "Unknown or invalid indicator")
        _test_record_rejection({"day": 1, "indicator": 123, "value": 72.0}, "Unknown or invalid indicator")

        # Boolean or non-integer mission day
        _test_record_rejection({"day": True, "indicator": "heart_rate", "value": 72.0}, "Malformed day")
        _test_record_rejection({"day": False, "indicator": "heart_rate", "value": 72.0}, "Malformed day")
        _test_record_rejection({"day": "1", "indicator": "heart_rate", "value": 72.0}, "Malformed day")
        _test_record_rejection({"day": 1.5, "indicator": "heart_rate", "value": 72.0}, "Malformed day")

        # Boolean, non-numeric, or non-finite measurement values
        _test_record_rejection({"day": 1, "indicator": "heart_rate", "value": True}, "expected numeric float or int")
        _test_record_rejection({"day": 1, "indicator": "heart_rate", "value": False}, "expected numeric float or int")
        _test_record_rejection({"day": 1, "indicator": "heart_rate", "value": "72.0"}, "expected numeric float or int")
        _test_record_rejection({"day": 1, "indicator": "heart_rate", "value": None}, "expected numeric float or int")

        # NaN and Infinity values tested through the real json.load parser
        for non_finite_val in [float("nan"), float("inf"), float("-inf")]:
            records = [{"day": 1, "indicator": "heart_rate", "value": non_finite_val}]
            raw_json = json.dumps(records, allow_nan=True)
            with patch("app.routers.dashboard.get_simulator_data_path", return_value="/mock/data.json"):
                with patch("os.path.exists", return_value=True):
                    with patch("builtins.open", mock_open(read_data=raw_json)):
                        with self.assertRaises(ValueError) as ctx:
                            _load_fallback_mission_data(day=1)
                        self.assertIn("non-finite number", str(ctx.exception))

    def test_duplicate_mission_days_stable_sorting(self):
        """Duplicate readings on the same mission day must use stable sort to pick the last reading as latest."""
        # On Day 2, heart_rate has two observations: morning (68.0) and evening (74.0)
        records = []
        for ind in REFERENCE_RANGES.keys():
            records.append({"day": 1, "indicator": ind, "value": 70.0})
            if ind == "heart_rate":
                records.append({"day": 2, "indicator": ind, "value": 68.0})  # 1st reading on Day 2
                records.append({"day": 2, "indicator": ind, "value": 74.0})  # 2nd reading on Day 2
            else:
                records.append({"day": 2, "indicator": ind, "value": 70.0})

        mock_json = json.dumps(records)

        with patch("app.routers.dashboard.get_simulator_data_path", return_value="/mock/data.json"):
            with patch("os.path.exists", return_value=True):
                with patch("builtins.open", mock_open(read_data=mock_json)):
                    result = _load_fallback_mission_data(day=2)

        hr_res = result["heart_rate"]
        # Latest must be the final reading on Day 2 (74.0)
        self.assertEqual(hr_res["latest"], 74.0)
        # History must contain Day 1 reading and the earlier Day 2 reading (68.0)
        self.assertEqual(hr_res["history"], [70.0, 68.0])

        # Also verify with day=3 where Day 2 duplicates appear in history
        records_day3 = list(records)
        for ind in REFERENCE_RANGES.keys():
            records_day3.append({"day": 3, "indicator": ind, "value": 78.0})

        with patch("app.routers.dashboard.get_simulator_data_path", return_value="/mock/data.json"):
            with patch("os.path.exists", return_value=True):
                with patch("builtins.open", mock_open(read_data=json.dumps(records_day3))):
                    result_day3 = _load_fallback_mission_data(day=3)

        hr_day3 = result_day3["heart_rate"]
        self.assertEqual(hr_day3["latest"], 78.0)
        # History should preserve [Day 1, Day 2 reading 1, Day 2 reading 2]
        self.assertEqual(hr_day3["history"], [70.0, 68.0, 74.0])

    def test_out_of_order_simulator_records_processed_chronologically(self):
        """Out-of-order simulator records must be sorted by mission day before extracting latest/history."""
        # Intentionally scrambled days: Day 4, Day 1, Day 3, Day 2
        scrambled_days = [4, 1, 3, 2]
        records = []
        for ind in REFERENCE_RANGES.keys():
            for d in scrambled_days:
                # Value is 50.0 + d * 5.0 (Day 1: 55, Day 2: 60, Day 3: 65, Day 4: 70)
                records.append({"day": d, "indicator": ind, "value": 50.0 + (d * 5.0)})

        mock_json_content = json.dumps(records)

        with patch("app.routers.dashboard.get_simulator_data_path", return_value="/mock/mission_data.json"):
            with patch("os.path.exists", return_value=True):
                with patch("builtins.open", mock_open(read_data=mock_json_content)):
                    loaded = _load_fallback_mission_data(day=4)

        # For heart_rate, values must be strictly sorted: [55.0, 60.0, 65.0, 70.0]
        hr_data = loaded["heart_rate"]
        self.assertEqual(hr_data["latest"], 70.0)  # Day 4 value
        self.assertEqual(hr_data["history"], [55.0, 60.0, 65.0])  # Days 1, 2, 3 in ascending order

        # Test cutoff at day=3
        with patch("app.routers.dashboard.get_simulator_data_path", return_value="/mock/mission_data.json"):
            with patch("os.path.exists", return_value=True):
                with patch("builtins.open", mock_open(read_data=mock_json_content)):
                    loaded_day3 = _load_fallback_mission_data(day=3)

        hr_day3 = loaded_day3["heart_rate"]
        self.assertEqual(hr_day3["latest"], 65.0)  # Day 3 value
        self.assertEqual(hr_day3["history"], [55.0, 60.0])  # Days 1, 2 in ascending order

    def test_calculate_trend_directions(self):
        """Test calculation of directional velocity ('up', 'down', 'stable') across sparkline readings."""
        # Insufficient data
        self.assertEqual(calculate_trend([], "heart_rate"), "stable")
        self.assertEqual(calculate_trend([70.0], "heart_rate"), "stable")

        # Flat / zero variance
        self.assertEqual(calculate_trend([70.0] * 7, "heart_rate"), "stable")

        # Rising slope (> 5% of normal range span)
        self.assertEqual(calculate_trend([60.0, 62.0, 65.0, 68.0, 70.0, 72.0, 75.0], "heart_rate"), "up")

        # Falling slope (< -5% of normal range span)
        self.assertEqual(calculate_trend([8.5, 8.2, 7.8, 7.2, 6.8, 6.2, 5.6], "sleep_hours"), "down")

        # Minor noise within +/- 5% threshold
        self.assertEqual(calculate_trend([70.0, 70.2, 69.8, 70.1, 70.0, 70.2, 70.1], "heart_rate"), "stable")

    def test_day_90_endpoint_contract_and_trends(self):
        """Verify Day 90 dashboard endpoint matches frontend contracts and captures Day 90 mission story."""
        res = get_dashboard_summary(day=90)
        self.assertIsInstance(res, DashboardSummaryResponse)
        self.assertEqual(res.overall_status, "warning")
        self.assertEqual(res.mission_day, 90)

        indicators_by_key = {ind.indicator: ind for ind in res.indicators}
        self.assertEqual(len(indicators_by_key), 7)

        # Day 90 story checks:
        # 1. sleep_hours must be under 6 hours and flagged as warning, trending down
        sleep_ind = indicators_by_key["sleep_hours"]
        self.assertLess(sleep_ind.value, 6.0)
        self.assertEqual(sleep_ind.status, "warning")
        self.assertEqual(sleep_ind.trend, "down")
        self.assertEqual(sleep_ind.name, "Sleep Duration")
        self.assertEqual(sleep_ind.value, sleep_ind.latest_value)
        self.assertEqual(sleep_ind.message, sleep_ind.reason)

        # 2. heart_rate is trending up under operational stress
        hr_ind = indicators_by_key["heart_rate"]
        self.assertEqual(hr_ind.trend, "up")
        self.assertEqual(hr_ind.name, "Heart Rate")

        # 3. mood_score is trending down
        mood_ind = indicators_by_key["mood_score"]
        self.assertEqual(mood_ind.trend, "down")
        self.assertEqual(mood_ind.name, "Subjective Mood Score")

        # 4. Verify all 7 indicators supply both frontend and backend fields
        for ind_key, ind in indicators_by_key.items():
            self.assertEqual(ind.value, ind.latest_value)
            self.assertEqual(ind.message, ind.reason)
            self.assertIn(ind.trend, ["up", "down", "stable"])
            self.assertIsInstance(ind.name, str)
            self.assertTrue(len(ind.name) > 0)


if __name__ == "__main__":
    unittest.main()
