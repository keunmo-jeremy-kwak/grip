'use strict';

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// 시스템 프롬프트 — prompt caching 적용 (변경 없는 내용이므로 비용 절감)
const SYSTEM_PROMPT = `당신은 라이브커머스 광고 전문 카피라이터입니다. 카카오톡 메시지 광고 소재를 작성합니다.

## 출력 규칙 (반드시 준수)
- title: 15자 이내. 방송의 핵심 혜택을 담은 클릭 유도 문구. 이모지 사용 가능.
- body: 45자 이내. 셀러/상품 정보와 유입 유도 문구를 자연스럽게 연결.
- badge: 5자 이내. 할인/혜택 키워드 (예: 특가, 1+1, 쿠폰, 무료). 해당 없으면 null.
- cta: 8자 이내. CTA 버튼 텍스트 (예: 방송 보러 가기, 지금 확인하기, 알림 설정).

## 응답 형식
반드시 아래 JSON 형식만 반환하세요. 마크다운 코드블록 없이 순수 JSON만 출력하세요.
{
  "title": "...",
  "body": "...",
  "badge": "..." | null,
  "cta": "..."
}`;

async function generateCopy(broadcastInfo) {
  const { broadcastId, title, sellerName, scheduledAt, productNames, broadcastUrl, thumbnailUrl } = broadcastInfo;

  const scheduledStr = scheduledAt
    ? new Date(scheduledAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '일정 미정';

  const productsStr = productNames && productNames.length > 0
    ? productNames.slice(0, 3).join(', ')
    : '다양한 상품';

  const userPrompt = `다음 라이브 방송의 카카오톡 메시지 광고 소재를 작성하세요.

방송 제목: ${title}
셀러 이름: ${sellerName}
방송 예정 시간: ${scheduledStr}
주요 상품: ${productsStr}`;

  logger.info(`Claude API 호출: [${broadcastId}] ${title}`);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: userPrompt }],
  });

  const raw = response.content[0].text.trim();
  let generated;
  try {
    generated = JSON.parse(raw);
  } catch {
    logger.warn('JSON 파싱 실패, 재시도 없이 기본값 사용');
    generated = { title: title.substring(0, 15), body: `${sellerName}의 라이브 방송에 초대합니다.`, badge: null, cta: '방송 보러 가기' };
  }

  const copy = {
    broadcastId,
    title: generated.title || '',
    body: generated.body || '',
    badge: generated.badge || null,
    cta: generated.cta || '방송 보러 가기',
    broadcastTitle: title,
    sellerName,
    scheduledAt: scheduledAt || null,
    thumbnailUrl: thumbnailUrl || null,
    broadcastUrl,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  saveCopy(copy);
  logger.info(`소재 생성 완료: [${broadcastId}] title="${copy.title}"`);
  return copy;
}

function saveCopy(copy) {
  const outputDir = path.resolve(process.env.OUTPUT_DIR || './output', copy.broadcastId);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'copy.json'), JSON.stringify(copy, null, 2), 'utf-8');
}

module.exports = { generateCopy };
