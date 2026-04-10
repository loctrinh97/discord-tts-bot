# Production-Ready Architecture

## Target System

The intended production shape of this project is:

- `frontend/`: Next.js frontend for admin, user, and public pages
- `frontend/` BFF layer: Next.js API routes for frontend-oriented request composition
- `backend/`: NestJS backend API for domain logic and integration orchestration
- `database/`: PostgreSQL schema and shared database package
- `backend/worker/`: async workers for crawling, analysis, and notification delivery
- `bot/`: Discord runtime for commands, events, and outbound messaging

## High-Level Flow

1. Users interact with the Next.js frontend.
2. Frontend pages call the Next.js BFF layer when frontend-specific composition is needed.
3. The BFF calls the NestJS backend API.
4. The backend API owns domain logic such as auth, guild setup, tickets, pricing, market data, and notifications.
5. PostgreSQL stores durable application state.
6. Redis handles cache, queue, and pub/sub responsibilities.
7. Workers consume async jobs for crawling, analysis, and notification pipelines.
8. The Discord bot consumes backend-facing contracts for commands, events, and messaging workflows.

## Service Responsibilities

### Frontend

- Owns page rendering and user-facing experience.
- Includes:
  - Admin dashboard for bot and guild setup
  - Authenticated user pages
  - Public pages such as About or profile pages
- Should not own core business rules.

### Next.js BFF

- Exists to shape backend data for frontend needs.
- Handles request aggregation, session-aware composition, and frontend-specific response contracts.
- Must not become a second domain backend.

### Backend API

- Source of truth for application rules.
- Owns:
  - Discord OAuth
  - Guild configuration and bot setup
  - Ticket and pricing workflows
  - Market data orchestration
  - Notification orchestration
- Coordinates PostgreSQL, Redis, workers, and bot-facing contracts.

### PostgreSQL

- Stores durable state.
- Expected core entities include:
  - Users
  - Guilds
  - Tickets
  - Orders
  - Market data

### Redis

- Used for short-lived infrastructure concerns:
  - Cache
  - Queue
  - Pub/Sub
- Do not treat Redis as the primary source of truth for core domain data.

### Worker

- Runs asynchronous or long-running jobs.
- Expected responsibilities:
  - Crawl market data
  - Analyze pricing signals
  - Send notifications
- Should consume queue or pub/sub messages rather than duplicating API request logic.

### Discord Bot

- Owns Discord command handling, event handling, and outbound messaging.
- Should stay thin on domain logic and defer durable business rules to backend APIs over time.

## Production Boundaries

- Frontend talks to backend through BFF and API contracts, not direct database access.
- Bot should not own long-term business state in production; local JSON is transitional only.
- Worker should not become a second backend API surface.
- Database schema changes should be introduced through `database/` and consumed through stable contracts.
- Backend remains the main orchestration point across user flows, jobs, notifications, and integrations.

## Design Guidance For Agents

- When implementing a new feature, decide first which layer truly owns it.
- Prefer this ownership model:
  - UI and page flow -> frontend
  - frontend-specific composition -> BFF
  - business rules and integrations -> backend
  - durable persistence -> database
  - async execution -> worker
  - Discord delivery and interaction runtime -> bot
- Avoid leaking domain logic upward into the BFF or downward into the bot.
- Avoid reintroducing root-level monolith patterns.

## Current Gap Notes

- The current repository is only partially at this production target.
- Bot-local JSON persistence still exists in `bot/data/`.
- Redis is not yet represented as a fully implemented package in the repository layout.
- The architecture above should be treated as the target direction for future changes.
