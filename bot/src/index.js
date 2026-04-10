const { Client, GatewayIntentBits } = require("discord.js");
const { generateDependencyReport } = require("@discordjs/voice");

const { TOKEN } = require("./config");
const {
  restoreDeletedGenshinPanel,
  syncStoredGenshinPanels,
} = require("./genshin");
const {
  listPanels,
  savePanel,
  deletePanel,
} = require("./genshinPanelStore");
const { handleSlashCommand } = require("./commands");
const {
  restoreDeletedTicketPanel,
  syncStoredTicketPanels,
} = require("./tickets");
const {
  deleteOpenTicketByChannelId,
  getTicketPanel,
  saveTicketPanel,
} = require("./ticketStore");
const { handleVoiceStateUpdate } = require("./voice");

console.log(generateDependencyReport());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once("clientReady", async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  try {
    const syncedPanels = await syncStoredGenshinPanels(client, listPanels());
    syncedPanels.forEach((panel) => savePanel(panel));
  } catch (error) {
    console.error("Failed to sync Genshin panels:", error);
  }

  try {
    const syncedTicketPanels = await syncStoredTicketPanels(client);
    syncedTicketPanels.forEach((panel) => saveTicketPanel(panel));
  } catch (error) {
    console.error("Failed to sync ticket panels:", error);
  }
});

client.on("interactionCreate", (interaction) => {
  void handleSlashCommand(interaction);
});

client.on("voiceStateUpdate", (oldState, newState) => {
  handleVoiceStateUpdate(oldState, newState);
});

client.on("messageDelete", async (message) => {
  if (!message.guildId || !message.id) {
    return;
  }

  const panelConfig = listPanels().find(
    (panel) => panel.guildId === message.guildId && panel.messageId === message.id
  );

  if (!panelConfig) {
    return;
  }

  try {
    const restoredPanel = await restoreDeletedGenshinPanel(client, panelConfig);
    savePanel(restoredPanel);
  } catch (error) {
    console.error("Failed to restore deleted Genshin panel:", error);
    deletePanel(panelConfig.guildId);
  }

  const ticketPanelConfig = getTicketPanel(message.guildId);

  if (!ticketPanelConfig || ticketPanelConfig.messageId !== message.id) {
    return;
  }

  try {
    const restoredPanel = await restoreDeletedTicketPanel(
      client,
      ticketPanelConfig
    );
    saveTicketPanel(restoredPanel);
  } catch (error) {
    console.error("Failed to restore deleted ticket panel:", error);
  }
});

client.on("channelDelete", (channel) => {
  deleteOpenTicketByChannelId(channel.id);
});

client.login(TOKEN);
