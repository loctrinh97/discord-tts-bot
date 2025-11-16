// src/tts.js
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const { exec } = require("child_process");
const { PYTHON_CMD } = require("./config");

// State voice chung
let voiceConnection = null;
let disconnectTimeout = null;

// ===== Utils chung =====

function safeReply(target, text) {
  if (!target) return;

  if (typeof target.followUp === "function") {
    return target.followUp(text);
  }

  if (typeof target.reply === "function") {
    return target.reply(text);
  }

  console.warn("safeReply: target has no followUp/reply");
}

function getOrCreateVoiceConnection(voiceChannel) {
  if (voiceConnection && voiceConnection.joinConfig.channelId === voiceChannel.id) {
    return voiceConnection;
  }

  voiceConnection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });

  return voiceConnection;
}

function runTtsPython(textToSay, audioFilePath, interaction, onDone) {
  const command = `${PYTHON_CMD} tts.py "${textToSay}" ${audioFilePath}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error generating TTS: ${error.message}`);
      safeReply(interaction, "There was an error generating the speech.");
      return onDone?.(error);
    }

    if (stderr) {
      console.warn("TTS stderr:", stderr);
    }

    onDone?.(null);
  });
}

function playAudioFileInChannel(audioFilePath, voiceChannel, interaction, onFinish) {
  try {
    const connection = getOrCreateVoiceConnection(voiceChannel);
    const player = createAudioPlayer();
    const resource = createAudioResource(audioFilePath);

    connection.subscribe(player);
    player.play(resource);

    player.addListener("stateChange", (oldState, newState) => {
      if (newState.status === AudioPlayerStatus.Idle) {
        onFinish?.();
      }
    });

    if (disconnectTimeout) clearTimeout(disconnectTimeout);
    // Có thể set timeout disconnect sau idle nếu muốn:
    // disconnectTimeout = setTimeout(() => {
    //   connection.destroy();
    //   voiceConnection = null;
    // }, 60_000);
  } catch (error) {
    console.error("Error joining the voice channel or playing audio:", error);
    safeReply(
      interaction,
      "There was an error trying to join the voice channel or play audio."
    );
    onFinish?.(error);
  }
}

// ===== API dùng cho nơi khác =====

// Dùng cho TikTok queue
function playTTS(textToSay, audioFilePath, voiceChannel, interaction, onFinish) {
  runTtsPython(textToSay, audioFilePath, interaction, (err) => {
    if (err) return;
    playAudioFileInChannel(audioFilePath, voiceChannel, interaction, () => {
      onFinish?.();
    });
  });
}

// Dùng cho message "." – không queue
function playTTSDemo(textToSay, audioFilePath, voiceChannel, interaction, onFinish) {
  runTtsPython(textToSay, audioFilePath, interaction, (err) => {
    if (err) return;
    playAudioFileInChannel(audioFilePath, voiceChannel, interaction, () => {
      onFinish?.();
    });
  });
}

// Event handler cho messageCreate
async function handleMessageTts(message) {
  if (!message.content.startsWith(".")) return;

  const voiceChannel = message.member?.voice?.channel;

  if (!voiceChannel) {
    await message.reply("You need to be in a voice channel to use this command.");
    return;
  }

  let textToSay = message.content;

  if (message.mentions.users.size > 0) {
    message.mentions.users.forEach((user) => {
      textToSay = textToSay
        .replace(`<@${user.id}>`, user.username)
        .replace("tibi.ne", "đười ươi");
    });
  }

  textToSay = textToSay.slice(1).trim(); // bỏ dấu "." đầu

  if (!textToSay) {
    await message.reply("Please provide a message for me to say.");
    return;
  }

  const audioFilePath = "./output.mp3";
  playTTSDemo(textToSay, audioFilePath, voiceChannel, message, () => {});
}

module.exports = {
  playTTS,
  playTTSDemo,
  handleMessageTts,
};
