# EU Recovery and Resilience Scoreboard - Data Visualization System

## Overview
This repository contains a responsive web application designed to visualize complex datasets inspired by the **EU Recovery and Resilience Scoreboard** (tracked nationally via the PRR - Plano de Recuperação e Resiliência). 

Developed for the **Human-Computer Interaction** (*Interação Pessoa-Máquina*) course at the University of Minho, the primary focus of this project was to architect an intuitive, user-centric dashboard.

## User Persona Archetypes Addressed
The UI layout, charts, and workflows were engineered from the ground up to satisfy three distinct user personas detailed in the requirements specification:
* **The Analyst (Helena):** Advanced filtering, structural section tracking (e.g., Digital/Green transition), and exportable formatted data matrices (CSV/JSON).
* **The Entrepreneur (Marco):** Dynamic multi-country comparative charts, financial investment distributions across key development pillars, and explicit disbursement timelines.
* **The Citizen/Educator (Clara):** Plain-language executive summaries, region-specific lookups, simplified infographics, and direct real-world metric mappings (e.g., number of schools upgraded).

---

## Architecture & Tech Stack
* **Frontend Framework:** Vue.js (Composition API)
* **State Management:** Pinia 
* **Routing System:** Vue Router 
* **Styling Framework:** Tailwind CSS 
* **Mock Backend:** JSON Server 
* **Data Visualization:** VueApexCharts 

---

## Getting Started

### Prerequisites
* **Node.js** (v16.x or higher) — Required for running the package manager (`npm`) and execution tools (`npx`).

### Installation & Setup
1. Clone the repository:
```bash
git clone [https://github.com/your-username/eu-recovery-resilience-visualizer.git](https://github.com/your-username/eu-recovery-resilience-visualizer.git)
cd eu-recovery-resilience-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Running server
```bash
npx json-server db.json
```

4. Running project
```bash
npm run dev
```
