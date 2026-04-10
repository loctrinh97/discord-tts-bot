# Database Architecture

## Main Files

- Schema: `database/prisma/schema.prisma`
- Shared Prisma export: `database/index.js`
- Shared type declaration: `database/index.d.ts`

## Package Role

- `database/` is both a Prisma workspace and a consumable local package for backend code.
- Backend imports the database package through the package name, not through relative access to Prisma internals.

## Current Model Scope

The current schema includes:

- `User`
- `Guild`
- `Ticket`
- `Order`
- `MarketData`
- `Notification`

If new persistence needs appear, extend the schema here first and propagate the contract outward.
