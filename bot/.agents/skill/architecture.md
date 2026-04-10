# Bot Architecture

## Main Files

- Entry point: `bot/src/index.js`
- Slash command definitions and dispatcher: `bot/src/commands.js`
- Shared env and config constants: `bot/src/config.js`
- Slash command deploy script: `bot/deploy-commands.js`

## Feature Files

- `bot/src/voice.js`: voice queueing, TTS playback, and voice connection lifecycle
- `bot/src/genshin.js`: interactive Genshin pricing panels and panel sync behavior
- `bot/src/tickets.js`: ticket panel interactions, channel creation, and close flow
- `bot/src/tiktok.js`: TikTok live integration and chat-to-TTS behavior
- `bot/src/genshinPanelStore.js`: JSON persistence for Genshin panels
- `bot/src/ticketStore.js`: JSON persistence for ticket panels and open tickets

## Local Data

- `bot/data/genshin-panels.json`
- `bot/data/ticket-panels.json`
- `bot/data/open-tickets.json`

These files are part of the current bot runtime contract and should be migrated carefully if persistence changes later.
