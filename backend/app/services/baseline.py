"""Personal baseline statistical analysis and anomaly detection for AstroTrack.

Evaluates an astronaut's reading relative to their own historical distribution
using z-scores and recent mean / standard deviation, while upholding absolute
physiological danger limits for vital signs.

Design Principles:
- Requires a Sequence of at least MIN_BASELINE_READINGS (7) historical readings.
- History MUST be ordered chronologically from oldest to newest (index 0 is oldest,
  index -1 is most recent).
- Sequence can be any general numerical sequence (e.g., list, tuple), but strings,
  bytes, and non-sequences are strictly rejected with TypeError.
- Invalid historical entries (None, bool, NaN, infinite, or non-numeric values) are
  explicitly rejected with ValueError rather than silently discarded, preserving
  clinical telemetry integrity and ensuring corrupted data never enters baseline calculations.
- Clamps standard deviation with EPSILON_STD (0.01) to eliminate ZeroDivisionError.
- Guards against floating-point overflow during mean, variance, and z-score calculations,
  safely raising ValueError instead of producing NaN or infinity.
- Wording accurately describes history as reading counts (e.g. 'based on your last 30 readings')
  rather than calendar days, reflecting missions with variable daily sampling frequencies.
"""

import math
from dataclasses import dataclass
from typing import List, Sequence, Tuple

from app.services.reference_data import (
    get_reference_range,
    is_vital,
)

MIN_BASELINE_READINGS: int = 7
MAX_BASELINE_HISTORY: int = 30
EPSILON_STD: float = 0.01  # Minimum standard deviation to avoid division by zero

# Per-indicator minimum standard deviation used for z-scores (design choice, not
# an official NASA number). Short or very stable histories give a tiny measured
# SD, which would turn ordinary day-to-day variation (e.g. +2 bpm) into an
# "extreme" deviation. The floor is roughly normal day-to-day variability.
MIN_STD: dict = {
    "heart_rate": 2.5,
    "blood_pressure_systolic": 3.0,
    "blood_pressure_diastolic": 2.0,
    "body_temp": 0.12,
    "blood_sugar": 4.0,
    "sleep_hours": 0.4,
    "mood_score": 0.5,
}


@dataclass
class EvalResult:
    """Standardized evaluation result returned by AstroTrack."""

    status: str  # "normal" | "warning" | "critical"
    reason: str  # Human-readable explanation for astronaut and flight surgeon
    mode: str  # "baseline" | "reference"


def _validate_history_sequence(history: Sequence[float]) -> List[float]:
    """Validate and convert a history sequence, ensuring strict telemetry integrity.

    Args:
        history: Chronological sequence of historical readings (oldest to newest).

    Returns:
        List of validated float values.

    Raises:
        TypeError: If history is not a Sequence or is string/bytes.
        ValueError: If history is None, empty, or contains invalid entries (None, bool, NaN, inf).
    """
    if history is None:
        raise ValueError("History cannot be None for baseline calculations.")

    if isinstance(history, (str, bytes)):
        raise TypeError(f"History cannot be string or bytes, got {type(history).__name__}.")

    if not isinstance(history, Sequence):
        raise TypeError(f"History must be a Sequence of numbers, got {type(history).__name__}.")

    if len(history) == 0:
        raise ValueError("Cannot calculate baseline statistics on empty history.")

    validated: List[float] = []
    for idx, x in enumerate(history):
        if x is None or isinstance(x, bool) or not isinstance(x, (int, float)):
            raise ValueError(
                f"Invalid historical reading at index {idx}: {x!r}. "
                "All historical entries must be finite real numbers (cannot be None, bool, or non-numeric)."
            )
        try:
            val_f = float(x)
        except (TypeError, ValueError, OverflowError):
            raise ValueError(
                f"Historical reading at index {idx} cannot be converted to float: {x!r}."
            )

        if math.isnan(val_f) or math.isinf(val_f):
            raise ValueError(
                f"Invalid historical reading at index {idx}: {x!r}. "
                "Historical readings cannot be NaN or Infinite."
            )
        validated.append(val_f)

    return validated


