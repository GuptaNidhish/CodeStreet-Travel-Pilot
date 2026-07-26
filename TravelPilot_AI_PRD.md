
# Product Requirements Document (PRD)
# TravelPilot AI – Autonomous Travel Disruption Concierge

## Vision
Build an autonomous multi-agent AI platform that detects travel disruptions in real time and resolves them without requiring user intervention. Unlike a chatbot, the platform proactively monitors flights, predicts disruptions, rebooks travel, updates hotels/cabs, manages budgets, and keeps travelers informed.

## Goal
Win the hackathon by showcasing an AI-first autonomous workflow.

## Core Differentiator
> Detect → Decide → Act → Explain

## Users
- Business travelers
- Premium card holders
- Corporate travel managers
- Families

## Tech Stack
Frontend:
- Next.js + React + Tailwind
- shadcn/ui
- Framer Motion
- Mapbox

Backend:
- Node.js
- Express
- PostgreSQL
- Redis

AI:
- LangGraph
- OpenAI API
- MCP-ready tool architecture

External APIs:
- AviationStack / Amadeus
- OpenWeather
- Google Maps
- Twilio / WhatsApp
- Firebase Push
- Hotel booking mock API

## Multi-Agent Architecture
1. Monitoring Agent
2. Prediction Agent
3. Flight Rebooking Agent
4. Hotel Agent
5. Ground Transport Agent
6. Budget Agent
7. Policy Agent
8. Notification Agent
9. Explainability Agent
10. Manager Dashboard Agent

## User Journey
1. User books itinerary.
2. Monitoring agent watches flight status.
3. Cancellation/delay predicted or detected.
4. AI evaluates alternatives.
5. Policy/budget checked.
6. Flight booked automatically.
7. Hotel/cab updated.
8. Notifications sent.
9. Timeline updated.
10. Manager dashboard updated.

## Features

### 1. Autonomous Monitoring
- Poll live flight APIs.
- Detect cancellations, delays, missed connections.

### 2. Predictive Disruption
- Weather
- Airport congestion
- Historical delays
- Risk score (0–100)

### 3. AI Flight Ranking
Score based on:
- Arrival time
- Price
- Stops
- Airline reliability
- Carbon
- User preference

### 4. Autonomous Rebooking
Automatic booking when confidence >90%.
Otherwise request approval.

### 5. Hotel & Cab Synchronization
- Extend hotel
- Shift check-in/out
- Rebook airport cab

### 6. Budget Optimizer
Respect travel policy and optimize overall spend.

### 7. Explainable AI
Each decision includes:
- Why selected
- Alternatives rejected
- Confidence

### 8. Live Timeline
Chronological travel events with AI actions.

### 9. Voice Concierge
Natural-language voice commands.

### 10. Personalized Memory
Preferences:
- Window/aisle
- Vegetarian
- Preferred airlines
- Budget

### 11. Manager Dashboard
Metrics:
- Active trips
- Delayed
- Cancelled
- Auto-resolved
- Savings
- Risk heatmap

### 12. Insurance & Refund Automation
Generate:
- Refund requests
- Compensation
- Expense reports

### 13. Family Mode
Keep group together while rebooking.

### 14. Carbon Optimizer
Display CO₂ for each option.

### 15. Confidence Engine
>90 Auto-book
70–90 Ask user
<70 Human review

## Screens

### Traveler
- Login
- Dashboard
- Live itinerary
- Timeline
- AI recommendation
- Notifications
- Voice assistant
- Settings

### Manager
- KPIs
- Map
- Trips table
- Risk analytics
- Cost savings
- AI activity log

## Database
Users
Trips
Flights
Hotels
Cabs
Policies
Notifications
Events
AgentLogs

## APIs
POST /trip
GET /trip/:id
GET /flight/status
POST /rebook
POST /hotel/update
POST /notify
GET /dashboard

## Non-functional
- <3s dashboard load
- Retry on API failure
- Agent logs
- Mobile responsive

## Demo Script
1. Create trip.
2. Simulate cancellation.
3. Prediction triggers.
4. Agents collaborate.
5. Flight rebooked.
6. Hotel updated.
7. Timeline updates.
8. Manager dashboard updates.
9. AI explains decision.

## Stretch Goals
- Indoor airport navigation
- Digital twin simulation
- WhatsApp bot
- Calendar sync
- Slack/Teams alerts

## Folder Structure
src/
  app/
  components/
  agents/
  services/
  api/
  lib/
  db/
  hooks/
  types/

## Success Metrics
- Detection latency
- Auto-resolution rate
- Rebooking time
- Cost savings
- User satisfaction
- Prediction accuracy

## Build Priority
MVP:
- Monitoring
- Prediction
- Rebooking
- Timeline
- Notifications

V2:
- Hotels
- Budget
- Dashboard
- Explainability

V3:
- Voice
- Carbon
- Refunds
- Family mode

## Prompt for Coding Agent
Build a production-quality full-stack application following this PRD. Use clean architecture, TypeScript, reusable components, responsive UI, LangGraph-based multi-agent orchestration, PostgreSQL with Prisma, JWT auth, REST APIs, optimistic UI, loading/error states, mock integrations where real APIs are unavailable, and write modular code ready for deployment.
