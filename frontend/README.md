# Frontend

Next.js application split into:

- Admin dashboard for setup and operations
- User-facing application pages
- Public pages such as About
- BFF API routes for frontend-specific composition

## Structure

- `app/`: App Router pages and layouts
- `components/`: reusable UI
- `lib/`: client utilities and API wrappers
- `bff/`: backend-for-frontend handlers and adapters
- `public/`: static assets
