# Cross-Service Features

## Bot

- The Discord bot lives in `bot/`.
- Bot source lives in `bot/src/`.
- Local bot state is stored in `bot/data/` as JSON files.
- Slash command deployment is handled by `bot/deploy-commands.js`.

## Backend

- The NestJS API lives in `backend/`.
- Shared database access is wired through the local `database/` package using `file:../database`.
- Background jobs now live under `backend/worker/` instead of a root `worker/` folder.

## Database

- Prisma schema and generation live in `database/`.
- `database/` exports a shared Prisma client entry used by backend code.

## Frontend

- The Next.js frontend lives in `frontend/`.
- Public, admin, user, and BFF concerns are separated inside the frontend app structure.

## Current Local Persistence

- Ticket panels, open tickets, and Genshin panel state are still JSON-backed in `bot/data/`.
- This is transitional project state, not the final long-term persistence model.
