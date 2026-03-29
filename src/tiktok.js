const { WebcastPushConnection } = require("tiktok-live-connector");
const { MAX_TEXT_LENGTH, enqueueSpeech, normalizeText } = require("./voice");

let tiktokLiveConnection = null;
let tiktokContext = null;

function extractUsernameFromUrl(url) {
  const match = url.match(/tiktok\.com\/@([a-zA-Z0-9._]+)\/live/);
  return match ? match[1] : null;
}

async function connectTikTokWithRetry(username, maxAttempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      console.log(
        `[TikTok] Connecting for @${username} (attempt ${attempt}/${maxAttempts})`
      );

      const connection = new WebcastPushConnection(username);
      await connection.connect();

      console.log("[TikTok] Connected successfully.");
      return connection;
    } catch (error) {
      lastError = error;
      console.error(
        `[TikTok] Connect failed (attempt ${attempt}/${maxAttempts})`,
        error
      );

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 2_000 * attempt));
      }
    }
  }

  throw lastError;
}

async function handleTikTokCommand(interaction) {
  const streamUrl = interaction.options.getString("url", true);
  const username = extractUsernameFromUrl(streamUrl);
  const voiceChannel = interaction.member?.voice?.channel;

  if (!username) {
    await interaction.reply(
      "Invalid TikTok stream URL. Please enter a valid live stream URL."
    );
    return;
  }

  if (!voiceChannel) {
    await interaction.reply("You need to be in a voice channel before starting TikTok TTS.");
    return;
  }

  await interaction.reply(`Connecting to TikTok live stream: ${streamUrl}`);

  try {
    if (tiktokLiveConnection) {
      await Promise.resolve(tiktokLiveConnection.disconnect());
    }

    const connection = await connectTikTokWithRetry(username, 3);

    tiktokLiveConnection = connection;
    tiktokContext = {
      guild: interaction.guild,
      voiceChannel,
    };

    console.log(`Connected to stream for user: ${username}`);

    tiktokLiveConnection.on("chat", (data) => {
      if (!tiktokContext) {
        return;
      }

      const text = normalizeText(`${data.comment || ""}`);
      if (!text || text.length > MAX_TEXT_LENGTH) {
        return;
      }

      void enqueueSpeech({
        guild: tiktokContext.guild,
        voiceChannel: tiktokContext.voiceChannel,
        text,
      }).catch((error) => {
        if (error.message !== "QUEUE_LIMIT_REACHED") {
          console.error("[TikTok] Failed to enqueue chat for TTS:", error);
        }
      });
    });
  } catch (err) {
    console.error("Error connecting to TikTok live stream:", err);

    let message =
      "Failed to connect to TikTok after 3 attempts. Please try again later.";

    if (err?.reason === "Sign Error") {
      message =
        "TikTok signing server returned an error (504/500). This is an issue on the TikTok/signing service side, not the bot.";
    } else if (
      typeof err?.message === "string" &&
      err.message.includes("Unexpected server response: 200")
    ) {
      message =
        "WebSocket connection to TikTok failed (Unexpected server response: 200). TikTok may be blocking the connection or the user might not be live.";
    }

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(message);
    } else {
      await interaction.reply(message);
    }
  }
}

async function handleTikTokStopCommand(interaction) {
  if (!tiktokLiveConnection) {
    await interaction.reply("There is no active TikTok connection to stop.");
    return;
  }

  try {
    await Promise.resolve(tiktokLiveConnection.disconnect());
  } catch (error) {
    console.error("Error while disconnecting TikTok:", error);
  } finally {
    tiktokLiveConnection = null;
    tiktokContext = null;
  }

  if (interaction.replied || interaction.deferred) {
    await interaction.followUp("Disconnected from TikTok live.");
  } else {
    await interaction.reply("Disconnected from TikTok live.");
  }
}

module.exports = {
  handleTikTokCommand,
  handleTikTokStopCommand,
};
