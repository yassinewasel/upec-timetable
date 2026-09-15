/* =========================================================
   1) CATALOGUE CENTRAL
   ---------------------------------------------------------
   Pour ajouter une matière/prof/salle récurrente, on la
   définit UNE seule fois ici. Les semaines restent compactes.
========================================================= */

const CATALOG = {
  subjects: {
    DEV:      {label:"SAE3.A.01 DEV", color:"sae"},
    DATA:     {label:"SAE3.C.01 DATA", color:"sae"},
    WEB:      {label:"R3.01 Web", color:"web"},
    DEVEFF:   {label:"R3.02 DévEff", color:"deveff"},
    ANALYSE:  {label:"R3.03 Analyse", color:"analyse"},
    QDEV:     {label:"R3.04 QDév", color:"qdev"},
    PROGSYS:  {label:"R3.05 ProgSys", color:"progsys"},
    CRYPTO:   {label:"R3.09 Crypto", color:"crypto"},
    SYSINFO:  {label:"R3.10 SysInfo", color:"sysinfo"},
    DROIT:    {label:"R3.11 Droit", color:"droit"},
    ANGLAIS:  {label:"R3.12 Anglais", color:"anglais"},
    COMM:     {label:"R3.13 Comm", color:"comm"},
    PPP:      {label:"R3.14 PPP", color:"ppp"}
  },

  teachers: {
    AUT_A:"Autonomie FI2A",
    AUT_C:"Autonomie FI2C",
    DELECHELLE:"DELECHELLE",
    BELAICHE:"BELAICHE",
    GIZZINI:"GIZZINI",
    CHIBANI:"CHIBANI",
    CASTRO:"CASTRO",
    ALCOLEI:"ALCOLEI",
    CARTIER:"CARTIER",
    MASSERON:"MASSERON",
    BRIQUET:"BRIQUET",
    LEMEUNIER:"LEMEUNIER",
    LORAUD:"LORAUD",
    BOUAOUNE:"BOUAOUNE",
    ATTAL:"ATTAL",
    BEGUE:"BEGUE"
  },

  rooms: {
    A:"INFO-019",
    C:"INFO-112",
    BOTH:"INFO-019 / INFO-112",
    AMP_CHIMIE:"AMPHI CHIMIE",
    RT_AMPHI:"RT-AMPHI",
    RT115:"RT-115"
  }
};

/* =========================================================
   2) PRESETS
   ---------------------------------------------------------
   Une ligne de cours devient très courte :
   c(0,"A_DEV","09:45","12:45")

   Si un détail change :
   c(0,"A_DEV","14:00","17:00",{room:"A"})
========================================================= */

const PRESETS = {
  A_DEV:   p("A","DEV","BOTH","AUT_A","Proj"),
  C_DATA:  p("C","DATA","BOTH","AUT_C","Proj"),

  A_WEB:   p("A","WEB","A","DELECHELLE","TD"),
  C_WEB:   p("C","WEB","C","BEGUE","TD"),
  CM_WEB:  p("shared","WEB","AMP_CHIMIE","DELECHELLE","CM"),

  A_DEVEFF:p("A","DEVEFF","A","BELAICHE","TD"),
  C_DEVEFF:p("C","DEVEFF","C","ALCOLEI","TD"),
  CM_DEVEFF:p("shared","DEVEFF","AMP_CHIMIE","BELAICHE","CM"),

  A_ANALYSE:p("A","ANALYSE","A","BELAICHE","TD"),
  C_ANALYSE:p("C","ANALYSE","C","GIZZINI","TP"),

  A_QDEV:  p("A","QDEV","A","BELAICHE","TD"),
  C_QDEV:  p("C","QDEV","C","CASTRO","TD"),
  CM_QDEV: p("shared","QDEV","AMP_CHIMIE","BELAICHE","CM"),

  A_PROGSYS:p("A","PROGSYS","A","CHIBANI","TD"),
  C_PROGSYS:p("C","PROGSYS","C","GIZZINI","TD"),
  CM_PROGSYS:p("shared","PROGSYS","RT_AMPHI","CHIBANI","CM"),

  A_CRYPTO:p("A","CRYPTO","A","MASSERON","TD"),
  C_CRYPTO:p("C","CRYPTO","C","CARTIER","TD"),
  CM_CRYPTO:p("shared","CRYPTO","RT_AMPHI","CARTIER","CM"),

  A_SYSINFO:p("A","SYSINFO","A","CHIBANI","TD"),
  C_SYSINFO:p("C","SYSINFO","C","ATTAL","TD"),
  CM_SYSINFO:p("shared","SYSINFO","RT_AMPHI","CHIBANI","CM"),

  CM_DROIT:p("shared","DROIT","RT_AMPHI","BRIQUET","CM"),

  A_ANGLAIS:p("A","ANGLAIS","RT115","LEMEUNIER","TP"),
  C_ANGLAIS:p("C","ANGLAIS","RT115","LEMEUNIER","TP"),

  A_COMM:p("A","COMM","A","LORAUD","TP"),
  C_COMM:p("C","COMM","C","LORAUD","TP"),

  A_PPP:p("A","PPP","A","BOUAOUNE","TD"),
  C_PPP:p("C","PPP","C","BOUAOUNE","TD")
};

function p(group,subject,room,teacher,type){
  return {group,subject,room,teacher,type};
}

