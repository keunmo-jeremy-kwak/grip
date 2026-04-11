'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '../../data');
const STATE_FILE = path.join(DATA_DIR, 'processed.json');

function loadState() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(STATE_FILE)) return { processed: [] };
  return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

function isProcessed(broadcastId) {
  const state = loadState();
  return state.processed.includes(broadcastId);
}

function markProcessed(broadcastId) {
  const state = loadState();
  if (!state.processed.includes(broadcastId)) {
    state.processed.push(broadcastId);
    saveState(state);
  }
}

module.exports = { isProcessed, markProcessed };
