const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const PANEL_STORE_PATH = path.join(DATA_DIR, "ticket-panels.json");
const OPEN_TICKETS_STORE_PATH = path.join(DATA_DIR, "open-tickets.json");

function ensureStoreFile(filePath) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "{}\n", "utf8");
  }
}

function readJson(filePath) {
  ensureStoreFile(filePath);

  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeJson(filePath, value) {
  ensureStoreFile(filePath);
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function listTicketPanels() {
  return Object.values(readJson(PANEL_STORE_PATH));
}

function getTicketPanel(guildId) {
  return readJson(PANEL_STORE_PATH)[guildId] || null;
}

function saveTicketPanel(panel) {
  const panels = readJson(PANEL_STORE_PATH);
  panels[panel.guildId] = panel;
  writeJson(PANEL_STORE_PATH, panels);
  return panel;
}

function deleteTicketPanel(guildId) {
  const panels = readJson(PANEL_STORE_PATH);
  delete panels[guildId];
  writeJson(PANEL_STORE_PATH, panels);
}

function listOpenTickets() {
  return Object.values(readJson(OPEN_TICKETS_STORE_PATH));
}

function buildOpenTicketKey(guildId, ownerId, type) {
  return `${guildId}:${ownerId}:${type}`;
}

function getOpenTicket(guildId, ownerId, type) {
  const tickets = readJson(OPEN_TICKETS_STORE_PATH);
  return tickets[buildOpenTicketKey(guildId, ownerId, type)] || null;
}

function saveOpenTicket(ticket) {
  const tickets = readJson(OPEN_TICKETS_STORE_PATH);
  tickets[buildOpenTicketKey(ticket.guildId, ticket.ownerId, ticket.type)] = ticket;
  writeJson(OPEN_TICKETS_STORE_PATH, tickets);
  return ticket;
}

function deleteOpenTicket(guildId, ownerId, type) {
  const tickets = readJson(OPEN_TICKETS_STORE_PATH);
  delete tickets[buildOpenTicketKey(guildId, ownerId, type)];
  writeJson(OPEN_TICKETS_STORE_PATH, tickets);
}

function deleteOpenTicketByChannelId(channelId) {
  const tickets = readJson(OPEN_TICKETS_STORE_PATH);
  const nextTickets = Object.fromEntries(
    Object.entries(tickets).filter(([, ticket]) => ticket.channelId !== channelId)
  );
  writeJson(OPEN_TICKETS_STORE_PATH, nextTickets);
}

module.exports = {
  PANEL_STORE_PATH,
  OPEN_TICKETS_STORE_PATH,
  listTicketPanels,
  getTicketPanel,
  saveTicketPanel,
  deleteTicketPanel,
  listOpenTickets,
  getOpenTicket,
  saveOpenTicket,
  deleteOpenTicket,
  deleteOpenTicketByChannelId,
};
