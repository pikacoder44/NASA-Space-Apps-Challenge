"""Tests for the real NASA data endpoints (Inspiration4, OSDR OSD-575)."""

import os
import sys
import unittest
from unittest.mock import patch

_BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if _BACKEND_DIR not in sys.path:
    sys.path.insert(0, _BACKEND_DIR)

from fastapi.testclient import TestClient

from app.main import app
from app.services.nasa_data import NASA_DATA_ENV_VAR, parse_timepoint


class TestNasaData(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_glucose_endpoint_returns_real_osd575_data(self):
        res = self.client.get("/api/nasa/inspiration4/glucose")
        self.assertEqual(res.status_code, 200)
        body = res.json()
        self.assertEqual(body["source"]["study_id"], "OSD-575")
        self.assertTrue(body["source"]["url"].startswith("https://osdr.nasa.gov/"))
        self.assertEqual(body["unit"], "mg/dL")
        self.assertEqual(body["lab_reference_range"], {"min": 65.0, "max": 99.0})
        self.assertEqual([m["subject_id"] for m in body["crew"]], ["C001", "C002", "C003", "C004"])
        self.assertEqual(body["summary"]["count"], 28)

        c001 = body["crew"][0]["readings"]
        self.assertEqual([r["timepoint"] for r in c001], ["L-92", "L-44", "L-3", "R+1", "R+45", "R+82", "R+194"])
        self.assertEqual((c001[0]["value"], c001[0]["lab_flag"], c001[0]["phase"]), (83.0, "normal", "pre-flight"))
        self.assertTrue(body["limitations"])

    def test_lab_flags_follow_lab_range(self):
        body = self.client.get("/api/nasa/inspiration4/glucose").json()
        for member in body["crew"]:
            for r in member["readings"]:
                expected = "low" if r["value"] < 65 else "high" if r["value"] > 99 else "normal"
                self.assertEqual(r["lab_flag"], expected)

    def test_parse_timepoint(self):
        self.assertEqual(parse_timepoint("L-92")["days"], -92)
        self.assertEqual(parse_timepoint("R+45")["phase"], "post-flight")
        with self.assertRaises(ValueError):
            parse_timepoint("X1")

    def test_sources_list_dataset_and_hrp(self):
        sources = self.client.get("/api/nasa/sources").json()
        urls = [s["url"] for s in sources]
        self.assertIn("https://osdr.nasa.gov/bio/repo/data/studies/OSD-575", urls)
        self.assertIn("https://www.nasa.gov/hrp/hazards/", urls)

    def test_missing_file_returns_503(self):
        with patch.dict(os.environ, {NASA_DATA_ENV_VAR: os.path.join(_BACKEND_DIR, "does-not-exist")}):
            self.assertEqual(self.client.get("/api/nasa/inspiration4/glucose").status_code, 503)


if __name__ == "__main__":
    unittest.main()
