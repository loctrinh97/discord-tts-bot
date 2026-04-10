const {
  ApplicationCommandOptionType,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");
const { valorantMaps } = require("./config");
const {
  handleGenshinCommand,
  handleGenshinComponent,
  syncGenshinPanel,
} = require("./genshin");
const { getPanel, savePanel } = require("./genshinPanelStore");
const { handleTikTokCommand, handleTikTokStopCommand } = require("./tiktok");
const {
  handleTicketComponent,
  isTicketComponent,
  syncTicketPanel,
} = require("./tickets");
const { getTicketPanel, saveTicketPanel } = require("./ticketStore");
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
    name: "genshin",
    description: "Mo menu bao gia cay thue Genshin",
  },
  {
    name: "genshin-setup",
    description: "Cau hinh channel bang gia Genshin cho guild nay",
    default_member_permissions: PermissionFlagsBits.ManageGuild.toString(),
    options: [
      {
        name: "channel",
        description: "Channel hien thi panel bang gia Genshin",
        type: ApplicationCommandOptionType.Channel,
        channel_types: [ChannelType.GuildText],
        required: true,
      },
    ],
  },
  {
    name: "ticket-setup",
    description: "Cau hinh panel tao ticket cho guild nay",
    default_member_permissions: PermissionFlagsBits.ManageGuild.toString(),
    options: [
      {
        name: "channel",
        description: "Channel hien thi panel ticket",
        type: ApplicationCommandOptionType.Channel,
        channel_types: [ChannelType.GuildText],
        required: true,
      },
      {
        name: "category",
        description: "Category chua cac ticket moi tao",
        type: ApplicationCommandOptionType.Channel,
        channel_types: [ChannelType.GuildCategory],
        required: true,
      },
      {
        name: "support_role",
        description: "Role staff duoc xem va tra loi ticket",
        type: ApplicationCommandOptionType.Role,
        required: false,
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
  if (isTicketComponent(interaction)) {
    await handleTicketComponent(interaction);
    return;
  }

  if (interaction.isStringSelectMenu() || interaction.isButton()) {
    await handleGenshinComponent(interaction);
    return;
  }

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

  if (commandName === "genshin") {
    await handleGenshinCommand(interaction);
    return;
  }

  if (commandName === "genshin-setup") {
    if (!interaction.inGuild()) {
      await interaction.reply({
        content: "Lenh nay chi dung duoc trong guild.",
        ephemeral: true,
      });
      return;
    }

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
      await interaction.reply({
        content: "Ban can quyen Manage Server de cau hinh panel Genshin.",
        ephemeral: true,
      });
      return;
    }

    const channel = options.getChannel("channel", true);
    const existingPanel = getPanel(interaction.guildId);

    if (channel.type !== ChannelType.GuildText) {
      await interaction.reply({
        content: "Hay chon mot text channel trong guild.",
        ephemeral: true,
      });
      return;
    }

    if (
      existingPanel?.messageId &&
      (existingPanel.channelId !== channel.id)
    ) {
      try {
        const oldChannel = await interaction.client.channels.fetch(
          existingPanel.channelId
        );

        if (oldChannel?.isTextBased()) {
          const oldMessage = await oldChannel.messages.fetch(
            existingPanel.messageId
          );
          await oldMessage.delete();
        }
      } catch {
        // Ignore cleanup failures and continue setting up the new panel.
      }
    }

    const savedPanel = await syncGenshinPanel(interaction.client, {
      guildId: interaction.guildId,
      channelId: channel.id,
      messageId:
        existingPanel?.channelId === channel.id ? existingPanel.messageId : null,
    });

    savePanel(savedPanel);

    await interaction.reply({
      content: `Da cau hinh panel Genshin tai <#${channel.id}>.`,
      ephemeral: true,
    });
    return;
  }

  if (commandName === "ticket-setup") {
    if (!interaction.inGuild()) {
      await interaction.reply({
        content: "Lenh nay chi dung duoc trong guild.",
        ephemeral: true,
      });
      return;
    }

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
      await interaction.reply({
        content: "Ban can quyen Manage Server de cau hinh panel ticket.",
        ephemeral: true,
      });
      return;
    }

    const channel = options.getChannel("channel", true);
    const category = options.getChannel("category", true);
    const supportRole = options.getRole("support_role");
    const existingPanel = getTicketPanel(interaction.guildId);

    if (channel.type !== ChannelType.GuildText) {
      await interaction.reply({
        content: "Hay chon mot text channel de hien thi panel ticket.",
        ephemeral: true,
      });
      return;
    }

    if (category.type !== ChannelType.GuildCategory) {
      await interaction.reply({
        content: "Hay chon mot category hop le de chua ticket.",
        ephemeral: true,
      });
      return;
    }

    if (
      existingPanel?.messageId &&
      existingPanel.channelId !== channel.id
    ) {
      try {
        const oldChannel = await interaction.client.channels.fetch(
          existingPanel.channelId
        );

        if (oldChannel?.isTextBased()) {
          const oldMessage = await oldChannel.messages.fetch(
            existingPanel.messageId
          );
          await oldMessage.delete();
        }
      } catch {
        // Ignore cleanup failures and continue setting up the new panel.
      }
    }

    const savedPanel = await syncTicketPanel(interaction.client, {
      guildId: interaction.guildId,
      channelId: channel.id,
      categoryId: category.id,
      supportRoleId: supportRole?.id || null,
      messageId:
        existingPanel?.channelId === channel.id ? existingPanel.messageId : null,
    });

    saveTicketPanel(savedPanel);

    await interaction.reply({
      content: `Da cau hinh panel ticket tai <#${channel.id}> va tao ticket trong ${category}.`,
      ephemeral: true,
    });
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