def _calculate_stats_from_validated(validated: List[float]) -> Tuple[float, float]:
    """Calculate mean and clamped std from a pre-validated list of floats with overflow protection.

    Args:
        validated: Non-empty list of finite floats.

    Returns:
        Tuple of (mean, clamped_std) where clamped_std >= EPSILON_STD (0.01).

    Raises:
        ValueError: If arithmetic overflow occurs during mean, variance, or std deviation calculation.
    """
    n = len(validated)
    try:
        total = 0.0
        for x in validated:
            total += x
            if not math.isfinite(total):
                raise ValueError("Historical values caused arithmetic overflow in mean calculation.")

        mean = total / n
        if not math.isfinite(mean):
            raise ValueError("Historical values caused arithmetic overflow in mean calculation.")

        sum_sq = 0.0
        for x in validated:
            diff = x - mean
            if not math.isfinite(diff):
                raise ValueError("Historical values caused arithmetic overflow in variance calculation.")
            sq = diff ** 2
            if not math.isfinite(sq):
                raise ValueError("Historical values caused arithmetic overflow in variance calculation.")
            sum_sq += sq
            if not math.isfinite(sum_sq):
                raise ValueError("Historical values caused arithmetic overflow in variance calculation.")

        variance = sum_sq / n
        if not math.isfinite(variance):
            raise ValueError("Historical values caused arithmetic overflow in variance calculation.")

        std = math.sqrt(variance)
        if not math.isfinite(std):
            raise ValueError("Historical values caused arithmetic overflow in standard deviation calculation.")

    except OverflowError as exc:
        raise ValueError(
            f"Historical values caused floating-point overflow during statistical calculations: {exc}"
        ) from exc

    return mean, max(std, EPSILON_STD)


def calculate_baseline_stats(history: Sequence[float]) -> Tuple[float, float]:
    """Calculate mean and clamped standard deviation for a sequence of historical readings.

    Note:
        History is expected in chronological order (oldest to newest).
        Standard deviation is clamped to EPSILON_STD (0.01) to eliminate ZeroDivisionError.
        Independently validates history sequence and protects against arithmetic overflow.

    Args:
        history: Sequence of historical readings.

    Returns:
        Tuple of (mean, clamped_std).

    Raises:
        TypeError: If history is not a valid Sequence.
        ValueError: If history is empty, contains invalid/non-finite entries, or causes arithmetic overflow.
    """
    validated = _validate_history_sequence(history)
    return _calculate_stats_from_validated(validated)


