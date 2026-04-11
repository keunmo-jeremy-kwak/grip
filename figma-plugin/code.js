// Figma 플러그인 메인 스레드 (code.js)
// Figma Plugin API로 텍스트 레이어 업데이트 및 PNG 내보내기를 담당합니다.

figma.showUI(__html__, { width: 420, height: 620, title: 'GripAds 소재 자동화' });

// UI로부터 메시지 수신
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'apply-copy') {
    await applyCopyToFrame(msg.copy);
  } else if (msg.type === 'close') {
    figma.closePlugin();
  }
};

async function applyCopyToFrame(copy) {
  // 현재 선택된 노드 또는 현재 페이지의 첫 번째 프레임 사용
  let targetFrame = figma.currentPage.selection[0];
  if (!targetFrame || targetFrame.type !== 'FRAME') {
    // 선택된 프레임이 없으면 현재 페이지에서 'ad-frame' 이름의 프레임 탐색
    targetFrame = figma.currentPage.findOne(
      (n) => n.type === 'FRAME' && n.name === 'ad-frame'
    );
  }

  if (!targetFrame) {
    figma.ui.postMessage({
      type: 'error',
      message: '대상 프레임을 찾지 못했습니다.\n"ad-frame" 이름의 프레임을 선택하거나, 프레임을 직접 선택 후 다시 시도하세요.',
    });
    return;
  }

  figma.ui.postMessage({ type: 'status', message: '텍스트 레이어 업데이트 중...' });

  // ---------------------------------------------------------------
  // 텍스트 레이어 이름 → copy 필드 매핑
  // Figma 템플릿에서 아래 이름으로 레이어를 설정해야 합니다.
  // ---------------------------------------------------------------
  const TEXT_LAYER_MAP = {
    'ad-title': copy.title,
    'ad-body': copy.body,
    'ad-badge': copy.badge || '',
    'ad-cta': copy.cta,
    'ad-seller': copy.sellerName || '',
    'ad-scheduled-at': copy.scheduledAt
      ? formatDate(copy.scheduledAt)
      : '',
  };

  // 폰트 로드 후 텍스트 업데이트
  const textNodes = targetFrame.findAll((n) => n.type === 'TEXT');
  for (const node of textNodes) {
    const newText = TEXT_LAYER_MAP[node.name];
    if (newText !== undefined) {
      await figma.loadFontAsync(node.fontName);
      node.characters = newText;
    }
  }

  // 썸네일 이미지 삽입 (ad-thumbnail 레이어)
  if (copy.thumbnailUrl) {
    figma.ui.postMessage({ type: 'status', message: '썸네일 이미지 삽입 중...' });
    figma.ui.postMessage({ type: 'fetch-image', url: copy.thumbnailUrl });
    // 이미지는 UI에서 fetch → ArrayBuffer로 전달받아 처리 (see 'image-data' handler below)
  } else {
    await exportAndSend(targetFrame, copy.broadcastId);
  }
}

// UI에서 이미지 데이터를 받아 썸네일 레이어에 삽입
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'apply-copy') {
    await applyCopyToFrame(msg.copy);
  } else if (msg.type === 'image-data') {
    const thumbnailNode = figma.currentPage.selection[0]?.findOne?.(
      (n) => n.name === 'ad-thumbnail'
    );
    if (thumbnailNode && thumbnailNode.type === 'RECTANGLE') {
      const image = figma.createImage(new Uint8Array(msg.data));
      thumbnailNode.fills = [{ type: 'IMAGE', imageHash: image.hash, scaleMode: 'FILL' }];
    }
    // 썸네일 처리 후 export
    const frame = figma.currentPage.selection[0];
    if (frame) await exportAndSend(frame, msg.broadcastId);
  } else if (msg.type === 'close') {
    figma.closePlugin();
  }
};

async function exportAndSend(frame, broadcastId) {
  figma.ui.postMessage({ type: 'status', message: 'PNG 내보내기 중...' });
  try {
    const bytes = await frame.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 2 } });
    figma.ui.postMessage({
      type: 'export-done',
      data: Array.from(bytes),
      broadcastId,
      filename: `${broadcastId}_ad.png`,
    });
  } catch (err) {
    figma.ui.postMessage({ type: 'error', message: `PNG 내보내기 실패: ${err.message}` });
  }
}

function formatDate(isoString) {
  try {
    const d = new Date(isoString);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
  } catch {
    return isoString;
  }
}