/* =========================================================
   3) DONNÉES DES SEMAINES
   ---------------------------------------------------------
   C'EST LA SEULE ZONE À MODIFIER POUR UNE NOUVELLE SEMAINE.

   Exemple nouvelle semaine :
   42: {
     range:"12 → 16 octobre",
     days:[["Lundi","12/10"], ...],
     events:[
       c(0,"A_DEV","09:45","12:45"),
       c(0,"C_DATA","09:45","12:45"),
       c(1,"A_WEB","14:00","17:00")
     ]
   }

   Jour : 0=lundi, 1=mardi, 2=mercredi, 3=jeudi, 4=vendredi
========================================================= */

const FALLBACK_WEEKS = {
  38:{
    range:"14 → 18 septembre",
    days:[["Lundi","14/09"],["Mardi","15/09"],["Mercredi","16/09"],["Jeudi","17/09"],["Vendredi","18/09"]],
    events:[
      c(0,"A_DEV","09:45","12:45"),
      c(0,"C_DATA","09:45","12:45"),
      c(0,"CM_WEB","14:00","15:30"),
      c(0,"CM_QDEV","15:45","17:15"),
      c(0,"CM_DEVEFF","17:30","19:00"),

      c(1,"CM_PROGSYS","09:30","11:00"),
      c(1,"A_WEB","11:15","12:45"),
      c(1,"C_ANALYSE","11:15","12:45"),
      c(1,"A_WEB","14:00","17:00"),
      c(1,"C_PROGSYS","14:00","15:30"),
      c(1,"C_QDEV","15:45","18:45"),

      c(2,"A_QDEV","09:30","11:00"),
      c(2,"C_WEB","09:45","12:45"),
      c(2,"A_COMM","11:15","11:55"),
      c(2,"A_ANGLAIS","12:00","12:45"),
      c(2,"A_CRYPTO","14:00","17:00"),
      c(2,"A_DEVEFF","17:15","18:45"),
      c(2,"C_ANGLAIS","14:00","14:40"),
      c(2,"C_COMM","14:45","15:30"),
      c(2,"C_DATA","15:45","17:15"),

      c(3,"A_PROGSYS","09:30","11:00"),
      c(3,"C_DEVEFF","09:30","11:00"),
      c(3,"A_ANALYSE","11:15","12:45"),
      c(3,"C_COMM","11:15","11:55"),
      c(3,"C_ANGLAIS","12:00","12:45"),
      c(3,"A_QDEV","14:00","15:30"),
      c(3,"C_ANALYSE","14:00","17:00"),
      c(3,"A_ANALYSE","15:45","18:45"),

      c(4,"CM_CRYPTO","08:00","09:30"),
      c(4,"A_ANGLAIS","09:45","10:25"),
      c(4,"A_COMM","10:30","11:10"),
      c(4,"C_CRYPTO","09:45","11:10"),
      c(4,"CM_DROIT","11:15","12:45"),
      c(4,"A_DEV","14:00","17:00"),
      c(4,"C_WEB","14:00","15:30"),
      c(4,"C_CRYPTO","15:45","17:15")
    ]
  },

  39:{
    range:"21 → 25 septembre",
    days:[["Lundi","21/09"],["Mardi","22/09"],["Mercredi","23/09"],["Jeudi","24/09"],["Vendredi","25/09"]],
    events:[
      c(0,"A_DEV","09:45","12:45"),
      c(0,"C_DATA","09:45","12:45"),
      c(0,"A_DEV","14:00","17:00",{room:"A"}),
      c(0,"C_DATA","14:00","17:00"),

      c(1,"A_DEV","09:45","12:45"),
      c(1,"C_DATA","09:45","12:45"),
      c(1,"A_DEV","14:00","17:00"),
      c(1,"C_DATA","14:00","17:00"),

      c(2,"A_DEV","09:45","12:45"),
      c(2,"C_DATA","09:45","12:45"),
      c(2,"A_DEV","14:00","15:30",{room:"A"}),
      c(2,"A_PPP","15:45","17:15"),
      c(2,"C_PPP","14:00","15:30"),
      c(2,"C_ANGLAIS","15:45","17:15",{room:"C",type:"TD"}),

      c(3,"A_COMM","09:30","11:00"),
      c(3,"A_ANGLAIS","11:15","12:45",{room:"A"}),
      c(3,"C_DATA","09:30","11:00",{room:"A"}),
      c(3,"C_COMM","11:15","12:45"),
      c(3,"A_DEV","14:00","17:00"),
      c(3,"C_DATA","14:00","17:00"),

      c(4,"A_DEV","09:00","12:00"),
      c(4,"C_DATA","09:00","12:00"),
      c(4,"A_DEV","14:00","17:00"),
      c(4,"C_DATA","14:00","17:00")
    ]
  },

  40:{
    range:"28 septembre → 2 octobre",
    days:[["Lundi","28/09"],["Mardi","29/09"],["Mercredi","30/09"],["Jeudi","01/10"],["Vendredi","02/10"]],
    events:[
      c(0,"A_DEVEFF","09:30","11:00"),
      c(0,"A_ANALYSE","11:15","12:45"),
      c(0,"C_ANALYSE","09:30","11:00"),
      c(0,"C_PROGSYS","11:15","12:45"),
      c(0,"A_DEVEFF","14:00","17:00"),
      c(0,"C_COMM","14:00","15:30",{slot:1}),
      c(0,"C_ANGLAIS","14:00","15:30",{slot:2}),
      c(0,"C_ANGLAIS","15:45","17:15",{slot:1}),
      c(0,"C_COMM","15:45","17:15",{slot:2}),
      c(0,"CM_QDEV","17:15","18:45"),

      c(1,"CM_SYSINFO","09:30","11:00"),
      c(1,"CM_CRYPTO","11:15","12:45"),
      c(1,"A_DEV","14:00","15:30",{room:"A"}),
      c(1,"A_PROGSYS","15:45","17:15"),
      c(1,"C_ANALYSE","14:00","17:00"),

      c(2,"A_DEV","09:45","12:45"),
      c(2,"C_DATA","09:45","12:45"),
      c(2,"A_WEB","14:00","17:00"),
      c(2,"C_CRYPTO","14:00","17:00"),
      c(2,"C_DEVEFF","17:15","18:45"),

      c(3,"A_ANALYSE","09:45","12:45"),
      c(3,"C_QDEV","09:45","12:45"),
      c(3,"A_QDEV","14:00","15:30"),
      c(3,"A_SYSINFO","15:45","17:15"),
      c(3,"C_SYSINFO","14:00","15:30"),
      c(3,"C_DATA","15:45","17:15",{room:"C"}),
      c(3,"CM_DROIT","17:15","18:45"),

      c(4,"A_ANGLAIS","08:45","10:15",{slot:1}),
      c(4,"A_COMM","08:45","10:15",{slot:2}),
      c(4,"A_COMM","10:30","12:00",{slot:1}),
      c(4,"A_ANGLAIS","10:30","12:00",{slot:2}),
      c(4,"C_WEB","09:00","12:00"),
      c(4,"A_CRYPTO","14:00","17:00"),
      c(4,"C_DEVEFF","14:00","17:00")
    ]
  },

  41:{
    range:"5 → 9 octobre",
    days:[["Lundi","05/10"],["Mardi","06/10"],["Mercredi","07/10"],["Jeudi","08/10"],["Vendredi","09/10"]],
    events:[
      c(0,"A_COMM","11:15","12:45"),
      c(0,"C_DATA","11:15","12:45",{room:"C"}),
      c(0,"A_ANGLAIS","14:00","15:30",{room:"A",type:"TD"}),
      c(0,"C_COMM","14:00","15:30"),
      c(0,"A_DEV","15:45","17:15"),
      c(0,"C_DATA","15:45","17:15",{teacher:"BEGUE"}),

      c(1,"A_PPP","11:15","12:45"),
      c(1,"C_DATA","11:15","12:45",{room:"C"}),
      c(1,"A_DEV","14:00","17:00",{room:"A"}),
      c(1,"C_DATA","14:00","17:00",{room:"C"}),

      c(2,"A_DEV","11:15","12:45",{room:"A"}),
      c(2,"C_DATA","11:15","12:45",{room:"C"}),
      c(2,"A_DEV","14:00","17:00",{room:"A"}),
      c(2,"C_DATA","14:00","17:00"),

      c(3,"A_DEV","09:45","12:45"),
      c(3,"C_PPP","09:30","11:00"),
      c(3,"C_DATA","11:15","12:45"),
      c(3,"A_DEV","14:00","15:30",{room:"A",teacher:"BEGUE"}),
      c(3,"C_DATA","14:00","15:30",{room:"C"}),

      c(4,"A_DEV","09:00","12:00"),
      c(4,"C_DATA","09:00","12:00"),
      c(4,"A_DEV","14:00","15:30",{room:"A"}),
      c(4,"C_ANGLAIS","14:00","15:30",{room:"C",type:"TD"})
    ]
  }
};

