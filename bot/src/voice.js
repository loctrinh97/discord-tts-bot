const prism = require("prism-media");
const ffmpegPath = require("ffmpeg-static");
const {
  AudioPlayerStatus,
  NoSubscriberBehavior,
  StreamType,
  VoiceConnectionStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  joinVoiceChannel,
} = require("@discordjs/voice");

process.env.FFMPEG_PATH = process.env.FFMPEG_PATH || ffmpegPath;

const SAY_COOLDOWN_MS = 4_000;
const MAX_TEXT_LENGTH = 180;
const MAX_QUEUE_SIZE = 10;
const GOOGLE_TTS_LANGUAGE = "vi";

const guildStates = new Map();
const cooldowns = new Map();

function buildGoogleTtsUrl(text) {
  const params = new URLSearchParams({
    ie: "UTF-8",
    client: "tw-ob",
    tl: GOOGLE_TTS_LANGUAGE,
    q: text,
  });

  return `https://translate.google.com/translate_tts?${params.toString()}`;
}

function createGuildState(guildId) {
  const player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Pause,
    },
  });

  const state = {
    guildId,
    connection: null,
    player,
    queue: [],
    currentItem: null,
    channelId: null,
    busy: false,
  };

  player.on(AudioPlayerStatus.Idle, () => {
    cleanupCurrentStream(state);
    state.busy = false;
    state.currentItem = null;
    void processQueue(state);
  });

  player.on("error", (error) => {
    console.error(`[Voice] Player error in guild ${guildId}:`, error);
    cleanupCurrentStream(state);
    state.busy = false;
    state.currentItem = null;
    void processQueue(state);
  });

  guildStates.set(guildId, state);
  return state;
}

function getGuildState(guildId) {
  return guildStates.get(guildId) || createGuildState(guildId);
}

function cleanupCurrentStream(state) {
  const stream = state.currentItem?.stream;
  if (!stream) {
    return;
  }

  stream.removeAllListeners();
  stream.destroy();
}

function destroyGuildVoiceState(guildId) {
  const state = guildStates.get(guildId);
  if (!state) {
    return;
  }

  cleanupCurrentStream(state);
  state.queue.length = 0;
  state.currentItem = null;
  state.busy = false;

  try {
    state.player.stop(true);
  } catch (error) {
    console.error(`[Voice] Failed to stop player for guild ${guildId}:`, error);
  }

  try {
    state.connection?.destroy();
  } catch (error) {
    console.error(`[Voice] Failed to destroy connection for guild ${guildId}:`, error);
  }

  guildStates.delete(guildId);
}

async function ensureConnection(state, voiceChannel) {
  if (state.connection) {
    if (state.channelId === voiceChannel.id) {
      return state.connection;
    }

    state.connection.destroy();
    state.connection = null;
  }

  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    selfDeaf: false,
  });

  state.connection = connection;
  state.channelId = voiceChannel.id;
  connection.subscribe(state.player);

  connection.on(VoiceConnectionStatus.Disconnected, async () => {
    try {
      await Promise.race([
        entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
        entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
      ]);
    } catch (error) {
      destroyGuildVoiceState(voiceChannel.guild.id);
    }
  });

  await entersState(connection, VoiceConnectionStatus.Ready, 15_000);
  return connection;
}

function createTtsStream(text) {
  return new prism.FFmpeg({
    args: [
      "-analyzeduration",
      "0",
      "-loglevel",
      "0",
      "-user_agent",
      "Mozilla/5.0",
      "-i",
      buildGoogleTtsUrl(text),
      "-f",
      "s16le",
      "-ar",
      "48000",
      "-ac",
      "2",
    ],
  });
}

async function processQueue(state) {
  if (state.busy || state.queue.length === 0) {
    return;
  }

  const item = state.queue.shift();
  state.busy = true;
  state.currentItem = item;

  try {
    await ensureConnection(state, item.voiceChannel);

    const stream = createTtsStream(item.text);
    stream.once("error", (error) => {
      console.error(`[Voice] Stream error in guild ${state.guildId}:`, error);
      state.player.stop(true);
    });

    item.stream = stream;

    const resource = createAudioResource(stream, {
      inputType: StreamType.Raw,
    });

    state.player.play(resource);
  } catch (error) {
    console.error(`[Voice] Failed to play audio in guild ${state.guildId}:`, error);
    cleanupCurrentStream(state);
    state.busy = false;
    state.currentItem = null;
    await item.onError?.(
      "Khong the phat am thanh luc nay. Hay kiem tra voice channel va thu lai."
    );
    void processQueue(state);
  }
}

function normalizeText(text) {
  return text.replace(/\s+/g, " ").trim();
}

