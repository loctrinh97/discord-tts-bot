// Initialize dotenv
require("dotenv").config();

// Discord.js versions ^13.0 require us to explicitly define client intents
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { REST } = require("@discordjs/rest"); // Import REST from @discordjs/rest
const { Routes } = require("discord-api-types/v10"); // Import Routes for command registration

const {
  generateDependencyReport,
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const { exec } = require("child_process");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// Use token from .env file
const TOKEN = process.env.DISCORD_TOKEN;

const CLIENT_ID = "1258630238888529921";

let connection; // To store the connection
let timeout; // To store the timeout ID

console.log(generateDependencyReport());

// Define a list of Valorant maps
const valorantMaps = [
  "Ascent",
  "Bind",
  "Haven",
  "Split",
  "Icebox",
  "Breeze",
  "Fracture",
  "Pearl",
  "Lotus",
];

// Slash commands definition
const commands = [
  {
    name: "tibi",
    description: "Tibi là ai",
  },
  {
    name: "random",
    description: "Generate a random something",
    options: [
      {
        name: "number",
        description: "Generate a random number between min and max",
        type: 1, // Subcommand type
        options: [
          {
            name: "min",
            description: "The minimum number",
            type: 4, // Integer type
            required: true,
          },
          {
            name: "max",
            description: "The maximum number",
            type: 4, // Integer type
            required: true,
          },
        ],
      },
      {
        name: "map",
        description: "Get a random Valorant map",
        type: 1, // Subcommand type
      },
    ],
  },
];

// Register the slash commands
const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    // Register commands globally
    await rest.put(
      Routes.applicationCommands(CLIENT_ID), // Global commands for all servers
      { body: commands }
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

// Event handler for interaction (slash command)
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === "tibi") {
    await interaction.reply("Tibi là đười ươi");
  }

  if (commandName === "random") {
    const subcommand = options.getSubcommand();

    // Handle random number generation
    if (subcommand === "number") {
      const min = options.getInteger("min");
      const max = options.getInteger("max");

      if (min >= max) {
        await interaction.reply(
          "The minimum value must be less than the maximum value."
        );
      } else {
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        await interaction.reply(
          `Random number between ${min} and ${max}: **${randomNum}**`
        );
      }
    }

    // Handle random map selection
    else if (subcommand === "map") {
      const randomMap =
        valorantMaps[Math.floor(Math.random() * valorantMaps.length)];
      await interaction.reply(`Random Valorant map: **${randomMap}**`);
    }
  }
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Command to join voice channel and play TTS audio
client.on("messageCreate", async (message) => {
  // Check if the message starts with "!say"
  if (message.content.startsWith(".")) {
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return message.reply(
        "You need to be in a voice channel to use this command."
      );
    }

    let textToSay = message.content;
    if (message.mentions.users.size > 0) {
      // Create a response string with usernames replacing mentions
      message.mentions.users.forEach((user) => {
        textToSay = textToSay
          .replace(`<@${user.id}>`, user.username)
          .replace("tibi.ne", "đười ươi"); // Replace mention ID with username
      });
    }

    textToSay = textToSay.slice(1).trim(); // Extract the text after "!say "
    if (!textToSay) {
      return message.reply("Please provide a message for me to say.");
    }

    const audioFilePath = "./output.mp3"; // Output file path

    // Run the Python script to generate TTS
    exec(
      `python3 tts.py "${textToSay}" ${audioFilePath}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error generating TTS: ${error.message}`);
          return message.reply("There was an error generating the speech.");
        }

        try {
          // Join the voice channel
          const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
          });

          // Play the TTS audio
          const player = createAudioPlayer();
          const resource = createAudioResource(audioFilePath);
          connection.subscribe(player);
          player.play(resource);

          // Clean up after playing
          player.on("finish", () => {
            // Start the timeout to disconnect after 5 minutes if everyone leaves
            if (timeout) clearTimeout(timeout); // Clear existing timeout
            timeout = setTimeout(() => {
              if (connection) {
                connection.destroy(); // Disconnect the bot after 5 minutes
                connection = null; // Reset the connection variable
              }
            }, 5 * 60 * 1000); // 5 minutes
          });
        } catch (error) {
          console.error(
            "Error joining the voice channel or playing audio:",
            error
          );
          message.reply(
            "There was an error trying to join the voice channel or play audio.",
            error
          );
        }
      }
    );
  }
});

// Log In our bot
client.login(TOKEN);