function c(day,preset,start,end,overrides={}){
  return {day,start,end,preset,...overrides};
}

/* =========================================================
   DONNÉES EXTERNES
   ---------------------------------------------------------
   Le site charge ./data/edt.json.
   Les semaines intégrées ci-dessus restent uniquement comme
   secours si le JSON est indisponible.
========================================================= */

let WEEKS=JSON.parse(JSON.stringify(FALLBACK_WEEKS));

function normalizeExternalRange(raw,weekNo){
  if(raw?.range) return raw.range;
  if(raw?.range_title){
    return raw.range_title
      .replace(/^Du lundi\s+/i,"")
      .replace(/\s+au vendredi\s+/i," → ")
      .replace(/\/(\d{2})(?=\b)/g,"/$1");
  }
  const days=(raw?.days||[]).map(d=>Array.isArray(d)?d:{name:d.name,date:d.date});
  if(days.length){
    return `${days[0].date||""} → ${days[days.length-1].date||""}`;
  }
  return `Semaine ${weekNo}`;
}

function normalizeExternalWeek(raw,weekNo){
  const days=(raw?.days||[]).map(d=>{
    if(Array.isArray(d)) return d;
    return [d?.name||"",d?.date||""];
  });

  const events=(raw?.events||[]).map(ev=>{
    const copy={...ev};

    // Les sous-groupes Formadep (ex. FI2A1/FI2A2) deviennent
    // les deux demi-colonnes déjà prévues dans l'interface.
    if(!copy.slot && copy.subgroup){
      if(/1$/.test(copy.subgroup)) copy.slot=1;
      else if(/2$/.test(copy.subgroup)) copy.slot=2;
    }

    return copy;
  });

  return {
    range:normalizeExternalRange(raw,weekNo),
    days,
    events
  };
}

