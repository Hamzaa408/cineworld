(function () {
  var PER = 20; /* ek page par kitni movies */
  var list = document.getElementById("movieList");
  if (!list) return;
  var page = 1, sig = "", timer = null;

  var css = document.createElement("style");
  css.textContent =
    ".card[data-pg='h']{display:none!important}" +
    ".pager{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;align-items:center;padding:22px 0}" +
    ".pager.hide{display:none}" +
    ".pager button{min-width:42px;height:42px;border-radius:10px;border:1px solid #333;background:#222;color:#fff;font-weight:bold;font-size:15px;cursor:pointer;padding:0 12px}" +
    ".pager button.on{background:#a855f7;border-color:#a855f7}" +
    ".pager button:disabled{opacity:.35;cursor:default}" +
    ".pager .dots{color:#777;padding:0 4px}" +
    ".pager .info{width:100%;text-align:center;color:#888;font-size:12px;margin-top:4px}";
  document.head.appendChild(css);

  var pager = document.createElement("div");
  pager.id = "pager";
  pager.className = "pager hide";
  list.appendChild(pager);

  function cards() { return [].slice.call(list.querySelectorAll(".card")); }

  function pbtn(label, p, on, dis) {
    var b = document.createElement("button");
    b.textContent = label;
    if (on) b.className = "on";
    if (dis) b.disabled = true;
    else b.onclick = function () { go(p); };
    return b;
  }

  function draw(pages, total) {
    pager.className = "pager" + (pages <= 1 ? " hide" : "");
    pager.innerHTML = "";
    if (pages <= 1) return;
    pager.appendChild(pbtn("‹", page - 1, false, page === 1));
    var last = 0;
    for (var i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || Math.abs(i - page) <= 1) {
        if (last && i - last > 1) {
          var d = document.createElement("span");
          d.className = "dots";
          d.textContent = "…";
          pager.appendChild(d);
        }
        pager.appendChild(pbtn(String(i), i, i === page, false));
        last = i;
      }
    }
    pager.appendChild(pbtn("›", page + 1, false, page === pages));
    var inf = document.createElement("div");
    inf.className = "info";
    inf.textContent = "Page " + page + " / " + pages + " (" + total + " movies)";
    pager.appendChild(inf);
    if (list.lastChild !== pager) list.appendChild(pager);
  }

  function build() {
    var all = cards();
    var vis = all.filter(function (c) { return c.style.display !== "none"; });
    var s = vis.map(function (c) { return c._m ? c._m.id : ""; }).join("|");
    if (s !== sig) { sig = s; page = 1; }
    var pages = Math.max(1, Math.ceil(vis.length / PER));
    if (page > pages) page = pages;
    var start = (page - 1) * PER, end = start + PER, idx = 0;
    all.forEach(function (c) {
      if (c.style.display === "none") { c.removeAttribute("data-pg"); return; }
      if (idx >= start && idx < end) c.removeAttribute("data-pg");
      else c.setAttribute("data-pg", "h");
      idx++;
    });
    draw(pages, vis.length);
  }

  function go(p) {
    page = p;
    build();
    var top = list.getBoundingClientRect().top + window.pageYOffset - 150;
    window.scrollTo({ top: top, behavior: "smooth" });
  }

  function later() { clearTimeout(timer); timer = setTimeout(build, 60); }
  new MutationObserver(later).observe(list, { attributes: true, subtree: true, attributeFilter: ["style"] });
  new MutationObserver(later).observe(list, { childList: true });

  function fixRatings() {
    list.querySelectorAll(".avgRating").forEach(function (el) {
      if (el.textContent.trim() === "Abhi koi rating nahi") {
        el.innerHTML = '<b style="color:#ffd700;font-size:13px">Be the first to rate</b><br><span style="font-size:12px;color:#aaa">Tap a star to share your rating.</span>';
      }
    });
  }
  new MutationObserver(fixRatings).observe(list, { childList: true, subtree: true });
  fixRatings();
  build();
})();
