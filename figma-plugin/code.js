// 상세페이지 메이커 - Figma Plugin Main Thread
figma.showUI(__html__, { width: 440, height: 660, title: '상세페이지 메이커' });

const W = 800; // 캔버스 너비 (상세페이지 표준)
let FONT = 'Inter'; // 로드된 폰트명 (한국어 폰트 우선)

// ── 유틸 ──────────────────────────────────────────────
function rgb(r, g, b) { return { r: r / 255, g: g / 255, b: b / 255 }; }
function solid(r, g, b) { return [{ type: 'SOLID', color: rgb(r, g, b) }]; }
function val(data, key) { return (data[key] && data[key].trim()) ? data[key] : `{{${key}}}`; }

async function loadFonts() {
  try {
    await figma.loadFontAsync({ family: 'Noto Sans KR', style: 'Regular' });
    await figma.loadFontAsync({ family: 'Noto Sans KR', style: 'Bold' });
    FONT = 'Noto Sans KR';
  } catch {
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
    await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
    FONT = 'Inter';
  }
}

function makeFrame(name, w, h, bgRgb) {
  const f = figma.createFrame();
  f.name = name;
  f.resize(w, h);
  f.clipsContent = true;
  f.fills = bgRgb ? solid(...bgRgb) : [{ type: 'SOLID', color: rgb(255, 255, 255) }];
  return f;
}

function makeText(content, size, bold, colorRgb, maxW) {
  const t = figma.createText();
  t.fontName = { family: FONT, style: bold ? 'Bold' : 'Regular' };
  t.characters = content || '';
  t.fontSize = size;
  t.fills = [{ type: 'SOLID', color: rgb(...colorRgb) }];
  if (maxW) {
    t.textAutoResize = 'HEIGHT';
    t.resize(maxW, t.height);
  }
  return t;
}

function imgPlaceholder(name, x, y, w, h, bgRgb, label) {
  const f = makeFrame(name, w, h, bgRgb);
  f.x = x; f.y = y;
  const lbl = makeText(label || `이미지: {{${name}}}`, 11, false, [160, 160, 160], w - 20);
  lbl.x = 10; lbl.y = Math.max(10, h / 2 - 10);
  f.appendChild(lbl);
  return f;
}

// ── 9개 섹션 생성 함수 ────────────────────────────────

// 01. 공지/프로모션 배너
function sec01(data) {
  const f = makeFrame('01. 공지/프로모션 배너', W, 80, [255, 243, 205]);

  const txt = makeText(val(data, 'notice_text'), 15, false, [120, 90, 0], 560);
  txt.x = 40; txt.y = 22;
  f.appendChild(txt);

  if (data['promo_badge']) {
    const badge = makeFrame('promo_badge', 110, 40, [220, 50, 50]);
    badge.cornerRadius = 20;
    badge.x = W - 150; badge.y = 20;
    const bt = makeText(val(data, 'promo_badge'), 13, true, [255, 255, 255]);
    bt.x = 12; bt.y = 10;
    badge.appendChild(bt);
    f.appendChild(badge);
  }
  return f;
}

// 02. Hook (히어로)
function sec02(data) {
  const f = makeFrame('02. Hook (히어로)', W, 500, [40, 40, 55]);

  const img = imgPlaceholder('hero_image', 0, 0, W, 500, [55, 55, 75],
    `히어로 이미지 URL: {{hero_image}}`);
  f.appendChild(img);

  // 그라데이션 오버레이 (어두운 반투명 박스)
  const overlay = makeFrame('overlay', W, 180, [0, 0, 0]);
  overlay.opacity = 0.65;
  overlay.x = 0; overlay.y = 320;
  f.appendChild(overlay);

  const tagline = makeText(val(data, 'tagline'), 30, true, [255, 255, 255], 720);
  tagline.x = 40; tagline.y = 350;
  f.appendChild(tagline);

  return f;
}

// 03. 공감 (Pain Point)
function sec03(data) {
  const f = makeFrame('03. 공감 (Pain Point)', W, 340, [248, 248, 250]);

  const label = makeText('이런 고민 있으셨나요?', 14, false, [150, 90, 210]);
  label.x = 40; label.y = 55;
  f.appendChild(label);

  const pain = makeText(val(data, 'pain_point'), 26, true, [25, 25, 30], 720);
  pain.x = 40; pain.y = 90;
  f.appendChild(pain);

  return f;
}

