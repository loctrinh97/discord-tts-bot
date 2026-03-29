const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");

const { TOKEN, CLIENT_ID, GUILD_ID } = require("./src/config");
const { commands } = require("./src/commands");

if (!TOKEN) {
  throw new Error("Missing DISCORD_TOKEN or CLIENT_TOKEN in environment.");
}

if (!CLIENT_ID) {
  throw new Error("Missing CLIENT_ID or APPLICATION_ID in environment.");
}

const rest = new REST({ version: "10" }).setToken(TOKEN);

async function deployCommands() {
  const route = GUILD_ID
    ? Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID)
    : Routes.applicationCommands(CLIENT_ID);

  console.log(
    GUILD_ID
      ? `Deploying slash commands to guild ${GUILD_ID}...`
      : "Deploying global slash commands..."
  );

  await rest.put(route, { body: commands });

  console.log("Slash commands deployed successfully.");
}

deployCommands().catch((error) => {
  console.error("Failed to deploy slash commands:", error);
  process.exitCode = 1;
});
