"""Real NASA data: SpaceX Inspiration4 blood glucose from NASA OSDR study OSD-575.

The original CSV is stored unchanged in data/nasa/inspiration4/original/.
Only the GLUCOSE rows are used. Values are flagged against the lab's own
reference range from the file, never against AstroTrack's evaluator, so real
crew members are not labelled "critical" by a demo algorithm.
"""

import csv
import os
import re
from functools import lru_cache
from typing import Any, Dict, List

_REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
CSV_NAME = "LSDS-8_Comprehensive_Metabolic_Panel_CMP.upload_SUBMITTED.csv"
NASA_DATA_ENV_VAR = "NASA_DATA_DIR"

OSD_575 = {
    "title": (
        "SpaceX Inspiration4 Blood Serum Metabolic Panel and Immune/Cardiac Cytokine Arrays "
        "(Comprehensive Metabolic Panel and Multiplex)"
    ),
    "study_id": "OSD-575",
    "repository": "NASA Open Science Data Repository (OSDR)",
    "url": "https://osdr.nasa.gov/bio/repo/data/studies/OSD-575",
    "file": CSV_NAME,
    "mission": "SpaceX Inspiration4, 3-day low Earth orbit mission, September 2021, 4 civilian astronauts",
}

NASA_SOURCES: List[Dict[str, str]] = [
    {
        "name": f"{OSD_575['title']} ({OSD_575['study_id']})",
        "url": OSD_575["url"],
        "type": "dataset",
        "usage": "Real blood glucose values of the Inspiration4 crew, served by GET /api/nasa/inspiration4/glucose.",
    },
    {
        "name": "NASA Open Science Data Repository (OSDR)",
        "url": "https://osdr.nasa.gov/",
        "type": "repository",
        "usage": "Source repository of the Inspiration4 dataset.",
    },
    {
        "name": "NASA Human Research Program: Hazards of Human Spaceflight",
        "url": "https://www.nasa.gov/hrp/hazards/",
        "type": "reference",
        "usage": "Scientific background for the monitored indicators and guidance citations.",
    },
]

LIMITATIONS = [
    "Samples were taken before and after flight, not during flight.",
    "4 crew members and 7 time points each; not continuous monitoring.",
    "Research data for context only, not a diagnosis of any crew member.",
]

_TIMEPOINT = re.compile(r"^([LR])([+-])(\d+)$")


class NasaDataUnavailable(RuntimeError):
    """Raised when the NASA data file is missing or unreadable."""


def get_nasa_csv_path() -> str:
    base = os.environ.get(NASA_DATA_ENV_VAR) or os.path.join(_REPO_ROOT, "data", "nasa")
    return os.path.join(base, "inspiration4", "original", CSV_NAME)


def parse_timepoint(tp: str) -> Dict[str, Any]:
    """'L-92' -> pre-flight, 92 days before launch; 'R+45' -> post-flight, 45 days after return."""
    m = _TIMEPOINT.match(tp.strip())
    if not m:
        raise ValueError(f"Unrecognised time point {tp!r}")
    anchor, sign, num = m.groups()
    days = int(num) * (-1 if sign == "-" else 1)
    if anchor == "L":
        return {"phase": "pre-flight", "days": days, "relative_to": "launch", "order": days}
    return {"phase": "post-flight", "days": days, "relative_to": "return", "order": 1000 + days}


def _flag(value: float, lo: float, hi: float) -> str:
    if value < lo:
        return "low"
    if value > hi:
        return "high"
    return "normal"


@lru_cache(maxsize=4)
def _load(path: str) -> Dict[str, Any]:
    try:
        with open(path, encoding="utf-8-sig", newline="") as f:
            rows = [r for r in csv.DictReader(f) if (r.get("ANALYTE") or "").strip().upper() == "GLUCOSE"]
    except OSError as exc:
        raise NasaDataUnavailable(f"NASA data file not found or unreadable: {path}") from exc

    crew: Dict[str, Dict[str, Any]] = {}
    unit, lab_range = None, None
    for r in rows:
        value = float(r["VALUE"])
        lo, hi = float(r["RANGE_MIN"]), float(r["RANGE_MAX"])
        unit = unit or r["UNITS"].strip()
        lab_range = lab_range or {"min": lo, "max": hi}
        tp = parse_timepoint(r["timepoint"])
        member = crew.setdefault(r["SUBJECT_ID"].strip(), {"subject_id": r["SUBJECT_ID"].strip(), "readings": []})
        member["readings"].append({
            "timepoint": r["timepoint"].strip(),
            "phase": tp["phase"],
            "days": tp["days"],
            "relative_to": tp["relative_to"],
            "value": value,
            "lab_flag": _flag(value, lo, hi),
            "_order": tp["order"],
        })
    if not rows:
        raise NasaDataUnavailable(f"No GLUCOSE rows in {path}")

    for member in crew.values():
        member["readings"].sort(key=lambda x: x["_order"])
        for x in member["readings"]:
            del x["_order"]

    def mean(values: List[float]) -> float:
        return round(sum(values) / len(values), 1)

    all_readings = [x for m in crew.values() for x in m["readings"]]
    summary = {
        "count": len(all_readings),
        "crew_count": len(crew),
        "preflight_mean": mean([x["value"] for x in all_readings if x["phase"] == "pre-flight"]),
        "return_day_mean": mean([x["value"] for x in all_readings if x["timepoint"] == "R+1"]),
        "postflight_mean": mean([x["value"] for x in all_readings if x["phase"] == "post-flight"]),
        "outside_lab_range": sum(1 for x in all_readings if x["lab_flag"] != "normal"),
    }
    return {
        "indicator": "blood_sugar",
        "analyte": "GLUCOSE",
        "unit": unit,
        "lab_reference_range": lab_range,
        "crew": [crew[k] for k in sorted(crew)],
        "summary": summary,
    }


def get_inspiration4_glucose() -> Dict[str, Any]:
    """Inspiration4 crew glucose series with source metadata. Raises NasaDataUnavailable."""
    return {"source": OSD_575, "limitations": LIMITATIONS, **_load(get_nasa_csv_path())}