async function loadExternalSchedule(formation=currentFormation){
    const requested=
      FORMATIONS[formation] ? formation : "FI2";

    const config=FORMATIONS[requested];

    try{
      const response=await fetch(
        `${config.json}?t=${Date.now()}`,
        {cache:"no-store"}
      );

      if(!response.ok){
        throw new Error(`HTTP ${response.status}`);
      }

      const payload=await response.json();
      const incoming=payload?.weeks||{};

      /*
       * FI2 garde ses données intégrées en secours.
       * FA2 utilise uniquement fa2.json.
       */
      const nextWeeks=
        requested==="FI2"
          ? JSON.parse(JSON.stringify(FALLBACK_WEEKS))
          : {};

      Object.entries(incoming).forEach(([weekNo,rawWeek])=>{
        const n=Number(weekNo);

        if(!Number.isFinite(n)) return;

        const normalized=normalizeExternalWeek(rawWeek,n);

        if(normalized.days.length){
          nextWeeks[n]=normalized;
        }
      });

      if(!Object.keys(nextWeeks).length){
        throw new Error(
          `Aucune semaine disponible pour ${requested}`
        );
      }

      currentFormation=requested;
      localStorage.setItem(
        FORMATION_KEY,
        currentFormation
      );

      WEEKS=nextWeeks;

      state.week=getAutoWeek();
      state.manualWeek=false;

      const dayCount=
        WEEKS[state.week]?.days?.length||1;

      state.day=Math.max(
        0,
        Math.min(state.day,dayCount-1)
      );

      syncFormationUI();
      renderAll();

    }catch(err){
      console.warn(
        `Impossible de charger ${requested}`,
        err
      );

      /*
       * Si FA2 échoue, retour sûr vers FI2.
       */
      if(requested==="FA2"){
        currentFormation="FI2";
        localStorage.setItem(
          FORMATION_KEY,
          "FI2"
        );

        syncFormationUI();

        return loadExternalSchedule("FI2");
      }

      /*
       * Secours ultime FI2.
       */
      WEEKS=
        JSON.parse(
          JSON.stringify(FALLBACK_WEEKS)
        );

      currentFormation="FI2";
      state.week=getAutoWeek();
      state.manualWeek=false;

      syncFormationUI();
      renderAll();
    }
  }

  function syncFormationUI(){

    const customLabel =
      document.getElementById("formationCustomLabel");

    if(customLabel){
      customLabel.textContent=currentFormation;
    }

    document
      .querySelectorAll(".formation-custom-option")
      .forEach(option=>{
        const active =
          option.dataset.formation===currentFormation;

        option.classList.toggle("active",active);

        option.setAttribute(
          "aria-selected",
          active ? "true" : "false"
        );
      });


    const select=
      document.getElementById("formationSelect");

    if(select){
      select.value=currentFormation;
    }

    const brand=
      document.querySelector(".edt-brand-subtitle");

    if(brand){
      brand.textContent="BUT Informatique · UPEC";
    }

    document.documentElement.dataset.formation=
      currentFormation;
  }

  async function switchFormation(formation){
    if(
      !FORMATIONS[formation] ||
      formation===currentFormation
    ){
      return;
    }

    const select=
      document.getElementById("formationSelect");

    if(select){
      select.disabled=true;
    }

    try{
      await loadExternalSchedule(formation);
    }finally{
      if(select){
        select.disabled=false;
      }
    }
  }

  /* =========================================================
     4) MOTEUR - normalement, tu n'y touches jamais
========================================================= */

const START_HOUR=8;
const END_HOUR=19;
const LS_KEY="edt-fi2-state-v2";
  const FORMATION_KEY="edt-formation-v1";

  const FORMATIONS={
    FI2:{
      id:"FI2",
      json:"./data/edt.json",
      groups:["A","C"],
      labels:["FI2A","FI2C"],
      subtitle:"FI2A / FI2C"
    },

    FA2:{
      id:"FA2",
      json:"./data/fa2.json",
      groups:["A","C"],
      labels:["FA2A","FA2C"],
      subtitle:"FA2A / FA2C"
    }
  };

  let currentFormation=
    localStorage.getItem(FORMATION_KEY)==="FA2"
      ? "FA2"
      : "FI2";

const ACADEMIC_YEAR = 2026;

/* =========================================================
   SÉLECTION AUTOMATIQUE DE LA SEMAINE
   ---------------------------------------------------------
   Chaque semaine devient "active" le vendredi précédent
   à 19:00.

   Exemple :
   - S38 commence le lundi 14/09
   - elle devient active vendredi 11/09 à 19:00
   - S39 devient active vendredi 18/09 à 19:00

   Résultat :
   vendredi 18/09 à 18:59 -> S38
   vendredi 18/09 à 19:00 -> S39
   samedi / dimanche -> S39
========================================================= */

function parseFrenchDate(ddmm){
  const [day,month]=ddmm.split("/").map(Number);
  return new Date(ACADEMIC_YEAR,month-1,day,0,0,0,0);
}

function getWeekActivationDate(weekNo){
  const week=WEEKS[weekNo];
  if(!week || !week.days?.length) return null;

  const monday=parseFrenchDate(week.days[0][1]);

  // vendredi précédent = lundi - 3 jours
  const activation=new Date(monday);
  activation.setDate(activation.getDate()-3);
  activation.setHours(19,0,0,0);

  return activation;
}

function getAutoWeek(now=new Date()){
  const weekNumbers=Object.keys(WEEKS).map(Number).sort((a,b)=>a-b);

  let selected=weekNumbers[0];

  for(const weekNo of weekNumbers){
    const activation=getWeekActivationDate(weekNo);
    if(activation && now>=activation){
      selected=weekNo;
    }else{
      break;
    }
  }

  return selected;
}

function autoMode(){
  return window.matchMedia("(max-width:700px)").matches ? "day" : "week";
}

/*
  À chaque nouveau chargement du site, on repart de la
  semaine correspondant réellement à la date actuelle.
  Un choix manuel reste possible ensuite pendant la session.
*/
let state={
  week:getAutoWeek(),
  day:Number(localStorage.getItem(LS_KEY+"-day")) || 0,
  mode:localStorage.getItem(LS_KEY+"-mode") || autoMode(),
  manualWeek:false
};

