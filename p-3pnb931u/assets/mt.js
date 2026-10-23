/* 세션 103-C-5 · 103-C-6 — 휴대폰 · 태블릿 · PC 첫 장 한 줄 배치 · 기둥(원장 · 학부모 공통 · 짝 = assets/mt.css)
 *  ① html 에 .mt(1023 이하) · .mt-ph(760 이하) · .mt-tb(761~1023) · .mt-pc(1024 이상)
 *  ② 첫 장 = 확대 없이 제목 → 알약 → 휴대폰 그림(두 대가 실제 차지하는 테두리의 「보이는 높이」로 맞춤 · 가운데) · 위 여백 = 바 + max(16, 남는 높이 × 0.6)
 *     PC: 보이는 높이 = (화면 − 바 − 40 − 글 묶음 − 28) × 0.98 · 기둥 폭 = 휴대폰 두 대 가로 × 1.35(560~840) · 화면 가운데
 *  ③ PC 기둥 맞추기: 상단 바 로고 왼쪽 · 「다운로드」 글자 오른쪽 = 기둥 · 점 막대 = 기둥 오른쪽 선 10 안 · 재생 동그라미 = 점 막대 아래 16 같은 세로선
 *  ④ 「▶ 누르면 시작」 안내 4초 뒤 사라짐 · 한 번 뒤엔 다시 안 나옴 ⑤ 마지막 장 오른쪽 아래 ↺ = 처음부터 다시 ⑥ 휴대폰 = 학부모 「자주 묻는 것 3가지 ›」 접기 */
