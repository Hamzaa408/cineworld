var AVG="the-avengers-2012,avengers-age-of-ultron-2015,avengers-infinity-war-2018,avengers-endgame";
var MI="mission-impossible-1996,mission-impossible-2-2000,mission-impossible-3-2006,mission-impossible-ghost-protocol-2011,mission-impossible-rogue-nation-2015,mission-impossible-fallout-2018,mission-impossible-dead-reckoning-2023,mission-impossible-final-reckoning-2025";
var DATA={
"Tom Cruise":"endless-love-1981,taps-1981,losin-it-1983,the-outsiders-1983,risky-business-1983,all-the-right-moves-1983,legend-1985,top-gun-1986,the-color-of-money-1986,cocktail-1988,rain-man-1988,born-on-the-fourth-of-july-1989,days-of-thunder-1990,far-and-away-1992,a-few-good-men-1992,the-firm-1993,interview-with-the-vampire-1994,jerry-maguire-1996,eyes-wide-shut-1999,magnolia-1999,vanilla-sky-2001,minority-report-2002,the-last-samurai-2003,collateral-2004,war-of-the-worlds-2005,lions-for-lambs-2007,tropic-thunder-2008,valkyrie-2008,knight-and-day-2010,rock-of-ages-2012,jack-reacher-2012,oblivion-2013,edge-of-tomorrow-2014,jack-reacher-never-go-back-2016,the-mummy-2017,american-made-2017,top-gun-maverick-2022,digger-2026,"+MI,
"Robert Downey Jr.":"chaplin-1992,kiss-kiss-bang-bang-2005,zodiac-2007,tropic-thunder-2008-rdj,iron-man-2008,incredible-hulk-2008,sherlock-holmes-2009,iron-man-2-2010,due-date-2010,sherlock-holmes-a-game-of-shadows-2011,iron-man-3-2013,the-judge-2014,captain-america-civil-war-2016,spider-man-homecoming-2017,dolittle-2020,oppenheimer-2023,avengers-doomsday,"+AVG,
"Chris Evans":"captain-america-2011,captain-winter-soldier-2014,captain-america-civil-war-2016,deadpool-wolverine,avengers-doomsday,"+AVG,
"Chris Hemsworth":"thor-2011,thor-dark-world-2013,thor-ragnarok-2017,extraction-2020,thor-love-thunder-2022,avengers-doomsday,"+AVG,
"Scarlett Johansson":"iron-man-2-2010,captain-winter-soldier-2014,captain-america-civil-war-2016,black-widow-2021,"+AVG,
"Tom Holland":"captain-america-civil-war-2016,spider-man-homecoming-2017,spider-man-far-from-home-2019,spiderman-no-way-home,spider-man-brand-new-day-2026,avengers-infinity-war-2018,avengers-endgame",
"Zendaya":"spider-man-homecoming-2017,spider-man-far-from-home-2019,spiderman-no-way-home,spider-man-brand-new-day-2026,dune-part-two,dune-part-three-2026",
"Timothee Chalamet":"dune-part-two,dune-part-three-2026",
"Chris Pratt":"guardians-galaxy-2014,guardians-galaxy-vol2-2017,guardians-galaxy-vol3-2023,thor-love-thunder-2022,super-mario-bros-movie,avengers-infinity-war-2018,avengers-endgame",
"Benedict Cumberbatch":"doctor-strange-2016,doctor-strange-multiverse-2022,thor-ragnarok-2017,spiderman-no-way-home,avengers-doomsday,avengers-infinity-war-2018,avengers-endgame",
"Chadwick Boseman":"black-panther-2018,captain-america-civil-war-2016,avengers-infinity-war-2018,avengers-endgame",
"Ryan Reynolds":"deadpool-2016,deadpool-2-2018,deadpool-wolverine,red-notice-2021",
"Dwayne Johnson":"the-mummy-returns-2001,the-scorpion-king-2002,the-rundown-2003,walking-tall-2004,gridiron-gang-2006,get-smart-2008,race-to-witch-mountain-2009,fast-five-2011,fast-furious-6-2013,g-i-joe-retaliation-2013,san-andreas-2015,furious-7-2015,central-intelligence-2016,moana-2016,fate-of-the-furious-2017,jumanji-welcome-to-the-jungle-2017,rampage-2018,skyscraper-2018,hobbs-shaw-2019,jumanji-the-next-level-2019,jungle-cruise-2021,red-notice-2021,black-adam-2022,moana-live-action-2026",
"Vin Diesel":"fast-furious-2001,tokyo-drift-2006,fast-furious-2009,fast-five-2011,fast-furious-6-2013,furious-7-2015,fate-of-the-furious-2017,f9-2021,fast-x-2023,bloodshot-2020,guardians-galaxy-2014,guardians-galaxy-vol2-2017,guardians-galaxy-vol3-2023,avengers-infinity-war-2018",
"Paul Walker":"varsity-blues-1999,shes-all-that-1999,the-skulls-2000,fast-furious-2001,joy-ride-2001,2-fast-2-furious-2003,timeline-2003,into-the-blue-2005,eight-below-2006,running-scared-2006,fast-furious-2009,takers-2010,fast-five-2011,hours-2013,fast-furious-6-2013,brick-mansions-2014,furious-7-2015",
"Gal Gadot":"fast-furious-2009,fast-five-2011,fast-furious-6-2013,batman-v-superman-2016,wonder-woman-2017,justice-league-2017,wonder-woman-1984,red-notice-2021",
"Henry Cavill":"man-of-steel-2013,batman-v-superman-2016,justice-league-2017,mission-impossible-fallout-2018,enola-holmes-2020",
"Jason Momoa":"batman-v-superman-2016,justice-league-2017,aquaman-2018,dune-part-two,aquaman-lost-kingdom-2023,fast-x-2023,street-fighter-2026",
"Margot Robbie":"suicide-squad-2016,birds-of-prey-2020,the-suicide-squad-2021",
"Will Smith":"suicide-squad-2016,bad-boys-for-life-2020",
"Robert Pattinson":"tenet-2020,the-batman-2022",
"Joaquin Phoenix":"joker-2019,joker-folie-a-deux-2024",
"Sean Connery":"dr-no-1962,from-russia-with-love-1963,goldfinger-1964,thunderball-1965,you-only-live-twice-1967,diamonds-are-forever-1971",
"Roger Moore":"live-and-let-die-1973,the-man-with-the-golden-gun-1974,the-spy-who-loved-me-1977,moonraker-1979,for-your-eyes-only-1981,octopussy-1983,a-view-to-a-kill-1985",
"Timothy Dalton":"the-living-daylights-1987,licence-to-kill-1989",
"Pierce Brosnan":"goldeneye-1995,tomorrow-never-dies-1997,the-world-is-not-enough-1999,die-another-day-2002",
"Daniel Craig":"casino-royale-2006,quantum-of-solace-2008,skyfall-2012,spectre-2015,no-time-to-die-2021",
"Shah Rukh Khan":"king-2026",
"Deepika Padukone":"chhapaak-2020,king-2026",
"Ayushmann Khurrana":"shubh-mangal-zyada-saavdhan-2020,udta-teer-2026",
"Sara Ali Khan":"love-aaj-kal-2020,udta-teer-2026",
"Allu Arjun":"ala-vaikunthapurramuloo-2020",
"Mahesh Babu":"sarileru-neekevvaru-2020"
};
var ACTORS={};
Object.keys(DATA).forEach(function(n){ACTORS[n]=DATA[n].split(",");});

(function(){
  var cur="all";
  var menu=document.getElementById("menu");
  var sel=document.createElement("select");
  sel.id="actorSelect";
  sel.innerHTML='<option value="all">Actors</option>';
  Object.keys(ACTORS).sort().forEach(function(name){
    var o=document.createElement("option");
    o.value=name;o.textContent=name;
    sel.appendChild(o);
  });
  menu.appendChild(sel);
  function applyActor(){
    var list=ACTORS[cur];
    var shown=0;
    document.querySelectorAll(".card").forEach(function(card){
      var id=card._m&&card._m.id;
      if(cur!=="all"&&!(list&&list.indexOf(id)!==-1)) card.style.display="none";
      if(card.style.display!=="none") shown++;
    });
    var msg=document.getElementById("emptyMsg");
    if(msg) msg.style.display=shown?"none":"block";
  }
  document.addEventListener("change",function(e){
    if(e.target===sel){
      cur=sel.value;
      sel.classList.toggle("active",cur!=="all");
      applyFilters();
      applyActor();
    }else if(cur!=="all"){applyActor();}
  });
  document.addEventListener("click",function(){if(cur!=="all")applyActor();});
  document.addEventListener("input",function(){if(cur!=="all")applyActor();});
})();
