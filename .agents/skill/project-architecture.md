# Project Architecture

## Reference

- For the intended production target, use `production-ready-architecture.md` as the target architecture reference.
- This file describes the current repository structure and ownership boundaries in the codebase as it exists now.

## Root

- Root is a container for services, not an app runtime.
- Expected project folders at root:
  - `backend/`
  - `bot/`
  - `database/`
  - `frontend/`
- Non-product folders such as `.git/`, `.vscode/`, or `.agents/` may exist, but product logic should stay inside the service folders.

## Bot

- Main runtime entry: `bot/src/index.js`
- Slash command definitions: `bot/src/commands.js`
- Shared bot config: `bot/src/config.js`
- Slash command deploy script: `bot/deploy-commands.js`
- Persistent local JSON data: `bot/data/`
- Docker context: `bot/Dockerfile` and `bot/.dockerignore`

## Backend

- NestJS app root: `backend/src/`
- Global database wiring: `backend/src/database/`
- Background worker: `backend/worker/`

## Database

- Prisma schema: `database/prisma/schema.prisma`
- Shared Prisma client entry: `database/index.js`

## Frontend

- Next.js app root: `frontend/app/`
- Frontend utilities: `frontend/lib/`
- BFF-specific helpers: `frontend/bff/`

## Current vs Target

- Current structure is organized by independently managed services at the repository root.
- Target production direction is documented separately in `production-ready-architecture.md`.
- When a task involves long-term system design, prefer aligning decisions with the target architecture reference unless the current implementation explicitly constrains the change.
