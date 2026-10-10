(function(){
  var old=document.getElementById("actorSelect");
  if(old) old.remove();
  var cur="all";
  var menu=document.getElementById("menu");
  var btn=document.createElement("button");
  btn.id="actorBtn";
  btn.textContent="🎭 Actors";
  menu.appendChild(btn);

  var css=document.createElement("style");
  css.textContent=
    "#actorModal{position:fixed;inset:0;background:rgba(0,0,0,.75);display:none;align-items:flex-end;justify-content:center;z-index:1000}"+
    "#actorModal .sheet{background:#171717;width:100%;max-width:520px;max-height:80vh;border-radius:18px 18px 0 0;display:flex;flex-direction:column;overflow:hidden}"+
    "#actorModal .top{display:flex;gap:8px;padding:14px;border-bottom:1px solid #292929}"+
    "#actorSearch{flex:1;padding:11px;border:1px solid #333;border-radius:10px;background:#222;color:#fff;font-size:15px;outline:none}"+
    "#actorClose{background:#333;color:#fff;border:0;border-radius:10px;padding:0 14px;font-size:16px;cursor:pointer}"+
    "#actorList{overflow-y:auto;padding:8px 10px 20px}"+
    ".actorItem{display:flex;justify-content:space-between;align-items:center;padding:13px 12px;margin:6px 0;background:#222;border-radius:10px;font-weight:bold;cursor:pointer}"+
    ".actorItem small{background:#e50914;border-radius:12px;padding:3px 9px;font-size:12px}"+
    ".actorItem.active{outline:2px solid #a855f7}";
  document.head.appendChild(css);

  var modal=document.createElement("div");
  modal.id="actorModal";
  modal.innerHTML='<div class="sheet"><div class="top"><input id="actorSearch" type="text" placeholder="Actor ka naam dhoondo..."><button id="actorClose">✕</button></div><div id="actorList"></div></div>';
  document.body.appendChild(modal);
  var listEl=document.getElementById("actorList");
  var searchEl=document.getElementById("actorSearch");

  function count(name){
    var l=ACTORS[name];
    return movies.filter(function(m){return l.indexOf(m.id)!==-1}).length;
  }

  function buildList(){
    var q=searchEl.value.toLowerCase().trim();
    var items=Object.keys(ACTORS).map(function(n){return {n:n,c:count(n)}})
      .filter(function(x){return x.c>0&&(!q||x.n.toLowerCase().indexOf(q)!==-1)})
      .sort(function(a,b){return b.c-a.c||a.n.localeCompare(b.n)});
    listEl.innerHTML="";
    var all=document.createElement("div");
    all.className="actorItem"+(cur==="all"?" active":"");
    all.innerHTML="<span>Sab movies (All)</span>";
    all.onclick=function(){choose("all")};
    listEl.appendChild(all);
    items.forEach(function(x){
      var d=document.createElement("div");
      d.className="actorItem"+(cur===x.n?" active":"");
      d.innerHTML="<span>"+x.n+"</span><small>"+x.c+"</small>";
      d.onclick=function(){choose(x.n)};
      listEl.appendChild(d);
    });
  }

  function applyActor(){
    var l=ACTORS[cur];
    var shown=0;
    document.querySelectorAll(".card").forEach(function(card){
      var id=card._m&&card._m.id;
      if(cur!=="all"&&!(l&&l.indexOf(id)!==-1)) card.style.display="none";
      if(card.style.display!=="none") shown++;
    });
    var msg=document.getElementById("emptyMsg");
    if(msg) msg.style.display=shown?"none":"block";
  }

  function choose(name){
    cur=name;
    var allBtn=document.querySelector('#menu button[data-ind="all"]'); if(allBtn) allBtn.click();
    btn.textContent=cur==="all"?"🎭 Actors":"🎭 "+cur;
    btn.classList.toggle("active",cur!=="all");
    modal.style.display="none";
    applyFilters();
    applyActor();
  }

  btn.onclick=function(){
    searchEl.value="";
    buildList();
    modal.style.display="flex";
  };
  document.getElementById("actorClose").onclick=function(){modal.style.display="none"};
  modal.onclick=function(e){if(e.target===modal) modal.style.display="none"};
  searchEl.oninput=buildList;

  ["click","input","change"].forEach(function(ev){
    document.addEventListener(ev,function(){
      if(cur!=="all") setTimeout(applyActor,0);
    });
  });
})();
