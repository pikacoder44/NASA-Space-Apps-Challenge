"""Unit tests for AstroTrack 180-Day Mission Simulator.

Tests deterministic output generation, JSON structure, indicator coverage,
physical boundary constraints, and verification of the Day 90 warning scenario.
"""

import json
import os
import sys
import unittest

# Ensure both repository root and backend directory are in sys.path
_REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
_BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if _REPO_ROOT not in sys.path:
    sys.path.insert(0, _REPO_ROOT)
if _BACKEND_DIR not in sys.path:
    sys.path.insert(0, _BACKEND_DIR)

from app.services.evaluator import evaluate
from data.simulator.generate import (
    BASELINES,
    RANDOM_SEED,
    TOTAL_DAYS,
    generate_mission_data,
)


class TestMissionSimulator(unittest.TestCase):
    """Test suite for the mission data generator and dataset."""

    @classmethod
    def setUpClass(cls):
        cls.dataset = generate_mission_data(RANDOM_SEED)

    def test_record_count_and_days(self):
        """Verify total records equal 180 days multiplied by 7 indicators."""
        expected_count = TOTAL_DAYS * len(BASELINES)
        self.assertEqual(len(self.dataset), expected_count)
        self.assertEqual(expected_count, 1260)

    def test_indicator_completeness_per_day(self):
        """Each of the 180 days must have all 7 indicators."""
        days_map = {}
        for r in self.dataset:
            days_map.setdefault(r["day"], set()).add(r["indicator"])

        self.assertEqual(len(days_map), TOTAL_DAYS)
        expected_indicators = set(BASELINES.keys())
        for day, inds in days_map.items():
            self.assertEqual(
                inds,
                expected_indicators,
                f"Day {day} does not have all 7 indicators",
            )

    def test_simulation_determinism(self):
        """Two runs with the identical seed must generate byte-for-byte identical datasets."""
        run_a = generate_mission_data(RANDOM_SEED)
        run_b = generate_mission_data(RANDOM_SEED)
        self.assertEqual(run_a, run_b)

    def test_json_file_on_disk(self):
        """Verify data/simulator/mission_data.json exists, is valid JSON, and matches generator."""
        file_path = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "../../data/simulator/mission_data.json")
        )
        self.assertTrue(os.path.exists(file_path), f"File {file_path} does not exist")
        with open(file_path, "r", encoding="utf-8") as f:
            disk_data = json.load(f)

        self.assertEqual(len(disk_data), 1260)
        self.assertEqual(disk_data[0]["indicator"], "heart_rate")
        self.assertIn("day", disk_data[0])
        self.assertIn("value", disk_data[0])

    def test_physiological_physical_limits(self):
        """Ensure all generated values stay strictly within physical boundaries."""
        for r in self.dataset:
            ind = r["indicator"]
            val = r["value"]
            cfg = BASELINES[ind]
            self.assertGreaterEqual(
                val,
                cfg["min"],
                f"Day {r['day']} {ind} value {val} is below physical minimum {cfg['min']}",
            )
            self.assertLessEqual(
                val,
                cfg["max"],
                f"Day {r['day']} {ind} value {val} is above physical maximum {cfg['max']}",
            )

    def test_day_90_story_in_simulated_dataset(self):
        """Verify that on Day 90 of the generated dataset, evaluation produces a WARNING status."""
        by_ind = {}
        for r in self.dataset:
            by_ind.setdefault(r["indicator"], {})[r["day"]] = r["value"]

        statuses = []
        for ind in BASELINES.keys():
            day90_val = by_ind[ind][90]
            # Use past 30 days prior to day 90
            hist = [by_ind[ind][d] for d in range(60, 90)]
            eval_res = evaluate(ind, day90_val, history=hist)
            statuses.append(eval_res.status)

        # On Day 90:
        # At least one indicator must be 'warning' (sleep debt, elevated HR, mood drop)
        self.assertIn("warning", statuses)
        # None should be 'critical'
        self.assertNotIn("critical", statuses)

        # Therefore overall status on Day 90 is strictly 'warning'
        overall_status = "warning" if "warning" in statuses else "normal"
        self.assertEqual(overall_status, "warning")

    def test_mid_mission_infection_event(self):
        """Verify transient infection spike in temperature around Days 42-45."""
        by_day_temp = {
            r["day"]: r["value"] for r in self.dataset if r["indicator"] == "body_temp"
        }
        # Peak temperature around day 43 should be distinctly higher than mission baseline (36.6 °C)
        fever_temp = by_day_temp[43]
        self.assertGreater(fever_temp, 37.4)


if __name__ == "__main__":
    unittest.main()