state.day=Math.min(4,Math.max(0,state.day));

function resolveEvent(raw){
  const preset=PRESETS[raw.preset] || {};
  const subjectKey=raw.subject || preset.subject;
  const subject=CATALOG.subjects[subjectKey] || {
    label:String(subjectKey||"Cours")
      .replace(/-/g," ")
      .replace(/\s+/g," ")
      .trim(),
    color:"sae"
  };

  const roomKey=raw.room || preset.room;
  const teacherKey=raw.teacher || preset.teacher;

  return {
    ...preset,
    ...raw,
    subjectLabel:subject.label,
    color:raw.color || subject.color,
    roomLabel:CATALOG.rooms[roomKey] || roomKey || "",
    teacherLabel:CATALOG.teachers[teacherKey] || teacherKey || "",
    type:raw.type || preset.type || ""
  };
}

function timeToDecimal(t){
  const [h,m]=t.split(":").map(Number);
  return h+m/60;
}

function pos(decimal){
  return ((decimal-START_HOUR)/(END_HOUR-START_HOUR))*100;
}

function renderAll(){
  renderWeekButtons();
  renderDayNav();
  renderMain();
  persist();
}

function persist(){
  // La semaine n'est volontairement pas mémorisée :
  // au prochain chargement, la date réelle reprend la main.
  localStorage.setItem(LS_KEY+"-day",state.day);
  localStorage.setItem(LS_KEY+"-mode",state.mode);
}

function renderWeekButtons(){
  const strip=document.getElementById("weekStrip");
  const automaticWeek=getAutoWeek();

  strip.innerHTML="";

  Object.keys(WEEKS).map(Number).sort((a,b)=>a-b).forEach(n=>{
    const b=document.createElement("button");

    b.className=
      "btn week-btn"+
      (n===state.week ? " active" : "")+
      (n===automaticWeek ? " auto-week" : "");

    b.type="button";
    b.textContent=`S${n}`;

    if(n===automaticWeek){
      b.title="Semaine correspondant à la date actuelle";
    }

    b.addEventListener("click",()=>{
      state.week=n;
      state.manualWeek=true;
      state.day=Math.min(state.day,WEEKS[n].days.length-1);
      renderAll();
    });

    strip.appendChild(b);
  });

  document.getElementById("weekViewBtn").classList.toggle("active",state.mode==="week");
  document.getElementById("dayViewBtn").classList.toggle("active",state.mode==="day");

  const todayBtn=document.getElementById("todayBtn");
  if(todayBtn){
    todayBtn.textContent=state.manualWeek
      ? `Aujourd’hui · S${automaticWeek}`
      : `Aujourd’hui · S${state.week}`;
  }
}

function renderDayNav(){
  const nav=document.getElementById("dayNav");
  nav.innerHTML="";
  const week=WEEKS[state.week];

  // Jour précédent
  const prev=document.createElement("button");
  prev.type="button";
  prev.className="nav-arrow";
  prev.setAttribute("aria-label","Jour précédent");
  prev.textContent="‹";
  prev.disabled=state.day===0;
  prev.addEventListener("click",()=>{
    if(state.day>0){
      state.day--;
      state.mode="day";
      renderAll();
    }
  });
  nav.appendChild(prev);

  // Les 5 jours restent toujours accessibles en vue Jour.
  week.days.forEach((d,i)=>{
    const b=document.createElement("button");
    b.type="button";
    b.className=i===state.day?"active":"";
    b.setAttribute("aria-label",`${d[0]} ${d[1]}`);
    b.innerHTML=`${d[0].slice(0,3)}<br><small>${d[1]}</small>`;
    b.addEventListener("click",()=>{
      state.day=i;
      state.mode="day";
      renderAll();
    });
    nav.appendChild(b);
  });

  // Jour suivant
  const next=document.createElement("button");
  next.type="button";
  next.className="nav-arrow";
  next.setAttribute("aria-label","Jour suivant");
  next.textContent="›";
  next.disabled=state.day===week.days.length-1;
  next.addEventListener("click",()=>{
    if(state.day<week.days.length-1){
      state.day++;
      state.mode="day";
      renderAll();
    }
  });
  nav.appendChild(next);

  // Sur petit écran, garde automatiquement le jour actif visible.
  requestAnimationFrame(()=>{
    const active=nav.querySelector("button.active");
    active?.scrollIntoView({
      behavior:"smooth",
      block:"nearest",
      inline:"center"
    });
  });
}

function renderMain(){
  const week=WEEKS[state.week];
  const card=document.getElementById("mainCard");
  card.classList.toggle("mode-day",state.mode==="day");
  card.classList.toggle("mode-week",state.mode==="week");

  const formationConfig=
      FORMATIONS[currentFormation];

    document.getElementById("subtitle").textContent=
      `BUT Informatique · ${formationConfig.subtitle} · Semaine ${state.week} · ${week.range}`;

  const visibleDays=state.mode==="day" ? [state.day] : [0,1,2,3,4];
  renderSchedule(document.getElementById("schedule"),week,visibleDays);

  requestAnimationFrame(()=>{
    if(state.mode==="week"){
      const sc=document.getElementById("scheduleScroll");
      sc.scrollLeft=0;
    }
  });
}

