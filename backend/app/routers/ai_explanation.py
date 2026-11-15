"""AI Explanation router for space medicine telemetry analysis."""

from fastapi import APIRouter
from app.schemas.ai_explanation import AIExplanationRequest, AIExplanationResponse

router = APIRouter()


@router.post(
    "/api/v1/health/ai-explanation",
    response_model=AIExplanationResponse,
    summary="Get space medicine AI telemetry analysis (v1 path)",
)
@router.post(
    "/api/health/ai-explanation",
    response_model=AIExplanationResponse,
    summary="Get space medicine AI telemetry analysis",
)
def get_ai_explanation(payload: AIExplanationRequest):
    """Generate structured operational clinical telemetry insights for astronaut questions."""
    indicator = payload.indicator or "telemetry"
    status_val = payload.status or "operational"

    if indicator == "sleep_hours" or "sleep" in (payload.prompt or "").lower():
        return AIExplanationResponse(
            indicator="sleep_hours",
            status=status_val,
            title="Circadian Adaptation & Sleep Debt Analysis",
            explanation=(
                "In microgravity, the absence of a natural 24-hour diurnal solar cycle, combined with cabin "
                "acoustic noise (~65 dB) and core body temperature elevation, impairs slow-wave sleep. "
                "Cumulative deficit leads to micro-sleep vulnerabilities during high-workload operations."
            ),
            recommendation="Schedule a 45-minute sleep recovery extension and inspect berth acoustic baffles.",
            risk_level="moderate" if status_val == "warning" else "low",
        )

    if indicator == "heart_rate" or "cardiac" in (payload.prompt or "").lower():
        return AIExplanationResponse(
            indicator="heart_rate",
            status=status_val,
            title="Cardiovascular Deconditioning & Autonomic Regulation",
            explanation=(
                "Cephalad fluid redistribution removes the gravitational hydrostatic pressure column, "
                "causing early plasma volume contraction and altered baroreceptor sensitivity. "
                "Elevated resting pulse indicates compensatory sympathetic tone or hydration deficit."
            ),
            recommendation="Consume 500 mL electrolyte fluid and verify scheduled ARED countermeasure adherence.",
            risk_level="high" if status_val == "critical" else "moderate",
        )

    return AIExplanationResponse(
        indicator=indicator,
        status=status_val,
        title=f"Spaceflight Telemetry Analysis: {indicator.replace('_', ' ').title()}",
        explanation=(
            f"Telemetry for {indicator} is currently classified as {status_val}. "
            "Microgravity environmental stressors (fluid shifts, cosmic radiation, confinement) "
            "require continuous monitoring against your personal baseline."
        ),
        recommendation="Log repeat reading per protocol schedule and maintain flight countermeasure routines.",
        risk_level="moderate" if status_val == "warning" else "low",
    )
