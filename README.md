# Discord Platform

This repository is organized by separate services:

- `frontend/`: Next.js frontend with public, admin, user, and BFF routes
- `backend/`: NestJS backend API
- `database/`: Prisma schema, migrations, and seeds
- `bot/`: Discord bot runtime

Supporting files now live inside the relevant service folders:

- `bot/data/`: bot JSON state and panel storage
- `backend/worker/`: background jobs and queue consumers

Each service is managed independently with its own `package.json`.

## Service Setup

```powershell
cd bot
copy env.example .env
npm install
```

```powershell
cd backend
npm install
```

```powershell
cd frontend
npm install
```

```powershell
cd database
npm install
```

```powershell
cd backend\worker
npm install
```

## Run Services

```powershell
cd bot; npm run start
cd backend; npm run dev
cd frontend; npm run dev
cd backend\worker; npm run start
```

## Docker

- Build the bot from `bot/`:

```powershell
cd bot
docker build -t discord-tts-bot .
```

## Current scaffold coverage

- Bot runtime lives under `bot/` and no longer depends on root `src/`
- Backend exposes initial NestJS modules and `/api/health`
- Frontend exposes initial App Router pages and `/api/health`
- Database includes a starter Prisma schema for users, guilds, tickets, orders, market data, and notifications