function renderSchedule(root,week,visibleDays){
    const FORMATION_CONFIG=
      FORMATIONS[currentFormation];

    root.innerHTML='<div class="corner">Heure</div>';
  root.style.setProperty("--day-count",visibleDays.length);

  // colonnes de l'en-tête
  visibleDays.forEach((dayIndex,visualIndex)=>{
    const d=week.days[dayIndex];
    const h=document.createElement("div");
    h.className="day-header";
    h.style.gridColumn=visualIndex+2;
    h.innerHTML=`
      <div class="day">${d[0]}</div>
      <div class="date">${d[1]}</div>
      <div class="group-labels ${FORMATION_CONFIG.groups.length===3?"fa2":""}">
          ${FORMATION_CONFIG.labels
            .map(label=>`<span>${label}</span>`)
            .join("")}
        </div>
    `;
    root.appendChild(h);
  });

  // heures
  const timeCol=document.createElement("div");
  timeCol.className="time-column";
  root.appendChild(timeCol);

  for(let t=START_HOUR;t<=END_HOUR+0.001;t+=0.25){
    const h=Math.floor(t);
    const m=Math.round((t-h)*60);
    const el=document.createElement("div");
    el.className="time-label"+(m===0?" hour":"");
    el.textContent=m===0 ? `${String(h).padStart(2,"0")}:00` : String(m).padStart(2,"0");

    if(Math.abs(t-START_HOUR)<0.001) el.classList.add("first");
    else if(Math.abs(t-END_HOUR)<0.001) el.classList.add("last");
    else el.style.top=pos(t)+"%";

    timeCol.appendChild(el);
  }

  // zone des cours
  const area=document.createElement("div");
  area.className="days-area";
  area.style.gridColumn=`2 / ${visibleDays.length+2}`;
  root.appendChild(area);

  const dayWidth=100/visibleDays.length;

  visibleDays.forEach((_,visualIndex)=>{
    const col=document.createElement("div");
    col.className=
        "day-column"+
        (FORMATION_CONFIG.groups.length===3
          ? " fa2"
          : "");

      col.style.left=(visualIndex*dayWidth)+"%";
    col.style.width=dayWidth+"%";
    area.appendChild(col);
  });

  week.events.map(resolveEvent).forEach(ev=>{
    const visualIndex=visibleDays.indexOf(ev.day);
    if(visualIndex<0) return;

    let start=Math.max(timeToDecimal(ev.start),START_HOUR);
    let end=Math.min(timeToDecimal(ev.end),END_HOUR);
    if(end<=START_HOUR || start>=END_HOUR) return;

    const el=document.createElement("div");
    el.className="event";
    if(ev.color && /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(ev.color)){
      el.style.backgroundColor=ev.color;
    }else{
      el.classList.add(ev.color||"sae");
    }
    if(ev.group==="shared") el.classList.add("shared");
    if(ev.slot) el.classList.add("subgroup");

    const dayLeft=visualIndex*dayWidth;
    const gutter=Math.max(.12,dayWidth*.009);

    let left,width;

    if(ev.group==="shared"){
        left=dayLeft+gutter;
        width=dayWidth-gutter*2;

      }else{
        const groupIndex=
          FORMATION_CONFIG.groups.indexOf(
            ev.group
          );

        if(groupIndex<0){
          return;
        }

        const groupWidth=
          dayWidth /
          FORMATION_CONFIG.groups.length;

        const groupLeft=
          dayLeft +
          groupIndex*groupWidth;

        if(ev.slot===1){
          left=groupLeft+gutter;
          width=
            groupWidth/2 -
            gutter*1.2;

        }else if(ev.slot===2){
          left=
            groupLeft +
            groupWidth/2 +
            gutter/2;

          width=
            groupWidth/2 -
            gutter*1.2;

        }else{
          left=groupLeft+gutter;
          width=
            groupWidth -
            gutter*1.5;
        }
      }

    const duration=end-start;
    el.style.left=left+"%";
    el.style.width=width+"%";
    el.style.top=pos(start)+"%";
    el.style.height=((duration/(END_HOUR-START_HOUR))*100)+"%";

    if(duration<=.8) el.classList.add("small");

    el.innerHTML=`
      <div class="event-time">${ev.start}–${ev.end}</div>
      <div class="event-title">${ev.subjectLabel}</div>
      <div class="event-room">${ev.roomLabel}${ev.type?" · "+ev.type:""}</div>
      <div class="event-teacher">${ev.teacherLabel}</div>
    `;

    area.appendChild(el);
  });
}

/* =========================================================
   5) EXPORT PNG
   Toujours exporté en vue SEMAINE complète 1080 px
========================================================= */

async function saveScheduleAsImage(){
  const btn=document.getElementById("saveImageBtn");
  const old=btn.textContent;

  btn.disabled=true;
  btn.textContent="Création...";

  try{
    if(typeof html2canvas==="undefined"){
      throw new Error("html2canvas n'est pas chargé");
    }

    const week=WEEKS[state.week];
    const stage=document.getElementById("exportStage");

    stage.innerHTML=`
      <section class="card">
        <header class="heading">
          <h1>Emploi du temps</h1>
          <div class="subtitle">
            BUT Informatique · ${FORMATIONS[currentFormation].subtitle} · Semaine ${state.week} · ${week.range}
          </div>
        </header>
        <div class="schedule-scroll">
          <div class="schedule" id="exportSchedule">
            <div class="corner">Heure</div>
          </div>
        </div>
      </section>
    `;

    renderSchedule(
      document.getElementById("exportSchedule"),
      week,
      [0,1,2,3,4]
    );

    if(document.fonts?.ready) await document.fonts.ready;
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));

    const target=stage.querySelector(".card");
    const canvas=await html2canvas(target,{
      backgroundColor:"#ffffff",
      scale:2,
      useCORS:true,
      allowTaint:false,
      logging:false,
      scrollX:0,
      scrollY:0,
      width:1080,
      windowWidth:1080
    });

    const blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/png",1));
    if(!blob) throw new Error("Impossible de produire le PNG");

    const filename=`EDT_FI2A_FI2C_S${state.week}.png`;
    const isMobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // PC : vraie fenêtre "Enregistrer sous" quand possible
    if(!isMobile && "showSaveFilePicker" in window){
      try{
        const handle=await window.showSaveFilePicker({
          suggestedName:filename,
          types:[{description:"Image PNG",accept:{"image/png":[".png"]}}]
        });
        const writable=await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        btn.textContent="Enregistré ✓";
        setTimeout(()=>btn.textContent=old,1400);
        return;
      }catch(err){
        if(err.name==="AbortError") return;
      }
    }

    // iPhone/iPad/Android : partage natif
    if(isMobile){
      const file=new File([blob],filename,{type:"image/png"});
      if(navigator.share && navigator.canShare?.({files:[file]})){
        try{
          await navigator.share({files:[file],title:`EDT S${state.week}`});
          return;
        }catch(err){
          if(err.name==="AbortError") return;
        }
      }
    }

    // fallback
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download=filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1500);

  }catch(err){
    console.error(err);
    alert("Impossible de créer l'image de l'emploi du temps.");
  }finally{
    btn.disabled=false;
    if(btn.textContent==="Création...") btn.textContent=old;
  }
}

