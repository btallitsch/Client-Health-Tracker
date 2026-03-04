# Client Health Tracker

A visual dashboard to monitor client health based on contact recency, revenue, and satisfaction.

## Features

- **Health Scoring System** — Each client is scored 0–100 across three dimensions:
  - **Last Contact** (0–33 pts): Days since last touchpoint
  - **Revenue** (0–33 pts): Monthly recurring revenue tier
  - **Satisfaction** (0–34 pts): Rating on a 1–10 scale
- **Risk Levels**: Healthy (70–100), At Risk (40–69), Critical (0–39)
- **Visual Dashboard**: Stat cards, donut chart, bar chart, score gauges
- **Grid & Table Views**: Toggle between card grid and sortable data table
- **Add / Edit / Delete Clients** with full form validation
- **Filter & Search**: By risk level, name, company, or industry
- **State Management**: Zustand store with derived stats and scoring

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- Zustand (state management)
- Recharts (charts)
- date-fns (date utilities)
- lucide-react (icons)

## Project Structure

```
src/
├── types/          # TypeScript interfaces and types
├── store/          # Zustand store (useClientStore)
├── utils/          # Scoring logic + sample data
├── components/     # UI components
│   ├── Dashboard.tsx         # Main layout, filters, view toggle
│   ├── StatCard.tsx          # KPI metric cards
│   ├── ClientCard.tsx        # Grid card with gauge
│   ├── ClientTable.tsx       # Sortable table view
│   ├── ClientForm.tsx        # Add/edit modal form
│   ├── ClientDetailModal.tsx # View detail + actions
│   ├── RiskBadge.tsx         # Risk level pill
│   ├── ScoreGauge.tsx        # Circular arc score gauge
│   └── RiskChart.tsx         # Recharts donut + bar
└── styles/
    └── global.css            # CSS variables + global styles
```

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173)

## Build for Production

```bash
npm run build
npm run preview
```
