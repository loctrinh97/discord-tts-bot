// bot.js
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { generateDependencyReport } = require("@discordjs/voice");

const { TOKEN, CLIENT_ID } = require("./src/config");
const { commands, handleSlashCommand } = require("./src/commands");
const { handleMessageTts } = require("./src/tts");

// Log thông tin lib voice
console.log(generateDependencyReport());

// Tạo Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// REST client dùng để đăng ký slash commands
const rest = new REST({ version: "10" }).setToken(TOKEN);

// Event: bot online
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Event: slash commands
client.on("interactionCreate", handleSlashCommand);

// Event: message prefix "." -> TTS demo
client.on("messageCreate", handleMessageTts);

// Đăng ký slash commands + login
(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error("Error registering slash commands:", error);
  }
})();

client.login(TOKEN);