(function () {
  var H = document.documentElement;
  function mode() {
    var w = innerWidth;
    H.classList.toggle('mt', w <= 1023); H.classList.toggle('mt-ph', w <= 760); H.classList.toggle('mt-tb', w > 760 && w <= 1023); H.classList.toggle('mt-pc', w >= 1024);
    H.classList.toggle('mt-short', innerHeight <= 900);
    return w <= 1023;
  }
  mode(); window.__mtMode = mode;
  var F = null, colL = null, colR = null;
  function hero() {
    mode();
    var W = innerWidth, ph = W <= 760, pc = W >= 1024;
    var tb = (document.getElementById('tbar') || {}).offsetHeight || 0;
    H.style.setProperty('--mt-tb', tb + 'px');
    var last = document.querySelector('.slide:last-of-type'); if (last && last.querySelector('.lastwrap')) last.classList.add('mt-last');
    F = F || document.querySelector('.slide[data-s="0"] > .fit') || document.querySelector('.fit0'); if (!F) return;
    F.classList.add('mt-hero');
    var sl = F.parentElement, comp = F.querySelector('.comp'); if (!comp) return;
    var box = F.querySelector(':scope > section > div:not([aria-hidden])');
    F.style.zoom = 1; comp.style.zoom = 1; comp.style.margin = '0';
    H.classList.add('mt-measure');
    var cr = comp.getBoundingClientRect(), b = null;
    [].forEach.call(comp.children, function (c) {
      if ((getComputedStyle(c).backgroundImage || '').indexOf('radial') >= 0) return;
      var r = c.getBoundingClientRect(); if (!r.width || !r.height) return;
      b = b ? { l: Math.min(b.l, r.left), t: Math.min(b.t, r.top), r: Math.max(b.r, r.right), b: Math.max(b.b, r.bottom) } : { l: r.left, t: r.top, r: r.right, b: r.bottom };
    });
    H.classList.remove('mt-measure');
    if (!b) return;
    var bl = b.l - cr.left, bt = b.t - cr.top, bw = b.r - b.l, bh = b.b - b.t;
    var avail = innerHeight - tb - (pc ? 40 : ph ? 76 : 110), gap = pc ? 28 : ph ? 20 : 26;
    var txt = F.querySelector('h1').parentElement;
    if (pc && box) box.style.width = ''; 
    var th = txt.offsetHeight;
    var vis = Math.max(80, (avail - th - gap) * (pc ? 0.98 : ph ? 0.90 : 0.92)), z = vis / bh;
    comp.style.zoom = z.toFixed(5);
    comp.style.margin = (-bt) + 'px ' + (-(cr.width - bl - bw)) + 'px ' + (-(cr.height - bt - bh)) + 'px ' + (-bl) + 'px';
    if (pc && box) {
      var colW = Math.round(Math.min(840, Math.max(560, bw * z * 1.35)));
      box.style.width = colW + 'px';
      colL = Math.round((W - colW) / 2); colR = colL + Math.round(colW);
      th = txt.offsetHeight;
    } else { if (box) box.style.width = ''; colL = colR = null; }
    var total = th + gap + vis;
    sl.style.alignItems = 'flex-start';
    sl.style.paddingTop = (tb + Math.max(16, (avail - total) * 0.6)) + 'px';
    if (window.__barCol) window.__barCol(colL, colR);
    ctl();
  }
  // ③ PC 점 막대 · 재생 동그라미 = 기둥 오른쪽
  function ctl() {
    var dots = document.querySelector('.pdots') || document.querySelector('.dots'), pp = document.querySelector('.pp');
    if (!dots || !pp) return;
    if (colR === null || innerWidth < 1024) { dots.style.right = ''; pp.style.left = pp.style.top = pp.style.right = pp.style.bottom = ''; return; }
    dots.style.right = (innerWidth - colR + 10) + 'px';
    var r = dots.getBoundingClientRect(), cx = r.left + r.width / 2;
    pp.style.right = 'auto'; pp.style.bottom = 'auto';
    pp.style.left = Math.round(cx - pp.offsetWidth / 2) + 'px';
    pp.style.top = Math.round(r.bottom + 16) + 'px';
  }
  window.__mtHero = hero;
  function all() { hero(); faq(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', all); else all();
  addEventListener('load', all); addEventListener('resize', all); setTimeout(all, 300); setTimeout(all, 1000);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(all);

  // ④ 안내 알약 — 4초 뒤 사라짐 · 한 번 보인 뒤엔 다시 안 나옴
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

  // ⑤ 마지막 장 ↺ = 처음부터 다시
  document.addEventListener('click', function (e) {
    var pp = e.target.closest && e.target.closest('.pp'); if (!pp || !document.body.classList.contains('onlast')) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (window.__deck && window.__deck.go) { window.__deck.go(0); if (window.__deck.resume) window.__deck.resume(); return; }
    var a = document.querySelector('.again'); if (a) a.click();
  }, true);

  // ⑥ 휴대폰 = 학부모 마지막 장 「자주 묻는 것 3가지 ›」(누르면 그 자리에서 펼침 · 태블릿 · PC = 펼친 채)
  function faq() {
    var w = document.querySelector('.faqwrap'); if (!w || w.querySelector('.faqtog')) return;
    var n = w.querySelectorAll('details').length;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'faqtog'; b.setAttribute('aria-expanded', 'false');
    b.innerHTML = '자주 묻는 것 ' + n + '가지 <i aria-hidden="true">›</i>';
    var f = w.querySelector('.faq');
    /* 103-C-6 펼친 목록 = 진행 막대 위 칸 안에서 밀어서 봄(막대와 안 겹침) */
    function fitBox() {
      var sc = w.closest('.scroll'); if (!sc) return; sc.style.height = '';
      if (!w.classList.contains('open') || !document.documentElement.classList.contains('mt-ph')) return;
      var bar = document.querySelector('.pbar'), br = bar && bar.getBoundingClientRect();
      var lim = br && br.height ? br.top - 12 : innerHeight - 24;
      sc.style.height = Math.round(lim - sc.getBoundingClientRect().top) + 'px';
      var t = b.getBoundingClientRect().top - sc.getBoundingClientRect().top;
      sc.scrollTo({ top: sc.scrollTop + t - 24, behavior: 'smooth' });
    }
    b.addEventListener('click', function (e) { e.stopPropagation(); var o = w.classList.toggle('open'); b.setAttribute('aria-expanded', o ? 'true' : 'false'); fitBox(); });
    addEventListener('resize', fitBox);
    if (f) ['click'].forEach(function (t) { f.addEventListener(t, function (e) { e.stopPropagation(); }, { passive: true }); });
    ['pointerdown', 'pointerup', 'touchstart', 'touchend'].forEach(function (t) { b.addEventListener(t, function (e) { e.stopPropagation(); }); });
    w.insertBefore(b, w.firstChild);
  }
})();
