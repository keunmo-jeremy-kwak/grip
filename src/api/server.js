'use strict';

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const app = express();
app.use(cors());
app.use(express.json());

const OUTPUT_DIR = path.resolve(process.env.OUTPUT_DIR || './output');

// output 디렉토리에서 모든 copy.json을 읽어 반환
function loadAllCopies() {
  if (!fs.existsSync(OUTPUT_DIR)) return [];
  return fs.readdirSync(OUTPUT_DIR)
    .filter((dir) => {
      const copyPath = path.join(OUTPUT_DIR, dir, 'copy.json');
      return fs.existsSync(copyPath);
    })
    .map((dir) => {
      const copyPath = path.join(OUTPUT_DIR, dir, 'copy.json');
      return JSON.parse(fs.readFileSync(copyPath, 'utf-8'));
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function updateCopyStatus(broadcastId, status) {
  const copyPath = path.join(OUTPUT_DIR, broadcastId, 'copy.json');
  if (!fs.existsSync(copyPath)) return false;
  const copy = JSON.parse(fs.readFileSync(copyPath, 'utf-8'));
  copy.status = status;
  copy.exportedAt = new Date().toISOString();
  fs.writeFileSync(copyPath, JSON.stringify(copy, null, 2), 'utf-8');
  return true;
}

// GET /api/pending-copies — Figma 플러그인이 호출해 미처리 소재 목록 조회
app.get('/api/pending-copies', (req, res) => {
  try {
    const all = loadAllCopies();
    const pending = all.filter((c) => c.status === 'pending');
    logger.info(`/api/pending-copies 요청 → ${pending.length}건 반환`);
    res.json({ copies: pending });
  } catch (err) {
    logger.error(`pending-copies 오류: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/copies — 전체 소재 목록 (상태 확인용)
app.get('/api/copies', (req, res) => {
  try {
    const all = loadAllCopies();
    res.json({ copies: all });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/mark-exported/:id — Figma 플러그인이 export 완료 후 호출
app.post('/api/mark-exported/:id', (req, res) => {
  const { id } = req.params;
  const updated = updateCopyStatus(id, 'exported');
  if (!updated) {
    logger.warn(`mark-exported: broadcastId [${id}] 를 찾지 못함`);
    return res.status(404).json({ error: 'broadcastId not found' });
  }
  logger.info(`소재 export 완료 처리: [${id}]`);
  res.json({ ok: true, broadcastId: id, status: 'exported' });
});

function start(port) {
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      logger.info(`API 서버 시작: http://localhost:${port}`);
      resolve(server);
    });
  });
}

module.exports = { start };
