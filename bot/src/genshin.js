const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageFlags,
  StringSelectMenuBuilder,
} = require("discord.js");

const MENU_CUSTOM_ID = "genshin:menu";
const FULLMAP_CUSTOM_ID = "genshin:fullmap";
const BACK_MAIN_CUSTOM_ID = "genshin:back-main";
const BACK_FULLMAP_CUSTOM_ID = "genshin:back-fullmap";
const DIVIDER = "────────────────────────";
const BANNER_IMAGE =
  "https://images6.alphacoders.com/118/thumb-1920-1189218.jpg";

const genshinServices = [
  {
    value: "version",
    label: "Phiên bản mới nhất 6.4 - Luna V",
    emoji: "🌙",
    title: "Phiên bản mới nhất 6.4 - Luna V",
    description: "Mới Nhất Tính Đến Hiện Tại",
    quoteBlocks: [
      {
        title: "Sự Kiện Game Thủ Thành: Chiến Dịch Phòng Thủ Cứ Điểm (23/03 -> 02/04)",
        value: "`50.000 VNĐ/Full`",
      },
      {
        title: "Sự Kiện Nhỏ: Nấm Linh Du Ký (16/03 -> 26/03)",
        value: "`50.000 VNĐ/Full`",
      },
      {
        title: "Thiên Âm Nhã Tập: Nod-Krai (25/02 -> 07/04)",
        value: "`40.000 VNĐ/Full`",
      },
      {
        title: "Góc Có Thể Bạn Sẽ Quên",
        value: "",
      },
      {
        title: "Thưởng Giới Hạn Thám Hiểm Nodkrai 6.3 400 nguyên thạch (14/01 -> 07/04)",
        value: "`300.000 VNĐ/Full Map 6.3`",
      },
      {
        title: "Content BEM NHAU",
        value: "",
      },
      {
        title: "Nhà Hát Giả Tưởng (01/03 -> 31/03)",
        value: "`80.000 VNĐ/10p ~ 100.000 VNĐ/12p`",
      },
      {
        title: "Ảo Cảnh Hiểm Ác (04/03 -> 07/04)",
        value: "`1->3: 30.000 VNĐ\\n4: 50.000 VNĐ\\n5: 100.000 VNĐ\\n6: 150.000 VNĐ`",
      },
      {
        title: "La Hoàn (16/03 -> 16/04)",
        value: "`80.000 VNĐ/36 sao/12 tầng`",
      },
    ],
    notes: [
      "Giá có thể thay đổi sau khi trải nghiệm xong.",
      "Có hỗ trợ cày Full Map 6.3 chỉ với 6.3, còn được nhận cả 400 nguyên thạch hoạt động thời giới hạn này. Đặt thuê ngay kẻo lỡ.",
      "Có kiện nhỏ Nấm Linh Du Ký cần hết sức hết sức hết sức lưu ý thời gian.",
    ],
    ticketLine: "Tạo Ticket để đặt cày ở # / Ticket -> Cày Thuê",
    imageUrl: BANNER_IMAGE,
  },
  {
    value: "roll",
    label: "Cày roll",
    emoji: "🎯",
    title: "Cày roll",
    description: "Dịch Vụ Cày Roll Cảm Nhận Theo Giá Map",
    quoteBlocks: [
      {
        title: "1 Roll",
        value: "`5k ~ 8k/ROLL`",
      },
      {
        title: "Cứu Banner (còn ≤ 5 ngày, cần gấp)",
        value: "`10k/ROLL`",
      },
    ],
    notes: [
      "Ne Event, La Hoàn, Nhà Hát, Natlan 5.8, Ma Thần, Thẻ Tháng, Battle Pass, Nhiệm Vụ Đồng Hành + Truyền Thuyết",
      "Không gộp chung tài nguyên nạp của khách với dịch vụ khác trong shop",
      "Khi khách đã đặt đến 50 Roll và muốn đặt tiếp thì: Giá Roll + 1k/roll",
    ],
    ticketLine: "Tạo Ticket để đặt cày ở # / Ticket -> Cày Thuê",
    imageUrl: BANNER_IMAGE,
  },
  {
    value: "material",
    label: "Nhặt nguyên liệu",
    emoji: "🌿",
    title: "Nhặt nguyên liệu",
    description: "Dịch Vụ Nhặt Nguyên Liệu",
    quoteBlocks: [
      {
        title: "Đặc sản khu vực (Nguyên liệu đột phá)",
        value: "`30k/168 Nguyên Liệu`",
      },
      {
        title: "Nguyên liệu mốc trung (2★ - 3★)",
        value: "`30k/100 Nguyên Liệu`",
      },
      {
        title: "Tinh điệp",
        value: "`30k/120 Tinh Điệp`",
      },
      {
        title: "Nguyên liệu theo yêu cầu",
        value: "`30k/100 Cái`",
      },
    ],
    notes: [
      "Nguyên liệu yêu cầu: Khoáng sản, Gỗ, Đồ nấu ăn 1 sao,... Cần gì cứ ib nhé.",
      "Nguyên liệu 2 - 3★ chính là mốc trung của nguyên liệu đó.",
    ],
    ticketLine: "Tạo Ticket để đặt cày ở # / Ticket -> Cày Thuê",
    imageUrl: BANNER_IMAGE,
  },
  {
    value: "quest",
    label: "Quest",
    emoji: "📖",
    title: "Quest",
    description: "Dịch Vụ Nhiệm Vụ",
    quoteBlocks: [
      {
        title: "Nhiệm Vụ Ma Thần Từ 6.0",
        value: "`50k/Màn`",
      },
      {
        title: "Nhiệm Vụ Ma Thần",
        value: "`40k/Màn`",
      },
      {
        title: "Nhiệm Vụ Truyền Thuyết",
        value: "`35k/Màn`",
      },
      {
        title: "Nhiệm Vụ Đồng Hành",
        value: "`25k/Full Kết`",
      },
      {
        title: "Nhiệm Vụ Sử Ký Bộ Tộc",
        value: "`60k/Full 3 Màn`",
      },
      {
        title: "Nhiệm Vụ Thế Giới",
        value: "`5k ~ 150k (tùy thời gian hoàn thành)`",
      },
    ],
    notes: [
      "Những Quest Thế Giới siêu dài như Aranara, Jeht, Khvarena, Narzissenkreuz, Viện Khoa Học, Pháo Đài... cứ tạo ticket bên mình báo giá nhé.",
      "Sử Ký Bộ Tộc có 3 màn, nhận 1 màn 20k/1.",
    ],
    ticketLine: "Tạo Ticket để đặt cày ở # / Ticket -> Cày Thuê",
    imageUrl: BANNER_IMAGE,
  },
  {
    value: "fullmap",
    label: "Full Map",
    emoji: "🗺️",
    title: "Bảng Giá Full Map",
    description: "Full map bao gồm full rương + thần đồng + NVTG theo khu vực.",
    priceLines: [
      "1 khu vực nhỏ: **70.000đ**",
      "1 nation lớn: **250.000đ+**",
      "Combo full map: **Báo giá riêng theo phần trăm**",
    ],
  },
];

