# ✈️ TravelPilot AI — Autonomous Travel Disruption Concierge

> **"Not an app that shows you rebooking options. A concierge that already booked the good one."**

![TravelPilot AI Banner](https://img.shields.io/badge/TravelPilot_AI-Autonomous_Concierge-6366f1?style=for-the-badge&logo=ai)
[![CodeStreet 2026](https://img.shields.io/badge/Hackathon-CodeStreet_2026-ff4500?style=for-the-badge)](https://codestreet.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14_App_Router-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Node.js & Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![PostgreSQL & Prisma](https://img.shields.io/badge/Prisma_ORM-6.2-2d3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Google Gemini 2.5](https://img.shields.io/badge/Gemini_2.5_Flash-Multi--Agent_AI-4285f4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 📌 Table of Contents

- [Overview & Vision](#-overview--vision)
- [The Disruption Crisis & The Solution](#-the-disruption-crisis--the-solution)
- [Key Features](#-key-features)
- [🤖 Multi-Agent Architecture](#-multi-agent-architecture)
- [🎯 3-Tier Autonomy & Policy Guard](#-3-tier-autonomy--policy-guard)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🔌 API Endpoints](#-api-endpoints)
- [🚀 Quick Start Guide](#-quick-start-guide)
- [⚙️ Environment Variables](#️-environment-variables)
- [📧 Demo Credentials & Disruption Simulator](#-demo-credentials--disruption-simulator)
- [📊 Database Schema Overview](#-database-schema-overview)
- [🧪 Verification & Testing](#-verification--testing)
- [📄 License & Acknowledgments](#-license--acknowledgments)

---

## 🌟 Overview & Vision

**TravelPilot AI** is an end-to-end, zero-touch autonomous travel disruption concierge engineered for business travelers, premium cardholders, and corporate travel managers.

When a flight is delayed, diverted, or cancelled, conventional apps send passive push notifications asking travelers to search for rebookings themselves. **TravelPilot AI flips the paradigm**: it continuously monitors flight statuses, predicts cascades, scores alternative flights using Google Gemini 2.5 Flash, evaluates corporate policy boundaries, automatically rebooks optimal itineraries (flights + hotels + cabs), and provides a 5-minute safety window for human review or single-click reversal.

---

## 💥 The Disruption Crisis & The Solution

| The Traditional Way (Reactive Chaos) ❌ | The TravelPilot AI Way (Autonomous Resolution) ✅ |
| :--- | :--- |
| **Notification Delay**: Learns of cancellation hours after the airline knows. | **Real-Time Detection & Prediction**: Detects flight issues and weather cascades instantly. |
| **Manual Rebooking Fatigue**: Traveler waits in 3-hour airport customer service queues or struggles on slow apps. | **Zero-Touch Auto-Booking**: Evaluates candidate flights and auto-books within policy boundaries in seconds. |
| **Orphaned Logistics**: Flight changes but hotel and cab reservations remain on old times, causing missed check-ins. | **Multi-Modal Synchronization**: Automatically shifts hotel check-ins and reschedules airport pickups. |
| **Black-Box Decisions**: No insight into why a replacement flight was picked. | **Explainable AI & Audit Log**: Full audit trace of LLM reasoning, rejected options, and cost deltas. |
| **Compliance Risks**: Out-of-policy bookings created under stress during travel chaos. | **Deterministic Policy Guard**: Enforces corporate fare caps, cabin limits, and max stops via rule engines. |

---

## 🚀 Key Features

### 1. 🔍 Real-Time Disruption Detection & Weather Risk Scoring
- Continuous monitoring of flight status changes (Delays, Cancellations, Diversions, Missed Connections).
- Integration with OpenWeather API & historical delay indexes to generate a composite risk score (0–100).

### 2. 🤖 Gemini 2.5 Flash Candidate Ranking Engine
- Evaluates candidate replacement flights against traveler preferences (seat choice, preferred alliance, carbon footprint, connection times, cabin class).
- Multi-dimensional scoring formula balancing arrival time urgency, fare delta, carbon footprint, and airline reliability.

### 3. 🛡️ Deterministic Policy Guard (Human-in-the-Loop Safeguard)
- Hard strict-checks that cannot be hallucinated or bypassed by LLMs.
- Enforces cabin class constraints, max budget thresholds, stop caps, and fare variance limits.

### 4. 🏨 Multi-Modal Itinerary Sync (Hotel + Cab Adjustments)
- When a flight changes, TravelPilot automatically adjusts downstream commitments:
  - Reschedules hotel check-in/check-out dates.
  - Shifts ground transport (cabs/rides) to match the new arrival time.

### 5. ⏳ 5-Minute Safety Window & Single-Click Reversal
- Autonomous Tier 1 decisions give travelers an instant 5-minute undo window.
- Single-click itinerary rollback restores original bookings if desired.

### 6. 📊 Corporate Manager Dashboard & Live Risk Heatmap
- Enterprise view for travel managers: active trips, disruption heatmaps, total cost savings, auto-resolution rates, and real-time agent audit logs.

### 7. ⚡ Live SSE (Server-Sent Events) Agent Execution Feed
- Watch the 10 specialized agents collaborate live in real-time on the frontend UI during a disruption flow.

---

## 🤖 Multi-Agent Architecture

TravelPilot AI uses a multi-agent orchestration pattern based on **Detect → Decide → Act → Explain**:

```
 ┌────────────────┐     ┌─────────────────────┐     ┌──────────────────────┐
 │ 1. Monitor     │ ──> │ 2. Risk Scoring     │ ──> │ 3. Planner (Gemini)  │
 │    Agent       │     │    Agent            │     │    Agent             │
 └────────────────┘     └─────────────────────┘     └──────────────────────┘
                                                               │
 ┌────────────────┐     ┌─────────────────────┐                ▼
 │ 6. Hotel       │ <── │ 5. Execution        │ <── ┌──────────────────────┐
 │    Sync Agent  │     │    Agent            │     │ 4. Policy Guard      │
 └────────────────┘     └─────────────────────┘     │    (Deterministic)   │
         │                         │                └──────────────────────┘
         ▼                         ▼
 ┌────────────────┐     ┌─────────────────────┐     ┌──────────────────────┐
 │ 7. Ground      │ ──> │ 8. Notification     │ ──> │ 9. Explainability    │
 │    Transport   │     │    Agent            │     │    & Audit Agent     │
 └────────────────┘     └─────────────────────┘     └──────────────────────┘
```

### Specialized Agents Breakdown

| Agent Name | Function & Responsibility |
| :--- | :--- |
| **1. Monitoring Agent** | Polls live flight status APIs to catch cancellations, delays, and schedule alterations. |
| **2. Risk Scoring Agent** | Computes composite risk scores using weather data, airport congestion, and connection tight limits. |
| **3. Planner Agent (LLM)** | Queries available flights via search APIs and scores candidate itineraries with Gemini 2.5 Flash. |
| **4. Policy Guard Agent** | Enforces hard corporate fare caps, cabin matching, and stop limits deterministically. |
| **5. Execution Agent** | Executes flight booking requests idempotently and issues confirmed booking PNRs. |
| **6. Hotel Sync Agent** | Modifies existing hotel reservations to match the new check-in/out timestamps. |
| **7. Ground Transport Agent** | Adjusts cab pick-up schedules based on updated estimated time of arrival (ETA). |
| **8. Notification Agent** | Generates push/in-app notifications detailing what changed, what was done, and undo options. |
| **9. Explainability Agent** | Logs step-by-step LLM reasoning, confidence scores, and rejected alternatives to audit storage. |
| **10. Manager Analytics Agent**| Aggregates enterprise-wide travel stats, cost deltas, and risk telemetry for corporate managers. |

---

## 🎯 3-Tier Autonomy & Policy Guard

TravelPilot AI protects travelers and corporate budgets through a clear, configurable **3-Tier Autonomy Matrix**:

```
                       ┌─────────────────────────────────┐
                       │    Disruption Detected          │
                       └─────────────────────────────────┘
                                        │
                                        ▼
                       ┌─────────────────────────────────┐
                       │ Risk Score & Candidates Found   │
                       └─────────────────────────────────┘
                                        │
                 ┌──────────────────────┼──────────────────────┐
                 ▼                      ▼                      ▼
         [ Tier 1: Auto ]       [ Tier 2: Confirm ]    [ Tier 3: Escalate ]
         Fare Delta ≤ 15%       Fare Delta ≤ 40%       Exceeds Tier 2 caps
         Price Delta ≤ $200     Price Delta ≤ $600     International reroute
         Same Cabin Class       Max 1 stop change      Multi-passenger group
         Auto-Booked Instant    5-min Confirmation     Assigned to Human Desk
```

| Tier | Policy Boundary | System Behavior |
| :--- | :--- | :--- |
| **Tier 1 (Full Autonomy)** | Fare delta ≤15%, Price delta ≤$200, Same cabin, Max 1 stop | **Auto-booked immediately**. 5-minute undo window provided to traveler. |
| **Tier 2 (User Confirmation)** | Fare delta ≤40%, Price delta ≤$600 | **Option reserved**. Notification sent with a 5-minute confirmation countdown. |
| **Tier 3 (Human Escalation)** | Fare delta >$600 or complex routing | **Escalated**. Flagged on Manager Dashboard for corporate travel desk intervention. |

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 14 (App Router, TypeScript)
- **UI Components**: React 18, Tailwind CSS, shadcn/ui, Lucide Icons
- **Animation**: Framer Motion
- **Maps**: Mapbox GL JS (`react-map-gl`)
- **State Management**: Zustand
- **Real-Time**: EventSource SSE (Server-Sent Events) client

### **Backend**
- **Runtime**: Node.js & TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (hosted on Supabase)
- **ORM**: Prisma ORM v6.2
- **Validation**: Zod & TypeScript type enforcement
- **Auth**: JWT (JSON Web Tokens) with role-based middleware (`TRAVELER` vs `MANAGER`)

### **AI & Orchestration**
- **LLM Engine**: Google Gemini 2.5 Flash (`@google/generative-ai`)
- **Agent Orchestration**: Multi-Agent State Machine Pipeline
- **Integrations**: OpenWeather API, Amadeus Flight API, Mock Hotel & Ground Transport APIs

---

## 📁 Project Structure

```
CodeStreet-Travel-Pilot/
├── apps/
│   ├── web/                         # Next.js 14 Frontend Application
│   │   ├── src/
│   │   │   ├── app/                 # Next.js App Router pages
│   │   │   │   ├── page.tsx         # Traveler Dashboard
│   │   │   │   ├── login/           # Auth login screen
│   │   │   │   ├── manager/         # Corporate Manager Dashboard
│   │   │   │   ├── simulator/       # Live Disruption Simulation Tool
│   │   │   │   ├── timeline/        # Trip Events & Decision Timeline
│   │   │   │   ├── trips/           # Trip Details & Itineraries
│   │   │   │   ├── notifications/   # In-app notifications
│   │   │   │   └── agent-trace/     # Real-time Agent Execution Trace
│   │   │   ├── components/          # Reusable UI components
│   │   │   │   ├── AgentOrchestratorVisualizer.tsx
│   │   │   │   ├── CandidateComparisonCard.tsx
│   │   │   │   ├── DisruptionSimulatorPanel.tsx
│   │   │   │   ├── FlightRiskMap.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── UndoCountdownTimer.tsx
│   │   │   ├── stores/              # Zustand state stores
│   │   │   └── hooks/               # Custom React hooks (SSE, Auth)
│   └── server/                      # Express TypeScript Backend Server
│       ├── prisma/
│       │   ├── schema.prisma        # Prisma Database Schema
│       │   └── seed.ts              # Demo Data Seeder
│       ├── src/
│       │   ├── agents/              # Multi-Agent Orchestrator Machine
│       │   │   └── orchestrator.ts  # 10-Agent Pipeline Engine
│       │   ├── integrations/        # External API Providers (Weather, Flights, Hotels)
│       │   ├── middleware/          # JWT & Role Auth Middleware
│       │   ├── routes/              # REST API Controllers & Handlers
│       │   │   ├── auth.ts
│       │   │   ├── audit.ts
│       │   │   ├── dashboard.ts
│       │   │   ├── disruptions.ts
│       │   │   ├── flights.ts
│       │   │   ├── notifications.ts
│       │   │   ├── rebook.ts
│       │   │   ├── sse.ts
│       │   │   └── trips.ts
│       │   └── index.ts             # Express Server Initialization
├── packages/
│   └── shared/                      # Shared Types, Schemas, & Policy Constants
├── .env.example                     # Environment Variables Template
├── package.json                     # Monorepo npm Workspaces Root Configuration
├── tsconfig.base.json               # Shared TypeScript Base Configuration
└── TravelPilot_AI_PRD.md            # Product Requirements Document
```

---

## 🔌 API Endpoints

### **Authentication**
- `POST /api/auth/login` — Authenticate user and receive JWT token.
- `GET /api/auth/me` — Retrieve current user profile and travel preferences.

### **Disruptions & Agent Pipeline**
- `POST /api/disruptions/simulate` — Trigger live disruption simulation (e.g. flight cancellation/delay).
- `GET /api/disruptions/active` — List active flight disruptions.
- `POST /api/rebook/execute` — Execute or confirm a rebooking candidate decision.
- `POST /api/rebook/undo` — Reverse a Tier-1 auto-booked decision within 5 minutes.

### **Trips & Analytics**
- `GET /api/trips` — Fetch all trips for authenticated user.
- `GET /api/trips/:id` — Get full trip details (segments, hotels, cabs, disruptions).
- `GET /api/dashboard/stats` — Fetch manager dashboard metrics (savings, risk score, auto-resolution rate).
- `GET /api/audit/logs` — Fetch audit logs for explainability and agent tracing.

### **Real-time Engine**
- `GET /api/sse/events` — Server-Sent Events endpoint streaming live agent step executions to the web UI.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: `v18.x` or `v20.x` higher
- **npm**: `v9.x` or higher
- **PostgreSQL**: Supabase PostgreSQL database (or local PostgreSQL instance)
- **Google Gemini API Key**: Free tier or paid API key from [Google AI Studio](https://aistudio.google.com/)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/GuptaNidhish/CodeStreet-Travel-Pilot.git
cd CodeStreet-Travel-Pilot
```

---

### Step 2: Install Dependencies
```bash
npm install
```

---

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env` at the project root:

```bash
cp .env.example .env
```

Open `.env` and fill in your keys (Supabase PostgreSQL URL, JWT Secret, Google AI API Key, Mapbox Token):

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
JWT_SECRET="super-secret-key-change-in-production"
GOOGLE_AI_API_KEY="AIzaSy..."
GEMINI_MODEL="gemini-2.5-flash"
NEXT_PUBLIC_MAPBOX_TOKEN="pk.eyJ1..."
```

---

### Step 4: Setup Database & Seed Demo Data
Push the Prisma schema to your PostgreSQL database and seed realistic demo trips, users, flights, and policy rules:

```bash
# Push database schema
npm run db:push

# Seed demo data
npm run db:seed
```

---

### Step 5: Start Development Servers
Run both the Next.js frontend and Express backend concurrently:

```bash
npm run dev
```

- 🌐 **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- ⚙️ **Backend Server**: [http://localhost:4000](http://localhost:4000)
- 🏥 **API Health Check**: [http://localhost:4000/api/health](http://localhost:4000/api/health)

---

## ⚙️ Environment Variables

| Variable | Required | Description |
| :--- | :---: | :--- |
| `DATABASE_URL` | Yes | Supabase PostgreSQL Connection Pool URL (Transaction pooler on port 6543) |
| `DIRECT_URL` | Yes | Supabase PostgreSQL Direct Connection URL (Session connection on port 5432) |
| `JWT_SECRET` | Yes | Secret string for signing authentication tokens |
| `GOOGLE_AI_API_KEY` | Yes | Google Gemini API Key for multi-agent reasoning and ranking |
| `GEMINI_MODEL` | No | Defaults to `gemini-2.5-flash` |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | No | Mapbox public access token for interactive flight risk maps |
| `PORT` | No | Express server port (Defaults to `4000`) |
| `FRONTEND_URL` | No | Next.js app URL for CORS (Defaults to `http://localhost:3000`) |

---

## 📧 Demo Credentials & Disruption Simulator

The repository comes pre-seeded with 2 demo accounts for testing:

| Role | Email | Password | Account Access |
| :--- | :--- | :--- | :--- |
| **Traveler** | `alex@travelpilot.demo` | `demo123` | Personal Itineraries, Live Rebooking UI, 5-Min Undo Window |
| **Corporate Manager** | `sarah@travelpilot.demo` | `demo123` | Executive Dashboard, Corporate Risk Heatmap, Audit Logs |

### 🛠️ Running a Disruption Simulation

1. Log in as **Alex (Traveler)** (`alex@travelpilot.demo` / `demo123`).
2. Click **Simulator** in the sidebar navigation or top header.
3. Select a trip (e.g., *SFO ➔ JFK Flight AA-104*) and choose a disruption scenario:
   - **Severe Weather Delay (3+ hours)**
   - **Flight Cancellation (Immediate Disruption)**
   - **Missed Connection Hazard**
4. Click **Trigger Simulation**.
5. Watch the **10-Agent Pipeline** execute live on the screen:
   - Risk calculation ➔ Gemini candidate scoring ➔ Policy check ➔ Autonomous rebooking ➔ Hotel/Cab adjustment ➔ Notification output.
6. Test the **5-Minute Undo Window** to observe itinerary rollback safety.

---

## 📊 Database Schema Overview

```
 ┌───────────────┐        ┌───────────────┐        ┌─────────────────────┐
 │     User      │ 1────* │     Trip      │ 1────* │       Segment       │
 └───────────────┘        └───────────────┘        └─────────────────────┘
                                  │                           │
                                  ├──────────*                │ 1
                                  │          │                ▼
                                  │   ┌──────────────┐   ┌──────────────────┐
                                  │   │ Disruption   │ 1─│ Rebooking        │
                                  │   │ Event        │   │ Candidate        │
                                  │   └──────────────┘   └──────────────────┘
                                  │          │ 1
                                  │          ▼
                                  │   ┌──────────────┐
                                  │   │ Rebooking    │
                                  │   │ Decision     │
                                  │   └──────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
 ┌───────────────┐        ┌───────────────┐        ┌───────────────┐
 │ HotelBooking  │        │  CabBooking   │        │   AuditLog    │
 └───────────────┘        └───────────────┘        └───────────────┘
```

The database models full end-to-end trip state: `User` preferences, `Trip` entities, `Segment` flight legs, `DisruptionEvent` instances, scored `RebookingCandidate` options, `RebookingDecision` policy tracking, synced `HotelBooking` & `CabBooking` modifications, and append-only `AuditLog` history.

---

## 🧪 Verification & Testing

### Workspace Build & Verification Commands

```bash
# Typecheck & build all packages and applications
npm run build

# Lint monorepo codebase
npm run lint

# Start Prisma Studio to inspect local database state
npm run db:studio
```

---

## 📄 License & Acknowledgments

This project is open-source software licensed under the **MIT License**.

Built with ❤️ for **CodeStreet 2026 Hackathon**.

> *"Travelling is full of surprises. Resolving disruptions shouldn't be one of them."*
