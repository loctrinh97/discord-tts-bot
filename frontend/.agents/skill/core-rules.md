# Frontend Core Rules

- **Framework:** Frontend uses Next.js with the App Router and TypeScript.
- **Ownership:** Frontend owns public pages, authenticated pages, UI composition, and frontend-facing BFF routes.
- **Folder Scope:** Route files belong in `frontend/app/`. Shared UI belongs in `frontend/components/`. Utilities belong in `frontend/lib/`.
- **Service Boundaries:** Do not import backend source files directly. Communicate through HTTP or API contracts, or explicit shared package contracts.
- **Visual Consistency:** Preserve the established frontend direction already present in the scaffold unless asked to redesign it.
- **BFF Role:** Frontend BFF logic should stay frontend-oriented and request-shaping focused, not become a second backend domain layer.
- **Build Discipline:** Frontend changes should continue to pass `cd frontend && npm run build`.
