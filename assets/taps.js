/* 세션 102-M — 누를 자리(촬영 좌표 → 그림에 대한 %) · 만든 곳 = 저장소 inbell tools/site/taps_js.py · 손으로 고치지 않음 */
(function () {
  var T = {"P3a_home_unchecked": [10.9, 27.7], "P3b_home_checked": [18.6, 83.6], "P4b_pre_mode": [26.1, 55.7], "P4b_end_date_picker": [50.0, 51.8], "P4d_calendar_both": [38.1, 54.1], "P5a_summary": [50.0, 38.7], "P5b_day_detail": [62.0, 57.3], "P2a_red": [36.0, 37.5], "O_notice_reads": [25.0, 50.1], "O_install_kakao": [73.1, 93.2]};
  document.querySelectorAll('.tapdot[data-tap]').forEach(function (e) {
    var p = T[e.dataset.tap]; if (!p) { e.remove(); return; }
    e.style.setProperty('--x', p[0] + '%'); e.style.setProperty('--y', p[1] + '%');
  });
})();
