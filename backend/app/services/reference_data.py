"""Reference physiological data ranges for the AstroTrack health monitoring system.

DISCLAIMER:
The reference thresholds, standard ranges, and danger limits below are illustrative
demonstration values developed for the NASA Space Apps Challenge 2026 hackathon.
They do NOT represent clinical medical diagnosis, official flight surgeon protocols,
or validated NASA medical guidelines.
"""

from typing import Any, Dict, Set

DISCLAIMER: str = (
    "Notice: Reference thresholds and ranges are illustrative hackathon demonstration values "
    "for AstroTrack and do not represent validated medical advice or official NASA flight rules."
)

# Reference definitions for standard population baseline
# Each entry defines:
#   - unit: String unit of measurement
#   - normal: (low, high) bounds inclusive for 'normal'
#   - warning: (low, high) bounds inclusive for 'warning' (outside normal, inside warning)
#   - Values strictly outside the warning bounds evaluate to 'critical'
REFERENCE_RANGES: Dict[str, Dict[str, Any]] = {
    "heart_rate": {
        "unit": "bpm",
        "normal": (60.0, 100.0),
        "warning": (50.0, 120.0),
        "display_name": "Heart Rate",
    },
    "blood_pressure_systolic": {
        "unit": "mmHg",
        "normal": (90.0, 120.0),
        "warning": (80.0, 140.0),
        "display_name": "Systolic Blood Pressure",
    },
    "blood_pressure_diastolic": {
        "unit": "mmHg",
        "normal": (60.0, 80.0),
        "warning": (50.0, 90.0),
        "display_name": "Diastolic Blood Pressure",
    },
    "body_temp": {
        "unit": "°C",
        "normal": (36.1, 37.2),
        "warning": (35.5, 38.0),
        "display_name": "Body Temperature",
    },
    "blood_sugar": {
        "unit": "mg/dL",
        "normal": (70.0, 140.0),
        "warning": (60.0, 180.0),
        "display_name": "Blood Glucose",
    },
    "sleep_hours": {
        "unit": "hours",
        "normal": (7.0, 9.0),
        "warning": (6.0, 10.0),
        "display_name": "Sleep Duration",
    },
    "mood_score": {
        "unit": "1-10",
        "normal": (6.0, 10.0),
        "warning": (4.0, 10.0),
        "display_name": "Subjective Mood Score",
    },
}

# Vital indicators enforce absolute danger limits regardless of personal baseline mode.
# Non-vital indicators (sleep_hours, mood_score) do NOT have absolute danger limits.
VITAL_INDICATORS: Set[str] = {
    "heart_rate",
    "blood_pressure_systolic",
    "blood_pressure_diastolic",
    "body_temp",
    "blood_sugar",
}


def is_vital(indicator: str) -> bool:
    """Return True if indicator is a core physiological vital with absolute danger limits."""
    return indicator in VITAL_INDICATORS


def get_reference_range(indicator: str) -> Dict[str, Any]:
    """Retrieve reference configuration for an indicator, or raise ValueError if unknown."""
    if indicator not in REFERENCE_RANGES:
        raise ValueError(
            f"Unknown health indicator '{indicator}'. Supported indicators: {list(REFERENCE_RANGES.keys())}"
        )
    return REFERENCE_RANGES[indicator]


def get_unit(indicator: str) -> str:
    """Retrieve measurement unit for an indicator."""
    return get_reference_range(indicator)["unit"]


def get_display_name(indicator: str) -> str:
    """Retrieve human-readable display name for an indicator."""
    return get_reference_range(indicator)["display_name"]
