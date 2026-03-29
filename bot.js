const { Client, GatewayIntentBits } = require("discord.js");
const { generateDependencyReport } = require("@discordjs/voice");

const { TOKEN } = require("./src/config");
const { handleSlashCommand } = require("./src/commands");
const { handleVoiceStateUpdate } = require("./src/voice");

console.log(generateDependencyReport());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", (interaction) => {
  void handleSlashCommand(interaction);
});

client.on("voiceStateUpdate", (oldState, newState) => {
  handleVoiceStateUpdate(oldState, newState);
});

client.login(TOKEN);
