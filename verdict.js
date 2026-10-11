(function () {
  var css = document.createElement("style");
  css.textContent =
    ".verdict{margin:6px 0 10px;padding:9px 10px;border-radius:9px;background:#1f1f1f;font-size:14px;font-weight:bold}" +
    ".verdict small{display:block;color:#aaa;font-weight:normal;font-size:12px;margin-top:3px}" +
    ".verdict .bar{height:6px;border-radius:4px;background:#333;margin-top:7px;overflow:hidden}" +
    ".verdict .bar i{display:block;height:100%}";
  document.head.appendChild(css);

  function score(r) {
    r = String(r || "");
    var i = r.match(/IMDb\s*([\d.]+)/);
    var t = r.match(/RT\s*(\d+)\s*%/);
    var a = i ? parseFloat(i[1]) * 10 : null;
    var b = t ? parseFloat(t[1]) : null;
    if (a !== null && b !== null) return Math.round((a + b) / 2);
    if (a !== null) return Math.round(a);
    if (b !== null) return Math.round(b);
    return null;
  }

  function verdictOf(s) {
    if (s >= 80) return { t: "All Time Watch", c: "#22c55e" };
    if (s >= 65) return { t: "One Time Watch", c: "#84cc16" };
    if (s >= 50) return { t: "Average Watch", c: "#eab308" };
    return { t: "Skip It", c: "#ef4444" };
  }

  document.querySelectorAll(".card").forEach(function (card) {
    var m = card._m;
    if (!m) return;
    if (typeof isUpcoming === "function" && isUpcoming(m)) return;
    var anchor = card.querySelector(".stars");
    if (!anchor) return;
    var box = document.createElement("div");
    box.className = "verdict";
    var s = score(m.rating);
    if (m.verdict) {
      box.innerHTML = '<span style="color:#ffd700">' + m.verdict + "</span>";
    } else if (s === null) {
      box.innerHTML = '<span style="color:#aaa">Verdict: Rating not available</span>';
    } else {
      var v = verdictOf(s);
      box.innerHTML =
        '<span style="color:' + v.c + '">' + v.t + "</span>" +
        "<small>Score: " + s + "/100 (IMDb + RT)</small>" +
        '<div class="bar"><i style="width:' + s + "%;background:" + v.c + '"></i></div>';
    }
    anchor.parentNode.insertBefore(box, anchor);
  });
})();
