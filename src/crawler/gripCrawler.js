'use strict';

const { chromium } = require('playwright');
const logger = require('../utils/logger');

// ---------------------------------------------------------------
// grip.show DOM 변경 시 이 상수만 수정하면 됩니다.
// ---------------------------------------------------------------
const SELECTORS = {
  // 라이브예고 카드 목록 컨테이너
  broadcastCard: '[data-testid="live-schedule-item"], .live-schedule-item, .schedule-card',
  // 방송 제목
  title: '[data-testid="broadcast-title"], .broadcast-title, h3',
  // 셀러 이름
  sellerName: '[data-testid="seller-name"], .seller-name, .host-name',
  // 방송 예정 시간
  scheduledAt: '[data-testid="scheduled-at"], .scheduled-time, time',
  // 썸네일 이미지
  thumbnail: 'img[data-testid="thumbnail"], .thumbnail img, img.broadcast-image',
  // 상품 이름 목록
  productName: '[data-testid="product-name"], .product-name, .product-title',
};

// ---------------------------------------------------------------

async function fetchUpcomingBroadcasts(scheduleUrl) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  // 불필요한 리소스 차단으로 크롤링 속도 향상
  await page.route('**/*.{woff,woff2,ttf,otf}', (route) => route.abort());
  await page.route('**/analytics/**', (route) => route.abort());
  await page.route('**/ads/**', (route) => route.abort());

  const broadcasts = [];

  try {
    logger.info(`크롤링 시작: ${scheduleUrl}`);
    await page.goto(scheduleUrl, { waitUntil: 'networkidle', timeout: 30000 });

    // 카드 목록이 로드될 때까지 대기 (가장 첫 번째 셀렉터 시도)
    const selectorList = SELECTORS.broadcastCard.split(', ');
    let foundSelector = null;
    for (const sel of selectorList) {
      const count = await page.locator(sel).count();
      if (count > 0) {
        foundSelector = sel;
        break;
      }
    }

    if (!foundSelector) {
      logger.warn('라이브예고 카드를 찾지 못했습니다. SELECTORS를 확인하세요.');
      return broadcasts;
    }

    const cards = await page.locator(foundSelector).all();
    logger.info(`발견된 라이브예고 카드: ${cards.length}개`);

    for (const card of cards) {
      try {
        const broadcast = await extractBroadcastData(card, page);
        if (broadcast) broadcasts.push(broadcast);
      } catch (err) {
        logger.warn(`카드 파싱 실패 (건너뜀): ${err.message}`);
      }
    }
  } catch (err) {
    logger.error(`크롤링 오류: ${err.message}`);
  } finally {
    await browser.close();
  }

  logger.info(`크롤링 완료: ${broadcasts.length}건`);
  return broadcasts;
}

async function extractBroadcastData(card, page) {
  // href에서 방송 ID 추출
  const href = await card.getAttribute('href').catch(() => null)
    || await card.locator('a').first().getAttribute('href').catch(() => null)
    || '';
  const broadcastId = extractIdFromHref(href);
  if (!broadcastId) return null;

  const title = await getText(card, SELECTORS.title);
  const sellerName = await getText(card, SELECTORS.sellerName);
  const scheduledAt = await getText(card, SELECTORS.scheduledAt)
    || await card.locator('time').first().getAttribute('datetime').catch(() => null);
  const thumbnailUrl = await card.locator(SELECTORS.thumbnail).first().getAttribute('src').catch(() => null);
  const productEls = await card.locator(SELECTORS.productName).all();
  const productNames = await Promise.all(productEls.map((el) => el.innerText().catch(() => '')));

  return {
    broadcastId,
    title: title || '(제목 없음)',
    sellerName: sellerName || '(셀러 미상)',
    scheduledAt: scheduledAt || null,
    thumbnailUrl: thumbnailUrl || null,
    productNames: productNames.filter(Boolean),
    broadcastUrl: href ? `https://grip.show${href}` : `https://grip.show/live/${broadcastId}`,
  };
}

async function getText(locator, selectorStr) {
  for (const sel of selectorStr.split(', ')) {
    try {
      const el = locator.locator(sel).first();
      const count = await el.count();
      if (count > 0) return (await el.innerText()).trim();
    } catch (_) {}
  }
  return null;
}

function extractIdFromHref(href) {
  if (!href) return null;
  // /live/abc123 또는 /lives/abc123 패턴에서 ID 추출
  const match = href.match(/\/live[s]?\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

module.exports = { fetchUpcomingBroadcasts };
