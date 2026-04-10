const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const STORE_PATH = path.join(DATA_DIR, "genshin-panels.json");

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, "{}\n", "utf8");
  }
}

function readPanels() {
  ensureStore();

  try {
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writePanels(panels) {
  ensureStore();
  fs.writeFileSync(STORE_PATH, `${JSON.stringify(panels, null, 2)}\n`, "utf8");
}

function listPanels() {
  return Object.values(readPanels());
}

function getPanel(guildId) {
  return readPanels()[guildId] || null;
}

function savePanel(panel) {
  const panels = readPanels();
  panels[panel.guildId] = panel;
  writePanels(panels);
  return panel;
}

function deletePanel(guildId) {
  const panels = readPanels();
  delete panels[guildId];
  writePanels(panels);
}

module.exports = {
  STORE_PATH,
  listPanels,
  getPanel,
  savePanel,
  deletePanel,
};
