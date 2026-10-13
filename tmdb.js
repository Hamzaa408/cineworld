(function () {
  var KEY = "96c02451e55812e5a5685360a9b42b23";
  var IMG = "https://image.tmdb.org/t/p/w500";
  var API = "https://api.themoviedb.org/3";
  var cache = {};
  try { cache = JSON.parse(localStorage.getItem("tmdb_cache_v3") || "{}"); } catch (e) {}
  function save() { try { localStorage.setItem("tmdb_cache_v3", JSON.stringify(cache)); } catch (e) {} }
  function clean(t) { return t.replace(/\s*\(\d{4}\)\s*$/, "").replace(/\s*-\s*Live Action$/i, "").replace(/\s*Live Action$/i, ""); }
  function getJSON(u) { return fetch(u).then(function (r) { return r.json(); }); }
  function isIndian(m) {
    var ind = (m.industry || "").toLowerCase();
    return ind === "bollywood" || ind === "tollywood" || (m.budget || "").indexOf("₹") !== -1;
  }
  function isUpcoming(m) {
    var s = (m.status || "").toLowerCase();
    return s === "coming soon" || s === "most awaited" || s === "upcoming";
  }
  function missing(v) {
    return !v || /^\s*(n\/?a|tba|-|not available)\s*$/i.test(String(v));
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

  /* ---- paise ka system: budget / box office ---- */
  function usd(n) {
    if (n >= 1e9) return "$" + (n / 1e9).toFixed(2).replace(/\.?0+$/, "") + " billion";
    if (n >= 1e6) return "$" + Math.round(n / 1e6) + " million";
    return "$" + Math.round(n / 1000) + " thousand";
  }

  function cleanVal(s) {
    s = String(s || "");
    s = s.replace(/<!--[\s\S]*?-->/g, "")
         .replace(/<ref[^>]*\/>/gi, "")
         .replace(/<ref[\s\S]*?<\/ref>/gi, "");
    var U = { c: "crore", cr: "crore", crore: "crore", l: "lakh", lakh: "lakh", m: "million", million: "million", b: "billion", billion: "billion" };
    s = s.replace(/\{\{\s*INRConvert\s*\|\s*([\d.,]+)\s*\|\s*([a-z]+)[^}]*\}\}/gi, function (_, n, u) {
      return "₹" + n + " " + (U[u.toLowerCase()] || u);
    });
    s = s.replace(/\{\{\s*US\$\s*\|\s*([\d.,]+)\s*\|\s*([a-z]+)[^}]*\}\}/gi, function (_, n, u) {
      return "$" + n + " " + u;
    });
    s = s.replace(/\{\{\s*(?:INR|Indian rupee)\s*\}\}/gi, "₹");
    s = s.replace(/\{\{\s*(?:nowrap|nobr)\s*\|([^{}]*)\}\}/gi, "$1");
    s = s.replace(/\{\{[^{}]*\}\}/g, "");
    s = s.replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, "$1")
         .replace(/'''?/g, "")
         .replace(/&nbsp;/g, " ")
         .replace(/&ndash;|–/g, "-")
         .replace(/<[^>]+>/g, "")
         .replace(/\s+/g, " ")
         .trim();
    s = s.replace(/₹\s*([\d.,]+)\s*million/gi, function (_, n) {
      var v = parseFloat(n.replace(/,/g, "")) / 10;
      return "₹" + (Math.round(v * 100) / 100) + " crore";
    });
    s = s.replace(/₹\s*([\d.,]+)\s*billion/gi, function (_, n) {
      var v = parseFloat(n.replace(/,/g, "")) * 100;
      return "₹" + (Math.round(v * 100) / 100) + " crore";
    });
    return /\d/.test(s) ? s.slice(0, 40) : "";
  }

  function wikiMoney(title) {
    var url = "https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&rvslots=main&rvsection=0&redirects=1&format=json&formatversion=2&origin=*&titles=" + encodeURIComponent(title);
    return getJSON(url).then(function (j) {
      var p = j && j.query && j.query.pages && j.query.pages[0];
      var r = p && p.revisions && p.revisions[0];
      var t = r && r.slots && r.slots.main && r.slots.main.content;
      if (!t) return {};
      t = t.replace(/<!--[\s\S]*?-->/g, "")
           .replace(/<ref[^>]*\/>/gi, "")
           .replace(/<ref[\s\S]*?<\/ref>/gi, "");
      var lines = t.split("\n"), out = {}, cur = null;
      for (var i = 0; i < lines.length; i++) {
        var L = lines[i];
        var m = L.match(/^\s*\|\s*([a-z_ ]+?)\s*=\s*(.*)$/i);
        if (m) {
          var k = m[1].toLowerCase().replace(/\s+/g, "_");
          var tgt = k === "budget" ? "budget" : (k === "gross" || k === "box_office") ? "gross" : null;
          if (tgt && out[tgt] === undefined) { cur = tgt; out[tgt] = m[2]; } else { cur = null; }
        } else if (cur && !/^\s*(\||\}\})/.test(L)) {
          out[cur] += " " + L;
        } else {
          cur = null;
        }
      }
      return { budget: cleanVal(out.budget), gross: cleanVal(out.gross) };
    }).catch(function () { return {}; });
  }

  function fetchMoney(m, d) {
    if (d.mdone) return Promise.resolve(d);
    var w = m.wiki ? wikiMoney(m.wiki) : Promise.resolve({});
    var t = d.id
      ? getJSON(API + "/movie/" + d.id + "?api_key=" + KEY).catch(function () { return null; })
      : Promise.resolve(null);
    return Promise.all([w, t]).then(function (r) {
      var wm = r[0] || {}, tm = r[1] || {};
      d.mb = wm.budget || (tm.budget > 0 ? usd(tm.budget) : "");
      d.mg = wm.gross || (tm.revenue > 0 ? usd(tm.revenue) : "");
      d.mdone = true;
      save();
      return d;
    });
  }

  /* ---- Hit / Flop khud tay karna ---- */
  function parseMoney(s) {
    s = String(s || "");
    var cur = s.indexOf("₹") > -1 ? "INR" : (s.indexOf("$") > -1 ? "USD" : "");
    var n = s.match(/(\d[\d,]*\.?\d*)/);
    if (!cur || !n) return null;
    var v = parseFloat(n[1].replace(/,/g, ""));
    if (isNaN(v)) return null;
    var low = s.toLowerCase();
    if (cur === "INR") {
      if (/crore|\bcr\b/.test(low)) { /* theek hai */ }
      else if (/lakh/.test(low)) v = v / 100;
      else if (/million/.test(low)) v = v / 10;
      else if (/billion/.test(low)) v = v * 100;
      else return null;
    } else {
      if (/billion/.test(low)) v = v * 1000;
      else if (/million/.test(low)) { /* theek hai */ }
      else if (/thousand/.test(low)) v = v / 1000;
      else return null;
    }
    return { cur: cur, v: v };
  }

  function autoStatus(m) {
    var b = parseMoney(m.budget), g = parseMoney(m.boxOffice);
    if (!b || !g || b.cur !== g.cur || b.v <= 0) return "";
    var r = g.v / b.v;
    if (b.cur === "INR") {
      if (m._gross) r = r * 0.75;
      if (r < 0.8) return "Flop";
      if (r < 1.2) return "Average";
      if (r < 1.8) return "Hit";
      if (r < 2.5) return "Super Hit";
      return "Blockbuster";
    }
    if (r < 1.5) return "Flop";
    if (r < 2.2) return "Average";
    if (r < 3) return "Hit";
    if (r < 4.5) return "Super Hit";
    return "Blockbuster";
  }

  function setStatus(card, m, s) {
    m.status = s;
    var sp = card.querySelector(".status");
    if (sp) {
      sp.textContent = s;
      sp.style.background = s === "Flop" ? "#e50914" : (s === "Average" ? "#b8860b" : "#2e7d32");
    }
  }

  function applyMoney(card, m, d) {
    var changed = false;
    if (missing(m.budget) && d.mb) { m.budget = d.mb; changed = true; }
    if (missing(m.boxOffice) && d.mg) { m.boxOffice = d.mg; m._gross = true; changed = true; }
    if (changed) {
      [].slice.call(card.querySelectorAll("p")).forEach(function (p) {
        if (/^\s*Budget:/.test(p.textContent)) {
          p.textContent = "Budget: " + (m.budget || "N/A") + " | Box Office: " + (m.boxOffice || "N/A");
        }
      });
    }
    if (changed || missing(m.status)) {
      var s = autoStatus(m);
      if (s) setStatus(card, m, s);
    }
  }

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
        if (!r) {
          var o = { id: 0, poster: "", trailer: "", vote: 0, votes: 0 };
          cache[m.id] = o;
          save();
          return o;
        }
        return getJSON(API + "/movie/" + r.id + "/videos?api_key=" + KEY +
          "&language=en-US&include_video_language=hi,en,null")
          .then(function (v) {
            var out = {
              id: r.id,
              poster: r.poster_path || "",
              trailer: pick(v.results, hindi),
              vote: r.vote_average || 0,
              votes: r.vote_count || 0
            };
            cache[m.id] = out;
            save();
            return out;
          });
      })
      .catch(function () { return null; });
  }

  function show(card, m, d) {
    if (d.trailer) m.trailerId = d.trailer;

    /* rating khali ho to TMDB ki rating likho */
    if (!m.rating && d.vote > 0 && d.votes >= 5) {
      m.rating = "TMDB " + d.vote.toFixed(1) + "/10";
      var p = card.querySelector('p[style*="ffd700"]');
      if (p) p.textContent = m.rating;
    }

    /* budget / box office / status khali ho to khud bharo */
    if (!isUpcoming(m)) {
      if (missing(m.budget) || missing(m.boxOffice)) {
        fetchMoney(m, d).then(function (dd) { applyMoney(card, m, dd); });
      } else if (missing(m.status)) {
        var s0 = autoStatus(m);
        if (s0) setStatus(card, m, s0);
      }
    }

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
