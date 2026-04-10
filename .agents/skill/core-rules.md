# Core Rules

- **Service Ownership:** This repository is split by service. Root-level agent notes are for the whole project; service-specific implementation notes belong in each service's own `.agents/skill/` folder.
- **Root Layout:** The root should stay minimal. The expected product folders at root are `backend/`, `bot/`, `database/`, and `frontend/`.
- **No Root Runtime Code:** Do not reintroduce root-level runtime entrypoints such as `bot.js`, root `package.json`, root `Dockerfile`, or root setup scripts unless explicitly requested.
- **Independent Services:** Each service manages its own `package.json`, `package-lock.json`, local `node_modules`, env files, and Docker/build workflow.
- **Environment Handling:** Keep secrets out of version control. Bot env files live in `bot/.env` and `bot/env.example`. Add service-local env files for other services instead of putting shared runtime env files at root.
- **Code Style:** Preserve the style already used inside each service. The bot currently uses CommonJS. Backend and frontend use TypeScript.
- **Changes Scope:** When editing a service, prefer staying inside that service unless the change is intentionally cross-service.
