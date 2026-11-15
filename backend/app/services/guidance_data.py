"""Clinical guidance knowledge base and body map mappings."""

from typing import Dict, Any, List, Optional

GUIDANCE_CATALOG: Dict[str, Dict[str, Dict[str, Any]]] = {
    "heart_rate": {
        "normal": {
            "title": "Resting Heart Rate Nominal",
            "explanation": "Cardiac contraction frequency is within your personal baseline in microgravity.",
            "action": "Maintain scheduled flight duties, nutrition, and scheduled exercise countermeasure blocks.",
            "advice": [
                "Optimal cardiovascular stability.",
                "Continue fluid replenishment protocols."
            ],
            "citation": "NASA Human Research Program Standard Medical Protocol (HRP-47053)",
            "citation_url": "https://www.nasa.gov/hrp"
        },
        "warning": {
            "title": "Heart Rate Slightly Elevated",
            "explanation": "Cardiovascular baroreflex alteration or mild operational fatigue detected.",
            "action": "Log repeat reading in 4 hours, increase hydration, and verify rest compliance.",
            "advice": [
                "Drink 500 mL electrolyte fluid over the next 2 hours.",
                "Avoid strenuous unscheduled physical exertion.",
                "Review cabin ambient temperature and CO2 partial pressure."
            ],
            "citation": "NASA Space Medicine Clinical Practice Guidelines: Cardiovascular Deconditioning",
            "citation_url": "https://www.nasa.gov/hrp/hazards"
        },
        "critical": {
            "title": "Severe Tachycardia / Bradycardia Alert",
            "explanation": "Cardiac frequency has breached clinical safety limits in spaceflight.",
            "action": "Immediately contact the Flight Surgeon via Mission Control telemetry uplink. Rest in berth.",
            "advice": [
                "Stop all exercise and EVA preparation immediately.",
                "Rest in supine berth position with oxygen monitor attached.",
                "Prepare medical telemetry kit for ground consultation."
            ],
            "citation": "NASA Flight Medicine Emergency Triage Protocol",
            "citation_url": "https://www.nasa.gov/hrp/hazards"
        }
    },
    "blood_pressure_systolic": {
        "normal": {
            "title": "Systolic Arterial Pressure Nominal",
            "explanation": "Central arterial tension during ventricular systole is optimal.",
            "action": "Continue baseline flight protocol.",
            "advice": ["Cardiovascular fluid shift stabilized.", "Maintain hydration schedule."],
            "citation": "NASA HRP Medical Reference Table",
            "citation_url": "https://www.nasa.gov/hrp"
        },
        "warning": {
            "title": "Systolic Pressure Elevated",
            "explanation": "Cephalic fluid redistribution or vascular resistance shift is elevating systolic tension.",
            "action": "Rest quietly for 15 minutes and repeat brachial cuff measurement.",
            "advice": [
                "Verify correct cuff placement at heart level in microgravity.",
                "Reduce dietary sodium intake for next two meals.",
                "Log subjective symptoms (head fullness, vision changes)."
            ],
            "citation": "NASA Clinical Reference: Cephalic Fluid Shift & Spaceflight Hypertension",
            "citation_url": "https://www.nasa.gov/hrp/hazards"
        },
        "critical": {
            "title": "Hypertensive / Hypotensive Crisis",
            "explanation": "Systolic arterial pressure is critically outside safe physiological limits.",
            "action": "Notify Crew Medical Officer (CMO) and establish ground medical downlink.",
            "advice": [
                "Discontinue active countermeasures.",
                "Administer emergency vital monitoring sequence.",
                "Prepare telemetry report for flight surgeon."
            ],
            "citation": "NASA Medical Operations Guidelines: Critical Hemodynamic Events",
            "citation_url": "https://www.nasa.gov/hrp/hazards"
        }
    },
    "blood_pressure_diastolic": {
        "normal": {
            "title": "Diastolic Arterial Pressure Nominal",
            "explanation": "Resting peripheral vascular resistance is within baseline range.",
            "action": "Maintain nominal schedule.",
            "advice": ["Peripheral perfusion adequate.", "Continue routine vitals check."],
            "citation": "NASA HRP Cardiovascular Protocol",
            "citation_url": "https://www.nasa.gov/hrp"
        },
        "warning": {
            "title": "Diastolic Pressure Variance",
            "explanation": "Mild shift in resting arterial resistance detected.",
            "action": "Recheck in 2 hours and monitor fluid intake.",
            "advice": [
                "Ensure adequate relaxation before measurement.",
                "Avoid caffeine or stimulants.",
                "Track along with systolic pressure."
            ],
            "citation": "NASA Space Medicine Clinical Guidelines",
            "citation_url": "https://www.nasa.gov/hrp"
        },
        "critical": {
            "title": "Critical Diastolic Variance",
            "explanation": "Diastolic pressure breach indicates impaired cardiac perfusion.",
            "action": "Contact Flight Surgeon immediately. Halt active tasks.",
            "advice": [
                "Rest in crew quarters.",
                "Initiate continuous automatic blood pressure recording."
            ],
            "citation": "NASA Emergency Flight Protocol",
            "citation_url": "https://www.nasa.gov/hrp/hazards"
        }
    },
    "body_temp": {
        "normal": {
            "title": "Core Thermal Equilibrium Nominal",
            "explanation": "Core body temperature is balanced and within safe flight baseline.",
            "action": "Continue normal activity.",
            "advice": ["Thermoregulatory cooling intact.", "Maintain standard cabin hydration."],
            "citation": "NASA Thermal Physiology Standards",
            "citation_url": "https://www.nasa.gov/hrp"
        },
        "warning": {
            "title": "Mild Core Temperature Elevation",
            "explanation": "Spaceflight-associated core temperature elevation or mild inflammatory response.",
            "action": "Increase oral fluids, verify cabin ventilation airflow, and recheck in 2 hours.",
            "advice": [
                "Ensure suit / clothing allows adequate convective cooling.",
                "Hydrate with chilled electrolyte solution.",
                "Check for localized symptoms (nasal congestion, skin irritation)."
            ],
            "citation": "NASA HRP Spaceflight Thermoregulation & Space Fever Studies",
            "citation_url": "https://www.nasa.gov/hrp"
        },
        "critical": {
            "title": "Pyrexia / Hypothermia Emergency",
            "explanation": "Core temperature indicates acute systemic infection or thermoregulatory failure.",
            "action": "Alert CMO and Flight Surgeon immediately. Retrieve onboard medical diagnostic kit.",
            "advice": [
                "Administer active cooling/warming countermeasure per CMO direction.",
                "Collect blood smear / saliva sample for diagnostic analysis.",
                "Isolate in crew berth if infectious pathogen suspected."
            ],
            "citation": "NASA Infectious Disease & Acute Illness Protocol",
            "citation_url": "https://www.nasa.gov/hrp/hazards"
        }
    },
    "blood_sugar": {
        "normal": {
            "title": "Blood Glucose Nominal",
            "explanation": "Fasting circulating glucose concentration is stable.",
            "action": "Maintain scheduled nutrition and caloric intake.",
            "advice": ["Metabolic response steady.", "Log meal logs accurately."],
            "citation": "NASA Spaceflight Nutritional Biochemistry Protocol",
            "citation_url": "https://www.nasa.gov/hrp"
        },
        "warning": {
            "title": "Mild Glucose Fluctuation",
            "explanation": "Microgravity insulin sensitivity shift or post-absorptive variance.",
            "action": "Log dietary intake over past 24 hours and re-test before next meal.",
            "advice": [
                "Avoid concentrated sugar rations.",
                "Distribute complex carbohydrates evenly across scheduled meals.",
                "Ensure adequate hydration before exercise session."
            ],
            "citation": "NASA Metabolic Alterations in Microgravity Reference",
            "citation_url": "https://www.nasa.gov/hrp"
        },
        "critical": {
            "title": "Hypoglycemia / Hyperglycemia Alert",
            "explanation": "Blood glucose is dangerously outside safe limits for astronaut operations.",
            "action": "Contact CMO immediately. Administer oral glucose (if low) or medical protocol (if high).",
            "advice": [
                "Do not perform EVAs, robotic operations, or piloting tasks.",
                "Recheck blood glucose with capillary fingerstick every 30 minutes."
            ],
            "citation": "NASA Emergency Endocrine & Metabolic Procedures",
            "citation_url": "https://www.nasa.gov/hrp/hazards"
        }
    },
    "sleep_hours": {
        "normal": {
            "title": "Restorative Sleep Goal Achieved",
            "explanation": "Sleep duration was sufficient to maintain cognitive resilience and mission performance.",
            "action": "Maintain current circadian schedule and sleep berth environment.",
            "advice": ["Circadian rhythm aligned.", "Cognitive workload capacity high."],
            "citation": "NASA Behavioral Health & Performance Standards",
            "citation_url": "https://www.nasa.gov/hrp"
        },
        "warning": {
            "title": "Cumulative Sleep Debt Detected",
            "explanation": "Recent sleep duration has fallen below restorative thresholds during mission operations.",
            "action": "Review sleep berth acoustic insulation and schedule a 45-minute recovery sleep extension.",
            "advice": [
                "Utilize earplugs and verify sleep pod acoustic dampeners.",
                "Shift cabin lighting to red-spectrum 60 minutes before rest period.",
                "Avoid caffeine consumption within 6 hours of sleep block."
            ],
            "citation": "NASA Spaceflight Fatigue Management Guidelines",
            "citation_url": "https://www.nasa.gov/hrp/hazards"
        },
        "critical": {
            "title": "Severe Chronic Sleep Deprivation",
            "explanation": "Critical sleep deficit threatens cognitive motor performance and crew safety.",
            "action": "Stand down from critical operational tasks. Flight Surgeon consultation mandatory.",
            "advice": [
                "Mandatory sleep protocol authorized by mission director.",
                "Temporary stand-down from EVA, robotic, and docking operations.",
                "CMO may prescribe sleep countermeasure medication under protocol."
            ],
            "citation": "NASA Flight Rule: Crew Fatigue & Operational Stand-Down",
            "citation_url": "https://www.nasa.gov/hrp/hazards"
        }
    },
    "mood_score": {
        "normal": {
            "title": "Psychological Resilience High",
            "explanation": "Self-reported mood and subjective operational stamina are robust.",
            "action": "Continue positive behavioral routines and crew recreational time.",
            "advice": ["High operational morale.", "Maintain communication with family and ground support."],
            "citation": "NASA BHP Behavioral Health Operations Guidelines",
            "citation_url": "https://www.nasa.gov/hrp"
        },
        "warning": {
            "title": "Operational Stress / Fatigue Reported",
            "explanation": "Cumulative mission workload, confinement, and sleep disruption are impacting well-being.",
            "action": "Schedule dedicated relaxation time, connect with family downlink, or talk with flight psychologist.",
            "advice": [
                "Engage in non-work personal activities or creative relaxation.",
                "Request workload adjustment if timelines are compressed.",
                "Utilize private psychological conference (PPC) slot."
            ],
            "citation": "NASA Psychological Support Services for Long-Duration Missions",
            "citation_url": "https://www.nasa.gov/hrp/hazards"
        },
        "critical": {
            "title": "Significant Behavioral Stress Alert",
            "explanation": "Subjective score indicates acute psychological distress or severe mission exhaustion.",
            "action": "Contact Flight Surgeon and Chief of Space Medicine for private consultation.",
            "advice": [
                "Immediate stand-down from high-stress operational tasks.",
                "Private medical conference scheduled with ground support team.",
                "Crew commander to rebalance daily task allocations."
            ],
            "citation": "NASA Crew Behavioral Health Emergency Protocols",
            "citation_url": "https://www.nasa.gov/hrp/hazards"
        }
    }
}

