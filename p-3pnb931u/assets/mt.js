/* 세션 103-C-5 — 휴대폰 · 태블릿 새 자(원장 · 학부모 공통 · 짝 = assets/mt.css)
 *  ① html 에 .mt(1023 이하) · .mt-ph(760 이하) · .mt-tb(761~1023) ② 첫 장 = 확대 없이 제목 → 알약 → 휴대폰 그림(보이는 높이로 맞춤 · 가운데) · 위 여백 규칙
 *  ③ 「▶ 누르면 시작」 안내 4초 뒤 사라짐 · 한 번 뒤엔 다시 안 나옴 ④ 마지막 장 오른쪽 아래 ↺ = 처음부터 다시 */
(function () {
  var H = document.documentElement;
  function mode() { var w = innerWidth; H.classList.toggle('mt', w <= 1023); H.classList.toggle('mt-ph', w <= 760); H.classList.toggle('mt-tb', w > 760 && w <= 1023); return w <= 1023; }
  mode(); window.__mtMode = mode;
  var F = null;
  function hero() {
    var on = mode();
    var tb = (document.getElementById('tbar') || {}).offsetHeight || 0;
    H.style.setProperty('--mt-tb', tb + 'px');
    var last = document.querySelector('.slide:last-of-type'); if (last && last.querySelector('.lastwrap')) last.classList.add('mt-last');
    F = F || document.querySelector('.slide[data-s="0"] > .fit') || document.querySelector('.fit0'); if (!F) return;
    F.classList.add('mt-hero');
    var sl = F.parentElement, comp = F.querySelector('.comp'); if (!comp) return;
    if (!on) { comp.style.zoom = ''; comp.style.margin = ''; sl.style.alignItems = ''; return; }
    var ph = innerWidth <= 760;
    F.style.zoom = 1; comp.style.zoom = 1; comp.style.margin = '0';
    H.classList.add('mt-measure');
    var cr = comp.getBoundingClientRect(), b = null;
    [].forEach.call(comp.children, function (c) {
      if (c.classList.contains('bell2')) return;
      if ((getComputedStyle(c).backgroundImage || '').indexOf('radial') >= 0) return;
      var r = c.getBoundingClientRect(); if (!r.width || !r.height) return;
      b = b ? { l: Math.min(b.l, r.left), t: Math.min(b.t, r.top), r: Math.max(b.r, r.right), b: Math.max(b.b, r.bottom) } : { l: r.left, t: r.top, r: r.right, b: r.bottom };
    });
    H.classList.remove('mt-measure');
    if (!b) return;
    var bl = b.l - cr.left, bt = b.t - cr.top, bw = b.r - b.l, bh = b.b - b.t;
    var avail = innerHeight - tb - (ph ? 76 : 110), gap = ph ? 20 : 26;
    var th = F.querySelector('h1').parentElement.offsetHeight;
    var vis = Math.max(80, (avail - th - gap) * (ph ? 0.90 : 0.92)), z = vis / bh;
    comp.style.zoom = z.toFixed(5);
    comp.style.margin = (-bt) + 'px ' + (-(cr.width - bl - bw)) + 'px ' + (-(cr.height - bt - bh)) + 'px ' + (-bl) + 'px';
    var total = th + gap + vis;
    sl.style.alignItems = 'flex-start';
    sl.style.paddingTop = (tb + Math.max(16, (avail - total) * 0.6)) + 'px';
  }
  window.__mtHero = hero;
  function all() { hero(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', all); else all();
  addEventListener('load', all); addEventListener('resize', all); setTimeout(all, 300); setTimeout(all, 1000);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(all);

  // ③ 안내 알약 — 4초 뒤 사라짐 · 한 번 보인 뒤엔 다시 안 나옴
  function tipWatch() {
    var tip = document.querySelector('.tip'); if (!tip) return setTimeout(tipWatch, 200);
    var seen = false, tm = null;
    new MutationObserver(function () {
      if (!tip.classList.contains('on')) return;
      if (seen) { tip.classList.remove('on'); return; }
      seen = true; clearTimeout(tm); tm = setTimeout(function () { tip.classList.remove('on'); }, 4000);
    }).observe(tip, { attributes: true, attributeFilter: ['class'] });
    if (tip.classList.contains('on')) { seen = true; tm = setTimeout(function () { tip.classList.remove('on'); }, 4000); }
  }
  tipWatch();

  // ④ 마지막 장 ↺ = 처음부터 다시
  document.addEventListener('click', function (e) {
    var pp = e.target.closest && e.target.closest('.pp'); if (!pp || !document.body.classList.contains('onlast')) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (window.__deck && window.__deck.go) { window.__deck.go(0); if (window.__deck.resume) window.__deck.resume(); return; }
    var a = document.querySelector('.again'); if (a) a.click();
  }, true);
})();
