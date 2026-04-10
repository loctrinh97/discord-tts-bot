# Database

Shared database layer for the platform.

## Structure

- `prisma/`: Prisma schema and generated client config.
- `migrations/`: SQL or Prisma migrations.
- `seeds/`: Seed data for local development.

## Ownership

- PostgreSQL schema for users, guilds, tickets, orders, and market data.
- Redis integration contracts can be documented here if needed.
