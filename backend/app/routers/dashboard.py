"""Dashboard summary router for AstroTrack.

Serves GET /api/dashboard/summary, aggregating physiological assessments,
sequential sparkline trends, personal baseline evaluations, and overall mission health status.
"""

import json
import math
import os
from typing import Any, Dict, List, Optional, Sequence, Tuple

try:
    from fastapi import APIRouter, Depends, Query
except ImportError:
    # Fallback decorators for running tests in lightweight host environments without FastAPI
    class APIRouter:  # type: ignore
        def __init__(self, *args, **kwargs):
            pass

        def get(self, *args, **kwargs):
            def decorator(fn):
                return fn
            return decorator

    def Query(default=None, **kwargs):  # type: ignore
        return default

    def Depends(dependency=None):  # type: ignore
        return None

from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.astronaut import Astronaut
from app.routers.auth import get_current_astronaut
from app.schemas.dashboard import DashboardSummaryResponse, IndicatorSummary
from app.services.evaluator import evaluate
from app.services.reference_data import (
    REFERENCE_RANGES,
    get_display_name,
    get_reference_range,
    get_unit,
)

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

# Environment variable to explicitly override simulator data location (e.g. in containerized setups)
SIMULATOR_ENV_VAR = "SIMULATOR_DATA_PATH"

# Temporary hardcoded identifier for hackathon demo mode; Track A (Abu Huraira) owns auth/user session resolution.
DEFAULT_DEMO_ASTRONAUT_ID = "1"

# Explicitly documented static demo fallback dataset for isolated testing or offline environments
# when simulated mission data file cannot be mounted.
DEMO_FALLBACK_DATA: Dict[str, Dict[str, Any]] = {
    "heart_rate": {"latest": 72.0, "history": [64.0] * 14},
    "blood_pressure_systolic": {"latest": 112.0, "history": [112.0] * 14},
    "blood_pressure_diastolic": {"latest": 74.0, "history": [74.0] * 14},
    "body_temp": {"latest": 36.6, "history": [36.6] * 14},
    "blood_sugar": {"latest": 92.0, "history": [92.0] * 14},
    "sleep_hours": {"latest": 5.6, "history": [7.1] * 14},
    "mood_score": {"latest": 6.5, "history": [8.0] * 14},
}


def _validate_finite_float(val: Any, name: str = "value") -> float:
    """Validate and convert numeric input to a finite float, rejecting booleans, strings, NaN, and infinity."""
    if isinstance(val, bool) or not isinstance(val, (int, float)):
        raise ValueError(
            f"Invalid {name}: expected numeric float or int, got {type(val).__name__} ({val!r})"
        )
    try:
        fval = float(val)
    except (OverflowError, ValueError) as exc:
        raise ValueError(f"Invalid {name}: cannot convert {val!r} to float: {exc}") from exc

    if not math.isfinite(fval):
        raise ValueError(f"Invalid {name}: non-finite number {fval!r} is not allowed")

    return fval


def get_simulator_data_path() -> str:
    """Resolve the path to mission_data.json across local, repo-root, and Docker environments.

    Order of resolution:
    1. Explicit environment variable SIMULATOR_DATA_PATH.
    2. Repository root relative to this file: ../../../data/simulator/mission_data.json.
    3. Container root mount: /data/simulator/mission_data.json.
    4. Container app mount: /app/data/simulator/mission_data.json.
    5. Working directory paths: data/simulator/mission_data.json and ../data/simulator/mission_data.json.
    """
    env_path = os.environ.get(SIMULATOR_ENV_VAR)
    if env_path:
        return os.path.abspath(env_path)

    candidate_paths = [
        os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data/simulator/mission_data.json")),
        "/data/simulator/mission_data.json",
        "/app/data/simulator/mission_data.json",
        os.path.abspath("data/simulator/mission_data.json"),
        os.path.abspath("../data/simulator/mission_data.json"),
    ]
    for path in candidate_paths:
        if os.path.exists(path):
            return path

    return candidate_paths[0]


