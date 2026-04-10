# Backend Core Rules

- **Framework:** Backend uses NestJS with TypeScript.
- **Execution Boundary:** Backend owns API logic, orchestration, and backend-side background work.
- **Folder Scope:** Main application code belongs in `backend/src/`. Background jobs belong in `backend/worker/`.
- **Database Access:** Use the exported database package from `database/`. Do not import Prisma internals from generated paths.
- **Service Boundaries:** Do not move Discord runtime logic into backend modules. Discord command and event behavior belongs in `bot/`.
- **HTTP Surface:** Keep controllers thin. Put business logic into services or dedicated provider modules.
- **Type Safety:** Prefer explicit return types when TypeScript inference becomes non-portable across package boundaries.
- **Build Discipline:** Changes should continue to pass `cd backend && npm run build`.
