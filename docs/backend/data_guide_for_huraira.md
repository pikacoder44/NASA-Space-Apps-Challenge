# AstroTrack — NASA Data Research & Download Guide

**For:** Abu Huraira and the AstroTrack development team  
**Purpose:** Find, download, evaluate, and document genuine NASA astronaut-health research data for the NASA Space Apps Challenge submission.

---

## 1. Why we need NASA data

The NASA Space Apps Challenge submission form states:

> In order to be eligible for a Global Award, you must use NASA data or resources.

AstroTrack currently uses a simulator-generated dataset containing synthetic astronaut health telemetry. This is useful for demonstrating the application, but synthetic data alone does not establish that we used NASA data.

Our goal is to identify relevant NASA research resources and, if suitable publicly accessible datasets are available, download and evaluate them.

**Important distinction:**
- NASA research material can be used as a research/reference resource.
- A NASA dataset can be used as an actual data source if we download and use it.
- Our synthetic simulator data must continue to be identified as simulated data.
- Never claim that NASA data was integrated into AstroTrack unless we actually integrate it.

## 2. Official NASA resources

### A. NASA Human Research Program (HRP)

Link: https://www.nasa.gov/hrp/

NASA's Human Research Program studies how spaceflight affects astronaut health and performance.

Relevant research areas:
- Cardiovascular changes
- Human health countermeasures
- Sleep and circadian rhythm
- Behavioral health and performance
- Space radiation
- Physiological adaptation to microgravity

Use this resource to understand the scientific background of AstroTrack's health indicators.

**Note:** HRP is a research program, not a single downloadable dataset repository.

### B. NASA Life Sciences Portal (NLSP)

Link: https://nlsp.nasa.gov/

This is our recommended starting point for human astronaut-health research data.

The portal includes investigations supported by NASA HRP and data from the Life Sciences Data Archive.

It contains information about human spaceflight and ground-analog studies.

Direct links:

- Explore data: https://nlsp.nasa.gov/explore
- Main portal: https://nlsp.nasa.gov/
- NASA NLSP information: https://www.nasa.gov/hrp/nlsp/

### C. NASA Open Science Data Repository (OSDR)

Link: https://osdr.nasa.gov/

OSDR contains spaceflight and space-relevant research datasets, including physiological, behavioral, biomedical, biological, and environmental data.

Direct links:

- Dataset search: https://osdr.nasa.gov/bio/repo/search
- NASA OSDR information: https://science.nasa.gov/biological-physical/data/osdr/
- NASA OSDR FAQ: https://science.nasa.gov/reference/osdr-faq/

OSDR is useful for finding research datasets and associated metadata and publications.

### D. NASA OSDR download tutorial

Link: https://github.com/nasa/OSDR_Tutorials/blob/main/source/pages/guides/access_osdr_data.md

This official NASA tutorial explains how to search for datasets and navigate the repository.

### E. NASA OSDR controlled-access guide

Link: https://www.nasa.gov/reference/osdr-tutorials-requesting-controlled-access-datasets/

Some human-derived datasets have restricted files. This guide explains the access-request process.

---

## 3. Step-by-step: Find astronaut-health datasets using NLSP

Start here:

https://nlsp.nasa.gov/explore

### Step 1 — Open Explore Data

Open the NLSP Explore Data page.

You should find a searchable list of NASA experiments and research investigations.

### Step 2 — Search relevant research areas

Search using these keywords:

| Search keyword | AstroTrack relevance |
|---|---|
| Cardiovascular physiology | Heart rate and blood pressure |
| Sleep | Sleep duration and circadian rhythm |
| Behavioral health | Mood and psychological performance |
| Exercise physiology | Physical activity and countermeasures |
| Human physiology | General astronaut physiological changes |
| Bed rest | Ground-based microgravity analog research |
| Spaceflight | Actual spaceflight investigations |

Start with **Cardiovascular physiology**.

### Step 3 — Apply filters

Where available, prioritize:

- Species: Human (Homo sapiens)
- Research area: Cardiovascular physiology
- Mission: International Space Station (ISS)
- Experiment type: Spaceflight or Ground