const fullMapRegions = [
  {
    value: "nod-krai",
    label: "Nod-Krai",
    emoji: "❄️",
    menuDescription: "Đang ở phiên bản 6.3 ...",
    title: "100% Map Nod-Krai",
    description: "Báo giá full map Nod-Krai theo tiến độ và mức độ mở khóa hiện tại.",
    quoteBlocks: [
      {
        title: "Mở khóa cơ bản",
        value: "`120k/khu (khu >50%: 90k)`",
      },
      {
        title: "Loot + thần đồng",
        value: "`180k/khu`",
      },
      {
        title: "Combo full tiến độ",
        value: "`Báo giá riêng theo acc`",
      },
    ],
    notes: [
      "Khu vực mới nên giá sẽ thay đổi theo tiến độ cập nhật thực tế.",
      "Những chain quest chưa mở có thể cần báo trước để xếp lịch.",
      "Đơn gấp hoặc map khó sẽ được báo giá lại trước khi nhận.",
    ],
    ticketLine: "Tạo Ticket để đặt cày ở # / Ticket -> Cày Thuê",
    imageUrl: BANNER_IMAGE,
  },
  {
    value: "natlan",
    label: "Natlan",
    emoji: "🔥",
    menuDescription: "Xem Natlan",
    title: "100% Map Natlan",
    description: "Báo giá full map Natlan theo từng cụm vùng và chain mở rộng.",
    quoteBlocks: [
      {
        title: "Khu vực thường",
        value: "`130k/khu (khu >50%: 95k)`",
      },
      {
        title: "Cụm map lớn",
        value: "`220k/cụm`",
      },
      {
        title: "Trọn khu Natlan",
        value: "`Báo giá theo acc`",
      },
    ],
    notes: [
      "Map Natlan có nhiều cơ chế riêng, giá có thể chênh theo mức độ mở khóa.",
      "Nếu acc đã mở quest chính, tốc độ cày sẽ nhanh hơn.",
      "Deal giá cho đơn nhiều khu vực hoặc book trọn gói.",
    ],
    ticketLine: "Tạo Ticket để đặt cày ở # / Ticket -> Cày Thuê",
    imageUrl: BANNER_IMAGE,
  },
  {
    value: "fontaine",
    label: "Fontaine",
    emoji: "💧",
    menuDescription: "Xem Fontaine",
    title: "100% Map Fontaine",
    description: "Báo giá full map Fontaine bao gồm khu trên cạn và dưới nước.",
    quoteBlocks: [
      {
        title: "Zone thường",
        value: "`100k/zone (zone >50%: 75k)`",
      },
      {
        title: "Zone có dưới nước",
        value: "`150k/zone`",
      },
      {
        title: "Trọn Fontaine",
        value: "`320k+ / tùy acc`",
      },
    ],
    notes: [
      "Khu vực dưới nước và thần đồng liên kết có thể tốn thêm thời gian.",
      "Giá sẽ mềm hơn nếu acc đã mở tele và line quest chính.",
      "Nhận deal đơn combo nếu book thêm quest hoặc nhặt nguyên liệu.",
    ],
    ticketLine: "Tạo Ticket để đặt cày ở # / Ticket -> Cày Thuê",
    imageUrl: BANNER_IMAGE,
  },
  {
    value: "sumeru",
    label: "Sumeru",
    emoji: "🌳",
    menuDescription: "Xem Sumeru",
    title: "100% Map Sumeru",
    description: "Báo giá full map Sumeru cho rừng, sa mạc và cụm puzzle lớn.",
    quoteBlocks: [
      {
        title: "Khu vực thường",
        value: "`110k/khu (khu >50%: 80k)`",
      },
      {
        title: "Sa mạc / puzzle lớn",
        value: "`180k/khu`",
      },
      {
        title: "Trọn Sumeru",
        value: "`340k+ / tùy acc`",
      },
    ],
    notes: [
      "Sumeru có nhiều puzzle và thần đồng khóa bằng quest, cần check acc trước.",
      "Giá thay đổi theo map rừng hay sa mạc và mức độ đã mở.",
      "Book nhiều khu vực cùng lúc sẽ ưu tiên giá tốt hơn.",
    ],
    ticketLine: "Tạo Ticket để đặt cày ở # / Ticket -> Cày Thuê",
    imageUrl: BANNER_IMAGE,
  },
  {
    value: "inazuma",
    label: "Inazuma",
    emoji: "⚡",
    menuDescription: "Xem Inazuma",
    title: "100% Map Inazuma",
    description: "Báo giá full map Inazuma theo từng cụm đảo và khu vực đặc biệt.",
    quoteBlocks: [
      {
        title: "Các đảo thường",
        value: "`100k/khu (1 khu >50%: 70k/khu)`",
      },
      {
        title: "Đảo Seirai",
        value: "`150k -> >50% khu: 120k`",
      },
      {
        title: "Enkanomiya",
        value: "`280k -> >50% khu: 200k`",
      },
    ],
    notes: [
      "Nên đặt Full Map Inazuma để được trải nghiệm trọn vẹn và liền mạch.",
      "Enkanomiya không tính % map Inazuma.",
      "Khách hàng có thể deal giá nếu đủ tiền book dịch vụ này, miễn là team shop duyệt.",
    ],
    ticketLine: "Tạo Ticket để đặt cày ở # / Ticket -> Cày Thuê",
    imageUrl: BANNER_IMAGE,
  },
];

