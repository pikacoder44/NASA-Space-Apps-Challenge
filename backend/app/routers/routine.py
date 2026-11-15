"""Routine tasks and mission checklist router."""

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.timeutils import to_naive_utc, utcnow
from app.models.astronaut import Astronaut
from app.routers.auth import get_current_astronaut
from app.schemas.routine import RoutineTask
from app.services.readings_service import latest_readings

router = APIRouter()

VITALS = {"heart_rate", "blood_pressure_systolic", "blood_pressure_diastolic", "body_temp"}

# Extra task when an indicator's latest status is warning or critical (general, safe actions only).
FOLLOW_UP_TASKS = {
    "heart_rate": ("Rest 15 minutes and re-measure heart rate", "Medical"),
    "blood_pressure_systolic": ("Re-measure blood pressure seated after 10 minutes of rest", "Medical"),
    "blood_pressure_diastolic": ("Re-measure blood pressure seated after 10 minutes of rest", "Medical"),
    "body_temp": ("Re-measure body temperature in 1 hour and drink water", "Medical"),
    "blood_sugar": ("Re-measure blood glucose 1 hour after your next meal", "Nutrition"),
    "sleep_hours": ("Plan a recovery sleep window tonight", "Sleep"),
    "mood_score": ("Take a break and talk with a crew member", "Mental Health"),
}


@router.get("/today", response_model=List[RoutineTask], summary="Get today's crew health routine checklist")
def get_today_routine(
    db: Session = Depends(get_db),
    current_astro: Astronaut = Depends(get_current_astronaut),
):
    """Today's (UTC) health checklist for the active astronaut.

    Four daily tasks; the vitals and evening check-in tasks are marked completed
    when matching readings were logged today. One follow-up task is added for
    each indicator whose latest status is warning or critical (critical first).
    """
    latest = latest_readings(db, current_astro.id)
    today = utcnow().date()
    logged_today = {ind for ind, r in latest.items() if to_naive_utc(r.measured_at).date() == today}

    tasks = [
        RoutineTask(id="task-1", title="Morning Vitals Check (heart rate, blood pressure, temperature)",
                    category="Medical", completed=bool(VITALS & logged_today), due_time="07:30 UTC"),
        RoutineTask(id="task-2", title="ARED Resistive Countermeasure Protocol (60 min)",
                    category="Exercise", completed=False, due_time="10:00 UTC"),
        RoutineTask(id="task-3", title="T2 Treadmill Aerobic Session (30 min)",
                    category="Exercise", completed=False, due_time="16:00 UTC"),
        RoutineTask(id="task-4", title="Evening Subjective Check-in (mood and sleep)",
                    category="Mental Health", completed=bool({"mood_score", "sleep_hours"} & logged_today),
                    due_time="21:30 UTC"),
    ]

    flagged = sorted(
        (r for r in latest.values() if r.status in ("warning", "critical")),
        key=lambda r: (r.status != "critical", r.indicator),
    )
    seen_titles = set()
    for r in flagged:
        title, category = FOLLOW_UP_TASKS[r.indicator]
        if title in seen_titles:
            continue
        seen_titles.add(title)
        tasks.append(RoutineTask(id=f"follow-up-{r.indicator}", title=title, category=category,
                                 completed=False, indicator=r.indicator))
    return tasks
