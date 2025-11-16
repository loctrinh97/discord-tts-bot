// src/config.js
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

// Chọn lệnh Python phù hợp
const PYTHON_CMD = process.platform === "win32" ? "python" : "python3";

// Danh sách Valorant maps
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
  PYTHON_CMD,
  valorantMaps,
};
