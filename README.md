# ORCA - Marine Safety Dashboard
Live demo: https://orca-7l5i.onrender.com/


<img width="1568" height="746" alt="image" src="https://github.com/user-attachments/assets/19c607ec-4941-4891-9373-9b492d351662" />
<img width="1568" height="746" alt="image" src="https://github.com/user-attachments/assets/7d24555b-a026-4a1e-9555-f2ac953f8661" />
<img width="1568" height="747" alt="image" src="https://github.com/user-attachments/assets/d0988e5c-1455-4084-95b3-32f7426ce3f5" />


## What it does
ORCA (Marine Ecosystem Reasoning with Collaborative Agents) is a marine decision assistant built for Smart India Hackathon 2026 (problem statement SIH26176, ISRO / Department of Space).

A fisherman asks a question like "Is it safe to go fishing tomorrow at 6 AM near Ratnagiri?", by typing, by voice, or with a one-click scenario for a major coast. ORCA returns a **danger score (0-100)** with a clear verdict (Safe, Caution, Danger or Critical) and a recommendation.

### Features
- Interactive map of the Indian coast with toggleable layers: shore ports, sea surface temperature, chlorophyll/plankton, INCOIS fishing zones (PFZ), storm alerts, maritime boundaries, safest route and 60-minute boat trajectory
- Rule-based multi-agent engine (weather, ocean, boundary and alert agents) that combines its findings into one decision, with no generative AI involved
- 12-hour coastal wave and wind forecast
- Distance-to-maritime-border check
- Audit trail and data-source provenance for every decision
- English, Hindi and Marathi interface

### Data sources
Open-Meteo (marine and weather), INCOIS, IMD, ISRO MOSDAC

> Prototype decision-support platform. Always follow Coast Guard and local port advisories.
