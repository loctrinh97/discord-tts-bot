// src/tiktok.js
const { WebcastPushConnection } = require("tiktok-live-connector");
const { playTTS } = require("./tts");

// TikTok state
let tiktokLiveConnection = null;
let tiktokLastTimestamp = Date.now();
const chats = [];
let isSpeaking = false;

// ===== Helpers =====

function extractUsernameFromUrl(url) {
    const match = url.match(/tiktok\.com\/@([a-zA-Z0-9._]+)\/live/);
    return match ? match[1] : null;
}

// Process queued TikTok chat messages and play them via TTS
function processSpeechQueue(voiceChannel, interaction) {
    if (isSpeaking) return;
    if (chats.length === 0) return;

    const text = chats[0];
    isSpeaking = true;

    playTTS(text, "./output.mp3", voiceChannel, interaction, () => {
        // Remove the first item in the queue
        chats.shift();
        isSpeaking = false;

        // If we still have messages in the queue, continue processing
        if (chats.length > 0) {
            setTimeout(() => {
                processSpeechQueue(voiceChannel, interaction);
            }, 500); // small delay between messages
        }
    });
}


/**
 * Try to connect to TikTok live with retries
 */
async function connectTikTokWithRetry(username, maxAttempts = 3) {
    let lastError;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            console.log(
                `[TikTok] Connecting for @${username} (attempt ${attempt}/${maxAttempts})`
            );

            const conn = new WebcastPushConnection(username);
            await conn.connect();

            console.log("[TikTok] Connected successfully.");
            return conn;
        } catch (err) {
            lastError = err;
            console.error(
                `[TikTok] Connect failed (attempt ${attempt}/${maxAttempts})`,
                err
            );

            if (attempt < maxAttempts) {
                // Wait 2 seconds before next attempt
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }
        }
    }

    // If all attempts failed, throw the last error
    throw lastError;
}

// ===== Slash /tiktok =====

async function handleTikTokCommand(interaction) {
    const streamUrl = interaction.options.getString("url");
    const username = extractUsernameFromUrl(streamUrl);

    if (!username) {
        await interaction.reply(
            "Invalid TikTok stream URL. Please enter a valid live stream URL."
        );
        return;
    }

    await interaction.reply(`Connecting to TikTok live stream: ${streamUrl}`);

    try {
        // Try to connect up to 3 times
        const conn = await connectTikTokWithRetry(username, 3);

        tiktokLiveConnection = conn;
        tiktokLastTimestamp = Date.now();

        console.log(`current time : ${tiktokLastTimestamp}`);
        console.log(`Connected to stream for user: ${username}`);

        // Listen for chat events once connected
        tiktokLiveConnection.on("chat", (data) => {
            // If you want to read ALL comments since connection,
            // you can keep or remove the timestamp check.
            if (tiktokLastTimestamp < data.createTime) {
                const comment = `${data.nickname} : ${data.comment}`;
                chats.push(comment);

                const voiceChannel = interaction.member?.voice?.channel;
                if (voiceChannel && !isSpeaking) {
                    // Only start processing if bot is not currently speaking
                    processSpeechQueue(voiceChannel, interaction);
                }
            }
        });

    } catch (err) {
        console.error("Error connecting to TikTok live stream:", err);

        let msg =
            "Failed to connect to TikTok after 3 attempts. Please try again later.";

        // More detailed messages for common error types
        if (err?.reason === "Sign Error") {
            msg =
                "TikTok signing server returned an error (504/500). This is an issue on the TikTok/signing service side, not the bot.";
        } else if (
            typeof err?.message === "string" &&
            err.message.includes("Unexpected server response: 200")
        ) {
            msg =
                "WebSocket connection to TikTok failed (Unexpected server response: 200). TikTok may be blocking the connection or the user might not be live.";
        }

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(msg);
        } else {
            await interaction.reply(msg);
        }
    }
}

// ===== Slash /stop tiktok =====

async function handleTikTokStopCommand(interaction) {
    if (!tiktokLiveConnection) {
        await interaction.reply("There is no active TikTok connection to stop.");
        return;
    }

    try {
        // disconnect() may be sync or async -> normalize to Promise
        await Promise.resolve(tiktokLiveConnection.disconnect());
    } catch (err) {
        console.error("Error while disconnecting TikTok:", err);
    } finally {
        tiktokLiveConnection = null;
        isSpeaking = false;
        chats.length = 0;
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
