# ✈️ TravelPilot AI — Autonomous Travel Disruption Concierge

> **Not an app that shows you rebooking options. A concierge that already booked the good one.**

An autonomous multi-agent AI platform that detects travel disruptions in real time and resolves them without requiring user intervention. Built for **CodeStreet 2026**.

## 🏗️ Architecture

- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui, Framer Motion, Mapbox
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL via Supabase, Prisma ORM
- **AI**: LangGraph multi-agent orchestration, Google Gemini 2.5 Flash
- **Auth**: JWT-based authentication with role-based access control

## 🤖 Multi-Agent Pipeline

```
Monitor → Risk Scoring → Planner (LLM) → Policy Guard → Execution → Notify → Explain
```

**10 Specialized Agents:**
1. **Monitor Agent** — Classifies disruptions from flight status feeds
2. **Risk Scoring Agent** — Composite risk from delays + weather + connections
3. **Planner Agent** — Searches & scores rebooking alternatives (Gemini 2.5 Flash)
4. **Policy Guard** — Deterministic fare/cabin/stop checks (never LLM)
5. **Execution Agent** — Books the chosen option with idempotency
6. **Hotel Agent** — Adjusts hotel bookings for new itineraries
7. **Ground Transport Agent** — Reschedules cab/ride pickups
8. **Budget Agent** — Tracks spend and enforces budget caps
9. **Notification Agent** — "What changed / what was done / how to undo"
10. **Explainability Agent** — Full audit trail with reasoning

## 🎯 3-Tier Autonomy Model

| Tier | Action | Condition |
|------|--------|-----------|
| **Tier 1** | Auto-book immediately | Fare delta ≤15%, ≤$200, same cabin, ≤1 stop |
| **Tier 2** | Confirm with traveler | Fare delta ≤40%, ≤$600, 5-min timeout |
| **Tier 3** | Escalate to human desk | Exceeds Tier 2 caps, international reroute, multi-pax |

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/GuptaNidhish/CodeStreet-Travel-Pilot.git
cd CodeStreet-Travel-Pilot

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your Supabase, Gemini, and Mapbox keys

# 4. Push database schema
npm run db:push

# 5. Seed demo data
npm run db:seed

# 6. Run both frontend and backend
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- API Health: http://localhost:4000/api/health

## 📧 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Traveler | alex@travelpilot.demo | demo123 |
| Manager | sarah@travelpilot.demo | demo123 |

## 📁 Project Structure

```
├── apps/
│   ├── web/          # Next.js 14 frontend
│   └── server/       # Express backend + LangGraph agents
├── packages/
│   └── shared/       # Shared types, constants, validators
├── .env.example
├── package.json      # npm workspaces root
└── tsconfig.base.json
```

## 📄 License

Built for CodeStreet 2026 Hackathon.
