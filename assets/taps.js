/* 세션 102-M — 누를 자리(촬영 좌표 → 그림에 대한 %) · 만든 곳 = 저장소 inbell tools/site/taps_js.py · 손으로 고치지 않음 */
(function () {
  var T = {"P3a_home_unchecked": [10.9, 38.4], "P3b_home_checked": [18.6, 80.9], "P4b_pre_mode": [26.1, 58.5], "P4b_end_date_picker": [50.0, 53.2], "P4d_calendar_both": [38.1, 48.8], "P5a_summary": [50.0, 53.8], "P5b_day_detail": [62.0, 60.8], "P2a_red": [36.0, 52.1], "O_notice_reads": [25.0, 69.6], "O_install_kakao": [73.1, 94.2]};
  document.querySelectorAll('.tapdot[data-tap]').forEach(function (e) {
    var p = T[e.dataset.tap]; if (!p) { e.remove(); return; }
    e.style.setProperty('--x', p[0] + '%'); e.style.setProperty('--y', p[1] + '%');
  });
})();
