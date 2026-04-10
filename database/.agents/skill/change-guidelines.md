# Database Change Guidelines

- Add or modify models in `database/prisma/schema.prisma`.
- Keep naming consistent and relations explicit.
- Prefer stable exported interfaces from the database package when backend code needs shared helpers.
- Run Prisma validation and generation from `database/` after schema edits.
- If a change would replace bot-local JSON state with database tables, document the migration path clearly before deleting existing bot data behavior.
