# Database Core Rules

- **Ownership:** The `database/` service owns Prisma schema, client generation, and exported database package contracts.
- **Primary Artifact:** `database/prisma/schema.prisma` is the source of truth for database structure.
- **Exports:** Shared database access should go through `database/index.js` and `database/index.d.ts`.
- **No App Logic:** Do not place backend business logic or frontend formatting logic in the database package.
- **Migration Discipline:** Schema changes should be intentional, reviewable, and compatible with dependent services.
- **Generation Flow:** Regenerate the Prisma client from inside `database/` after schema changes.
- **Cross-Service Safety:** If type changes affect backend consumers, update backend code explicitly rather than relying on incidental inference.
