const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const {
  deleteOpenTicket,
  deleteOpenTicketByChannelId,
  getOpenTicket,
  getTicketPanel,
  listTicketPanels,
  saveOpenTicket,
} = require("./ticketStore");

const PANEL_CREATE_PREFIX = "ticket:create:";
const CLOSE_CUSTOM_ID = "ticket:close";
const CLOSE_CONFIRM_CUSTOM_ID = "ticket:close-confirm";
const CLOSE_CANCEL_CUSTOM_ID = "ticket:close-cancel";
const PANEL_BANNER =
  "https://images6.alphacoders.com/118/thumb-1920-1189218.jpg";

const ticketTypes = {
  "cay-thue": {
    key: "cay-thue",
    label: "Cay Thue",
    emoji: "???",
    style: ButtonStyle.Primary,
    descriptionLines: [
      "DICH VU CAY THUE GENSHIN - UY TIN VA NHANH CHONG",
      "- Full Map",
      "- Daily",
      "- Cay Roll",
      "- Event",
      "",
      "- Khong dung cheat, dam bao an toan acc",
      "- Cay dung yeu cau, co bao cao tien do",
      "- Co livestream",
    ],
    channelPrefix: "cay-thue",
  },
  "bao-hanh": {
    key: "bao-hanh",
    label: "Bao Hanh",
    emoji: "???",
    style: ButtonStyle.Success,
    descriptionLines: [
      "HO TRO BAO HANH - KIEM TRA LAI DICH VU DA NHAN",
      "- Kiem tra tien do don",
      "- Ho tro van de phat sinh",
      "- Xu ly thieu sot sau khi ban giao",
      "",
      "- Uu tien khach da dung dich vu",
      "- Phan hoi theo noi dung ticket",
      "- Co the yeu cau anh/video minh chung",
    ],
    channelPrefix: "bao-hanh",
  },
};

function getTicketType(type) {
  return ticketTypes[type] || null;
}

function isTicketComponent(interaction) {
  return (
    interaction.isButton() &&
    (interaction.customId.startsWith(PANEL_CREATE_PREFIX) ||
      interaction.customId === CLOSE_CUSTOM_ID ||
      interaction.customId === CLOSE_CONFIRM_CUSTOM_ID ||
      interaction.customId === CLOSE_CANCEL_CUSTOM_ID)
  );
}

function buildPanelEmbed() {
  return new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("CAY THUE - TAO TICKET")
    .setDescription(
      [
        "Mo ticket dung nhu cau de shop tiep nhan nhanh hon.",
        "",
        "Tao ticket ngay bang mot trong hai nut ben duoi.",
      ].join("\n")
    )
    .setImage(PANEL_BANNER)
    .setFooter({ text: "Powered by discord-tts-bot" });
}

function buildPanelButtons() {
  return new ActionRowBuilder().addComponents(
    Object.values(ticketTypes).map((ticketType) =>
      new ButtonBuilder()
        .setCustomId(`${PANEL_CREATE_PREFIX}${ticketType.key}`)
        .setLabel(ticketType.label)
        .setEmoji(ticketType.emoji)
        .setStyle(ticketType.style)
    )
  );
}

function getTicketPanelPayload() {
  return {
    embeds: [buildPanelEmbed()],
    components: [buildPanelButtons()],
  };
}

function buildTicketChannelName(type, username) {
  const sanitizedUsername = username
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

  return `${type.channelPrefix}-${sanitizedUsername || "member"}`.slice(0, 90);
}

function buildTicketEmbed(ticketType, member) {
  return new EmbedBuilder()
    .setColor(ticketType.style === ButtonStyle.Success ? 0x2ecc71 : 0x5865f2)
    .setTitle(`${ticketType.emoji} Ticket ${ticketType.label}`)
    .setDescription(
      [
        ...ticketType.descriptionLines,
        "",
        "Hay gui thong tin sau de shop xu ly nhanh:",
        "- UID / server",
        "- Nhu cau cu the",
        "- Tien do hoac deadline",
        "- Thong tin bo sung neu co",
        "",
        `Khach tao ticket: ${member}`,
      ].join("\n")
    )
    .setImage(PANEL_BANNER);
}

function buildTicketActionsRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(CLOSE_CUSTOM_ID)
      .setLabel("Dong ticket")
      .setStyle(ButtonStyle.Danger)
  );
}

function buildConfirmCloseRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(CLOSE_CONFIRM_CUSTOM_ID)
      .setLabel("Xac nhan dong")
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(CLOSE_CANCEL_CUSTOM_ID)
      .setLabel("Huy")
      .setStyle(ButtonStyle.Secondary)
  );
}

