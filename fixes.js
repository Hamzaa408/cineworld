(function () {
  /* 1. Duplicate movies hatao (sabse neeche wali copy rakhta hai) */
  var seen = {};
  var all = [].slice.call(document.querySelectorAll(".card"));
  for (var i = all.length - 1; i >= 0; i--) {
    var mm = all[i]._m;
    if (!mm) continue;
    if (seen[mm.id]) all[i].remove(); else seen[mm.id] = 1;
  }

  /* 2. Poster nahi aaya to Wikipedia search se dhoondo */
  function fixPosters() {
    document.querySelectorAll(".card").forEach(function (card) {
      var m = card._m;
      var img = card.querySelector(".poster img");
      if (!m || !img || card._pf) return;
      if (img.src.indexOf("placehold.co") === -1) return;
      card._pf = true;
      var q = m.title.replace(/\((\d{4})\)/, "$1") + " film";
      fetch("https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=" +
        encodeURIComponent(q) + "&gsrlimit=1&prop=pageimages&piprop=thumbnail&pithumbsize=500&format=json&origin=*")
        .then(function (r) { return r.json(); })
        .then(function (d) {
          var p = d.query && d.query.pages;
          if (!p) return;
          var k = Object.keys(p)[0];
          var t = p[k] && p[k].thumbnail;
          if (t && t.source) img.src = t.source;
        })
        .catch(function () {});
    });
  }
  setTimeout(fixPosters, 5000);
  setTimeout(fixPosters, 12000);

  /* 3. Trailer: error aaye to saaf message dikhao */
  var tf = document.getElementById("tf");
  var tl = document.getElementById("tl");
  var tm = document.getElementById("tm");
  var note = document.createElement("p");
  note.style.cssText = "color:#ffb4b4;margin:12px 0 0;text-align:center;display:none";
  note.textContent = "Ye trailer yahan nahi chal raha. Neeche wale link se YouTube par dekhein.";
  tm.insertBefore(note, tl);

  window.addEventListener("message", function (e) {
    if (String(e.origin).indexOf("youtube.com") === -1) return;
    var d;
    try { d = JSON.parse(e.data); } catch (x) { return; }
    if (d && d.event === "onError") {
      tf.style.display = "none";
      note.style.display = "block";
      tl.style.fontSize = "18px";
      tl.style.fontWeight = "bold";
    }
  });

  tf.addEventListener("load", function () {
    if (tf.src.indexOf("youtube.com/embed") === -1) return;
    try {
      tf.contentWindow.postMessage(JSON.stringify({ event: "listening", id: 1, channel: "widget" }), "*");
    } catch (x) {}
  });

  document.querySelectorAll(".card").forEach(function (card) {
    var m = card._m;
    var b = card.querySelector(".trailer");
    if (!m || !b) return;
    b.onclick = function (e) {
      e.preventDefault();
      var ytSearch = "https://www.youtube.com/results?search_query=" +
        encodeURIComponent(m.title + " trailer Hindi");
      if (!m.trailerId || m.trailerId.length !== 11) {
        window.open(ytSearch, "_blank");
        return;
      }
      note.style.display = "none";
      tf.style.display = "";
      tf.src = "https://www.youtube.com/embed/" + m.trailerId +
        "?autoplay=1&enablejsapi=1&origin=" + encodeURIComponent(location.origin);
      tl.href = ytSearch;
      tm.style.display = "flex";
    };
  });
})();