Do not exclude ground-based studies automatically. Bed-rest studies can be relevant because they simulate some physiological effects associated with microgravity.

### Step 4 — Open relevant experiments

For each promising result, inspect:

1. Experiment title
2. Experiment description
3. Research objectives
4. Principal investigator
5. Mission or study type
6. Variables and measurements
7. Data preservation status
8. Associated publications
9. Available files

**Important:** An experiment appearing in search results does not necessarily mean its downloadable files contain the exact measurements we need.

### Step 5 — Identify usable files

Look for:
- CSV files
- Excel spreadsheets
- Tabular measurement files
- Data dictionaries
- Metadata files
- Research publications

Check whether the files actually contain measurements rather than only study descriptions.

### Step 6 — Download and preserve the original files

Download publicly accessible files from the study page.

Keep the original files unchanged.

Create a separate working copy if we need to clean, transform, or normalize the data.

Record the original dataset URL and study identifier.

---

## 4. Step-by-step: Find datasets using OSDR

Start here:

https://osdr.nasa.gov/bio/repo/search

### Step 1 — Search datasets

Try these searches individually:

- Cardiovascular
- Human physiology
- Spaceflight
- Sleep
- Behavior
- Microgravity
- Bed rest

### Step 2 — Inspect the search results

Open a study and examine:

- Study ID (for example, OSD-xxx)
- Organism
- Mission or experiment
- Research description
- Assay types
- Available data files
- Publications

### Step 3 — Inspect the Files section

Open the study's Files section.

Expand the folders and inspect available files.

NASA's official FAQ explains how to select files and download them.

FAQ:

https://science.nasa.gov/reference/osdr-faq/

### Step 4 — Download accessible data

Select the required files and use the Download option.

If a file has a lock icon or requires controlled access, do not attempt to bypass its restrictions.

For controlled-access datasets, review:

https://www.nasa.gov/reference/osdr-tutorials-requesting-controlled-access-datasets/

For this hackathon, prioritize publicly accessible data.

---

## 5. Which data should we prioritize for AstroTrack?

Our application currently monitors seven indicators:

| AstroTrack indicator | Desired NASA research data |
|---|---|
| Heart rate | Heart rate measurements |
| Blood pressure (systolic) | Systolic blood pressure |
| Blood pressure (diastolic) | Diastolic blood pressure |
| Body temperature | Core or other clearly documented body-temperature measurements |
| Blood sugar | Blood glucose measurements |
| Sleep hours | Sleep duration or sleep-related measurements |
| Mood score | Behavioral health or validated mood-related measurements |

### Recommended priorities

**Priority 1 — Cardiovascular research**

Look for heart rate and blood pressure measurements.

These are directly relevant to the existing AstroTrack dashboard.

**Priority 2 — Sleep research**

Look for sleep duration, sleep quality, or circadian rhythm measurements.

**Priority 3 — Behavioral health research**

Look for validated behavioral or psychological measurements.

**Priority 4 — Other physiological indicators**

Investigate temperature and glucose data if suitable datasets are available.

Do not assume every NASA study contains all seven indicators.

A dataset may be useful even if it only supports one or two indicators.

---

## 6. How to decide whether a dataset is usable

Before downloading or integrating a dataset, verify:

- [ ] It is hosted by an official NASA repository.
- [ ] Its study ID and title are recorded.
- [ ] The research involves humans or a clearly relevant ground-based analog.
- [ ] The variables are relevant to AstroTrack.
- [ ] Units are documented.
- [ ] Measurement timestamps or study time points are available where needed.
- [ ] The population and study conditions are understood.
- [ ] Public-use or access restrictions are understood.
- [ ] The dataset has enough documentation to interpret its values correctly.

### Important scientific caution

NASA research data may come from different populations, missions, experimental conditions, and measurement protocols.

For example:
- A measurement from a bed-rest participant is not identical to a measurement from an astronaut aboard the ISS.
- A sleep study measurement cannot automatically be converted into a mood score.
- Blood pressure measurements from different protocols may not be directly comparable.

Do not combine datasets or compare measurements without checking their definitions, units, timing, and study conditions.

Do not use research observations as medical diagnostic thresholds.

---

## 7. How to document a dataset after finding it

