const { ApplicationCommandOptionType } = require("discord.js");
const { valorantMaps } = require("./config");
const { handleTikTokCommand, handleTikTokStopCommand } = require("./tiktok");
const { handleSayCommand } = require("./voice");

const commands = [
  {
    name: "say",
    description: "Noi noi dung vao voice channel hien tai",
    options: [
      {
        name: "text",
        description: "Noi dung can doc",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
  {
    name: "tiktok",
    description: "Monitor a TikTok live stream for comments",
    options: [
      {
        name: "url",
        description: "The URL of the TikTok live stream",
        type: ApplicationCommandOptionType.String,
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
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "min",
            description: "The minimum number",
            type: ApplicationCommandOptionType.Integer,
            required: true,
          },
          {
            name: "max",
            description: "The maximum number",
            type: ApplicationCommandOptionType.Integer,
            required: true,
          },
        ],
      },
      {
        name: "map",
        description: "Get a random Valorant map",
        type: ApplicationCommandOptionType.Subcommand,
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
        type: ApplicationCommandOptionType.Subcommand,
      },
    ],
  },
  {
    name: "disconnect",
    description: "Disconnect running features",
    options: [
      {
        name: "tiktok",
        description: "Disconnect from TikTok live",
        type: ApplicationCommandOptionType.Subcommand,
      },
    ],
  },
];

async function handleSlashCommand(interaction) {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  const { commandName, options } = interaction;

  if (commandName === "say") {
    await handleSayCommand(interaction);
    return;
  }

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
    }

    return;
  }

  if (commandName === "stop" && options.getSubcommand() === "tiktok") {
    await handleTikTokStopCommand(interaction);
    return;
  }

  if (commandName === "disconnect" && options.getSubcommand() === "tiktok") {
    await handleTikTokStopCommand(interaction);
  }
}

module.exports = {
  commands,
  handleSlashCommand,
};