function buildMenuEmbed() {
  return new EmbedBuilder()
    .setColor(0x7c4dff)
    .setTitle("🛒 Menu Cày Thuê Genshin - Tận Tâm - Chuyên Nghiệp")
    .setDescription(
      [
        "• Chọn **Dịch vụ** bên dưới.",
        "• Sau đó chọn để xem **bảng giá chi tiết**.",
        "• Cần hỗ trợ riêng? Mở ticket và gửi đúng nhu cầu cần farm.",
      ].join("\n")
    )
    .setImage(BANNER_IMAGE)
    .setFooter({ text: "Powered by Qzi" });
}

function getPanelPayload() {
  return {
    embeds: [buildMenuEmbed()],
    components: [buildMenuRow()],
  };
}

function isEphemeralMessage(interaction) {
  return Boolean(interaction.message?.flags & MessageFlags.Ephemeral);
}

function buildRichQuoteEmbed(item) {
  const lines = [
    `**${item.description}**`,
    DIVIDER,
    ...item.quoteBlocks.flatMap((block) => [
      `**${block.title}:**`,
      block.value,
      "",
    ]),
    "**Lưu Ý**",
    ...item.notes.map((note) => `- ${note}`),
    "",
    DIVIDER,
    `**${item.ticketLine}**`,
  ].filter(Boolean);

  return new EmbedBuilder()
    .setColor(0x2ecc71)
    .setTitle(`${item.emoji} ${item.title}`)
    .setDescription(lines.join("\n"))
    .setImage(item.imageUrl)
    .setFooter({ text: "Only you can see this" });
}

