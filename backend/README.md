# Backend API

NestJS service responsible for:

- Discord OAuth authentication
- Guild configuration and bot setup
- Ticket and pricing workflows
- Market data ingestion APIs
- Notification orchestration

## Structure

- `src/main.ts`: NestJS bootstrap entry point
- `src/app.module.ts`: top-level module
- `src/modules/`: domain modules
- `src/common/`: shared guards, interceptors, DTOs, utils
- `test/`: integration and e2e tests
