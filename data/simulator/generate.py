"""Deterministic 180-Day Astronaut Mission Data Simulator for AstroTrack.

Generates realistic physiological readings for a long-duration space mission
with scripted physiological events including the "Day 90 story" (workload stress
and sleep debt) and a transient mid-mission infection.

DISCLAIMER:
All generated data, astronaut profiles, and scenario curves are synthetic
demonstration artifacts for the NASA Space Apps Challenge 2026.
They do not represent real astronaut clinical records or NASA medical data.
"""

import json
import math
import os
import random
from typing import Any, Dict, List

# Seed ensures 100% deterministic, reproducible output
RANDOM_SEED: int = 42

TOTAL_DAYS: int = 180

# Baseline physiological configuration for our astronaut
# Standard deviations reflect natural circadian and operational variations
BASELINES: Dict[str, Dict[str, float]] = {
    "heart_rate": {"mean": 65.0, "std": 3.2, "min": 45.0, "max": 140.0, "round": 1},
    "blood_pressure_systolic": {"mean": 112.0, "std": 3.5, "min": 75.0, "max": 160.0, "round": 1},
    "blood_pressure_diastolic": {"mean": 73.0, "std": 2.5, "min": 45.0, "max": 100.0, "round": 1},
    "body_temp": {"mean": 36.6, "std": 0.15, "min": 35.0, "max": 39.5, "round": 2},
    "blood_sugar": {"mean": 92.0, "std": 4.5, "min": 55.0, "max": 200.0, "round": 1},
    "sleep_hours": {"mean": 7.1, "std": 0.65, "min": 3.0, "max": 12.0, "round": 1},
    "mood_score": {"mean": 8.0, "std": 0.70, "min": 1.0, "max": 10.0, "round": 1},
}


def clamp(val: float, min_val: float, max_val: float) -> float:
    return max(min_val, min(max_val, val))


def generate_mission_data(seed: int = RANDOM_SEED) -> List[Dict[str, Any]]:
    """Generate 180 days of daily readings for all 7 indicators."""
    rng = random.Random(seed)
    records: List[Dict[str, Any]] = []

    for day in range(1, TOTAL_DAYS + 1):
        # Event 1: Days 42-45 — Acute transient infection (fever & tachycardia)
        infection_active = 42 <= day <= 45
        infection_intensity = 0.0
        if infection_active:
            infection_intensity = math.sin((day - 41) / 4.0 * math.pi)

        # Event 2: Days 87-90 — The Day 90 Story (Workload strain & chronic sleep debt)
        # On Day 90: Sleep is under 6h, HR is elevated, mood is down.
        # Status evaluates strictly to WARNING (Yellow).
        stress_active = 87 <= day <= 91
        stress_intensity = 0.0
        if stress_active:
            if day == 87:
                stress_intensity = 0.50
            elif day == 88:
                stress_intensity = 0.75
            elif day == 89:
                stress_intensity = 0.90
            elif day == 90:
                stress_intensity = 1.00  # Day 90 peak (Warning state)
            elif day == 91:
                stress_intensity = 0.40

        # Event 3: Days 138-142 — Late-mission psychological monotony
        monotony_active = 138 <= day <= 142
        monotony_intensity = 0.0
        if monotony_active:
            monotony_intensity = math.sin((day - 137) / 5.0 * math.pi)

        for indicator, cfg in BASELINES.items():
            base_mean = cfg["mean"]
            std = cfg["std"]

            # Sample daily gaussian noise around baseline
            val = rng.gauss(base_mean, std)

            # Apply Scenario Events
            if infection_active:
                if indicator == "body_temp":
                    val += infection_intensity * 1.25  # Reaches ~37.8 °C
                elif indicator == "heart_rate":
                    val += infection_intensity * 20.0  # Reaches ~85 bpm
                elif indicator == "sleep_hours":
                    val -= infection_intensity * 0.8

            if stress_active:
                if indicator == "sleep_hours":
                    # Calibrated so Day 90 is ~5.6h (under 6h, z ~ -2.2 -> WARNING)
                    val -= stress_intensity * 0.45
                elif indicator == "heart_rate":
                    # Calibrated so Day 90 is ~71.5 bpm (z ~ +2.0 -> WARNING)
                    val += stress_intensity * 6.5
                elif indicator == "mood_score":
                    # Calibrated so Day 90 is ~6.4 (z ~ -2.1 -> WARNING)
                    val -= stress_intensity * 1.45
                elif indicator == "blood_pressure_systolic":
                    val += stress_intensity * 4.0

            if monotony_active:
                if indicator == "mood_score":
                    val -= monotony_intensity * 1.8
                elif indicator == "sleep_hours":
                    val -= monotony_intensity * 0.5

            # Clamp within physiological physical limits
            val = clamp(val, cfg["min"], cfg["max"])
            rounded_val = round(val, cfg["round"])

            records.append({
                "day": day,
                "indicator": indicator,
                "value": rounded_val,
            })

    return records


def save_mission_data(output_path: str, records: List[Dict[str, Any]]) -> None:
    """Save records to disk as formatted JSON."""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2)


if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    target_file = os.path.join(current_dir, "mission_data.json")
    dataset = generate_mission_data(RANDOM_SEED)
    save_mission_data(target_file, dataset)
    print(f"Generated {len(dataset)} records for {TOTAL_DAYS} mission days.")
    print(f"Saved dataset to {target_file}")
