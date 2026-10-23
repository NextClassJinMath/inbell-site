/* 세션 103-C-1 — 상단 바 공용 부품: <script src="…/assets/topbar.js" data-page="owner|parent|get"></script> 자리에 바를 넣는다(모양 = assets/topbar.css).
 * 링크 주소는 이 파일 주소에서 거꾸로 셈 → 공개 사이트(/ · /parent · /get)든 숨김 폴더(/p-…/)든 그 안에서 돈다.
 * owner = 원장 페이지가 장면마다 .lt(밝음) · 탭 .cur 를 직접 바꿈 · 그 밖 = body.dark(어두운 장) 따라 .lt · 지금 페이지 탭 .cur. */
// 103-C-2 — 카톡 안(인앱 브라우저)에서 열리면 폰 기본 브라우저(크롬 · 사파리)로 한 번 다시 열기(학부모 손 0 · 세 페이지 공통)
//   sessionStorage 표시로 되풀이 막음 · 실패해도 이 페이지는 그대로 보임.
try {
  if (/KAKAOTALK/i.test(navigator.userAgent || '') && !sessionStorage.getItem('inbell_open_ext')) {
    sessionStorage.setItem('inbell_open_ext', '1');
    location.href = 'kakaotalk://web/openExternal?url=' + encodeURIComponent(location.href);
  }
} catch (e) { /* 그대로 둠 */ }
(function () {
  var s = document.currentScript; if (!s) return;
  var page = s.getAttribute('data-page') || '';
  var base = new URL('..', s.src).pathname;  // …/assets/topbar.js → …/
  var svg = '<svg width="30" height="30" viewBox="0 80 1024 1024" aria-hidden="true"><defs><clipPath id="chtb"><path d="M352 330 C340 480 306 620 196 742 L828 742 C718 620 684 480 672 330 A172 172 0 0 0 352 330 Z"/><path d="M150 742 H874 a24 24 0 0 1 24 24 v42 a24 24 0 0 1 -24 24 H150 a24 24 0 0 1 -24 -24 v-42 a24 24 0 0 1 24 -24 Z"/><circle cx="512" cy="876" r="88"/></clipPath></defs><rect x="0" y="80" width="1024" height="1024" rx="230" fill="#1d1d76"/><g clip-path="url(#chtb)"><rect x="0" y="80" width="1024" height="1200" fill="#ffffff"/><polygon points="0,287 1024,1021 1024,1200 0,1200" fill="#d6d6e6"/></g></svg>';
  var tabs = [['', '원장님께'], ['parent', '학부모님께'], ['get', '다운로드']];
  var cur = page === 'owner' ? null : page;
  var h = '<div class="tbar' + (page === 'owner' ? '' : ' lt') + '" id="tbar"><div class="tb-in"><a href="' + base + '" class="tb-home" aria-label="인벨 처음으로">' + svg +
    '<span class="tb-name">인벨</span></a><nav class="tabs" aria-label="페이지">';
  tabs.forEach(function (t) {
    var on = cur !== null && t[0] === cur;
    h += '<a href="' + base + t[0] + '" data-r="' + t[0] + '"' + (on ? ' class="cur" aria-current="page"' : '') + '>' + t[1] + '</a>';
  });
  h += '</nav></div></div>';
  s.insertAdjacentHTML('beforebegin', h);
  if (page !== 'owner') {
    var bar = document.getElementById('tbar');
    var f = function () { bar.classList.toggle('lt', !document.body.classList.contains('dark')); };
    new MutationObserver(f).observe(document.body, { attributes: true, attributeFilter: ['class'] }); f();
  }
})();