def _load_fallback_mission_data(
    day: int = 90,
    allow_demo_fallback: bool = False,
) -> Dict[str, Dict[str, Any]]:
    """Load readings up to specified day from simulated mission data.

    Args:
        day: Mission day cutoff (1-180).
        allow_demo_fallback: If True and the simulator file cannot be found, returns
            the documented static demo fallback dataset instead of raising an error.
            Defaults to False so missing configuration in Docker/dev is not silently masked.

    Returns:
        Dictionary mapping indicator name to {"latest": float, "history": List[float]}.

    Raises:
        FileNotFoundError: If the simulator file does not exist and allow_demo_fallback is False.
        ValueError: If day is invalid, JSON is malformed, or telemetry records fail validation.
    """
    if isinstance(day, bool) or not isinstance(day, int):
        raise ValueError(f"Mission day must be an integer, got {type(day).__name__} ({day!r})")
    if day < 1 or day > 180:
        raise ValueError(f"Mission day must be between 1 and 180, got {day}")

    path = get_simulator_data_path()
    if not os.path.exists(path):
        if allow_demo_fallback:
            return DEMO_FALLBACK_DATA
        raise FileNotFoundError(
            f"Simulated mission data file not found at '{path}'. "
            "In Docker or development environments, ensure the simulator dataset exists "
            "(generate it via 'python data/simulator/generate.py') or configure the "
            "SIMULATOR_DATA_PATH environment variable."
        )

    with open(path, "r", encoding="utf-8") as f:
        records = json.load(f)

    if not isinstance(records, list):
        raise ValueError("Malformed simulator data: expected JSON list of records")

    records_by_ind: Dict[str, List[Tuple[int, float]]] = {}
    for idx, r in enumerate(records):
        if not isinstance(r, dict):
            raise ValueError(f"Malformed simulator record at index {idx}: expected dict, got {type(r).__name__}")
        if "day" not in r or "indicator" not in r or "value" not in r:
            raise ValueError(f"Malformed simulator record at index {idx} missing required keys ('day', 'indicator', 'value'): {r}")

        r_day = r["day"]
        if isinstance(r_day, bool) or not isinstance(r_day, int):
            raise ValueError(f"Malformed day in record at index {idx}: {r_day!r}")

        ind = r["indicator"]
        if not isinstance(ind, str) or ind not in REFERENCE_RANGES:
            raise ValueError(f"Unknown or invalid indicator in record at index {idx}: {ind!r}")

        val = _validate_finite_float(r["value"], name=f"simulator record value for {ind} on day {r_day}")

        if r_day <= day:
            records_by_ind.setdefault(ind, []).append((r_day, val))

    # Deliberately verify all 7 expected indicators have readings up to requested day
    result: Dict[str, Dict[str, Any]] = {}
    for expected_ind in REFERENCE_RANGES.keys():
        day_val_pairs = records_by_ind.get(expected_ind)
        if not day_val_pairs:
            raise ValueError(
                f"Simulated mission data is incomplete for day {day}: missing readings for indicator '{expected_ind}'"
            )
        # Sort chronologically by mission day (stable sort preserves order of same-day readings)
        day_val_pairs.sort(key=lambda item: item[0])
        values = [val for _, val in day_val_pairs]
        latest = values[-1]
        history = values[:-1][-30:]  # Up to 30 sequential observations prior to latest
        result[expected_ind] = {"latest": latest, "history": history}

    return result


def calculate_trend(trend_7d: Sequence[float], indicator: str) -> str:
    """Determine directional velocity ('up', 'down', 'stable') across sparkline readings.

    Uses least-squares linear regression slope across observations normalized by the indicator's
    normal reference span to classify directional velocity over the sparkline window.
    """
    if len(trend_7d) < 2:
        return "stable"
    ref = get_reference_range(indicator)
    lo, hi = ref["normal"]
    span = abs(hi - lo) if hi > lo else 1.0

    n = len(trend_7d)
    x = list(range(n))
    x_mean = (n - 1) / 2.0
    y_mean = sum(trend_7d) / n
    cov = sum((xi - x_mean) * (yi - y_mean) for xi, yi in zip(x, trend_7d))
    var = sum((xi - x_mean) ** 2 for xi in x)
    slope = cov / var if var != 0 else 0.0
    delta = slope * (n - 1)

    threshold = 0.05 * span
    if delta > threshold:
        return "up"
    elif delta < -threshold:
        return "down"
    return "stable"