// 04. 솔루션 (특징 3가지)
function sec04(data) {
  const f = makeFrame('04. 솔루션 (특징)', W, 480, [255, 255, 255]);

  const title = makeText('이 옷이 특별한 이유', 22, true, [25, 25, 30]);
  title.x = 40; title.y = 40;
  f.appendChild(title);

  const colW = 220;
  const gap = 20;
  const startX = (W - colW * 3 - gap * 2) / 2;

  for (let i = 1; i <= 3; i++) {
    const x = startX + (i - 1) * (colW + gap);

    const imgBox = imgPlaceholder(
      `feature_${i}_image`, x, 100, colW, 160, [225, 215, 255],
      `특징 ${i} 이미지`
    );
    f.appendChild(imgBox);

    const ftitle = makeText(val(data, `feature_${i}_title`), 16, true, [25, 25, 30], colW);
    ftitle.x = x; ftitle.y = 278;
    f.appendChild(ftitle);

    const fdesc = makeText(val(data, `feature_${i}_desc`), 13, false, [85, 85, 90], colW);
    fdesc.x = x; fdesc.y = 314;
    f.appendChild(fdesc);
  }
  return f;
}

// 05. 증거 (소재/인증)
function sec05(data) {
  const f = makeFrame('05. 증거 (소재/인증)', W, 380, [240, 244, 255]);

  const title = makeText('안전하고 믿을 수 있는 소재', 22, true, [25, 60, 160]);
  title.x = 40; title.y = 40;
  f.appendChild(title);

  const fabric = makeText(val(data, 'fabric'), 15, false, [50, 55, 90], 380);
  fabric.x = 40; fabric.y = 95;
  f.appendChild(fabric);

  const certImg = imgPlaceholder('cert_image', 480, 80, 280, 250, [195, 210, 245], '인증서 이미지');
  f.appendChild(certImg);

  return f;
}

// 06. 사이즈 가이드
function sec06(data) {
  const f = makeFrame('06. 사이즈 가이드', W, 380, [255, 255, 255]);

  const title = makeText('사이즈 가이드', 22, true, [25, 25, 30]);
  title.x = 40; title.y = 40;
  f.appendChild(title);

  const sizeImg = imgPlaceholder('size_chart_image', 40, 90, 720, 260, [235, 235, 240], '사이즈 차트 이미지');
  f.appendChild(sizeImg);

  return f;
}

// 07. 후기/신뢰
function sec07(data) {
  const f = makeFrame('07. 후기 / 신뢰', W, 540, [255, 248, 248]);

  const title = makeText('실제 구매 후기', 22, true, [25, 25, 30]);
  title.x = 40; title.y = 40;
  f.appendChild(title);

  const cardW = 220;
  const gap = 20;
  const startX = (W - cardW * 3 - gap * 2) / 2;

  for (let i = 1; i <= 3; i++) {
    const x = startX + (i - 1) * (cardW + gap);

    const card = makeFrame(`review_${i}`, cardW, 400, [255, 255, 255]);
    card.cornerRadius = 12;
    card.effects = [{
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.09 },
      offset: { x: 0, y: 3 },
      radius: 10,
      spread: 0,
      visible: true,
      blendMode: 'NORMAL'
    }];
    card.x = x; card.y = 100;

    const rimg = imgPlaceholder(`review_${i}_image`, 0, 0, cardW, 160, [240, 228, 228], `후기 ${i} 이미지`);
    card.appendChild(rimg);

    const rtxt = makeText(val(data, `review_${i}_text`), 13, false, [50, 50, 55], cardW - 32);
    rtxt.x = 16; rtxt.y = 176;
    card.appendChild(rtxt);

    const rauthor = makeText(val(data, `review_${i}_author`), 12, true, [150, 90, 90], cardW - 32);
    rauthor.x = 16; rauthor.y = 350;
    card.appendChild(rauthor);

    f.appendChild(card);
  }
  return f;
}