Create a small record for every dataset we decide to use.

| Field | What to record |
|---|---|
| Dataset name | Official NASA study title |
| NASA repository | NLSP or OSDR |
| Study ID | Official experiment/study identifier |
| Dataset URL | Direct study page |
| Downloaded files | Exact filenames |
| Variables | Measurements available |
| Units | Original measurement units |
| Population | Astronauts, bed-rest participants, etc. |
| Access | Public or controlled |
| AstroTrack usage | How we actually use it |

Keep the original dataset and its documentation together.

Suggested folder structure:

```text
data/
├── nasa/
│   ├── README.md
│   ├── cardiovascular/
│   │   ├── original/
│   │   └── processed/
│   ├── sleep/
│   │   ├── original/
│   │   └── processed/
│   └── behavioral-health/
│       ├── original/
│       └── processed/
└── simulator/
    └── mission_data.json
```

Do not replace the existing simulator dataset or mix NASA records into it without documenting the transformation and source.

---

## 8. How to list NASA resources in the Space Apps submission

The submission form asks for:

- Link Text: Name of the NASA resource
- URL: Full URL of the resource

Only list resources that the team actually used.

### Example: NASA research/reference resources

| Link Text | Full URL |
|---|---|
| NASA Human Research Program | https://www.nasa.gov/hrp/ |
| NASA Life Sciences Portal | https://nlsp.nasa.gov/ |
| NASA Open Science Data Repository | https://osdr.nasa.gov/ |

These should only be listed if the team genuinely consulted them in developing the project.

### Example: An actual downloaded dataset

If we download and use a specific dataset, list its official study title and direct study URL instead of relying only on the repository homepage.

For example:

| Link Text | URL |
|---|---|
| Official NASA study title (OSD-XXX) | Direct NASA study URL |

Replace the example with the actual study we use.

**Never claim that we used a dataset merely because we found or downloaded it. The project must actually use it.**

---

## 9. Recommended task order for Abu Huraira

1. Open NLSP Explore Data.
2. Search Cardiovascular physiology.
3. Filter for Human studies and inspect ISS and ground-based studies.
4. Identify a study with publicly accessible heart rate or blood pressure measurements.
5. Record its title, study ID, URL, variables, and units.
6. Download the relevant files.
7. Inspect the dataset and its documentation.
8. Repeat for Sleep if time permits.
9. Share the findings and original dataset links with the team.
10. Decide whether the dataset can be responsibly incorporated into AstroTrack before making any integration claims.

### What to send back to the team

For each candidate dataset, provide:

- NASA study title
- Study ID
- Direct URL
- Available variables
- Units
- Downloaded filenames
- Whether the files are publicly accessible
- Whether the measurements are relevant to AstroTrack
- Any limitations or restrictions

---

## 10. Useful official links — quick reference

| Resource | URL |
|---|---|
| NASA Human Research Program | https://www.nasa.gov/hrp/ |
| NASA Life Sciences Portal | https://nlsp.nasa.gov/ |
| NLSP Explore Data | https://nlsp.nasa.gov/explore |
| NASA NLSP information | https://www.nasa.gov/hrp/nlsp/ |
| NASA OSDR | https://osdr.nasa.gov/ |
| OSDR Dataset Search | https://osdr.nasa.gov/bio/repo/search |
| NASA OSDR FAQ | https://science.nasa.gov/reference/osdr-faq/ |
| OSDR Download Tutorial | https://github.com/nasa/OSDR_Tutorials/blob/main/source/pages/guides/access_osdr_data.md |
| OSDR Controlled Access Guide | https://www.nasa.gov/reference/osdr-tutorials-requesting-controlled-access-datasets/ |
| OSDR AWS Access Guide | https://www.nasa.gov/reference/osdr-help-getting-started-with-aws-and-osdr-data/ |

---

## Final reminder

Our objective is not to download the largest dataset or collect as many NASA links as possible.

We need a small number of **relevant, documented, genuinely NASA-sourced resources** that support AstroTrack's astronaut-health monitoring concept.

Keep synthetic telemetry clearly separated from real NASA research data.

Accuracy and transparent attribution are more important than claiming more NASA integration than we have actually achieved.