BODY_MAP_REGIONS: Dict[str, Dict[str, Any]] = {
    "head": {
        "indicators": ["sleep_hours", "mood_score"],
        "default_status": "normal"
    },
    "chest": {
        "indicators": ["heart_rate", "blood_pressure_systolic", "blood_pressure_diastolic", "body_temp"],
        "default_status": "normal"
    },
    "abdomen": {
        "indicators": ["blood_sugar"],
        "default_status": "normal"
    },
    "limbs": {
        "indicators": ["heart_rate", "blood_pressure_systolic", "blood_pressure_diastolic"],
        "default_status": "normal"
    },
    "full_body": {
        "indicators": [
            "heart_rate",
            "blood_pressure_systolic",
            "blood_pressure_diastolic",
            "body_temp",
            "blood_sugar",
            "sleep_hours",
            "mood_score"
        ],
        "default_status": "normal"
    }
}


def get_clinical_guidance(indicator: str, status: str) -> Dict[str, Any]:
    """Retrieve structured guidance for indicator and evaluation status."""
    ind_data = GUIDANCE_CATALOG.get(indicator, {})
    status_data = ind_data.get(status)

    if not status_data:
        # Generic graceful fallback
        return {
            "title": f"{indicator.replace('_', ' ').title()} - {status.title()} Status",
            "explanation": f"Telemetry for {indicator} is currently categorized as {status}.",
            "action": "Monitor regularly and consult crew medical guidelines if trend persists.",
            "advice": [
                "Log regular measurements.",
                "Report significant deviations to Flight Surgeon."
            ],
            "citation": "NASA Human Research Program Standard Medical Protocol",
            "citation_url": "https://www.nasa.gov/hrp",
            "disclaimer": "Support tool only, not a certified clinical diagnostic device."
        }

    return {
        "indicator": indicator,
        "status": status,
        **status_data,
        "disclaimer": "Support tool only, not a certified clinical diagnostic device."
    }


BODY_PART_ALIASES: Dict[str, str] = {
    "heart": "chest",
    "lungs": "chest",
    "brain": "head",
    "mind": "head",
    "stomach": "abdomen",
    "arms": "limbs",
    "legs": "limbs",
    "whole_body": "full_body",
    "body": "full_body",
}


def normalize_body_part(body_part: str) -> Optional[str]:
    """Map a body part name (any case, '-', ' ' or aliases like 'heart') to a region key, or None."""
    key = body_part.strip().lower().replace("-", "_").replace(" ", "_")
    key = BODY_PART_ALIASES.get(key, key)
    return key if key in BODY_MAP_REGIONS else None


def get_body_map_region(body_part: str) -> Optional[Dict[str, Any]]:
    """Indicators monitored for a body region, or None if the region is unknown."""
    key = normalize_body_part(body_part)
    if key is None:
        return None
    return {"body_part": key, "indicators": list(BODY_MAP_REGIONS[key]["indicators"])}