async function createTicketChannel(interaction, panelConfig, ticketType) {
  const existingTicket = getOpenTicket(
    interaction.guildId,
    interaction.user.id,
    ticketType.key
  );

  if (existingTicket) {
    const existingChannel = await interaction.guild.channels
      .fetch(existingTicket.channelId)
      .catch(() => null);

    if (existingChannel) {
      await interaction.reply({
        content: `Ban da co ticket mo tai ${existingChannel}.`,
        ephemeral: true,
      });
      return;
    }

    deleteOpenTicket(interaction.guildId, interaction.user.id, ticketType.key);
  }

  const channel = await interaction.guild.channels.create({
    name: buildTicketChannelName(ticketType, interaction.user.username),
    type: ChannelType.GuildText,
    parent: panelConfig.categoryId,
    permissionOverwrites: [
      {
        id: interaction.guild.roles.everyone.id,
        deny: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: interaction.client.user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.ManageChannels,
          PermissionFlagsBits.ManageMessages,
          PermissionFlagsBits.EmbedLinks,
          PermissionFlagsBits.AttachFiles,
        ],
      },
      {
        id: interaction.user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.AttachFiles,
          PermissionFlagsBits.EmbedLinks,
        ],
      },
      ...(panelConfig.supportRoleId
        ? [
            {
              id: panelConfig.supportRoleId,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.ManageMessages,
                PermissionFlagsBits.AttachFiles,
                PermissionFlagsBits.EmbedLinks,
              ],
            },
          ]
        : []),
    ],
  });

  saveOpenTicket({
    guildId: interaction.guildId,
    ownerId: interaction.user.id,
    type: ticketType.key,
    channelId: channel.id,
  });

  await channel.send({
    content: [
      `${interaction.user}`,
      panelConfig.supportRoleId ? `<@&${panelConfig.supportRoleId}>` : null,
    ]
      .filter(Boolean)
      .join(" "),
    embeds: [buildTicketEmbed(ticketType, interaction.user)],
    components: [buildTicketActionsRow()],
  });

  await interaction.reply({
    content: `Da tao ticket: ${channel}`,
    ephemeral: true,
  });
}

async function handleTicketComponent(interaction) {
  if (!interaction.inGuild()) {
    await interaction.reply({
      content: "Ticket chi dung duoc trong guild.",
      ephemeral: true,
    });
    return;
  }

  if (interaction.customId.startsWith(PANEL_CREATE_PREFIX)) {
    const typeKey = interaction.customId.slice(PANEL_CREATE_PREFIX.length);
    const ticketType = getTicketType(typeKey);
    const panelConfig = getTicketPanel(interaction.guildId);

    if (!ticketType || !panelConfig) {
      await interaction.reply({
        content: "Panel ticket chua duoc cau hinh hoac loai ticket khong hop le.",
        ephemeral: true,
      });
      return;
    }

    await createTicketChannel(interaction, panelConfig, ticketType);
    return;
  }

  if (interaction.customId === CLOSE_CUSTOM_ID) {
    await interaction.reply({
      content: "Xac nhan dong ticket nay?",
      components: [buildConfirmCloseRow()],
      ephemeral: true,
    });
    return;
  }

  if (interaction.customId === CLOSE_CANCEL_CUSTOM_ID) {
    await interaction.update({
      content: "Da huy thao tac dong ticket.",
      components: [],
    });
    return;
  }

  if (interaction.customId === CLOSE_CONFIRM_CUSTOM_ID) {
    const ownerId = interaction.channel.permissionOverwrites.cache.find(
      (overwrite) =>
        overwrite.type === 1 &&
        overwrite.id !== interaction.client.user.id &&
        overwrite.id !== interaction.user.id &&
        overwrite.allow.has(PermissionFlagsBits.ViewChannel)
    )?.id;

    const ticketType = Object.values(ticketTypes).find((candidate) =>
      interaction.channel.name.startsWith(candidate.channelPrefix)
    );

    if (ownerId && ticketType) {
      deleteOpenTicket(interaction.guildId, ownerId, ticketType.key);
    } else {
      deleteOpenTicketByChannelId(interaction.channelId);
    }

    await interaction.update({
      content: "Dang dong ticket...",
      components: [],
    });

    await interaction.channel.delete("Ticket closed via bot");
  }
}

async function syncTicketPanel(client, panelConfig) {
  const channel = await client.channels.fetch(panelConfig.channelId);

  if (!channel?.isTextBased()) {
    throw new Error("Configured ticket panel channel must be a text channel.");
  }

  let panelMessage = null;

  if (panelConfig.messageId) {
    panelMessage = await channel.messages.fetch(panelConfig.messageId).catch(() => null);
  }

  if (!panelMessage) {
    const recentMessages = await channel.messages.fetch({ limit: 20 });
    panelMessage =
      recentMessages.find(
        (message) =>
          message.author?.id === client.user.id &&
          message.components[0]?.components.some((component) =>
            component.customId?.startsWith(PANEL_CREATE_PREFIX)
          )
      ) || null;
  }

  if (panelMessage) {
    await panelMessage.edit(getTicketPanelPayload());
    return {
      ...panelConfig,
      channelId: channel.id,
      messageId: panelMessage.id,
    };
  }

  const newMessage = await channel.send(getTicketPanelPayload());
  return {
    ...panelConfig,
    channelId: channel.id,
    messageId: newMessage.id,
  };
}

async function syncStoredTicketPanels(client) {
  const syncedPanels = [];

  for (const panelConfig of listTicketPanels()) {
    try {
      syncedPanels.push(await syncTicketPanel(client, panelConfig));
    } catch {
      // Let other guild panels continue syncing even if one config is invalid.
    }
  }

  return syncedPanels;
}

async function restoreDeletedTicketPanel(client, panelConfig) {
  return syncTicketPanel(client, {
    ...panelConfig,
    messageId: null,
  });
}

module.exports = {
  getTicketPanelPayload,
  handleTicketComponent,
  isTicketComponent,
  syncTicketPanel,
  syncStoredTicketPanels,
  restoreDeletedTicketPanel,
};
