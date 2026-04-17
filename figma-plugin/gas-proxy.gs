// ================================================
// 상세페이지 메이커 - Google Apps Script 프록시
// ================================================
// 설치 방법:
// 1. https://script.google.com 접속
// 2. 새 프로젝트 생성
// 3. 이 코드 전체 붙여넣기
// 4. 배포 → 새 배포 → 웹 앱
//    - 다음 사용자로 실행: 나
//    - 액세스 권한: 모든 사용자
// 5. 배포 후 웹앱 URL을 피그마 플러그인 설정에 입력
// ================================================

function doGet(e) {
  const params = e.parameter;
  const sheetId  = params.sheetId;
  const sheetName = params.sheetName || 'Sheet1';
  const keyCol   = params.keyCol || 'key';
  const keyVal   = params.keyVal;

  try {
    if (!sheetId || !keyVal) {
      return jsonResponse({ error: 'sheetId와 keyVal은 필수입니다.' });
    }

    const ss = SpreadsheetApp.openById(sheetId);
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      return jsonResponse({ error: `'${sheetName}' 시트를 찾을 수 없습니다.` });
    }

    const data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      return jsonResponse({ error: '시트에 데이터가 없습니다.' });
    }

    const headers = data[0].map(h => String(h).trim());
    const keyIdx = headers.findIndex(h => h.toLowerCase() === keyCol.toLowerCase());
    if (keyIdx < 0) {
      return jsonResponse({ error: `'${keyCol}' 열을 찾을 수 없습니다. 현재 헤더: ${headers.join(', ')}` });
    }

    const matchRow = data.slice(1).find(row => String(row[keyIdx]).trim() === keyVal.trim());
    if (!matchRow) {
      return jsonResponse({ error: `key='${keyVal}' 에 해당하는 행이 없습니다.` });
    }

    const result = {};
    headers.forEach((h, i) => {
      result[h] = String(matchRow[i] ?? '').trim();
    });

    return jsonResponse({ ok: true, data: result });

  } catch(err) {
    return jsonResponse({ error: err.message });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
