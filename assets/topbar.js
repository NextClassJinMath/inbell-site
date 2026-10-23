/* 세션 103-C-1 — 상단 바 공용 부품: <script src="…/assets/topbar.js" data-page="owner|parent|get"></script> 자리에 바를 넣는다(모양 = assets/topbar.css).
 * 링크 주소는 이 파일 주소에서 거꾸로 셈 → 공개 사이트(/ · /parent · /get)든 숨김 폴더(/p-…/)든 그 안에서 돈다.
 * owner = 원장 페이지가 장면마다 .lt(밝음) · 탭 .cur 를 직접 바꿈 · 그 밖 = body.dark(어두운 장) 따라 .lt · 지금 페이지 탭 .cur. */
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
    var dl = t[0] === 'get';
    var label = dl ? '<svg class="dl-ic" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v13M6 11l6 6 6-6"/></svg><span class="dl-tx" data-t="' + t[1] + '">' + t[1] + '</span>' : t[1];
    var cls = (on ? 'cur' : '') + (dl ? (on ? ' ' : '') + 'dl-tab' : '');
    h += '<a href="' + base + t[0] + '" data-r="' + t[0] + '"' + (cls ? ' class="' + cls + '"' : '') + (on ? ' aria-current="page"' : '') + '>' + label + '</a>';
  });
  h += '</nav></div></div>';
  s.insertAdjacentHTML('beforebegin', h);
  // 103-C-5 — 위 탭 「다운로드」 빛(45° 사선 · 글자 폭 40% · 1.2초) · 뜬 뒤 1.5초에 한 번, 그 뒤 7초마다 · /get(지금 여기)과 「동작 줄이기」에서는 없음
  var dlt = document.querySelector('#tbar .dl-tab');
  if (dlt && page !== 'get' && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    var run = function () { dlt.classList.remove('shine'); void dlt.offsetWidth; dlt.classList.add('shine'); setTimeout(function () { dlt.classList.remove('shine'); }, 1300); };
    setTimeout(function () { run(); setInterval(run, 7000); }, 1500);
  }
  if (page !== 'owner') {
    var bar = document.getElementById('tbar');
    var f = function () { bar.classList.toggle('lt', !document.body.classList.contains('dark')); };
    new MutationObserver(f).observe(document.body, { attributes: true, attributeFilter: ['class'] }); f();
  }
})();