def compute_dashboard_summary(
    astronaut_id: Optional[str] = DEFAULT_DEMO_ASTRONAUT_ID,
    indicator_data: Optional[Dict[str, Dict[str, Any]]] = None,
    mission_day: Optional[int] = None,
) -> DashboardSummaryResponse:
    """Core calculation logic for building the astronaut dashboard summary.

    Args:
        astronaut_id: Profile ID of the astronaut. Defaults to demo ID '1' pending Track A auth.
        indicator_data: Dictionary mapping indicator names to {"latest": float, "history": Sequence[float]}.
                        If None, loads simulated mission fallback data for Day 90.
        mission_day: Evaluated mission day integer (1-180), if known.

    Returns:
        DashboardSummaryResponse object with overall status, indicator summaries, and sparkline trends.

    Raises:
        ValueError: If indicator_data is malformed, missing any of the 7 expected indicators,
                    or contains invalid/non-numeric measurements.
        TypeError: If history is not a valid sequence.
    """
    if indicator_data is None:
        indicator_data = _load_fallback_mission_data(day=90)
        if mission_day is None:
            mission_day = 90

    if not isinstance(indicator_data, dict):
        raise ValueError(f"indicator_data must be a dictionary, got {type(indicator_data).__name__}")

    summaries: List[IndicatorSummary] = []
    statuses: List[str] = []

    # Deliberately iterate over all 7 expected indicators; never substitute fake healthy defaults
    for indicator in REFERENCE_RANGES.keys():
        if indicator not in indicator_data:
            raise ValueError(
                f"Missing required indicator '{indicator}' in indicator_data. "
                f"All 7 physiological indicators must be provided; missing data cannot be substituted."
            )

        data = indicator_data[indicator]
        if not isinstance(data, dict):
            raise ValueError(
                f"Malformed indicator data for '{indicator}': expected dict, got {type(data).__name__}"
            )

        if "latest" not in data:
            raise ValueError(f"Missing 'latest' measurement for indicator '{indicator}'")

        latest_val = _validate_finite_float(data["latest"], name=f"latest value for {indicator}")

        history_raw = data.get("history")
        if history_raw is None:
            history_vals: List[float] = []
        elif isinstance(history_raw, (str, bytes, bytearray, dict)) or not isinstance(history_raw, Sequence):
            raise TypeError(
                f"Invalid history for '{indicator}': expected sequence of numbers, got {type(history_raw).__name__}"
            )
        else:
            history_vals = [
                _validate_finite_float(x, name=f"history reading for {indicator}")
                for x in history_raw
            ]

        # Run clinical evaluation engine (switches to baseline mode if len(history_vals) >= 7)
        eval_res = evaluate(indicator, latest_val, history=history_vals)
        statuses.append(eval_res.status)

        # Sparkline trend: up to last 7 sequential observations (prior history + current latest reading).
        # Note: In the daily mission simulator, these correspond to 7 daily observations. In general
        # telemetry streams, this represents the last 7 sequential readings rather than guaranteed calendar days.
        trend_candidates = history_vals + [latest_val]
        trend_7d = trend_candidates[-7:]
        trend_dir = calculate_trend(trend_7d, indicator)
        display_name = get_display_name(indicator)

        summaries.append(
            IndicatorSummary(
                indicator=indicator,
                name=display_name,
                value=latest_val,
                latest_value=latest_val,
                unit=get_unit(indicator),
                status=eval_res.status,
                reason=eval_res.reason,
                message=eval_res.reason,
                trend=trend_dir,
                trend_7d=trend_7d,
                mode=eval_res.mode,
            )
        )

    # Determine overall mission health status: critical > warning > normal
    if "critical" in statuses:
        overall_status = "critical"
    elif "warning" in statuses:
        overall_status = "warning"
    else:
        overall_status = "normal"

    # Temporary demo behavior: astronaut ID defaults to DEFAULT_DEMO_ASTRONAUT_ID.
    # Authentication and session identity resolution are owned by Track A (Abu Huraira).
    assigned_astro_id = str(astronaut_id) if astronaut_id is not None else DEFAULT_DEMO_ASTRONAUT_ID

    return DashboardSummaryResponse(
        overall_status=overall_status,
        indicators=summaries,
        mission_day=mission_day,
        astronaut_id=assigned_astro_id,
    )