/* =========================================================
   6) ÉVÈNEMENTS UI
========================================================= */

document.getElementById("weekViewBtn").addEventListener("click",()=>{
  state.mode="week";
  renderAll();
});

document.getElementById("dayViewBtn").addEventListener("click",()=>{
  state.mode="day";
  renderAll();
});

document.getElementById("saveImageBtn").addEventListener("click",saveScheduleAsImage);

document.getElementById("todayBtn").addEventListener("click",()=>{
  state.week=getAutoWeek();
  state.manualWeek=false;

  /*
    En vue Jour, on choisit aussi le jour actuel si nous
    sommes du lundi au vendredi de la semaine affichée.
  */
  const today=new Date();
  const jsDay=today.getDay(); // 0 dim, 1 lun ... 6 sam

  if(jsDay>=1 && jsDay<=5){
    state.day=jsDay-1;
  }else{
    // Le week-end on prépare le lundi de la semaine suivante.
    state.day=0;
  }

  renderAll();
});

/* =========================================================
   BASCULE AUTOMATIQUE SANS RECHARGER LA PAGE
   ---------------------------------------------------------
   Si le site reste ouvert le vendredi à 19:00, il passe
   tout seul à la semaine suivante tant que l'utilisateur
   n'a pas choisi manuellement une autre semaine.
========================================================= */

let lastAutoWeek=getAutoWeek();

setInterval(()=>{
  const newAutoWeek=getAutoWeek();

  if(newAutoWeek!==lastAutoWeek){
    lastAutoWeek=newAutoWeek;

    if(!state.manualWeek){
      state.week=newAutoWeek;
      state.day=0;
      renderAll();
    }else{
      // Met seulement à jour l'indication du bouton Aujourd'hui.
      renderWeekButtons();
    }
  }
},60*1000);

// Si on passe d'un téléphone vers un grand écran sans choix manuel préalable,
// on garde le choix déjà mémorisé.
window.addEventListener("orientationchange",()=>{
  setTimeout(()=>renderMain(),120);
});

document.addEventListener("visibilitychange",()=>{
  if(document.visibilityState!=="visible") return;

  const newAutoWeek=getAutoWeek();
  lastAutoWeek=newAutoWeek;

  if(!state.manualWeek && state.week!==newAutoWeek){
    state.week=newAutoWeek;
    state.day=0;
    renderAll();
  }else{
    renderWeekButtons();
  }
});

/* =========================================================
   7) NAVIGATION TACTILE / CLAVIER EN VUE JOUR
   ---------------------------------------------------------
   iPhone / iPad :
   - swipe vers la gauche = jour suivant
   - swipe vers la droite = jour précédent

   Ordinateur / clavier :
   - flèche gauche / droite
========================================================= */

const scheduleScroll=document.getElementById("scheduleScroll");
let touchStartX=null;
let touchStartY=null;

scheduleScroll.addEventListener("touchstart",(event)=>{
  if(state.mode!=="day" || event.touches.length!==1) return;
  touchStartX=event.touches[0].clientX;
  touchStartY=event.touches[0].clientY;
},{passive:true});

scheduleScroll.addEventListener("touchend",(event)=>{
  if(
    state.mode!=="day" ||
    touchStartX===null ||
    touchStartY===null ||
    !event.changedTouches.length
  ) return;

  const endX=event.changedTouches[0].clientX;
  const endY=event.changedTouches[0].clientY;

  const dx=endX-touchStartX;
  const dy=endY-touchStartY;

  touchStartX=null;
  touchStartY=null;

  // On ignore les petits gestes et les scrolls majoritairement verticaux.
  if(Math.abs(dx)<55 || Math.abs(dx)<=Math.abs(dy)*1.15) return;

  if(dx<0 && state.day<4){
    state.day++;
    renderAll();
  }else if(dx>0 && state.day>0){
    state.day--;
    renderAll();
  }
},{passive:true});

document.addEventListener("keydown",(event)=>{
  if(state.mode!=="day") return;

  if(event.key==="ArrowRight" && state.day<4){
    state.day++;
    renderAll();
  }else if(event.key==="ArrowLeft" && state.day>0){
    state.day--;
    renderAll();
  }
});

renderAll();
const formationSelect=
    document.getElementById("formationSelect");

  formationSelect?.addEventListener(
    "change",
    event=>{
      switchFormation(event.target.value);
    }
  );

  