function buildServiceEmbed(service) {
  if (service.quoteBlocks) {
    return buildRichQuoteEmbed(service);
  }

  return new EmbedBuilder()
    .setColor(0xf5a623)
    .setTitle(`${service.emoji} ${service.title}`)
    .setDescription(service.description)
    .addFields([
      {
        name: "Báo giá",
        value: service.priceLines.map((line) => `• ${line}`).join("\n"),
      },
      {
        name: "Lưu ý",
        value:
          "Giá có thể thay đổi theo server, độ khó acc và yêu cầu gấp. Đơn lớn nên báo trước để xếp lịch.",
      },
    ]);
}

function buildFullMapMenuEmbed() {
  return new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("Dịch vụ: Full Map")
    .setDescription("Chọn khu vực cần xem bảng giá chi tiết.");
}

function buildFullMapRegionEmbed(region) {
  if (region.quoteBlocks) {
    return buildRichQuoteEmbed(region);
  }

  return new EmbedBuilder()
    .setColor(0xf5a623)
    .setTitle(`${region.emoji} ${region.title}`)
    .setDescription(region.description)
    .addFields([
      {
        name: "Báo giá",
        value: region.priceLines.map((line) => `• ${line}`).join("\n"),
      },
      {
        name: "Lưu ý",
        value:
          "Giá có thể thay đổi theo độ khó acc, yêu cầu gấp và tiến độ thực tế.",
      },
    ]);
}

function buildMenuRow() {
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(MENU_CUSTOM_ID)
      .setPlaceholder("📁 Dịch vụ (Genshin Impact)")
      .addOptions(
        genshinServices.map((service) => ({
          label: service.label,
          value: service.value,
          emoji: service.emoji,
          description: service.description.slice(0, 100),
        }))
      )
  );
}

function buildFullMapMenuRow() {
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(FULLMAP_CUSTOM_ID)
      .setPlaceholder("Dịch vụ: Full Map")
      .addOptions(
        fullMapRegions.map((region) => ({
          label: region.label,
          value: region.value,
          emoji: region.emoji,
          description: region.menuDescription,
        }))
      )
  );
}

function buildBackMainRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(BACK_MAIN_CUSTOM_ID)
      .setLabel("Quay lại danh mục")
      .setStyle(ButtonStyle.Secondary)
  );
}

function buildFullMapActionsRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(BACK_MAIN_CUSTOM_ID)
      .setLabel("Về menu chính")
      .setStyle(ButtonStyle.Secondary)
  );
}

function buildRegionActionsRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(BACK_FULLMAP_CUSTOM_ID)
      .setLabel("Về Full Map")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(BACK_MAIN_CUSTOM_ID)
      .setLabel("Về menu chính")
      .setStyle(ButtonStyle.Secondary)
  );
}

