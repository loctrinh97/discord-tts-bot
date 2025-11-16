// src/commands.js
const { valorantMaps } = require("./config");
const { handleTikTokCommand, handleTikTokStopCommand } = require("./tiktok");

// Định nghĩa slash commands
const commands = [
  {
    name: "tiktok",
    description: "Monitor a TikTok live stream for comments",
    options: [
      {
        name: "url",
        type: 3, // STRING
        description: "The URL of the TikTok live stream",
        required: true,
      },
    ],
  },
  {
    name: "random",
    description: "Generate a random something",
    options: [
      {
        name: "number",
        description: "Generate a random number between min and max",
        type: 1, // SUBCOMMAND
        options: [
          {
            name: "min",
            description: "The minimum number",
            type: 4, // INTEGER
            required: true,
          },
          {
            name: "max",
            description: "The maximum number",
            type: 4, // INTEGER
            required: true,
          },
        ],
      },
      {
        name: "map",
        description: "Get a random Valorant map",
        type: 1, // SUBCOMMAND
      },
    ],
  },
  {
    name: "stop",
    description: "Stop running features",
    options: [
      {
        name: "tiktok",
        description: "Disconnect from TikTok live",
        type: 1, // SUBCOMMAND
      },
    ],
  },
];

async function handleSlashCommand(interaction) {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === "tiktok") {
    await handleTikTokCommand(interaction);
    return;
  }

  if (commandName === "random") {
    const subcommand = options.getSubcommand();

    if (subcommand === "number") {
      const min = options.getInteger("min");
      const max = options.getInteger("max");

      if (min >= max) {
        await interaction.reply(
          "The minimum value must be less than the maximum value."
        );
        return;
      }

      const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
      await interaction.reply(
        `Random number between ${min} and ${max}: **${randomNum}**`
      );
      return;
    }

    if (subcommand === "map") {
      const randomMap =
        valorantMaps[Math.floor(Math.random() * valorantMaps.length)];
      await interaction.reply(`Random Valorant map: **${randomMap}**`);
      return;
    }
  }

  if (commandName === "stop") {
    const subcommand = options.getSubcommand();

    if (subcommand === "tiktok") {
      await handleTikTokStopCommand(interaction);
      return;
    }
  }
}

module.exports = {
  commands,
  handleSlashCommand,
};
