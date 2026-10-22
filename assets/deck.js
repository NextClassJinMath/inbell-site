/* 인벨 사이트 v2 (세션 102-M) — 장(chapter) · 단계(step) 넘기기 공통 엔진. 원장 페이지(/) · 학부모 페이지(/parent) 가 같이 쓴다.
 *  장 = <section class="ch" data-name="…" [data-dark] [data-dur="10000"]>
 *  단계 = 장 안의 [data-k="1"]… 요소(그림 · 글 · 누를 자리 동그라미). 지금 단계 이하 data-k 는 .on(그림은 지금 것만 .cur).
 *  장 끝 = [data-done] 요소(결론 한 줄)가 마지막 단계 다음에 켜짐 · 장 시간 = data-dur(기본 10초)을 단계 수로 나눔.
 *  넘기기: 휴대폰 = 아래 막대 · 누르기(왼쪽 30% = 뒤로) · 쓸어 올리기 · 길게 누르면 멈춤 / 컴퓨터 = 오른쪽 점 · 휠 · 방향키 · 스페이스.
 *  첫 장: 휴대폰은 멈춘 채 「▶ 누르면 시작」 · 컴퓨터는 바로 재생. 마지막 장은 멈춤(스크롤 가능한 내용).
 */
(function () {
  const chs = [...document.querySelectorAll('.ch')];
  if (!chs.length) return;
  const MQ = matchMedia('(max-width:899px)'), TQ = matchMedia('(hover: none) and (pointer: coarse)');
  let mobile = MQ.matches || TQ.matches;
  const body = document.body;
  body.classList.toggle('mobile', mobile);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 단계 표 — [장, 단계]. 단계 0 = 장 처음(그림 1 · 글 1 이 바로 보임) … n = 결론
  const K = chs.map((c) => {
    const ks = [...c.querySelectorAll('[data-k]')].map((e) => +e.dataset.k);
    const n = ks.length ? Math.max(...ks) : 1;
    return c.querySelector('[data-done]') ? n + 1 : n;
  });
  const steps = [];
  K.forEach((n, ci) => { for (let k = 1; k <= n; k++) steps.push([ci, k]); });
  const dur = (i) => {
    const [ci] = steps[i];
    const total = +(chs[ci].dataset.dur || 10000);
    return (total / K[ci]) * mult;
  };

  // 진행 막대(휴대폰) · 점(컴퓨터) · 재생 단추 · 안내
  const bar = document.createElement('div'); bar.className = 'pbar';
  const dots = document.createElement('div'); dots.className = 'pdots';
  chs.forEach((c, ci) => {
    const s = document.createElement('button'); s.type = 'button'; s.className = 'seg'; s.setAttribute('aria-label', c.dataset.name + ' 장으로');
    s.innerHTML = '<i></i>'; s.onclick = (e) => { e.stopPropagation(); go(steps.findIndex((x) => x[0] === ci)); };
    bar.appendChild(s);
    const d = document.createElement('button'); d.type = 'button'; d.dataset.n = c.dataset.name; d.setAttribute('aria-label', c.dataset.name + ' 장으로');
    d.onclick = () => go(steps.findIndex((x) => x[0] === ci));
    dots.appendChild(d);
  });
  body.append(bar, dots);
  const fills = [...bar.querySelectorAll('i')];
  const pp = document.createElement('button'); pp.type = 'button'; pp.className = 'pp'; body.appendChild(pp);
  const tip = document.createElement('div'); tip.className = 'tip'; tip.textContent = '▶ 누르면 시작 · 쓸어 올려도 돼요'; body.appendChild(tip);

  let cur = 0, t0 = performance.now(), elapsed = 0, paused = false, pauseBy = '';
  let mult = 1; try { mult = parseFloat(localStorage.getItem('inbellSpeed')) || 1; } catch (e) {}

  function render() {
    const [ci, k] = steps[cur];
    chs.forEach((c, i) => {
      c.classList.toggle('on', i === ci); c.classList.toggle('past', i < ci);
      if (i !== ci) return;
      const n = K[i], hasDone = !!c.querySelector('[data-done]');
      const done = hasDone && k === n;
      const shown = done ? n - 1 : k;
      c.querySelectorAll('[data-k]').forEach((e) => {
        const ek = +e.dataset.k;
        if (e.matches('img, .shot')) {
          // 그림: 지금 단계의 것(없으면 가장 가까운 앞 단계 것)만
          const imgs = [...c.querySelectorAll('img[data-k], .shot[data-k]')].filter((x) => x.closest('.ch') === c);
          const best = Math.max(...imgs.map((x) => +x.dataset.k).filter((x) => x <= shown), 0);
          e.classList.toggle('cur', ek === best);
        } else if (e.matches('.tapdot')) {
          e.classList.toggle('on', ek === shown);
        } else {
          e.classList.toggle('on', ek <= shown);
          e.classList.toggle('now', ek === shown);
        }
      });
      c.classList.toggle('done', done);
    });
    body.classList.toggle('dark', chs[ci].hasAttribute('data-dark'));
    body.classList.toggle('end', cur === steps.length - 1);
    [...dots.children].forEach((d, i) => d.classList.toggle('on', i === ci));
    paint(0);
    document.dispatchEvent(new CustomEvent('deck:step', { detail: { ch: ci, k } }));
  }
  const CHS = chs.map((_, ci) => steps.map((x, i) => [x, i]).filter(([x]) => x[0] === ci).map(([, i]) => i));
  function paint(frac) {
    const ci = steps[cur][0];
    fills.forEach((f, i) => {
      const w = i < ci ? 1 : i > ci ? 0 : (CHS[ci].indexOf(cur) + frac) / CHS[ci].length;
      f.style.width = (w * 100).toFixed(1) + '%';
    });
    const d = dots.children[ci];
    if (d) d.style.setProperty('--p', (((CHS[ci].indexOf(cur) + frac) / CHS[ci].length) * 100).toFixed(1) + '%');
  }
  function go(i) {
    cur = Math.max(0, Math.min(steps.length - 1, i)); t0 = performance.now(); elapsed = 0; render();
    if (cur > 0) tip.classList.remove('on');
    const ch = chs[steps[cur][0]]; const sc = ch.querySelector('.scroll'); if (sc && steps[cur][1] === 1) sc.scrollTop = 0;
  }
  function next() { if (paused && pauseBy === 'start') resume(); if (cur < steps.length - 1) go(cur + 1); }
  function prev() { go(cur - 1); }
  function loop(now) {
    if (!paused && cur < steps.length - 1 && !reduce) {
      const d = dur(cur), e = elapsed + (now - t0);
      if (e >= d) next(); else paint(e / d);
    }
    requestAnimationFrame(loop);
  }
  function setBtn() {
    pp.textContent = paused ? '▶' : '❚❚';
    pp.setAttribute('aria-label', paused ? '재생' : '멈춤');
    pp.classList.toggle('breath', paused && pauseBy === 'start');
  }
  function pause(by) { if (paused) return; paused = true; pauseBy = by || 'hold'; elapsed += performance.now() - t0; setBtn(); }
  function resume() { if (!paused) return; paused = false; pauseBy = ''; t0 = performance.now(); setBtn(); tip.classList.remove('on'); }
  pp.addEventListener('click', (e) => { e.stopPropagation(); paused ? resume() : pause('btn'); });

  // 입력 — 링크 · 단추 · 스크롤 영역 안의 조작은 넘기기로 보지 않는다
  const skip = (t) => t.closest('a, button, input, summary, details, .pbar, .pdots');
  let down = 0, sx = 0, sy = 0, lp = null, moved = false, inScroll = null;
  addEventListener('pointerdown', (e) => {
    if (skip(e.target)) return;
    inScroll = e.target.closest('.scroll'); down = performance.now(); sx = e.clientX; sy = e.clientY; moved = false;
    lp = setTimeout(() => { if (mobile && !paused) pause('hold'); }, 380);
  });
  addEventListener('pointermove', (e) => { if (down && (Math.abs(e.clientY - sy) > 12 || Math.abs(e.clientX - sx) > 12)) moved = true; });
  addEventListener('pointerup', (e) => {
    if (!down) return; clearTimeout(lp); const held = performance.now() - down; down = 0;
    if (paused && pauseBy === 'hold') { resume(); return; }
    const dy = e.clientY - sy;
    if (inScroll && (dy > 0 ? inScroll.scrollTop > 0 : inScroll.scrollTop + inScroll.clientHeight < inScroll.scrollHeight - 2)) return;
    if (Math.abs(dy) > 50) { dy < 0 ? next() : prev(); return; }
    if (held < 380 && !moved && mobile) { e.clientX < innerWidth * 0.3 ? prev() : next(); }
  });
  let wl = 0;
  addEventListener('wheel', (e) => {
    const sc = e.target.closest && e.target.closest('.scroll');
    if (sc && (e.deltaY > 0 ? sc.scrollTop + sc.clientHeight < sc.scrollHeight - 2 : sc.scrollTop > 0)) return;
    e.preventDefault(); const n = performance.now();
    if (n - wl < 750 || Math.abs(e.deltaY) < 8) return; wl = n; e.deltaY > 0 ? next() : prev();
  }, { passive: false });
  addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea')) return;
    if (['ArrowDown', 'PageDown', ' ', 'ArrowRight'].includes(e.key)) { e.preventDefault(); next(); }
    if (['ArrowUp', 'PageUp', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); prev(); }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (!paused) pause('hidden'); } else if (pauseBy === 'hidden') resume();
  });
  document.querySelectorAll('.again').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); go(0); if (paused) resume(); }));
  document.querySelectorAll('.speed button').forEach((b) => {
    if (Math.abs(+b.dataset.v - mult) < 0.01) b.classList.add('on');
    b.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation(); mult = +b.dataset.v;
      try { localStorage.setItem('inbellSpeed', mult); } catch (_) {}
      b.parentNode.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
    });
  });
  function onMode() {
    mobile = MQ.matches || TQ.matches; body.classList.toggle('mobile', mobile);
    if (mobile && !paused && cur === 0) pause('start');
    setBtn();
  }
  [MQ, TQ].forEach((q) => q.addEventListener && q.addEventListener('change', onMode));
  render();
  if (mobile || reduce) pause(reduce ? 'btn' : 'start');
  setBtn();
  if (mobile) setTimeout(() => { if (cur === 0 && paused) { tip.classList.add('on'); setTimeout(() => tip.classList.remove('on'), 6000); } }, 700);
  requestAnimationFrame(loop);
  window.__deck = { go, next, prev, steps, pause, resume };
})();