def _database_indicator_data(db, astronaut_id: str) -> Tuple[Dict[str, Dict[str, Any]], Dict[str, str]]:
    """Latest reading + up to 30 previous values per indicator from the database.

    Returns (indicator_data, measured_at_by_indicator). Indicators without any
    logged reading are left out.
    """
    from app.core.timeutils import iso_utc
    from app.services.readings_service import HISTORY_LIMIT, recent_values

    data: Dict[str, Dict[str, Any]] = {}
    measured: Dict[str, str] = {}
    for indicator in REFERENCE_RANGES:
        rows = recent_values(db, astronaut_id, indicator, limit=HISTORY_LIMIT + 1)
        if not rows:
            continue
        latest, previous = rows[0], rows[1:]
        data[indicator] = {"latest": latest.value, "history": [r.value for r in reversed(previous)]}
        measured[indicator] = iso_utc(latest.measured_at)
    return data, measured


@router.get(
    "/summary",
    response_model=DashboardSummaryResponse,
    summary="Get astronaut health dashboard summary",
    description=(
        "Health status for all 7 indicators. Without `day`: each indicator's latest logged reading "
        "and its previous 30 values from the database (indicators with no logged readings fall back "
        "to the simulated mission data, marked source='simulator'). With `day`: the simulated mission "
        "scenario for that day (synthetic demo data). Evaluates against the personal baseline "
        "(or reference ranges if history < 7), adds 7-point sparklines, trend direction, and the "
        "worst-case overall status."
    ),
)
def get_dashboard_summary(
    day: Optional[int] = Query(
        default=None,
        ge=1,
        le=180,
        description="Optional: show the simulated mission scenario for this day (1-180) instead of logged readings",
    ),
    db: Session = Depends(get_db),
    current_astro: Astronaut = Depends(get_current_astronaut),
) -> DashboardSummaryResponse:
    """Dashboard summary for the active astronaut (demo astronaut when not logged in).

    Default: real logged readings from the database. `?day=N`: simulated scenario for day N.
    """
    if day is not None:
        summary = compute_dashboard_summary(
            astronaut_id=DEFAULT_DEMO_ASTRONAUT_ID,
            indicator_data=_load_fallback_mission_data(day=day),
            mission_day=day,
        )
        for ind in summary.indicators:
            ind.source = "simulator"
        summary.data_source = "simulator"
        return summary

    mission_day = min(max(int(current_astro.mission_day or 90), 1), 180)
    db_data, measured = _database_indicator_data(db, current_astro.id)
    merged = dict(db_data)
    if len(db_data) < len(REFERENCE_RANGES):
        simulated = _load_fallback_mission_data(day=mission_day)
        for indicator in REFERENCE_RANGES:
            merged.setdefault(indicator, simulated[indicator])

    summary = compute_dashboard_summary(
        astronaut_id=str(current_astro.id), indicator_data=merged, mission_day=mission_day
    )
    for ind in summary.indicators:
        ind.source = "database" if ind.indicator in db_data else "simulator"
        ind.measured_at = measured.get(ind.indicator)
    if len(db_data) == len(REFERENCE_RANGES):
        summary.data_source = "database"
    elif db_data:
        summary.data_source = "mixed"
    else:
        summary.data_source = "simulator"
    return summary
