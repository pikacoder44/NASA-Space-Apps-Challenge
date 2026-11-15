"""Evaluation engine for the AstroTrack astronaut health monitoring system.

This module is the core decision engine:
- Evaluates vitals and well-being indicators.
- Seamlessly transitions between population Reference Mode (for astronauts with < 7 readings)
  and Personal Baseline Mode (for astronauts with >= 7 historical readings).
- Enforces absolute physiological safety limits for core vital signs.
- Strictly validates incoming measurements and historical telemetry sequences, rejecting
  invalid, non-finite, and unsupported inputs with clear errors.
"""

import math
from typing import List, Optional, Sequence

from app.services.baseline import (
    MIN_BASELINE_READINGS,
    EvalResult,
    evaluate_baseline,
)
from app.services.reference_data import (
    REFERENCE_RANGES,
    get_reference_range,
)


def evaluate_reference(indicator: str, value: float) -> EvalResult:
    """Evaluate reading against fixed population reference ranges.

    Returns:
        EvalResult with status ('normal', 'warning', 'critical'), natural language reason,
        and mode ('reference').
    """
    ref = get_reference_range(indicator)
    unit = ref["unit"]
    display_name = ref.get("display_name", indicator.replace("_", " ").title())
    nlo, nhi = ref["normal"]
    wlo, whi = ref["warning"]

    if nlo <= value <= nhi:
        return EvalResult(
            status="normal",
            reason=(
                f"{display_name} ({value:.1f} {unit}) is within normal reference "
                f"limits ({nlo:.1f} - {nhi:.1f} {unit})."
            ),
            mode="reference",
        )

    if wlo <= value <= whi:
        direction = "elevated" if value > nhi else "low"
        return EvalResult(
            status="warning",
            reason=(
                f"{display_name} ({value:.1f} {unit}) is {direction} outside normal reference "
                f"range ({nlo:.1f} - {nhi:.1f} {unit})."
            ),
            mode="reference",
        )

    direction = "critically high" if value > whi else "critically low"
    bound = whi if value > whi else wlo
    return EvalResult(
        status="critical",
        reason=(
            f"{display_name} ({value:.1f} {unit}) is {direction} (exceeds warning limit "
            f"of {bound:.1f} {unit})."
        ),
        mode="reference",
    )


def evaluate(
    indicator: str,
    value: float,
    history: Optional[Sequence[float]] = None,
) -> EvalResult:
    """Main evaluation dispatcher for AstroTrack.

    Args:
        indicator: The health indicator key (e.g. 'heart_rate', 'sleep_hours').
        value: The current physiological measurement (finite real number).
        history: Prior readings for this indicator & astronaut (oldest to newest, max 30),
                 excluding the current reading. Can be a List, Tuple, or None.

    Returns:
        EvalResult containing status, explanation reason, and mode used ('reference' | 'baseline').

    Raises:
        TypeError: If history is an unsupported type (such as str, bytes, dict, or non-sequence).
        ValueError: If indicator is unknown, value cannot be converted to a finite float,
                    or history contains invalid entries (None, bool, NaN, infinite, non-numeric).
    """
    # 1. Validate indicator key
    if indicator not in REFERENCE_RANGES:
        raise ValueError(
            f"Unknown indicator '{indicator}'. Must be one of: {list(REFERENCE_RANGES.keys())}"
        )

    # 2. Validate current measurement value: must be a finite number and strictly not a boolean
    if value is None or isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ValueError(
            f"Invalid measurement value: {value!r}. Must be a finite number, not boolean or null."
        )

    try:
        float_val = float(value)
    except (TypeError, ValueError, OverflowError) as exc:
        raise ValueError(
            f"Invalid measurement value: {value!r}. Value cannot be converted to a finite float ({exc})."
        ) from exc

    if math.isnan(float_val) or math.isinf(float_val):
        raise ValueError(f"Invalid measurement value: {value!r}. Value cannot be NaN or Infinite.")

    # 3. If history is None, dispatch directly to reference mode
    if history is None:
        return evaluate_reference(indicator, float_val)

    # 4. Validate history sequence container type
    if isinstance(history, (str, bytes)):
        raise TypeError(f"History cannot be string or bytes, got {type(history).__name__}.")

    if not isinstance(history, Sequence):
        raise TypeError(f"History must be a Sequence of numbers, got {type(history).__name__}.")

    # 5. Strictly validate every historical entry (do not silently discard invalid data)
    validated_history: List[float] = []
    for idx, x in enumerate(history):
        if x is None or isinstance(x, bool) or not isinstance(x, (int, float)):
            raise ValueError(
                f"Invalid historical reading at index {idx}: {x!r}. "
                "All historical entries must be finite real numbers (cannot be None, bool, or non-numeric)."
            )
        try:
            fx = float(x)
        except (TypeError, ValueError, OverflowError) as exc:
            raise ValueError(
                f"Historical reading at index {idx} cannot be converted to float: {x!r} ({exc})."
            ) from exc

        if math.isnan(fx) or math.isinf(fx):
            raise ValueError(
                f"Invalid historical reading at index {idx}: {x!r}. "
                "Historical readings cannot be NaN or Infinite."
            )
        validated_history.append(fx)

    # 6. Dispatch based on verified history length:
    # Fewer than MIN_BASELINE_READINGS (7) -> fallback to reference mode
    if len(validated_history) < MIN_BASELINE_READINGS:
        return evaluate_reference(indicator, float_val)

    # 7 or more valid historical readings -> dispatch to personal baseline mode
    return evaluate_baseline(indicator, float_val, validated_history)
