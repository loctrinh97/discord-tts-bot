# Backend Change Guidelines

- Add new API capabilities by creating or extending a backend module under `backend/src/modules/`.
- Keep DTOs, guards, pipes, and shared utilities under `backend/src/common/` when they are reused.
- If a feature needs persistence, update `database/prisma/schema.prisma` first, then regenerate Prisma client from `database/`.
- If a task needs async processing, prefer placing the execution code in `backend/worker/` and keeping API endpoints as trigger or orchestration layers.
- Avoid embedding large config or static content directly in controllers.
- When changing database contracts, consider effects on frontend BFF requests and bot integrations.
