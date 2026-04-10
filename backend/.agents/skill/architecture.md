# Backend Architecture

## Main App

- Entry point: `backend/src/main.ts`
- Root module: `backend/src/app.module.ts`
- Global database wiring: `backend/src/database/`

## Modules

- `backend/src/modules/auth/`: authentication and Discord OAuth-facing API concerns
- `backend/src/modules/guild-config/`: guild setup and configuration APIs
- `backend/src/modules/ticket-pricing/`: ticket and pricing application logic
- `backend/src/modules/market-data/`: market-data-facing endpoints and services
- `backend/src/modules/notification/`: notification orchestration

## Worker

- `backend/worker/` is the backend-owned job runner area.
- Keep queue consumers, crawlers, schedulers, and async jobs there.
- Treat worker code as backend infrastructure, not as a separate top-level product.

## Database Dependency

- Backend depends on `@discord-tts-bot/database` via `file:../database`.
- Keep imports stable through the database package entrypoint.
- If backend needs a new database utility, export it from `database/` instead of reaching into private files.
