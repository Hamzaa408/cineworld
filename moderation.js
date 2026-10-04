(function () {
  var BAD_WORDS = [
    "fuck", "shit", "bitch", "asshole", "bastard", "whore",
    "madarchod", "behenchod", "bhenchod", "chutiya", "chutiye",
    "gandu", "harami", "haramzada", "kamina", "kutta", "kuttiya",
    "randi", "bhosdi", "bhosda", "lauda", "loda"
  ];
  var WAIT_MS = 10000;
  var lastSend = 0;
  function clean(s) {
    s = String(s).toLowerCase()
      .replace(/@/g, "a").replace(/0/g, "o").replace(/[1!|]/g, "i")
      .replace(/3/g, "e").replace(/[$5]/g, "s");
    s = s.replace(/[^a-z\s]/g, "");
    return s.replace(/(.)\1+/g, "$1");
  }
  var BAD = BAD_WORDS.map(clean);
  function allowed(name, text) {
    var t = clean(name + " " + text);
    for (var i = 0; i < BAD.length; i++) {
      if (t.indexOf(BAD[i]) !== -1) {
        alert("Is tarah ke alfaaz allowed nahi hain.");
        return false;
      }
    }
    if (/(https?:\/\/|www\.|\.(com|net|org|pk|in|io|xyz)\b)/i.test(text)) {
      alert("Links allowed nahi hain.");
      return false;
    }
    if (Date.now() - lastSend < WAIT_MS) {
      alert("Thoda ruko, 10 second baad dobara likho.");
      return false;
    }
    lastSend = Date.now();
    return true;
  }
  document.addEventListener("submit", function (e) {
    var f = e.target, nameEl, textEl;
    if (f && f.id === "chatForm") {
      nameEl = document.getElementById("chatName");
      textEl = document.getElementById("chatInput");
    } else if (f && f.id === "cmForm") {
      nameEl = document.getElementById("cmName");
      textEl = document.getElementById("cmText");
    } else {
      return;
    }
    if (!nameEl || !textEl) return;
    if (!allowed(nameEl.value, textEl.value)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);
})();