def evaluate_baseline(
    indicator: str,
    value: float,
    history: Sequence[float],
) -> EvalResult:
    """Evaluate reading against astronaut's personal historical baseline using z-scores.

    Args:
        indicator: Snake_case name of the health indicator.
        value: Current physiological reading. Must be a finite number (not bool, NaN, or inf).
        history: Previous readings for this indicator, strictly ordered oldest to newest
                 (chronological order, oldest at index 0, newest at index -1), excluding current.
                 Must be a Sequence containing at least MIN_BASELINE_READINGS (7) valid numerical entries.

    Returns:
        EvalResult with status ('normal', 'warning', 'critical'), natural language reason,
        and mode ('baseline').

    Raises:
        TypeError: If history is not a Sequence (e.g. string, dict).
        ValueError: If indicator is unknown, value is invalid, history contains invalid entries,
                    history has fewer than MIN_BASELINE_READINGS (7) valid readings,
                    or arithmetic overflow occurs during statistical/z-score calculations.
    """
    ref = get_reference_range(indicator)
    unit = ref["unit"]
    display_name = ref.get("display_name", indicator.replace("_", " ").title())

    # Defensive validation of current measurement value
    if value is None or isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ValueError(f"Invalid measurement value: {value}. Must be a finite number, not boolean.")

    try:
        float_val = float(value)
    except (TypeError, ValueError, OverflowError):
        raise ValueError(f"Invalid measurement value: {value}. Could not convert to float.")

    if math.isnan(float_val) or math.isinf(float_val):
        raise ValueError(f"Invalid measurement value: {value}. Cannot be NaN or Infinite.")

    # Explicit validation and conversion of history sequence (executed once)
    validated_history = _validate_history_sequence(history)

    if len(validated_history) < MIN_BASELINE_READINGS:
        raise ValueError(
            f"Baseline evaluation requires at least {MIN_BASELINE_READINGS} valid historical readings. "
            f"Provided: {len(validated_history)}. Fall back to reference mode when history is insufficient."
        )

    # Limit history to the most recent window (up to MAX_BASELINE_HISTORY, oldest to newest)
    window = validated_history[-MAX_BASELINE_HISTORY:]
    history_len = len(window)

    # Compute baseline statistics directly on pre-validated slice without duplicate validation
    mean, std = _calculate_stats_from_validated(window)
    std = max(std, MIN_STD.get(indicator, EPSILON_STD))

    # Compute z-score with arithmetic overflow guards
    try:
        diff = float_val - mean
        if not math.isfinite(diff):
            raise ValueError(
                f"Measurement value {float_val!r} caused arithmetic overflow when calculating deviation from baseline mean."
            )
        z_score = diff / std
        if not math.isfinite(z_score):
            raise ValueError(
                f"Arithmetic overflow occurred while calculating z-score for value {float_val!r} against baseline."
            )
    except OverflowError as exc:
        raise ValueError(
            f"Arithmetic overflow occurred while calculating z-score for value {float_val!r}: {exc}"
        ) from exc

    # Round z-score to 10 decimal places before threshold classification.
    # IEEE 754 representation noise (e.g. 65.025 - 65.0 = 0.02500000000000568...)
    # can cause a conceptually exact boundary value such as z=2.5 to evaluate as
    # 2.5000000000005684, incorrectly falling into the critical band.
    # Rounding to 10 dp (error tolerance ~1e-10) is orders of magnitude tighter
    # than any physiological significance, so no clinical meaning is lost.
    z_score = round(z_score, 10)

    # First check: Absolute danger limits for vitals always take precedence
    if is_vital(indicator):
        wlo, whi = ref["warning"]
        if float_val < wlo or float_val > whi:
            direction_word = "below" if float_val < wlo else "above"
            bound_val = wlo if float_val < wlo else whi
            return EvalResult(
                status="critical",
                reason=(
                    f"CRITICAL: {display_name} ({float_val:.1f} {unit}) is {direction_word} "
                    f"absolute safety limit of {bound_val:.1f} {unit}."
                ),
                mode="baseline",
            )

    # Evaluate personal baseline deviation
    # Accurately references reading count (e.g., 'based on your last N readings')
    # instead of calendar days.
    if indicator in ("sleep_hours", "mood_score"):
        # For sleep duration and mood, only drops (negative z-score) represent health concerns.
        # Higher sleep or better mood is positive / normal.
        if z_score >= -1.5:
            status = "normal"
            reason = (
                f"{display_name} ({float_val:.1f} {unit}) is consistent with your "
                f"personal baseline (mean {mean:.1f} {unit}, based on your last {history_len} readings)."
            )
        elif -2.5 <= z_score < -1.5:
            status = "warning"
            abs_z = abs(z_score)
            reason = (
                f"{display_name} ({float_val:.1f} {unit}) is {abs_z:.1f} SD below your "
                f"baseline ({mean:.1f} {unit}, based on your last {history_len} readings)."
            )
        else:  # z_score < -2.5
            abs_z = abs(z_score)
            status = "critical"
            reason = (
                f"{display_name} ({float_val:.1f} {unit}) is significantly depleted ({abs_z:.1f} SD below "
                f"your baseline of {mean:.1f} {unit}, based on your last {history_len} readings)."
            )
    else:
        # For vital indicators, deviations in either direction are clinically significant
        abs_z = abs(z_score)
        direction_word = "above" if z_score >= 0 else "below"

        if abs_z < 1.5:
            status = "normal"
            reason = (
                f"{display_name} ({float_val:.1f} {unit}) is within your personal baseline "
                f"(mean {mean:.1f} {unit}, based on your last {history_len} readings)."
            )
        elif 1.5 <= abs_z <= 2.5:
            status = "warning"
            reason = (
                f"{display_name} ({float_val:.1f} {unit}) is {abs_z:.1f} SD {direction_word} "
                f"your baseline ({mean:.1f} {unit}, based on your last {history_len} readings)."
            )
        else:  # abs_z > 2.5
            status = "critical"
            reason = (
                f"{display_name} ({float_val:.1f} {unit}) shows extreme deviation ({abs_z:.1f} SD "
                f"{direction_word} your baseline of {mean:.1f} {unit}, based on your last {history_len} readings)."
            )

    # A value inside the population normal reference range is never "critical":
    # a large personal deviation there is a warning (watch and re-measure), not "act now".
    nlo, nhi = ref["normal"]
    if status == "critical" and nlo <= float_val <= nhi:
        status = "warning"
        direction_word = "above" if z_score >= 0 else "below"
        reason = (
            f"{display_name} ({float_val:.1f} {unit}) is {abs(z_score):.1f} SD {direction_word} "
            f"your baseline ({mean:.1f} {unit}, based on your last {history_len} readings), "
            f"but still within the normal reference range ({nlo:.1f} - {nhi:.1f} {unit})."
        )

    return EvalResult(status=status, reason=reason, mode="baseline")
