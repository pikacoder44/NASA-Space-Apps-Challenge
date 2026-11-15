"""Astronaut database model."""

from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base


class Astronaut(Base):
    """Astronaut profile model representing crew members on deep space missions."""

    __tablename__ = "astronauts"

    id = Column(String(50), primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    role = Column(String(50), default="CDR-01", nullable=False)
    mission_day = Column(Integer, default=90, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    readings = relationship("Reading", back_populates="astronaut", cascade="all, delete-orphan")
