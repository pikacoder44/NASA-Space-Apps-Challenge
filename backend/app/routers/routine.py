"""Routine tasks and mission checklist router."""

from typing import List
from fastapi import APIRouter
from app.schemas.routine import RoutineTask

router = APIRouter()

DEFAULT_DAILY_ROUTINES: List[RoutineTask] = [
    RoutineTask(
        id="task-1",
        title="Morning Vitals & Pulse Oximetry Check",
        category="Medical",
        completed=True,
        due_time="07:30 UTC",
    ),
    RoutineTask(
        id="task-2",
        title="ARED Resistive Countermeasure Protocol (60 min)",
        category="Exercise",
        completed=True,
        due_time="10:00 UTC",
    ),
    RoutineTask(
        id="task-3",
        title="T2 Treadmill Aerobic Session (30 min)",
        category="Exercise",
        completed=False,
        due_time="16:00 UTC",
    ),
    RoutineTask(
        id="task-4",
        title="Evening Subjective Check-in & Sleep Berth Prep",
        category="Mental Health",
        completed=False,
        due_time="21:30 UTC",
    ),
]


@router.get("/today", response_model=List[RoutineTask], summary="Get today's crew health routine checklist")
def get_today_routine():
    """Retrieve today's scheduled operational health countermeasure and vital check tasks."""
    return DEFAULT_DAILY_ROUTINES
