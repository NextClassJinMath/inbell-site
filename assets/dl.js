/* 세션 102-M — 「인벨 다운로드」 버튼 하나 · 기기 인식(대장님 10-23)
 *  Android → Google Play · iPhone/iPad → App Store · Windows → PC 프로그램(PC_SETUP_URL · 비어 있으면 /get#pc) · Mac · 그 밖 → /get
 *  쓰는 법: <div class="dlbtn"></div> 자리마다 버튼 + 작은 글(「Android용 · Google Play」) + 「다른 기기 ›」(/get) 이 들어간다.
 *  /get 페이지는 window.INBELL_DL.os 로 지금 기기 줄을 맨 위에 진하게.
 *  시험: 주소 끝 ?os=android|ios|windows|mac 로 인식 결과를 강제(확인용 · 공개판에도 남아 있어도 무해).
 */
(function () {
  // PC 설치 파일 주소 — 공개 때 이 한 줄만 바꾼다(빈 칸 = /get#pc). 비밀 주소는 이 공개 저장소에 절대 적지 않는다.
  var PC_SETUP_URL = '';
  var PLAY = 'https://play.google.com/store/apps/details?id=com.jinuri.inbell';
  var APPSTORE = 'https://apps.apple.com/kr/app/id6818784496';
  var ua = navigator.userAgent || '';
  var force = (new URLSearchParams(location.search).get('os') || '').toLowerCase();
  var os = force || (/android/i.test(ua) ? 'android'
    : /iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1 && !/chrome\/|crios|edg\/|firefox/i.test(ua)) ? 'ios'
    : /windows/i.test(ua) ? 'windows'
    : /macintosh|mac os x/i.test(ua) ? 'mac' : 'other');
  var T = {
    android: { href: PLAY, label: 'Android용 · Google Play', ext: true },
    ios: { href: APPSTORE, label: 'iPhone · iPad용 · App Store', ext: true },
    windows: { href: PC_SETUP_URL || '/get#pc', label: PC_SETUP_URL ? 'Windows용 · PC 프로그램' : 'Windows용 · PC 프로그램(곧 열려요)', ext: false },
    mac: { href: '/get', label: 'Mac에서는 휴대폰 앱으로 써요', ext: false },
    other: { href: '/get', label: '휴대폰 · 컴퓨터 받는 곳', ext: false }
  };
  var t = T[os] || T.other;
  window.INBELL_DL = { os: os, PLAY: PLAY, APPSTORE: APPSTORE, PC_SETUP_URL: PC_SETUP_URL };
  function fill() {
    document.querySelectorAll('.dlbtn').forEach(function (w) {
      if (w.dataset.done) return; w.dataset.done = '1';
      var a = document.createElement('a'); a.className = 'dl-main'; a.href = t.href; a.textContent = '인벨 다운로드';
      if (t.ext) { a.target = '_blank'; a.rel = 'noopener'; }
      var row = document.createElement('div'); row.className = 'dl-sub';
      var s = document.createElement('span'); s.textContent = t.label;
      var o = document.createElement('a'); o.href = '/get'; o.textContent = '다른 기기 ›';
      row.appendChild(s); row.appendChild(o);
      w.appendChild(a); w.appendChild(row);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fill); else fill();
})();