// 08. CTA (구매 유도)
function sec08(data) {
  const f = makeFrame('08. CTA (구매 유도)', W, 200, [25, 25, 38]);

  const discount = makeText(val(data, 'discount'), 16, false, [195, 175, 255]);
  discount.x = 40; discount.y = 48;
  f.appendChild(discount);

  const price = makeText(val(data, 'price'), 38, true, [255, 255, 255]);
  price.x = 40; price.y = 76;
  f.appendChild(price);

  const btn = makeFrame('cta_button', 210, 76, [115, 75, 215]);
  btn.cornerRadius = 38;
  btn.x = W - 255; btn.y = 62;
  const btnTxt = makeText('지금 구매하기', 18, true, [255, 255, 255]);
  btnTxt.x = 26; btnTxt.y = 22;
  btn.appendChild(btnTxt);
  f.appendChild(btn);

  const urlNote = makeText(`구매링크: ${val(data, 'cta_url')}`, 11, false, [120, 115, 145], 400);
  urlNote.x = 40; urlNote.y = 164;
  f.appendChild(urlNote);

  return f;
}

// 09. 크로스 광고
function sec09(data) {
  const f = makeFrame('09. 크로스 광고', W, 180, [250, 250, 252]);

  // 상단 구분선
  const line = makeFrame('divider', W, 1, [220, 220, 225]);
  line.x = 0; line.y = 0;
  f.appendChild(line);

  const adLabel = makeText('광고', 11, false, [170, 170, 175]);
  adLabel.x = 40; adLabel.y = 18;
  f.appendChild(adLabel);

  const adImg = imgPlaceholder('ad_image', 40, 40, 160, 110, [215, 215, 220], '광고 이미지');
  f.appendChild(adImg);

  const adTitle = makeText(val(data, 'ad_title'), 16, true, [25, 25, 30], 520);
  adTitle.x = 220; adTitle.y = 55;
  f.appendChild(adTitle);

  const adUrl = makeText(val(data, 'ad_url'), 12, false, [60, 100, 210], 520);
  adUrl.x = 220; adUrl.y = 90;
  f.appendChild(adUrl);

  return f;
}

// ── 템플릿 생성 ────────────────────────────────────────
async function createTemplate(data) {
  await loadFonts();

  const sections = [
    sec01(data), sec02(data), sec03(data),
    sec04(data), sec05(data), sec06(data),
    sec07(data), sec08(data), sec09(data),
  ];

  // 전체 높이 계산 후 메인 프레임 생성
  const totalH = sections.reduce((sum, s) => sum + s.height, 0);
  const main = makeFrame(
    `상세페이지_${data['key'] || new Date().toISOString().slice(0, 10)}`,
    W, totalH, [255, 255, 255]
  );

  let y = 0;
  sections.forEach(s => {
    s.x = 0; s.y = y;
    y += s.height;
    main.appendChild(s);
  });

  figma.currentPage.appendChild(main);
  figma.viewport.scrollAndZoomIntoView([main]);

  figma.ui.postMessage({ type: 'template-created', nodeId: main.id, nodeName: main.name });
}

// ── 이미지 내보내기 ────────────────────────────────────
async function exportAsImage(nodeId) {
  const node = figma.getNodeById(nodeId);
  if (!node) {
    figma.ui.postMessage({ type: 'error', message: '노드를 찾을 수 없습니다. Figma에서 템플릿 프레임을 선택하세요.' });
    return;
  }
  try {
    const bytes = await node.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 2 } });
    figma.ui.postMessage({ type: 'image-export-done', data: Array.from(bytes), filename: `${node.name}.png` });
  } catch (e) {
    figma.ui.postMessage({ type: 'error', message: `내보내기 실패: ${e.message}` });
  }
}

// ── 선택 변경 감지 ─────────────────────────────────────
figma.on('selectionchange', () => {
  const sel = figma.currentPage.selection;
  if (sel.length === 1 && sel[0].type === 'FRAME') {
    figma.ui.postMessage({ type: 'selection-changed', nodeId: sel[0].id, nodeName: sel[0].name });
  } else {
    figma.ui.postMessage({ type: 'selection-changed', nodeId: null, nodeName: null });
  }
});

// ── 메시지 핸들러 ──────────────────────────────────────
figma.ui.onmessage = async (msg) => {
  switch (msg.type) {
    case 'create-template':
      await createTemplate(msg.data || {});
      break;
    case 'export-image':
      await exportAsImage(msg.nodeId);
      break;
    case 'close':
      figma.closePlugin();
      break;
  }
};
