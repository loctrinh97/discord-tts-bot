# Bot Core Rules

- **Runtime:** The bot uses Node.js, CommonJS, `discord.js` v14, and `@discordjs/voice`.
- **Ownership:** Bot owns Discord commands, interaction handlers, voice behavior, and Discord-facing workflows.
- **Folder Scope:** Bot source lives in `bot/src/`. Persistent local state lives in `bot/data/`.
- **Command Style:** Use slash commands only. Do not add legacy prefix commands unless explicitly requested.
- **Config:** Bot environment variables live in `bot/.env` and `bot/env.example`.
- **Persistence:** Current local state is JSON-backed. Update the relevant store files instead of inventing ad hoc local files.
- **Service Boundaries:** Do not put API server responsibilities into `bot/`. Backend and API behavior belongs in `backend/`.
- **Build Discipline:** Bot changes should continue to pass syntax checks such as `cd bot && node --check src/index.js`.
