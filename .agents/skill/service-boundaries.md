# Service Boundaries

## Repository Intent

This repository is no longer a single root-managed workspace. It is a multi-service codebase where each top-level service is managed independently.

## Service Rules

- `bot/` owns Discord runtime behavior, command handling, local bot JSON state, and bot-specific env files.
- `backend/` owns API behavior, application orchestration, and backend-side worker jobs under `backend/worker/`.
- `database/` owns Prisma schema, database package exports, and client generation.
- `frontend/` owns public pages, authenticated pages, and BFF routes.

## Dependency Direction

- `backend/` may depend on `database/`.
- `bot/` should not depend on backend internals directly through file imports.
- `frontend/` should not import backend source files directly.
- Cross-service contracts should happen through APIs, package exports, or explicit shared schemas.

## Migration Notes

- Legacy root bot files were removed.
- Legacy root `src/`, root `data/`, root `worker/`, root `package.json`, root `package-lock.json`, root `Dockerfile`, and root setup files were removed during the service split.
- Do not recreate those legacy root structures unless the project is intentionally being consolidated again.
