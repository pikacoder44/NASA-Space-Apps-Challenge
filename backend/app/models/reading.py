"""Health reading database model."""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.core.database import Base


class Reading(Base):
    """Historical or real-time physiological telemetry reading."""

    __tablename__ = "readings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    astronaut_id = Column(String(50), ForeignKey("astronauts.id", ondelete="CASCADE"), nullable=False, index=True)
    indicator = Column(String(50), nullable=False, index=True)
    value = Column(Float, nullable=False)
    unit = Column(String(20), nullable=False)
    status = Column(String(20), nullable=False)  # "normal", "warning", "critical"
    reason = Column(Text, nullable=True)
    measured_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    astronaut = relationship("Astronaut", back_populates="readings")

    __table_args__ = (
        Index("idx_readings_astro_indicator_measured", "astronaut_id", "indicator", "measured_at"),
    )