/* =========================================================
   Formation dropdown
========================================================= */

const formationCustom =
  document.getElementById("formationCustom");

const formationCustomTrigger =
  document.getElementById("formationCustomTrigger");

const formationCustomMenu =
  document.getElementById("formationCustomMenu");

function closeFormationCustom(){
  if(!formationCustomMenu || !formationCustomTrigger) return;

  formationCustomMenu.hidden=true;

  formationCustomTrigger.setAttribute(
    "aria-expanded",
    "false"
  );

  formationCustom?.classList.remove("open");
}

function openFormationCustom(){
  if(!formationCustomMenu || !formationCustomTrigger) return;

  formationCustomMenu.hidden=false;

  formationCustomTrigger.setAttribute(
    "aria-expanded",
    "true"
  );

  formationCustom?.classList.add("open");
}

formationCustomTrigger?.addEventListener(
  "click",
  event=>{
    event.stopPropagation();

    if(formationCustomMenu.hidden){
      openFormationCustom();
    }else{
      closeFormationCustom();
    }
  }
);

document
  .querySelectorAll(".formation-custom-option")
  .forEach(option=>{

    option.addEventListener(
      "click",
      async event=>{

        event.stopPropagation();

        const formation =
          option.dataset.formation;

        closeFormationCustom();

        if(!formation) return;

        if(formation!==currentFormation){
          await switchFormation(formation);
        }

        syncFormationUI();
      }
    );

  });

document.addEventListener(
  "click",
  event=>{
    if(
      formationCustom &&
      !formationCustom.contains(event.target)
    ){
      closeFormationCustom();
    }
  }
);

document.addEventListener(
  "keydown",
  event=>{
    if(event.key==="Escape"){
      closeFormationCustom();
    }
  }
);


syncFormationUI();
  loadExternalSchedule(currentFormation);


/* =========================================================
   Theme management
========================================================= */

const EDT_THEME_KEY="edt-theme-v1";

function getEdtTheme(){

  const saved =
    localStorage.getItem(EDT_THEME_KEY);

  if(saved==="light" || saved==="dark"){
    return saved;
  }

  return (
    window.matchMedia &&
    window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches
      ? "dark"
      : "light"
  );
}


function themeIcon(theme){

  /*
    L'icône représente l'action :
    lune en clair -> passer sombre
    soleil en sombre -> passer clair
  */

  if(theme==="dark"){
    return `
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
        />
        <path
          d="
            M12 2v2
            M12 20v2
            M4.93 4.93l1.41 1.41
            M17.66 17.66l1.41 1.41
            M2 12h2
            M20 12h2
            M4.93 19.07l1.41-1.41
            M17.66 6.34l1.41-1.41
          "
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
        />
      </svg>
    `;
  }

  return `
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="
          M20.2 15.3
          A8.5 8.5 0 0 1
          8.7 3.8
          A8.6 8.6 0 1 0
          20.2 15.3Z
        "
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linejoin="round"
      />
    </svg>
  `;
}


function applyEdtTheme(
  theme,
  save=false
){

  const normalized =
    theme==="dark"
      ? "dark"
      : "light";

  document.documentElement.dataset.theme=
    normalized;

  if(save){
    localStorage.setItem(
      EDT_THEME_KEY,
      normalized
    );
  }

  const button =
    document.getElementById(
      "themeToggleBtn"
    );

  if(button){

    button.innerHTML=
      themeIcon(normalized);

    const next =
      normalized==="dark"
        ? "clair"
        : "sombre";

    button.setAttribute(
      "aria-label",
      `Activer le mode ${next}`
    );

    button.title=
      `Activer le mode ${next}`;
  }


  /*
    Couleur de la barre système / PWA
  */

  const meta =
    document.querySelector(
      'meta[name="theme-color"]'
    );

  if(meta){
    meta.setAttribute(
      "content",
      normalized==="dark"
        ? "#0b1018"
        : "#f3f4f6"
    );
  }

}


function installThemeButton(){

  if(
    document.getElementById(
      "themeToggleBtn"
    )
  ){
    return;
  }

  const actions =
    document.querySelector(
      ".edt-nav .nav-actions"
    ) ||
    document.querySelector(
      ".nav-actions"
    );

  if(!actions){
    console.warn(
      "nav-actions introuvable : bouton thème non ajouté"
    );
    return;
  }

  const button =
    document.createElement("button");

  button.type="button";
  button.id="themeToggleBtn";

  button.setAttribute(
    "aria-label",
    "Changer de thème"
  );

  /*
    On le place juste avant Exporter.
  */

  const exportButton =
    document.getElementById(
      "saveImageBtn"
    );

  if(
    exportButton &&
    exportButton.parentElement===actions
  ){
    actions.insertBefore(
      button,
      exportButton
    );
  }else{
    actions.appendChild(button);
  }


  button.addEventListener(
    "click",
    ()=>{

      const current =
        document.documentElement
          .dataset.theme==="dark"
          ? "dark"
          : "light";

      applyEdtTheme(
        current==="dark"
          ? "light"
          : "dark",
        true
      );

    }
  );

}


installThemeButton();
applyEdtTheme(
  getEdtTheme(),
  false
);


/*
  Si l'utilisateur n'a jamais choisi manuellement
  de thème, le site suit les changements du système.
*/

if(
  window.matchMedia
){

  const systemTheme =
    window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

  systemTheme.addEventListener?.(
    "change",
    event=>{

      if(
        !localStorage.getItem(
          EDT_THEME_KEY
        )
      ){
        applyEdtTheme(
          event.matches
            ? "dark"
            : "light",
          false
        );
      }

    }
  );

}
