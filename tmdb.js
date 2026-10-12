(function () {
  var KEY = "96c02451e55812e5a5685360a9b42b23";
  var IMG = "https://image.tmdb.org/t/p/w500";
  var API = "https://api.themoviedb.org/3";
  var cache = {};
  try { cache = JSON.parse(localStorage.getItem("tmdb_cache_v1") || "{}"); } catch (e) {}
  function save() { try { localStorage.setItem("tmdb_cache_v1", JSON.stringify(cache)); } catch (e) {} }
  function clean(t) { return t.replace(/\s*\(\d{4}\)\s*$/, "").replace(/\s*-\s*Live Action$/i, "").replace(/\s*Live Action$/i, ""); }
  function getJSON(u) { return fetch(u).then(function (r) { return r.json(); }); }
  function isIndian(m) {
    var ind = (m.industry || "").toLowerCase();
    return ind === "bollywood" || ind === "tollywood" || (m.budget || "").indexOf("₹") !== -1;
  }

  /* ---- neeche status line ---- */
  var st = document.createElement("p");
  st.style.cssText = "text-align:center;color:#888;font-size:12px;padding:14px 10px 4px";
  st.textContent = "TMDB: check ho raha hai...";
  document.body.appendChild(st);

  getJSON(API + "/configuration?api_key=" + KEY)
    .then(function (j) {
      if (j && j.images) {
        st.textContent = "TMDB: chal raha hai (key theek hai)";
        st.style.color = "#4caf50";
      } else {
        st.textContent = "TMDB: key galat hai - " + ((j && j.status_message) || "pata nahi");
        st.style.color = "#e50914";
      }
    })
    .catch(function () {
      st.textContent = "TMDB: connect nahi ho raha (internet ya network block)";
      st.style.color = "#e50914";
    });

  var f = document.createElement("p");
  f.style.cssText = "text-align:center;color:#666;font-size:11px;padding:4px 10px 16px";
  f.textContent = "This product uses the TMDB API but is not endorsed or certified by TMDB.";
  document.body.appendChild(f);

  /* ---- trailer pasand karna ---- */
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
    var hindi = isIndian(m);
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

  var io = null;
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          io.unobserve(e.target);
          var card = e.target, m = card._m;
          if (m) lookup(m).then(function (d) { if (d) show(card, m, d); });
        }
      });
    }, { rootMargin: "400px" });
  }

  function watch(card) {
    var m = card._m;
    if (!m || card._tm) return;
    card._tm = true;

    if (io) io.observe(card);
    else lookup(m).then(function (d) { if (d) show(card, m, d); });

    var b = card.querySelector(".trailer");
    if (!b) return;
    var old = b.onclick;

    b.onclick = function (e) {
      e.preventDefault();

      /* Bollywood / Tollywood: seedha YouTube search */
      if (isIndian(m)) {
        window.open("https://www.youtube.com/results?search_query=" +
          encodeURIComponent(m.title + " official trailer"), "_blank");
        return;
      }

      /* Hollywood: site ke andar trailer */
      var c = cache[m.id];
      if (c) {
        if (c.trailer) m.trailerId = c.trailer;
        return old ? old.call(b, e) : undefined;
      }
      lookup(m).then(function (d) {
        if (d && d.trailer) m.trailerId = d.trailer;
        if (old) old.call(b, e);
      });
    };
  }

  function scan() {
    [].slice.call(document.querySelectorAll(".card")).forEach(watch);
  }

  scan();

  var box = document.getElementById("movieList") || document.body;
  new MutationObserver(scan).observe(box, { childList: true, subtree: true });
})();
