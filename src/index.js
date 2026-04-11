'use strict';

require('dotenv').config();

const cron = require('node-cron');
const { fetchUpcomingBroadcasts } = require('./crawler/gripCrawler');
const { generateCopy } = require('./generator/copyGenerator');
const { isProcessed, markProcessed } = require('./utils/state');
const apiServer = require('./api/server');
const logger = require('./utils/logger');

const SCHEDULE_URL = process.env.GRIP_LIVE_SCHEDULE_URL || 'https://grip.show/lives';
const CRAWL_INTERVAL = process.env.CRAWL_INTERVAL || '0 0,12,18 * * *';
const API_PORT = parseInt(process.env.API_PORT || '3000', 10);

async function runPipeline() {
  logger.info('=== 파이프라인 실행 시작 ===');

  let broadcasts;
  try {
    broadcasts = await fetchUpcomingBroadcasts(SCHEDULE_URL);
  } catch (err) {
    logger.error(`크롤링 실패: ${err.message}`);
    return;
  }

  const newBroadcasts = broadcasts.filter((b) => !isProcessed(b.broadcastId));
  logger.info(`신규 방송: ${newBroadcasts.length}건 (전체 ${broadcasts.length}건 중)`);

  for (const broadcast of newBroadcasts) {
    try {
      await generateCopy(broadcast);
      markProcessed(broadcast.broadcastId);
    } catch (err) {
      logger.error(`소재 생성 실패 [${broadcast.broadcastId}]: ${err.message}`);
    }
  }

  logger.info('=== 파이프라인 실행 완료 ===');
}

async function main() {
  const isOnce = process.argv.includes('--once');

  // Express API 서버 시작 (스케줄 모드에서만 항상 실행)
  if (!isOnce) {
    await apiServer.start(API_PORT);
  }

  if (isOnce) {
    // --once 플래그: 즉시 1회 실행 후 종료
    logger.info('1회 실행 모드 (--once)');
    await runPipeline();
    process.exit(0);
  } else {
    // 스케줄 모드: 시작 시 1회 즉시 실행 + 이후 cron 주기 실행
    logger.info(`스케줄 모드 시작. 주기: "${CRAWL_INTERVAL}"`);
    await runPipeline();
    cron.schedule(CRAWL_INTERVAL, runPipeline);
  }
}

main().catch((err) => {
  logger.error(`초기화 실패: ${err.message}`);
  process.exit(1);
});
