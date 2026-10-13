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
    var d = r.match(/TMDB\s*([\d.]+)/);
    var a = i ? parseFloat(i[1]) * 10 : null;
    var b = t ? parseFloat(t[1]) : null;
    var c = d ? parseFloat(d[1]) * 10 : null;
    if (a !== null && b !== null) return { s: Math.round((a + b) / 2), l: "IMDb + RT" };
    if (a !== null) return { s: Math.round(a), l: "IMDb" };
    if (b !== null) return { s: Math.round(b), l: "RT" };
    if (c !== null) return { s: Math.round(c), l: "TMDB" };
    return null;
  }

  function verdictOf(s) {
    if (s >= 80) return { t: "All Time Watch", c: "#22c55e" };
    if (s >= 65) return { t: "One Time Watch", c: "#84cc16" };
    if (s >= 50) return { t: "Average Watch", c: "#eab308" };
    return { t: "Skip It", c: "#ef4444" };
  }

  function paint(card) {
    var m = card._m;
    if (!m) return;
    if (typeof isUpcoming === "function" && isUpcoming(m)) return;
    var anchor = card.querySelector(".stars");
    if (!anchor) return;

    var key = String(m.rating || "") + "|" + String(m.verdict || "");
    if (card._vr === key && card._vbox) return;
    card._vr = key;

    var box = card._vbox;
    if (!box) {
      box = document.createElement("div");
      box.className = "verdict";
      card._vbox = box;
      anchor.parentNode.insertBefore(box, anchor);
    }

    var sc = score(m.rating);
    if (m.verdict) {
      box.innerHTML = '<span style="color:#ffd700">' + m.verdict + "</span>";
    } else if (!sc) {
      box.innerHTML = '<span style="color:#aaa">Verdict: Rating not available</span>';
    } else {
      var v = verdictOf(sc.s);
      box.innerHTML =
        '<span style="color:' + v.c + '">' + v.t + "</span>" +
        "<small>Score: " + sc.s + "/100 (" + sc.l + ")</small>" +
        '<div class="bar"><i style="width:' + sc.s + "%;background:" + v.c + '"></i></div>';
    }
  }

  document.querySelectorAll(".card").forEach(paint);

  /* tmdb.js baad mein rating bharti hai, tab bar dobara bana do */
  new MutationObserver(function (muts) {
    var seen = [];
    muts.forEach(function (mu) {
      var el = mu.target.nodeType === 1 ? mu.target : mu.target.parentNode;
      if (!el || !el.closest || el.closest(".verdict")) return;
      var card = el.closest(".card");
      if (card && seen.indexOf(card) === -1) seen.push(card);
    });
    seen.forEach(paint);
  }).observe(document.getElementById("movieList") || document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
})();
