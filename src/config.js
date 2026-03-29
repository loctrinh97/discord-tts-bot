const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const TOKEN = process.env.DISCORD_TOKEN || process.env.CLIENT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID || process.env.APPLICATION_ID;
const GUILD_ID = process.env.GUILD_ID;

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

module.exports = {
  TOKEN,
  CLIENT_ID,
  GUILD_ID,
  valorantMaps,
};
