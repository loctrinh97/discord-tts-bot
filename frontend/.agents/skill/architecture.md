# Frontend Architecture

## App Structure

- Root app entry: `frontend/app/layout.tsx`
- Landing page: `frontend/app/page.tsx`
- Admin route: `frontend/app/admin/`
- User app route: `frontend/app/app/`
- Public route example: `frontend/app/about/`
- Health and BFF route example: `frontend/app/api/health/route.ts`

## Supporting Folders

- `frontend/components/`: reusable interface components
- `frontend/lib/`: typed fetch helpers and shared frontend utilities
- `frontend/bff/`: frontend-specific request composition helpers
- `frontend/public/`: static assets

## Runtime Contract

- Frontend can call backend through configured URLs such as `NEXT_PUBLIC_BACKEND_URL`.
- Keep route concerns separated: public pages, authenticated pages, and API or BFF handlers should not blur together unnecessarily.
