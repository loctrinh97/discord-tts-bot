# Frontend Change Guidelines

- Add new pages in `frontend/app/` using App Router conventions.
- Keep reusable logic out of page files when it will be shared by multiple routes.
- Put fetch helpers and backend-client wrappers in `frontend/lib/`.
- If a route is frontend-only composition logic, keep it in frontend BFF or API space instead of moving it into backend by default.
- When UI changes are significant, ensure desktop and mobile behavior remain sound.
- Do not add service-management assumptions back into the root of the repository; frontend is independently managed from `frontend/`.
