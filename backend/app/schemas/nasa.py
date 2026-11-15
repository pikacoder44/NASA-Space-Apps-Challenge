"""Schemas for real NASA data endpoints."""

from typing import List
from pydantic import BaseModel, Field


class NasaSource(BaseModel):
    name: str
    url: str
    type: str = Field(..., description="'dataset', 'repository' or 'reference'")
    usage: str = Field(..., description="How AstroTrack actually uses this resource")


class NasaDatasetInfo(BaseModel):
    title: str
    study_id: str = Field(..., example="OSD-575")
    repository: str
    url: str
    file: str
    mission: str


class LabRange(BaseModel):
    min: float
    max: float


class NasaGlucoseReading(BaseModel):
    timepoint: str = Field(..., example="L-92", description="Original NASA time point label")
    phase: str = Field(..., example="pre-flight")
    days: int = Field(..., example=-92, description="Days relative to launch (pre-flight) or return (post-flight)")
    relative_to: str = Field(..., example="launch")
    value: float = Field(..., example=83.0)
    lab_flag: str = Field(..., example="normal", description="'low', 'normal' or 'high' vs the lab's reference range")


class NasaCrewMember(BaseModel):
    subject_id: str = Field(..., example="C001")
    readings: List[NasaGlucoseReading]


class NasaGlucoseSummary(BaseModel):
    count: int
    crew_count: int
    preflight_mean: float
    return_day_mean: float
    postflight_mean: float
    outside_lab_range: int


class NasaGlucoseResponse(BaseModel):
    source: NasaDatasetInfo
    indicator: str = Field(..., example="blood_sugar")
    analyte: str = Field(..., example="GLUCOSE")
    unit: str = Field(..., example="mg/dL")
    lab_reference_range: LabRange
    crew: List[NasaCrewMember]
    summary: NasaGlucoseSummary
    limitations: List[str]