function getDisplayName(member) {
  if (!member) {
    return "Unknown";
  }

  return member.displayName || member.user?.displayName || member.user?.username || "Unknown";
}

function getCooldownKey(guildId, userId) {
  return `${guildId}:${userId}`;
}

function getRemainingCooldownMs(guildId, userId) {
  const nextAllowedAt = cooldowns.get(getCooldownKey(guildId, userId)) || 0;
  const remaining = nextAllowedAt - Date.now();
  return remaining > 0 ? remaining : 0;
}

function consumeCooldown(guildId, userId) {
  cooldowns.set(getCooldownKey(guildId, userId), Date.now() + SAY_COOLDOWN_MS);
}

async function enqueueSpeech({ guild, voiceChannel, text, onError }) {
  const state = getGuildState(guild.id);
  const totalQueuedItems = state.queue.length + (state.busy ? 1 : 0);

  if (
    state.channelId &&
    state.channelId !== voiceChannel.id &&
    (state.busy || state.queue.length > 0)
  ) {
    throw new Error("BOT_BUSY_IN_OTHER_CHANNEL");
  }

  if (totalQueuedItems >= MAX_QUEUE_SIZE) {
    throw new Error("QUEUE_LIMIT_REACHED");
  }

  state.queue.push({
    text,
    voiceChannel,
    onError,
  });

  void processQueue(state);
}

async function sendInteractionResponse(interaction, content) {
  if (interaction.deferred || interaction.replied) {
    await interaction.editReply(content);
    return;
  }

  await interaction.reply(content);
}

async function deferInteractionReply(interaction) {
  try {
    await interaction.deferReply();
    return true;
  } catch (error) {
    if (error?.code === 10062) {
      console.warn("[Voice] Interaction expired before /say could be acknowledged.");
      return false;
    }

    throw error;
  }
}

async function handleSayCommand(interaction) {
  const voiceChannel = interaction.member?.voice?.channel;
  if (!voiceChannel) {
    await sendInteractionResponse(
      interaction,
      "Ban can vao voice channel truoc khi dung /say."
    );
    return;
  }

  const text = normalizeText(interaction.options.getString("text", true));
  if (!text) {
    await sendInteractionResponse(interaction, "Hay nhap noi dung de bot doc.");
    return;
  }

  const deferred = await deferInteractionReply(interaction);
  if (!deferred) {
    return;
  }

  if (text.length > MAX_TEXT_LENGTH) {
    await interaction.editReply(
      `Noi dung qua dai. Gioi han hien tai la ${MAX_TEXT_LENGTH} ky tu.`
    );
    return;
  }

  const remainingCooldown = getRemainingCooldownMs(
    interaction.guildId,
    interaction.user.id
  );
  if (remainingCooldown > 0) {
    await interaction.editReply(
      `Ban dang cooldown. Thu lai sau ${Math.ceil(remainingCooldown / 1000)}s.`
    );
    return;
  }

  const responseContent = `${getDisplayName(interaction.member)}: ${text}`;

  try {
    await enqueueSpeech({
      guild: interaction.guild,
      voiceChannel,
      text,
      onError: async (message) => {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(message);
          return;
        }

        await sendInteractionResponse(interaction, message);
      },
    });
    consumeCooldown(interaction.guildId, interaction.user.id);
  } catch (error) {
    if (error.message === "QUEUE_LIMIT_REACHED") {
      await interaction.editReply(`Hang doi da day. Toi da ${MAX_QUEUE_SIZE} muc moi guild.`);
      return;
    }

    if (error.message === "BOT_BUSY_IN_OTHER_CHANNEL") {
      await interaction.editReply("Bot dang phat o voice channel khac trong guild nay.");
      return;
    }

    console.error("[Voice] Failed to queue /say:", error);
    await interaction.editReply("Khong the them vao hang doi luc nay.");
    return;
  }

  await interaction.editReply(responseContent);
}

function handleVoiceStateUpdate(oldState, newState) {
  const guildId = oldState.guild.id;
  const state = guildStates.get(guildId);
  if (!state?.channelId) {
    return;
  }

  if (oldState.channelId !== state.channelId && newState.channelId !== state.channelId) {
    return;
  }

  const channel =
    oldState.guild.channels.cache.get(state.channelId) ||
    newState.guild.channels.cache.get(state.channelId);

  if (!channel?.members) {
    return;
  }

  const botId = oldState.guild.members.me?.id;
  if (!botId) {
    return;
  }

  if (channel.members.size === 1 && channel.members.has(botId)) {
    destroyGuildVoiceState(guildId);
  }
}

module.exports = {
  MAX_QUEUE_SIZE,
  MAX_TEXT_LENGTH,
  destroyGuildVoiceState,
  enqueueSpeech,
  handleSayCommand,
  handleVoiceStateUpdate,
  normalizeText,
};
