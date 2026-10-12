(function () {
  var KEY = "96c02451e55812e5a5685360a9b42b23";
  if (KEY.indexOf("PASTE") === 0) return;
  var IMG = "https://image.tmdb.org/t/p/w500";
  var API = "https://api.themoviedb.org/3";
  var cache = {};
  try { cache = JSON.parse(localStorage.getItem("tmdb_cache_v1") || "{}"); } catch (e) {}
  function save() { try { localStorage.setItem("tmdb_cache_v1", JSON.stringify(cache)); } catch (e) {} }
  function clean(t) { return t.replace(/\s*\(\d{4}\)\s*$/, "").replace(/\s*-\s*Live Action$/i, ""); }
  function getJSON(u) { return fetch(u).then(function (r) { return r.json(); }); }

  function pick(list, hindi) {
    var yt = (list || []).filter(function (v) { return v.site === "YouTube"; });
    var types = ["Trailer", "Teaser"];
    for (var i = 0; i < types.length; i++) {
      var c = yt.filter(function (v) { return v.type === types[i]; });
      if (!c.length) continue;
      var pref = c.filter(function (v) { return v.iso_639_1 === (hindi ? "hi" : "en"); });
      var pool = pref.length ? pref : c;
      var off = pool.filter(function (v) { return v.official; });
      return (off.length ? off : pool)[0].key;
    }
    return "";
  }

  function lookup(m) {
    if (cache[m.id]) return Promise.resolve(cache[m.id]);
    var title = encodeURIComponent(clean(m.title));
    var y = m.year ? "&year=" + m.year : "";
    var hindi = (m.industry || "").toLowerCase() === "bollywood" || (m.budget || "").indexOf("₹") !== -1;
    return getJSON(API + "/search/movie?api_key=" + KEY + "&query=" + title + y)
      .then(function (s) {
        if (s.results && s.results.length) return s;
        return getJSON(API + "/search/movie?api_key=" + KEY + "&query=" + title);
      })
      .then(function (s) {
        var r = s.results && s.results[0];
        if (!r) return null;
        return getJSON(API + "/movie/" + r.id + "/videos?api_key=" + KEY +
          "&language=en-US&include_video_language=hi,en,null")
          .then(function (v) {
            var out = { poster: r.poster_path || "", trailer: pick(v.results, hindi) };
            cache[m.id] = out;
            save();
            return out;
          });
      })
      .catch(function () { return null; });
  }

  function show(card, m, d) {
    if (d.trailer) m.trailerId = d.trailer;
    if (d.poster) {
      var img = card.querySelector(".poster img");
      var t = new Image();
      t.onload = function () { if (img) img.src = t.src; };
      t.src = IMG + d.poster;
    }
  }

  var cards = [].slice.call(document.querySelectorAll(".card"));

  function handle(card) {
    var m = card._m;
    if (!m || card._tm) return;
    card._tm = true;
    lookup(m).then(function (d) { if (d) show(card, m, d); });
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { io.unobserve(e.target); handle(e.target); }
      });
    }, { rootMargin: "400px" });
    cards.forEach(function (c) { io.observe(c); });
  } else {
    cards.slice(0, 40).forEach(handle);
  }

  cards.forEach(function (card) {
    var m = card._m;
    var b = card.querySelector(".trailer");
    if (!m || !b) return;
    var old = b.onclick;
    b.onclick = function (e) {
      var c = cache[m.id];
      if (c) {
        if (c.trailer) m.trailerId = c.trailer;
        return old.call(b, e);
      }
      e.preventDefault();
      lookup(m).then(function (d) {
        if (d && d.trailer) m.trailerId = d.trailer;
        old.call(b, e);
      });
    };
  });

  var f = document.createElement("p");
  f.style.cssText = "text-align:center;color:#666;font-size:11px;padding:16px";
  f.textContent = "This product uses the TMDB API but is not endorsed or certified by TMDB.";
  document.body.appendChild(f);
})();
