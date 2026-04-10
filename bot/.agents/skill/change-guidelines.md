# Bot Change Guidelines

- Add new slash commands by updating the command metadata in `bot/src/commands.js` and the corresponding handling flow.
- Keep heavy logic out of `bot/src/index.js`; use feature modules instead.
- Reuse the existing store modules for bot-local persistence rather than reading JSON files directly in feature handlers.
- For Discord UI, prefer embeds, buttons, and select menus that fit the existing interaction model.
- Preserve current moderation and permission checks when editing ticket creation or guild setup flows.
- If a feature starts needing durable cross-service persistence, plan a migration into backend or database rather than expanding JSON storage indefinitely.
- After command metadata changes, remember that command deployment still happens from `bot/deploy-commands.js`.