async function handleGenshinCommand(interaction) {
  await interaction.reply({
    ...getPanelPayload(),
    flags: MessageFlags.Ephemeral,
  });
}

async function handleGenshinComponent(interaction) {
  if (interaction.isStringSelectMenu() && interaction.customId === MENU_CUSTOM_ID) {
    const service = genshinServices.find(
      (item) => item.value === interaction.values[0]
    );

    if (!service) {
      await interaction.reply({
        content: "Không tìm thấy bảng giá cho mục đã chọn.",
        ephemeral: true,
      });
      return;
    }

    if (service.value === "fullmap") {
      const payload = {
        embeds: [buildFullMapMenuEmbed()],
        components: [buildFullMapMenuRow(), buildFullMapActionsRow()],
        flags: MessageFlags.Ephemeral,
      };

      if (isEphemeralMessage(interaction)) {
        await interaction.update(payload);
      } else {
        await interaction.reply(payload);
      }
      return;
    }

    const payload = {
      embeds: [buildServiceEmbed(service)],
      components: [buildBackMainRow()],
      flags: MessageFlags.Ephemeral,
    };

    if (isEphemeralMessage(interaction)) {
      await interaction.update(payload);
    } else {
      await interaction.reply(payload);
    }
    return;
  }

  if (
    interaction.isStringSelectMenu() &&
    interaction.customId === FULLMAP_CUSTOM_ID
  ) {
    const region = fullMapRegions.find(
      (item) => item.value === interaction.values[0]
    );

    if (!region) {
      await interaction.reply({
        content: "Không tìm thấy khu vực Full Map đã chọn.",
        ephemeral: true,
      });
      return;
    }

    await interaction.update({
      embeds: [buildFullMapRegionEmbed(region)],
      components: [buildRegionActionsRow()],
    });
    return;
  }

  if (interaction.isButton() && interaction.customId === BACK_FULLMAP_CUSTOM_ID) {
    await interaction.update({
      embeds: [buildFullMapMenuEmbed()],
      components: [buildFullMapMenuRow(), buildFullMapActionsRow()],
    });
    return;
  }

  if (interaction.isButton() && interaction.customId === BACK_MAIN_CUSTOM_ID) {
    await interaction.update(getPanelPayload());
  }
}

async function syncGenshinPanel(client, panelConfig) {
  const channel = await client.channels.fetch(panelConfig.channelId);

  if (!channel?.isTextBased()) {
    throw new Error("Configured Genshin panel channel must be a text channel.");
  }

  let panelMessage = null;

  if (panelConfig.messageId) {
    try {
      panelMessage = await channel.messages.fetch(panelConfig.messageId);
    } catch {
      panelMessage = null;
    }
  }

  if (!panelMessage) {
    const recentMessages = await channel.messages.fetch({ limit: 20 });
    panelMessage =
      recentMessages.find(
        (message) =>
          message.author?.id === client.user.id &&
          message.components[0]?.components[0]?.customId === MENU_CUSTOM_ID
      ) || null;
  }

  if (panelMessage) {
    await panelMessage.edit(getPanelPayload());
    return {
      guildId: panelConfig.guildId,
      channelId: channel.id,
      messageId: panelMessage.id,
    };
  }

  const newMessage = await channel.send(getPanelPayload());

  return {
    guildId: panelConfig.guildId,
    channelId: channel.id,
    messageId: newMessage.id,
  };
}

async function syncStoredGenshinPanels(client, panelConfigs) {
  const syncedPanels = [];

  for (const panelConfig of panelConfigs) {
    try {
      syncedPanels.push(await syncGenshinPanel(client, panelConfig));
    } catch {
      // Let other guild panels continue syncing even if one config is invalid.
    }
  }

  return syncedPanels;
}

async function restoreDeletedGenshinPanel(client, panelConfig) {
  return syncGenshinPanel(client, {
    guildId: panelConfig.guildId,
    channelId: panelConfig.channelId,
    messageId: null,
  });
}

module.exports = {
  handleGenshinCommand,
  handleGenshinComponent,
  syncGenshinPanel,
  syncStoredGenshinPanels,
  restoreDeletedGenshinPanel,
};
