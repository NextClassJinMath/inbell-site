/* 세션 102-M — 「인벨 다운로드」 버튼 하나 · 기기 인식(대장님 10-23)
 *  Android → Google Play · iPhone/iPad → App Store · Windows → PC 프로그램(PC_SETUP_URL · 비어 있으면 /get#pc) · Mac · 그 밖 → /get
 *  쓰는 법: <div class="dlbtn"></div> 자리마다 버튼 + 작은 글(기기 이름만 · 대장님 10-23 · 배지 없음) + 「다른 기기 ›」(/get) 이 들어간다.
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
    android: { href: PLAY, text: 'Google Play에서 인벨 받기', ext: true, sub: '다른 기기로 받기 ›' },
    ios: { href: APPSTORE, text: 'App Store에서 인벨 받기', ext: true, sub: '다른 기기로 받기 ›' },
    windows: PC_SETUP_URL ? { href: PC_SETUP_URL, text: 'Windows용 인벨 받기', ext: false, sub: '다른 기기로 받기 ›' }
                          : { off: true, text: 'Windows용은 곧 열려요', sub: '다른 기기로 받기 ›' },
    mac: { off: true, text: 'Mac용은 곧 열려요', sub: '다른 기기로 받기 ›' },
    other: { href: '/get', text: '인벨 받기', ext: false, sub: '' }
  };
  var t = T[os] || T.other;
  window.INBELL_DL = { os: os, PLAY: PLAY, APPSTORE: APPSTORE, PC_SETUP_URL: PC_SETUP_URL };
  function fill() {
    document.querySelectorAll('.dlbtn').forEach(function (w) {
      if (w.dataset.done) return; w.dataset.done = '1';
      var a;
      if (t.off) { a = document.createElement('span'); a.className = 'dl-main off'; a.setAttribute('aria-disabled', 'true'); }
      else { a = document.createElement('a'); a.className = 'dl-main'; a.href = t.href; if (t.ext) { a.target = '_blank'; a.rel = 'noopener'; } }
      a.textContent = t.text;
      w.appendChild(a);
      if (t.sub) {
        var row = document.createElement('div'); row.className = 'dl-sub';
        var o = document.createElement('a'); o.href = '/get'; o.textContent = t.sub;
        row.appendChild(o); w.appendChild(row);
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fill); else fill();
})();
