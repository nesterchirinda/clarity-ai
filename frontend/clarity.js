// Clarity rethink page - generated from the prototype (see docs/adr/12-ai-planning-pipeline.md)
(function(){
var IC={"squares": "<svg width=\"22\" height=\"22\" aria-hidden=\"true\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M104,42H56A14,14,0,0,0,42,56v48a14,14,0,0,0,14,14h48a14,14,0,0,0,14-14V56A14,14,0,0,0,104,42Zm2,62a2,2,0,0,1-2,2H56a2,2,0,0,1-2-2V56a2,2,0,0,1,2-2h48a2,2,0,0,1,2,2Zm94-62H152a14,14,0,0,0-14,14v48a14,14,0,0,0,14,14h48a14,14,0,0,0,14-14V56A14,14,0,0,0,200,42Zm2,62a2,2,0,0,1-2,2H152a2,2,0,0,1-2-2V56a2,2,0,0,1,2-2h48a2,2,0,0,1,2,2Zm-98,34H56a14,14,0,0,0-14,14v48a14,14,0,0,0,14,14h48a14,14,0,0,0,14-14V152A14,14,0,0,0,104,138Zm2,62a2,2,0,0,1-2,2H56a2,2,0,0,1-2-2V152a2,2,0,0,1,2-2h48a2,2,0,0,1,2,2Zm94-62H152a14,14,0,0,0-14,14v48a14,14,0,0,0,14,14h48a14,14,0,0,0,14-14V152A14,14,0,0,0,200,138Zm2,62a2,2,0,0,1-2,2H152a2,2,0,0,1-2-2V152a2,2,0,0,1,2-2h48a2,2,0,0,1,2,2Z\"/></svg>", "book": "<svg width=\"22\" height=\"22\" aria-hidden=\"true\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M232,50H160a38,38,0,0,0-32,17.55A38,38,0,0,0,96,50H24a6,6,0,0,0-6,6V200a6,6,0,0,0,6,6H96a26,26,0,0,1,26,26,6,6,0,0,0,12,0,26,26,0,0,1,26-26h72a6,6,0,0,0,6-6V56A6,6,0,0,0,232,50ZM96,194H30V62H96a26,26,0,0,1,26,26V204.31A37.86,37.86,0,0,0,96,194Zm130,0H160a37.87,37.87,0,0,0-26,10.32V88a26,26,0,0,1,26-26h66Z\"/></svg>", "user": "<svg width=\"22\" height=\"22\" aria-hidden=\"true\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26ZM71.44,198a66,66,0,0,1,113.12,0,89.8,89.8,0,0,1-113.12,0ZM94,120a34,34,0,1,1,34,34A34,34,0,0,1,94,120Zm99.51,69.64a77.53,77.53,0,0,0-40-31.38,46,46,0,1,0-51,0,77.53,77.53,0,0,0-40,31.38,90,90,0,1,1,131,0Z\"/></svg>", "sparkle": "<svg width=\"22\" height=\"22\" aria-hidden=\"true\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M196.89,130.94,144.4,111.6,125.06,59.11a13.92,13.92,0,0,0-26.12,0L79.6,111.6,27.11,130.94a13.92,13.92,0,0,0,0,26.12L79.6,176.4l19.34,52.49a13.92,13.92,0,0,0,26.12,0L144.4,176.4l52.49-19.34a13.92,13.92,0,0,0,0-26.12Zm-4.15,14.86-55.08,20.3a6,6,0,0,0-3.56,3.56l-20.3,55.08a1.92,1.92,0,0,1-3.6,0L89.9,169.66a6,6,0,0,0-3.56-3.56L31.26,145.8a1.92,1.92,0,0,1,0-3.6l55.08-20.3a6,6,0,0,0,3.56-3.56l20.3-55.08a1.92,1.92,0,0,1,3.6,0l20.3,55.08a6,6,0,0,0,3.56,3.56l55.08,20.3a1.92,1.92,0,0,1,0,3.6ZM146,40a6,6,0,0,1,6-6h18V16a6,6,0,0,1,12,0V34h18a6,6,0,0,1,0,12H182V64a6,6,0,0,1-12,0V46H152A6,6,0,0,1,146,40ZM246,88a6,6,0,0,1-6,6H230v10a6,6,0,0,1-12,0V94H208a6,6,0,0,1,0-12h10V72a6,6,0,0,1,12,0V82h10A6,6,0,0,1,246,88Z\"/></svg>", "list": "<svg width=\"20\" height=\"20\" aria-hidden=\"true\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M222,128a6,6,0,0,1-6,6H40a6,6,0,0,1,0-12H216A6,6,0,0,1,222,128ZM40,70H216a6,6,0,0,0,0-12H40a6,6,0,0,0,0,12ZM216,186H40a6,6,0,0,0,0,12H216a6,6,0,0,0,0-12Z\"/></svg>", "gear": "<svg width=\"14\" height=\"14\" aria-hidden=\"true\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M128,82a46,46,0,1,0,46,46A46.06,46.06,0,0,0,128,82Zm0,80a34,34,0,1,1,34-34A34,34,0,0,1,128,162Zm108-54.4a6,6,0,0,0-2.92-4L202.64,86.22l-.42-.71L202.1,51.2A6,6,0,0,0,200,46.64a110.12,110.12,0,0,0-36.07-20.31,6,6,0,0,0-4.84.45L128.46,43.86h-1L96.91,26.76a6,6,0,0,0-4.86-.44A109.92,109.92,0,0,0,56,46.68a6,6,0,0,0-2.12,4.55l-.16,34.34c-.14.23-.28.47-.41.71L22.91,103.57A6,6,0,0,0,20,107.62a104.81,104.81,0,0,0,0,40.78,6,6,0,0,0,2.92,4l30.42,17.33.42.71.12,34.31A6,6,0,0,0,56,209.36a110.12,110.12,0,0,0,36.07,20.31,6,6,0,0,0,4.84-.45l30.61-17.08h1l30.56,17.1A6.09,6.09,0,0,0,162,230a5.83,5.83,0,0,0,1.93-.32,109.92,109.92,0,0,0,36-20.36,6,6,0,0,0,2.12-4.55l.16-34.34c.14-.23.28-.47.41-.71l30.42-17.29a6,6,0,0,0,2.92-4.05A104.81,104.81,0,0,0,236,107.6Zm-11.25,35.79L195.32,160.1a6.07,6.07,0,0,0-2.28,2.3c-.59,1-1.21,2.11-1.86,3.14a6,6,0,0,0-.91,3.16l-.16,33.21a98.15,98.15,0,0,1-27.52,15.53L133,200.88a6,6,0,0,0-2.93-.77h-.14c-1.24,0-2.5,0-3.74,0a6,6,0,0,0-3.07.76L93.45,217.43a98,98,0,0,1-27.56-15.49l-.12-33.17a6,6,0,0,0-.91-3.16c-.64-1-1.27-2.08-1.86-3.14a6,6,0,0,0-2.27-2.3L31.3,143.4a93,93,0,0,1,0-30.79L60.68,95.9A6.07,6.07,0,0,0,63,93.6c.59-1,1.21-2.11,1.86-3.14a6,6,0,0,0,.91-3.16l.16-33.21A98.15,98.15,0,0,1,93.41,38.56L123,55.12a5.81,5.81,0,0,0,3.07.76c1.24,0,2.5,0,3.74,0a6,6,0,0,0,3.07-.76l29.65-16.56a98,98,0,0,1,27.56,15.49l.12,33.17a6,6,0,0,0,.91,3.16c.64,1,1.27,2.08,1.86,3.14a6,6,0,0,0,2.27,2.3L224.7,112.6A93,93,0,0,1,224.73,143.39Z\"/></svg>", "shield": "<svg width=\"14\" height=\"14\" aria-hidden=\"true\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M208,42H48A14,14,0,0,0,34,56v56c0,51.94,25.12,83.4,46.2,100.64,22.73,18.6,45.27,24.89,46.22,25.15a6,6,0,0,0,3.16,0c.95-.26,23.49-6.55,46.22-25.15C196.88,195.4,222,163.94,222,112V56A14,14,0,0,0,208,42Zm2,70c0,37.76-13.94,68.39-41.44,91.06A131.17,131.17,0,0,1,128,225.72a130.94,130.94,0,0,1-40.56-22.66C59.94,180.39,46,149.76,46,112V56a2,2,0,0,1,2-2H208a2,2,0,0,1,2,2Z\"/></svg>", "signout": "<svg width=\"14\" height=\"14\" aria-hidden=\"true\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M118,216a6,6,0,0,1-6,6H48a6,6,0,0,1-6-6V40a6,6,0,0,1,6-6h64a6,6,0,0,1,0,12H54V210h58A6,6,0,0,1,118,216Zm110.24-92.24-40-40a6,6,0,0,0-8.48,8.48L209.51,122H112a6,6,0,0,0,0,12h97.51l-29.75,29.76a6,6,0,1,0,8.48,8.48l40-40A6,6,0,0,0,228.24,123.76Z\"/></svg>", "close": "<svg width=\"20\" height=\"20\" aria-hidden=\"true\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M204.24,195.76a6,6,0,1,1-8.48,8.48L128,136.49,60.24,204.24a6,6,0,0,1-8.48-8.48L119.51,128,51.76,60.24a6,6,0,0,1,8.48-8.48L128,119.51l67.76-67.75a6,6,0,0,1,8.48,8.48L136.49,128Z\"/></svg>"};
/* Stand-in for the Notion profile photo (owner.user.avatar_url), shown the way Clarity AI shows it once connected */
var AVATAR='data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d8cbb8"/><stop offset="1" stop-color="#a99a84"/></linearGradient></defs><rect width="64" height="64" fill="url(#g)"/><circle cx="32" cy="25" r="11" fill="#5b4a3a"/><path d="M12 64c2-14 10-20 20-20s18 6 20 20z" fill="#efe8dd"/></svg>');
var SPARK='<svg class="spark" width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="#4a4d3c"/></svg>';
var CHEV='<svg class="task-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 6 15 12 9 18"/></svg>';
var SPEAK='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>';
function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
function $(id){ return document.getElementById(id); }

/* ---------- ClarityWorks shell (unchanged behaviour) ---------- */
var WIDGETS=[
  ["Weekly Clarity","See how you're progressing on your goals, embodying your desired identities, and spending your time."],
  ["Daily Greeting","A personalized welcome to your planner."],
  ["Daily Quote","A thought-provoking quote worth reflecting on."],
  ["Vision Board","A visual reminder of who you want to be, what you want to achieve, and how you want to spend your time."],
  ["Life Balance Wheel","Visualize balance across 8 life domains and track improvement over time."],
  ["Progress Gallery","Visual proof of your transformation. Photos of wins, milestones, and evidence you're changing."],
  ["Photo Board","Document your smaller achievements and wins to screenshot for your Notion reflections."],
  ["Meal Planner","Plan weekly meals that fuel your goals and fit your life."]
];
$('widgetList').innerHTML=WIDGETS.map(function(w){ return '<button class="widget-item"><div class="widget-item-info"><div class="widget-item-name">'+esc(w[0])+'</div><div class="widget-item-desc">'+esc(w[1])+'</div></div><svg class="widget-item-arrow" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><polyline points="9 18 15 12 9 6"/></svg></button>'; }).join('');
['navAvatar','menuAvatar','mAvatar'].forEach(function(id){ $(id).innerHTML='<img src="'+AVATAR+'" alt="">'; });
$('hamburger').innerHTML=IC.list; $('mClose').innerHTML=IC.close; $('icGear').innerHTML=IC.gear; $('icShield').innerHTML=IC.shield; $('icOut').innerHTML=IC.signout;
var NAV=[["widgets","Widgets",IC.squares],["clarity","Clarity",IC.sparkle],["tutorials","Tutorials",IC.book],["settings","Profile",IC.user]];
$('bottomNav').innerHTML=NAV.map(function(n){ return '<button class="bottom-nav-item" data-view="'+n[0]+'">'+n[2]+n[1]+'</button>'; }).join('');
$('mobileNav').innerHTML=NAV.map(function(n){ return '<button class="mobile-menu-nav-item" data-view="'+n[0]+'">'+n[2].replace('width="22" height="22"','width="16" height="16"')+(n[0]==="settings"?"Settings":n[1])+'</button>'; }).join('');

var view='widgets';
function showView(v){
  view=v;
  ['widgets','clarity','tutorials','settings'].forEach(function(k){ $(k+'View').classList.toggle('active',k===v); });
  document.querySelectorAll('[data-view]').forEach(function(el){ if(!el.classList.contains('brand')&&!el.classList.contains('user-menu-item')) el.classList.toggle('active',el.dataset.view===v); });
  document.body.classList.toggle('on-clarity',v==='clarity');
  $('userMenuDropdown').classList.remove('show'); closeMobile();
  try{ history.replaceState(null,'','#'+v); }catch(e){}
  window.scrollTo(0,v==='clarity'?document.body.scrollHeight:0);
  if(v==='clarity') setTimeout(function(){ $('chat-input').focus(); },0);
}
function closeMobile(){ $('mobileMenuPanel').classList.remove('open'); $('mobileMenuOverlay').classList.remove('show'); }

/* ---------- Clarity (Clarity AI's markup and styling; ClarityWorks' Intention → Sub-goal → Task → Subtask levels) ---------- */
var log=$('chat-log'), input=$('chat-input');

/* The 2026 intentions from the Notion Intentions database (Life Domain + Intention) */
var INTENTIONS=[
  {domain:"Projects",name:"I'm the founder of a thriving business, Clarity Works",keys:["clarity","business","launch","shop","etsy","product","customer","client","app","website","brand","sell"]},
  {domain:"Career",name:"I'm a trusted, confident professional",keys:["job","role","promotion","interview","career","manager","professional","linkedin","cv","grad"]},
  {domain:"Finances",name:"I'm financially stable and in control of my money",keys:["money","save","saving","budget","debt","invest","portfolio","pension","spend","finance","isa","£"]},
  {domain:"Health",name:"I'm strong, healthy and I love my body",keys:["gym","run","marathon","yoga","weight","sleep","fitness","health","strength","walk","gp","doctor"]},
  {domain:"Personal Development",name:"I'm a first-class graduate",keys:["degree","dissertation","exam","uni","module","grade","assignment","coursework","first-class","first class"]},
  {domain:"Personal Development",name:"I never stop learning",keys:["learn","course","read","book","language","skill","certificate"]},
  {domain:"Admin",name:"I'm a British citizen",keys:["citizenship","visa","passport","home office","naturalisation","naturalization","documents"]}
];
/* Snapshot of your Notion planner, read on 21 November 2026 (Sub-Goals and Tasks). The real build reads this live. */
var PLANNER={
  asOf:"21 November",
  bigThree:["Pass HSBC graduate probation","Gain “control” of my finances","Submit 1st Class Development Project"],
  jobSearch:["Apply to 5 jobs","Search for graduate opportunities","Update professional CV"],
  tasks:[
    {name:"GP Appointment",domain:"Health",due:"12 November",carried:1,keys:["gp","doctor"]},
    {name:"OBKYC ticket & release",domain:"Career",due:"15 November",carried:1,keys:["obkyc","release","ticket"]},
    {name:"AI Academy module 1",domain:"Career",due:"",carried:1,keys:["ai academy"]},
    {name:"Return Tkmaxx purchases",domain:"Finances",due:"",carried:1,keys:["return","tkmaxx","purchases"]},
    {name:"Integrate ClarityAI into clarityworks",domain:"Projects",due:"",carried:0,keys:["clarityai","clarity ai"]}
  ]
};
var SUBS={
  "Finances":[{name:"Gain “control” of my finances",note:"November Big 3"},{name:"Pay off 50% of credit card debt",note:"no tasks yet",keys:["credit card","card debt"]},{name:"Save first £500 of emergency fund in a HYSA",note:"not started",keys:["emergency fund","£500"]}],
  "Career":[{name:"Pass HSBC graduate probation",note:"November Big 3"}],
  "Projects":[{name:"Public Launch",note:"open"},{name:"Recruit & Onboard Founding Members",note:"open"},{name:"Build a High Converting Landing Page",note:"open"}],
  "Health":[],
  "Personal Development":[{name:"Submit 1st Class Development Project",note:"November Big 3"},{name:"Read 4 books",note:"by 31 December"}],
  "Admin":[{name:"Pass LIUK Test",note:"open",keys:["liuk","life in the uk"]}]
};
function existingSubgoal(text){
  var t=text.toLowerCase(), found=null;
  Object.keys(SUBS).forEach(function(d){ SUBS[d].forEach(function(sg){ if(sg.keys&&sg.keys.some(function(k){ return t.indexOf(k)>-1; })) found={domain:d,sg:sg}; }); });
  return found;
}
function existingTask(text){
  var t=text.toLowerCase(); return PLANNER.tasks.filter(function(x){ return x.keys.some(function(k){ return t.indexOf(k)>-1; }); })[0]||null;
}
function subsLine(it){
  var list=(SUBS[it.domain]||[]).filter(function(sg){ return it.domain!=="Personal Development" || (it.name.indexOf("graduate")>-1 ? /Development Project/.test(sg.name) : /books/.test(sg.name)); });
  if(!list.length) return " You don't have any sub-goals there yet.";
  return " You already have "+(list.length===1?"one sub-goal":list.length+" sub-goals")+" there: "+list.map(function(sg){ return "“"+sg.name+"” ("+sg.note+")"; }).join(", ")+".";
}
var DOMAINS=["Career","Finances","Health","Personal Development","Projects","Relationships","Admin"];

function matchIntention(text){
  var t=text.toLowerCase(), hits=INTENTIONS.filter(function(it){ return it.keys.some(function(k){ return t.indexOf(k)>-1; }); });
  return hits.length===1?hits[0]:null;
}
function guessDomain(text){
  var t=text.toLowerCase();
  if(/speak|confiden|learn|read|calm|organis|organiz|disciplin/.test(t)) return "Personal Development";
  if(/money|financ|wealth|debt|sav/.test(t)) return "Finances";
  if(/fit|health|strong|run|body/.test(t)) return "Health";
  if(/career|job|profession|work|leader/.test(t)) return "Career";
  if(/friend|partner|family|relationship/.test(t)) return "Relationships";
  return "Personal Development";
}

/* Dates and amounts */
var MONTHS=["january","february","march","april","may","june","july","august","september","october","november","december"];
function parseDeadline(text){
  var t=text.toLowerCase(), now=new Date(), d=null;
  if(/next year/.test(t)) d=new Date(now.getFullYear()+1,11,31);
  else if(/end of (the )?year|this year/.test(t)) d=new Date(now.getFullYear(),11,31);
  var days=['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  if(!d&&/\btoday\b/.test(t)) d=new Date(now);
  if(!d&&/\btomorrow\b/.test(t)){ d=new Date(now); d.setDate(d.getDate()+1); }
  if(!d){ for(var j=0;j<7;j++){ if(new RegExp('\\b'+days[j]+'\\b').test(t)){ d=new Date(now); var add=(j-now.getDay()+7)%7||7; if(/next week/.test(t)) add+=7; d.setDate(d.getDate()+add); break; } } }
  if(!d&&/end of (the )?week/.test(t)){ d=new Date(now); d.setDate(d.getDate()+((7-now.getDay())%7)); }
  var wk=t.match(/(\d+)\s*weeks?/); if(!d&&wk){ d=new Date(now); d.setDate(d.getDate()+7*(+wk[1])); }
  var mo=t.match(/(\d+)\s*months?/); if(!d&&mo){ d=new Date(now); d.setMonth(d.getMonth()+(+mo[1])); }
  if(!d&&/next month/.test(t)){ d=new Date(now.getFullYear(),now.getMonth()+2,0); }
  if(!d){ for(var i=0;i<12;i++){ var re=new RegExp('\\b('+MONTHS[i]+'|'+MONTHS[i].slice(0,3)+')\\b'); if(re.test(t)){ d=new Date(now.getFullYear(),i+1,0); if(d<now) d=new Date(now.getFullYear()+1,i+1,0); break; } } }
  return d;
}
function fmt(d){ if(!d||isNaN(d)) d=defaultDeadline(); return d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}); }
function monthsUntil(d){ return Math.max(1,Math.round((d-new Date())/(1000*60*60*24*30.44))); }
function parseMoney(text){
  var m=text.match(/£\s?([\d,]+(?:\.\d+)?)\s?(k|K)?/); if(!m) return null;
  var v=parseFloat(m[1].replace(/,/g,'')); if(m[2]) v*=1000; return v;
}
function gbp(v){ return '£'+Math.round(v).toLocaleString('en-GB'); }

/* What level is this? */
var TASK_VERBS=/^(i need to |i have to |i want to )?(renew|book|email|call|ring|write|send|file|pay|apply for|sort out|sort|fix|buy|cancel|update|submit|finish|clean|tidy|post|order|reply|print|register)\b/i;
function classify(text){
  var t=text.trim();
  if(/^(i('|’)?m|i am|i('|’)?ll be|i want to be|i want to become|become)\b/i.test(t)) return 'intention';
  if(TASK_VERBS.test(t) && !parseMoney(t)) return 'task';
  return 'subgoal';
}

/* ---------- Plans (canned in the prototype; the real build generates them with Clarity AI's backend) ---------- */
function taskPlan(){
  var t=S.text.toLowerCase();
  var subs = /gp|doctor/.test(t)
    ? ["Call the surgery at 8am when lines open","Take the first slot you can make","Add it to your calendar with a reminder","Write down what you want to ask before you go"]
    : /passport/.test(t)
    ? ["Check your passport's expiry date and what renewal needs","Get a digital photo that meets the rules","Fill in the online renewal form","Pay, then post your old passport","Track it until the new one arrives"]
    : ["Work out exactly what this involves","Gather anything you need first","Do the main part in one sitting","Check it's done, then tick it off"];
  return {title:S.text, subtasks:subs};
}
function subgoalPlan(mode){
  var t=S.text.toLowerCase(), by=fmt(S.deadline);
  if(mode==='realistic-invest') return {title:"Be investment-ready by "+by, note:"Income first, then a safety net, then less debt, then a first investment. Links your existing sub-goals “Save first £500 of emergency fund in a HYSA” and “Pay off 50% of credit card debt”.", tasks:[
    {title:"Land a job",subs:["Keep going with “Apply to 5 jobs” each week (already in your planner)","Finish “Update professional CV” (already in your planner)","Book one recruiter or alumni call a week"]},
    {title:"Finish your £500 emergency fund (existing sub-goal)",subs:["Open the high-yield savings account","Move £25 a week in, more once you're paid"]},
    {title:"Pay off 50% of your credit card (existing sub-goal)",subs:["Check the balance and interest rate","Pay more than the minimum every payday","Finish “Cancel unnecessary subscriptions” (already in your planner)"]},
    {title:"Open a stocks and shares ISA",subs:["Compare two low-fee platforms","Start with £25 a month once the card is halfway paid"]},
    {title:"Review on "+by,subs:["Check all four, then set a realistic date for £10,000"]}]};
  if(mode==='full-invest') return {title:"Build a "+gbp(S.money)+" investment portfolio by "+by, note:"About "+gbp(S.money/monthsUntil(S.deadline))+" a month for "+monthsUntil(S.deadline)+" months.", tasks:[
    {title:"Find "+gbp(S.money/monthsUntil(S.deadline))+" a month",subs:["List every regular cost","Cut or pause anything non-essential"]},
    {title:"Open a stocks and shares ISA",subs:["Compare two low-fee platforms","Choose a global index fund"]},
    {title:"Invest on payday every month",subs:["Set up the monthly payment","Check you're on track each month"]}]};
  var exn=S.existingSub?S.existingSub.name.toLowerCase():"";
  if(/control/.test(exn)) return {title:S.existingSub.name, note:"Your November Big 3, planned to "+by+". It uses tasks already in your planner.", tasks:[
    {title:"See where the money goes",subs:["List every regular payment and subscription","Check your credit card balance and interest rate"]},
    {title:"Finish what's already started",subs:["Finish setting up household bills (already in your planner)","Cancel unnecessary subscriptions (already in your planner)","Return unwanted purchases (already in your planner)"]},
    {title:"Set up a simple system",subs:["Keep Money Mondays as your weekly check","Set a spending limit for the rest of November"]},
    {title:"Kick off your next two sub-goals",subs:["Open the high-yield savings account for your £500 emergency fund","Set a monthly card payment above the minimum"]}]};
  if(/development project/.test(exn)) return {title:S.existingSub.name, note:"Your November Big 3. There's no due date in your planner, so I've planned to "+by+". Tell me if it's different.", tasks:[
    {title:"Get clear on what a first looks like",subs:["Re-read the brief and marking criteria","Use Mike's feedback on the grade"]},
    {title:"Plan the remaining work",subs:["List what's left","Book two focused sessions a week"]},
    {title:"Finish and polish",subs:["Write it up and proofread","Check it against the marking criteria"]},
    {title:"Submit",subs:["Submit a day early"]}]};
  if(/read 4 books/.test(exn)) return {title:S.existingSub.name, note:"Ongoing until 31 December: 20 minutes a day.", tasks:[
    {title:"Choose the four books",subs:["Pick four and note why each one matters"]},
    {title:"Make 20 minutes easy",subs:["Set a daily reading slot","Keep the current book by your bed"]},
    {title:"Track it",subs:["Tick it off each day in your planner"]}]};
  if(/emergency fund/.test(exn)) return {title:S.existingSub.name, note:"Your existing sub-goal, planned to "+by+".", tasks:[
    {title:"Open the account",subs:["Compare two high-yield savings accounts","Open the best one"]},
    {title:"Fill it",subs:["Set up a £25 weekly transfer","Add any refunds from returned purchases"]}]};
  if(S.existingSub && /credit card/.test(exn)) return {title:S.existingSub.name, note:"Your existing sub-goal, planned out to "+by+".", tasks:[
    {title:"Know the numbers",subs:["Check the balance, rate and minimum payment","Work out what half the balance is"]},
    {title:"Free up money for repayments",subs:["Finish “Cancel unnecessary subscriptions” (already in your planner)","Finish “Return unwanted purchases” (already in your planner)"]},
    {title:"Pay it down",subs:["Set a fixed payment above the minimum each month","Stop using the card for new spending"]},
    {title:"Check in monthly",subs:["Log the balance at each Money Monday"]}]};
  if(/etsy|shop/.test(t)) return {title:S.text, note:"Ready for a first customer by "+by+".", tasks:[
    {title:"Photograph the first ten products",subs:["Set up a light corner by a window","Shoot two angles per product","Edit and export for Etsy"]},
    {title:"Write the listings",subs:["Draft titles with search terms","Write short descriptions"]},
    {title:"Publish the shop",subs:["Set shipping and returns","Publish ten listings"]},
    {title:"Tell people it exists",subs:["Post three launch photos"]}]};
  return {title:S.text, note:"Done by "+by+".", tasks:[
    {title:"Decide what done looks like",subs:["Write one sentence describing done","Pick how you'll know you've got there"]},
    {title:"Do the first piece",subs:["Choose the smallest first step","Book it in your calendar"]},
    {title:"Keep it moving",subs:["Do one piece each week","Check progress halfway"]}]};
}
function intentionPlan(){
  var by=fmt(S.deadline);
  return {intention:S.text, domain:S.domain, subgoals:[
    {title:"See what it looks like day to day",note:"In the first month.",tasks:[{title:"Describe a normal day when this is true",subs:["Write it in your own words","Pick three things you'd be doing"]},{title:"Find one person who already lives it",subs:["Note what they do differently"]}]},
    {title:"Build the habit that proves it",note:"Through the middle months.",tasks:[{title:"Choose one weekly habit",subs:["Make it small enough to do on a bad week","Add it to your weekly planner"]},{title:"Track it for four weeks",subs:["Tick it off each week"]}]},
    {title:"Show it in one real moment by "+by,note:"The moment you'll point to.",tasks:[{title:"Pick the moment",subs:["Choose a date and place"]},{title:"Prepare for it",subs:["Practise twice beforehand"]}]}]};
}

/* ---------- Conversation ---------- */
var S;
function row(cls,inner){ var r=document.createElement('div'); r.className='msg-row '+cls; r.innerHTML=inner; log.appendChild(r); scrollDown(); return r; }
function assistant(text,status){ return row('assistant','<div class="msg-assistant">'+SPARK+'<div><div'+(status?' class="msg-status"':'')+'>'+esc(text)+'</div></div></div>'); }
function user(text){ return row('user','<div class="msg-user">'+esc(text)+'</div>'); }
function inline(html){ var r=log.lastElementChild; r.querySelector('.msg-assistant > div').insertAdjacentHTML('beforeend','<div class="inline-actions"><div class="intention-actions">'+html+'</div></div>'); scrollDown(); }
function clearInline(){ document.querySelectorAll('.inline-actions, #picker, #focus').forEach(function(el){ el.remove(); }); }
function scrollDown(){ if(view==='clarity') window.scrollTo(0,document.body.scrollHeight); }
function busyOn(){ S.busyN=(S.busyN||0)+1; S.busy=true; input.disabled=true; }
function busyOff(){ S.busyN=Math.max(0,(S.busyN||1)-1); S.busy=S.busyN>0; input.disabled=S.busy; }
function wait(text,ms,fn){ var r=assistant(text,true), s0=S; busyOn(); setTimeout(function(){ r.remove(); if(S!==s0){ input.disabled=!!S.busy; return; } busyOff(); fn(); if(!S.busy) input.focus(); },ms); }
function placeholder(p){ input.placeholder=p; }


/* ---------- Rethink sub-goals for an intention, through conversation ---------- */
var RETHINK={
  "Projects":{
    q1:["Launching to the public","Getting my first paying members","Building the product properly","Making it work alongside a job"],
    q2:["I'm also job hunting","I have more time than usual","Uni is finishing","Nothing's changed"],
    items:[
      {v:"New",was:"",now:"Get Clarity working inside ClarityWorks by 31 December",why:"It's in your planner as a task, “Integrate ClarityAI into clarityworks”, but it's big enough to be a sub-goal, and it fits in six weeks."},
      {v:"Focus",was:"Recruit & Onboard Founding Members",now:"Recruit your first 3 founding members by 31 December",why:"Paying members prove the business. Three is realistic before the year ends."},
      {v:"Park",was:"",now:"Park the other 19 sub-goals",why:"22 open sub-goals is more than one person can move in a season. They stay in Notion, just out of this year's view."},
      {v:"Next year",was:"Public Launch",now:"Public launch",why:"Not realistic in six weeks while you're job hunting. It moves to your 2027 plan."}
    ],
    result:"1 new sub-goal, 1 sharpened, 1 carried to your 2027 plan and 19 parked"
  },
  "Career":{
    q1:["Landing the right role","Doing great work where I am","Growing my skills","Being respected at work"],
    q2:["I'm between jobs","I've just finished probation","I want to change direction","Nothing's changed"],
    items:[
      {v:"Done",was:"Pass HSBC graduate probation",now:"Mark as achieved",why:"All 7 tasks are done and your review meeting was on 18 November."},
      {v:"New",was:"",now:"Apply to 5 graduate roles a week until 31 December (ongoing)",why:"Your planner this week is all job search. Graduate schemes take months to hire, so this year is about applications, not a start date."},
      {v:"New",was:"",now:"Finish AI Academy module 1 by 31 December",why:"It's been carried over once. Making it a sub-goal gives it a home, and it helps your applications."},
      {v:"Next year",was:"",now:"Start a graduate role",why:"Most schemes start in the new year or later. It goes into your 2027 plan."}
    ],
    result:"1 sub-goal marked achieved, 2 new sub-goals and 1 carried to your 2027 plan"
  },
  "Health":{
    q1:["Feeling strong and fit","Having more energy","Looking after my health","Feeling good in my body"],
    q2:["I'm between jobs","I've had a busy few weeks","I want a fresh start","Nothing's changed"],
    items:[
      {v:"New",was:"",now:"Hot Yoga twice a week until 31 December (ongoing)",why:"You're already going. This makes it count towards your intention."},
      {v:"New",was:"",now:"Three strength workouts a week until 31 December (ongoing)",why:"Your planner already has the templates: Lower body day, Core & upper body, Full body Friday."},
      {v:"New",was:"",now:"See the GP by 5 December",why:"It's been overdue since 12 November. A date stops it slipping again."}
    ],
    result:"3 new sub-goals"
  }
};
var YEAR_END=function(){ return new Date(new Date().getFullYear(),11,31); };
function weeksLeft(){ return Math.max(1,Math.round((YEAR_END()-new Date())/(1000*60*60*24*7))); }
function roundDown(v,step){ return Math.floor(v/step)*step; }

/* Finances: built from your answers and your planner, all ending by 31 December */
function financeReview(){
  var f=S.facts, items=[], next=[];
  var noIncome=f.noIncome, savings=f.savings, ess=f.essentials;
  if(noIncome){
    items.push({v:"New",was:"",now:"Start any paid work by 31 December",why:"This is about covering your costs, not your career, so it sits here under Finances. Temp, agency or part-time all count, and weekly pay gets money in sooner. Your graduate search stays under Career."});
    next.push({v:"Next year",was:"",now:"Earn your first full £"+(ess?ess.toLocaleString('en-GB'):'1,000')+" month",why:"Even with a December start, first pay usually lands in January."});
  }
  if(savings){
    var spend=ess?Math.round(ess*weeksLeft()/4.33/50)*50:0, floor=ess?roundDown(Math.max(savings-spend-200,0),100):roundDown(savings*0.6,100);
    items.push({v:"Adjust",was:"Save first £500 of emergency fund in a HYSA",now:"Finish the year with at least £"+floor.toLocaleString('en-GB')+" saved",why:"You've already passed £500 with £"+savings.toLocaleString('en-GB')+". Now the job is protecting it"+(ess?": at about £"+ess.toLocaleString('en-GB')+" a month you'll spend around £"+spend.toLocaleString('en-GB')+" before the year ends.":".")});
  } else {
    items.push({v:"Keep",was:"Save first £500 of emergency fund in a HYSA",now:"Save first £500 of emergency fund in a HYSA by 31 December",why:"The right first step for a safety net. It just needed a date."});
  }
  items.push({v:"Sharpen",was:"Gain “control” of my finances",now:"Track every pound and live on a monthly budget from 1 December",why:"Too vague to know when it's done. This covers knowing where your money goes, and your planner already has the first steps: household bills, subscriptions and returns."});
  items.push({v:"Adjust",was:"Pay off 50% of credit card debt",now:"Pay at least the minimum and add nothing new to the card by 31 December",why:noIncome?"Paying off half isn't realistic this year without income, and using savings would weaken your safety net.":"Keeps the debt from growing while you build up to bigger payments."});
  next.push({v:"Next year",was:"Pay off 50% of credit card debt",now:"Pay off 50% of your card",why:"Realistic once income is back."});
  if(f.invest){
    items.push({v:"New",was:"",now:"Learn how ISAs and index funds work by 31 December",why:"Covers knowing what you're investing in and why, without risking money you need now."});
    next.push({v:"Next year",was:"",now:"Start investing",why:"Once your income covers your costs."});
  }
  return {items:items.concat(next), result:items.filter(function(x){return x.v==="New";}).length+" new, "+items.filter(function(x){return x.v!=="New";}).length+" updated, and "+next.length+" carried to your 2027 plan"};
}

function rethinkFor(it){
  if(RETHINK[it.domain]) return RETHINK[it.domain];
  if(it.domain==="Finances") return {q1:["Not worrying about money each month","A safety net if something goes wrong","No credit card debt","Money growing for the future"],q2:["I've lost my income","Money's tight right now","I've just set up my own bills","Nothing's changed"],items:[],result:""};
  var subs=(SUBS[it.domain]||[]).filter(function(sg){ return it.domain!=="Personal Development" || (it.name.indexOf("graduate")>-1 ? /Development Project/.test(sg.name) : /books/.test(sg.name)); });
  return {q1:["Something I'm proud of","Feeling in control","Making steady progress","Getting it done"],q2:["I'm between jobs","Things are busy","I want a fresh start","Nothing's changed"],
    items:subs.map(function(sg){ return {v:"Keep",was:sg.name,now:sg.name+" by 31 December",why:"Clear and still right for this year. It just needed a date."}; }),
    result:subs.length+" sub-goal"+(subs.length===1?"":"s")+" kept with dates"};
}
function startRethink(){
  if(API.on){ clearInline(); var started=apiStart(S.intention); if(started!==false) return; }
  clearInline(); var it=S.intention; S.rt=rethinkFor(it); S.rtAnswers=[]; S.facts={}; S.liveMode=!!LIVE; S.liveQs=0;
  user(SUBS[it.domain]&&SUBS[it.domain].length?"Rethink these sub-goals":"Help me plan sub-goals");
  wait('Thinking',800,function(){
    var q1="Let's start with the intention, not the sub-goals. When you think of “"+it.name+"”, what does it mean to you between now and the end of the year?"; S.conv=[{q:q1}];
    assistant(q1);
    inline(S.rt.q1.map(function(o){ return '<button type="button" class="pill" data-act="rt-answer">'+esc(o)+'</button>'; }).join(''));
    S.stage='rt1'; placeholder('In your own words…');
  });
}

/* Turn an answer into themes, in Clarity's own words */
var THEMES=[
  [/spend|informed|track|budget|where.*money/i,"knowing where your money goes"],
  [/trajector|on track|freedom|future/i,"being on track for the future"],
  [/safety net|emergency|buffer|cushion/i,"having a safety net"],
  [/invest/i,"investing with understanding"],
  [/debt|credit card/i,"being debt-free"],
  [/support myself|independent|pay my own|self-suffic|support.*financ/i,"supporting yourself"],
  [/worry|stress|anxious/i,"not worrying about money"],
  [/grow/i,"money growing for the future"]
];
function themesOf(t){ var out=[]; THEMES.forEach(function(x){ if(x[0].test(t) && out.indexOf(x[1])<0) out.push(x[1]); }); return out; }
function listJoin(a){ return a.length<2?(a[0]||""):a.slice(0,-1).join(", ")+" and "+a[a.length-1]; }
function moneyIn(t){ var m=t.match(/£?\s?(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)\s?(k)?/i); if(!m) return null; var v=parseFloat(m[1].replace(/,/g,'')); if(m[2]) v*=1000; return v; }

function rethinkAnswer(text){
  if(liveOn()) return liveAnswer(text);
  S.rtAnswers.push(text);
  if(S.stage==='rt1'){
    S.facts.themes=themesOf(text); S.facts.invest=/invest/i.test(text);
    S.stage='busy';
    wait('Thinking',800,function(){
      assistant("That helps. And what's different about this season of your life?");
      inline(S.rt.q2.map(function(o){ return '<button type="button" class="pill" data-act="rt-answer">'+esc(o)+'</button>'; }).join(''));
      S.stage='rt2';
    });
  } else if(S.stage==='rt2'){
    S.facts.failedProbation=/fail|didn'?t pass|not pass|let go|didn'?t work out|sacked|fired/i.test(text);
    S.facts.noIncome=/lost|no (source of )?income|between jobs|unemploy|redundan|no job|laid off/i.test(text);
    if(/sav/i.test(text)) S.facts.savings=moneyIn(text);
    S.stage='busy';
    if(S.intention.domain==="Finances"){
      wait('Thinking',800,function(){
        var bits=[]; if(S.facts.noIncome) bits.push("your income has just stopped"); if(S.facts.savings) bits.push("you have £"+S.facts.savings.toLocaleString('en-GB')+" saved");
        assistant((bits.length?"Thanks for telling me. "+bits.join(" and ").replace(/^./,function(c){return c.toUpperCase();})+". ":"")+"One more thing so I can be realistic: roughly what do your essentials cost a month? Rent, bills, food, travel and minimum card payments.");
        inline(['£800','£1,000','£1,500','£2,000'].map(function(o){ return '<button type="button" class="pill" data-act="rt-answer">'+o+'</button>'; }).join(''));
        S.stage='rt3'; placeholder('For example: £1,200');
      });
    } else showReview();
  } else {
    S.facts.essentials=moneyIn(text); S.stage='busy'; showReview();
  }
}
function showReview(){
  wait('Looking at your sub-goals…',1500,function(){
    var f=S.facts, a0=(S.rtAnswers[0]||"").replace(/[.!]+$/,"").trim(), th=f.themes&&f.themes.length?listJoin(f.themes):(a0.length<60?a0.charAt(0).toLowerCase()+a0.slice(1).replace(/\bmy\b/gi,"your").replace(/\bI'm\b/g,"you're").replace(/\bI\b/g,"you"):"what you described");
    var line="So by the end of the year, “"+S.intention.name+"” means "+th+".";
    if(f.noIncome||f.savings){
      var bits=[]; if(f.noIncome) bits.push("your income has stopped"); if(f.savings) bits.push("you have £"+f.savings.toLocaleString('en-GB')+" saved");
      line+=" Right now "+listJoin(bits)+".";
      if(f.savings&&f.essentials){ var months=f.savings/f.essentials, end=new Date(); end.setDate(end.getDate()+Math.round(months*30.44)); line+=" At about £"+f.essentials.toLocaleString('en-GB')+" a month, your savings last roughly "+(Math.round(months*2)/2)+" months, until around "+end.toLocaleDateString('en-GB',{month:'long',year:'numeric'})+"."; }
    }
    if(f.failedProbation) line+=" Probation didn't work out, so this year is about working out what you want next and getting ready for it properly, not rushing into the first job going.";
    assistant(line+" Here's what I think you can achieve by 31 December, and what has to wait until next year.");
    if(S.intention.domain==="Career"&&f.failedProbation){ var c=careerReset(); S.rt.items=c.items; S.rt.result=c.result; }
    if(S.intention.domain==="Finances"){ var r=financeReview(); S.rt.items=r.items; S.rt.result=r.result; }
    reviewCard(); S.stage='review-sg'; reviewButtons(); placeholder('What do you want to do?');
  });
}

/* Career after a failed probation: direction first, then CV, search, and prep in parallel */
function careerReset(){
  return {items:[
    {v:"Close",was:"",now:"Close “Pass HSBC graduate probation” as not passed",why:"It didn't work out, so it shouldn't count as achieved. Nothing is deleted, and it stays in your history.",tasks:[]},
    {v:"New",was:"",now:"Decide what kind of role I want next by 5 December",why:"Everything else depends on this. Applying before you know what you want usually means landing somewhere that doesn't fit again.",tasks:["Reflect on why probation didn't work out","Write down what I enjoyed and what drained me at HSBC","Shortlist 2 to 3 types of role to aim for","Talk to 2 people who do those roles"]},
    {v:"New",was:"",now:"Get my CV and LinkedIn ready for those roles by 12 December",why:"Your HSBC experience still counts. This makes it work for the roles you choose.",tasks:["Add my HSBC experience to my CV","Tailor a CV version for each type of role","Update LinkedIn to match","Prepare a short, honest answer for why I left HSBC"]},
    {v:"New",was:"",now:"Search and apply to 5 roles a week until 31 December (ongoing)",why:"Researching companies can start now. Applications start once your CV is ready, and run alongside your prep.",tasks:["Research companies that hire for my chosen roles","Set up job alerts","Apply to 5 roles a week","Track every application and follow up after a week"]},
    {v:"New",was:"",now:"Upskill and prepare for interviews until 31 December (ongoing)",why:"Runs at the same time as applying, so you're ready when interviews come. AI Academy module 1 fits here.",tasks:["Finish AI Academy module 1","Prepare 5 STAR stories from my experience","Practise how I talk about leaving HSBC","Do one mock interview"]},
    {v:"Next year",was:"",now:"Start a new role",why:"Most hiring processes take 4 to 8 weeks, and December is slow. It goes into your 2027 plan.",tasks:[]}
  ],result:"1 sub-goal closed as not passed, 4 new sub-goals with their tasks, and 1 carried to your 2027 plan"};
}
/* ---------- Live Clarity: Claude reasons from your answers and your planner ---------- */
var LIVE=null;
try{ if(window.claude&&window.claude.use) window.claude.use('sample').then(function(s){ LIVE=s||null; }).catch(function(){}); }catch(e){}

var CLARITY_RULES=[
"You are Clarity, the planning coach inside ClarityWorks, a Notion life planner. You help the user rethink the sub-goals and tasks under ONE of their 2026 intentions, through a short conversation. The user should never have to work out their own next steps: think like an experienced mentor in this area of life, notice what their situation implies, and plan what a thoughtful expert would plan.",
"",
"THE HIERARCHY (keep to it strictly)",
"- Intention: who the user is becoming ('I'm...'). Already set; never change it.",
"- Sub-goal: an OUTCOME the user could call done or not done on 31 December, or a habit with a clear target and end date. Preparation, setup, tracking, reviewing, motivation and reward steps are never sub-goals.",
"- Task: one action the user can tick off, with a date or a schedule. A repeating action is one task with its schedule.",
"- Subtask: 2 to 4 small concrete steps inside a task.",
"",
"PRINCIPLES (apply them to every intention, whatever the domain)",
"1. Listen first. What the user tells you beats the planner data. If they say something failed or changed, plan for that.",
"2. Ask until you understand. One short, warm question per message, with 2 to 4 tappable answers. Ask about whatever would most change the plan (their situation, constraints, what usually gets in the way, what they want). Usually 1 to 3 questions; never more than 4. Never ask what the planner already tells you.",
"3. Results by 31 December. Every this-year sub-goal must be achievable by 31 December of this year. Judge by when the RESULT arrives, not when the action starts (waiting times, processing times, pay dates, holidays, how long change takes). Anything that can't finish by then goes in the Next year group, with no date and no tasks.",
"4. Needs before wants. Put urgent and overdue things and foundations first. Order sub-goals in the order they should happen, and say when two run at the same time.",
"5. Reuse before you create. Give every existing sub-goal a verdict. If a one-off task already exists in the planner, use it (exact name, \"existing\": true) instead of creating a duplicate.",
"6. Support goes inside. Tracking, check-ins, reviews, photos, measurements, motivation plans and rewards are tasks inside the sub-goal they support, never sub-goals of their own.",
"7. Start smaller than you think. Plan for the user's real week, including everything else in their planner and life right now. New repeating commitments start at a level they could keep on a bad week, and build up later only if it's sensible. Estimate the hours each new task takes. Keep the total new time per week realistic, and spread repeating tasks across different days instead of stacking them on one day.",
"8. One home for each thing. File each sub-goal under the intention it actually serves. If something belongs under another intention, say so in its 'why'.",
"9. Say exactly what to do. Every task name starts with a verb and names something the user could picture doing ('Write 3 things to do when you don't feel like training', not 'Set up your motivation plan').",
"10. Repeating work is planned as dated tasks. The user sees tasks when planning each week, so every occurrence must exist as its own dated task. For anything that repeats, give \"repeat\": {\"days\":[\"Mon\",\"Thu\"],\"from\":\"YYYY-MM-DD\",\"until\":\"YYYY-MM-DD\",\"skip\":[\"YYYY-MM-DD\"]} instead of a single date (until no later than 31 December; skip dates such as Christmas Day when sensible). The app creates one task per date. If the user currently repeats a routine that serves this intention, include it here the same way and with the same name, so it keeps happening. If one of the user's templates matches, set \"template\" to its exact name and leave subtasks empty; otherwise give the steps for each session as subtasks.",
"11. Keep it focused: 2 to 5 sub-goals for this year; park the rest. Each this-year sub-goal gets 3 to 5 tasks.",
"14. Only what the user controls. Sub-goals and tasks must depend on the user's own actions, not on other people's decisions or luck. Plan the inputs (applications sent, practice done, sessions completed), not outcomes others decide (interviews offered, offers made, being chosen, results awarded). Mention those outcomes only in a 'why', as what the inputs make more likely.",
"15. Build the skills it needs. Ask yourself what knowledge or skills success depends on, and if there is a gap, plan how to close it: name the specific topics to study, the resources or practice to use, and how the user will know they have learned it. Tie it to the user's actual target (the role, the exam, the project).",
"12. Style: British English, plain and kind, short sentences, no jargon, no em dashes, no italics, no emoji. In your messages and every 'why', speak to the user as 'you' and summarise in your own words; never paste their words back.",
"13. Sub-goals, tasks and subtasks go into the user's own planner, so write them the way people write their own to-do list: start with the verb and use no pronoun ('Measure waist at the same point each time and write it down', not 'Measure your waist...'). Use 'my' only where leaving it out would be unclear ('Update my CV with the HSBC project').",
"",
"VERDICTS: New, Keep, Sharpen (same aim, clearer wording), Adjust (changed to be realistic), Focus (a priority this year), Done (genuinely achieved), Close (ended without being achieved; nothing deleted), Park (out of this year's view), Next year (into the 2027 plan, undated).",
"",
"REPLY with ONLY one JSON object, in the shape the latest message asks for:",
"A question: {\"type\":\"question\",\"message\":\"A short acknowledgement, then your question.\",\"options\":[\"short answer\",\"short answer\"]}",
"The sub-goals (no tasks yet): {\"type\":\"review\",\"message\":\"2 to 4 sentences: what the intention means to them by the end of the year, in your words; the facts that shape the plan; then 'Here's what I think you can achieve by 31 December, and what has to wait until next year.'\",\"items\":[{\"v\":\"New\",\"was\":\"old wording if it replaces an existing sub-goal, else empty\",\"now\":\"the sub-goal, with 'by 31 December' or 'until 31 December (ongoing)' where it fits\",\"why\":\"one or two sentences\"}],\"result\":\"one line, e.g. '1 closed, 3 new and 1 carried to your 2027 plan'\"}. List this year's items in order, then Park, then Next year.",
"The tasks: {\"type\":\"tasks\",\"message\":\"one short sentence\",\"subgoals\":[{\"now\":\"the sub-goal's exact wording\",\"tasks\":[{\"name\":\"Verb ...\",\"when\":\"by 28 November (one-off tasks only)\",\"repeat\":null,\"template\":\"exact template name or empty\",\"existing\":false,\"hours\":1,\"subtasks\":[\"Verb ...\",\"Verb ...\"]}]}]}"
].join("\n");

/* Per-user data. The real build reads these from the user's own Notion: routines = task names repeated 3+ times in the last 8 weeks; templates = the Tasks database's page templates. Either can be empty. */
var USER_ROUTINES=["Reflect & Plan next week","Meal Plan, Shopping & Prep","Weekly Finances audit","Weekly Beauty Routine","End of week Beauty refresh","Sunday Reset Clean","Living Area Reset Clean","Kitchen & Dining Area Reset Clean","Incline Walk","Hot girl walk","Lower body day","Core & upper body","Full body Friday"];
var USER_TEMPLATES=["Lower body day","Core & upper body","Full body Friday","Glute sculpt day 2","2k & Core 2","Incline walk","Hot girl walk","30 mins Stair-master","Sunday yoga flow","Money Mondays","Meal Plan, Grocery Shop & Prep","Reflect & Plan next week","Self Education: week of…","Weekly Beauty Routine","Bathroom Reset Clean","Bedroom Reset Clean","Kitchen & Dining Area Reset Clean","Living Area Reset Clean"];
function plannerContext(){
  var it=S.intention, d=new Date();
  var subs=(SUBS[it.domain]||[]).filter(function(sg){ return it.domain!=="Personal Development" || (it.name.indexOf("graduate")>-1 ? /Development Project/.test(sg.name) : /books/.test(sg.name)); });
  var month=MONTH.filter(function(m){ return INTENTIONS[m.it]===it; });
  var tasks=PLANNER.tasks.filter(function(t){ return t.domain===it.domain; });
  var lines=[
    "Today is "+d.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+". There are about "+weeksLeft()+" weeks left in the year.",
    "The intention we're working on: \""+it.name+"\" (life domain: "+it.domain+").",
    "All of the user's 2026 intentions: "+INTENTIONS.map(function(x){ return x.name+" ("+x.domain+")"; }).join("; ")+".",
    "Existing sub-goals under this intention: "+(subs.length?subs.map(function(s){ return "\""+s.name+"\" ("+s.note+")"; }).join("; "):"none")+(it.domain==="Projects"?". There are 22 open sub-goals in total here; the three listed are the main ones.":"."),
    "This month's (November) focus in the planner: "+MONTH.map(function(m){ return "\""+m.name+"\" ("+m.tag+", "+m.meta+")"; }).join("; ")+".",
    "Related open tasks: "+(tasks.length?tasks.map(function(t){ return "\""+t.name+"\""+(t.due?" due "+t.due:"")+(t.carried?" (carried over)":""); }).join("; "):"none")+".",
    "This week's job-search tasks in the planner: "+PLANNER.jobSearch.join("; ")+".",
    "Routines already in the planner: Hot Yoga (the user already goes); workout templates Lower body day, Core & upper body, Full body Friday; reading 20 minutes a day.",
    (USER_ROUTINES.length?"Routines this user currently repeats (the same task 3 or more times in the last 8 weeks). From now on Clarity plans these as dated tasks instead of an automation, so include any that serve this intention: "+USER_ROUTINES.join("; ")+".":"This user has no repeating routines in their planner yet."),
    (USER_TEMPLATES.length?"Task templates in this user's Notion: "+USER_TEMPLATES.join(", ")+".":"This user has no task templates, so leave \"template\" empty.")
  ];
  return lines.join("\n");
}
function liveInput(){
  var turns=[{role:"user",content:CLARITY_RULES+"\n\nThe user's planner right now:\n"+plannerContext()+"\n\nThe conversation so far follows. Your first question to them was: \""+S.conv[0].q+"\""}];
  turns.push({role:"assistant",content:"Understood. I'll follow those rules and reply with one JSON object each time."});
  S.conv.slice(1).forEach(function(m){ turns.push(m); });
  return turns;
}
function liveThinking(){ var r=assistant('Thinking',true); busyOn(); return r; }
function liveDone(r){ if(r) r.remove(); busyOff(); if(!S.busy) input.focus(); }
var SNAPS=[];
var PENCIL='<svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M225.9,74.78,181.22,30.09a14,14,0,0,0-19.8,0L38.1,153.41a13.94,13.94,0,0,0-4.1,9.9V208a14,14,0,0,0,14,14H92.69a13.94,13.94,0,0,0,9.9-4.1L225.9,94.58a14,14,0,0,0,0-19.8ZM94.1,209.41a2,2,0,0,1-1.41.59H48a2,2,0,0,1-2-2V163.31a2,2,0,0,1,.59-1.41L136,72.48,183.51,120ZM217.41,86.1,192,111.51,144.49,64,169.9,38.58a2,2,0,0,1,2.83,0l44.68,44.69a2,2,0,0,1,0,2.83Z"/></svg>';
function snapshot(text,stage){
  var rows=log.querySelectorAll('.msg-row.user'), r=rows[rows.length-1]; if(!r||r.querySelector('.edit-msg')) return;
  SNAPS.push({text:text,conv:S.conv.length,stage:stage,kind:S.kind,items:JSON.stringify(S.rt.items),result:S.rt.result,qs:S.liveQs,plan:S.plan?JSON.stringify(S.plan):null});
  r.insertAdjacentHTML('afterbegin','<button type="button" class="edit-msg" data-act="edit-msg" data-snap="'+(SNAPS.length-1)+'" aria-label="Edit this message" title="Edit">'+PENCIL+'</button>');
}
function editMessage(btn,serverDone){
  if(S.busy) return;
  if(S.apiMode&&!serverDone) return apiBack(btn,function(){ editMessage(btn,true); });
  var sn=SNAPS[+btn.dataset.snap], r=btn.closest('.msg-row'); if(!sn||!r) return;
  while(r.nextSibling) r.nextSibling.remove(); r.remove(); clearInline();
  S.conv=S.conv.slice(0,sn.conv); S.stage=sn.stage; S.kind=sn.kind; S.rt.items=JSON.parse(sn.items); S.rt.result=sn.result; S.liveQs=sn.qs; S.plan=sn.plan?JSON.parse(sn.plan):S.plan;
  revivePlan(); if(S.kind==='rtplan'&&$('planWrap')&&S.plan){ S.mi=Math.min(S.mi||0,S.plan.subgoals.length-1); renderSubgoal(); }
  input.value=sn.text; placeholder('Edit your message and send it again'); input.focus(); scrollDown();
}
function normItems(items){ return items.map(function(x){ return {v:x.v||"New",was:x.was||"",now:x.now||"",why:x.why||"",tasks:(x.tasks||[]).map(function(t){ return typeof t==="string"?{name:t,when:"",subtasks:[]}:{name:t.name||"",when:t.when||"",template:t.template||"",existing:!!t.existing,hours:t.hours||0,repeat:t.repeat||null,subtasks:t.subtasks||[]}; })}; }); }
function mergeTasks(subgoals){
  var live=S.rt.items.filter(function(x){ return ['Park','Done','Close','Next year'].indexOf(x.v)<0; });
  (subgoals||[]).forEach(function(g,i){
    var key=(g.now||'').toLowerCase().trim();
    var hit=S.rt.items.filter(function(x){ return x.now.toLowerCase().trim()===key; })[0] || live[i];
    if(hit) hit.tasks=normItems([{tasks:g.tasks||[]}])[0].tasks;
  });
}
function liveAnswer(text,opt){
  if(S.apiMode) return apiMessage(text,opt);
  opt=opt||{}; var prevStage=S.stage, prevKind=S.kind;
  var mode=opt.mode||(S.stage==='rt-change'?'change':'talk');
  if(mode!=="tasks") snapshot(text,prevStage);
  var msg;
  if(mode==='tasks') msg="I'm happy with these sub-goals. Now plan the tasks for each this-year sub-goal (not Park, Done, Close or Next year). Reply with the tasks JSON.";
  else if(mode==='refine') msg="Change to the tasks: "+text+"\nKeep the agreed sub-goals exactly as they are. Reply with the tasks JSON containing ONLY the sub-goals whose tasks change, each with its full new task list.";
  else if(mode==='change') msg="Change to the sub-goals: "+text+"\nReply with the full sub-goals JSON (type review).";
  else msg=text+(S.liveQs>=4?"\n\n(You've asked enough questions now: reply with the sub-goals JSON.)":"");
  S.conv.push({role:"user",content:msg});
  var r=liveThinking(), s0=S; S.stage='busy';
  LIVE.json(liveInput(),{cache:false}).then(function(out){
    if(S!==s0){ r.remove(); input.disabled=!!S.busy; return; }
    liveDone(r);
    if(!out||!out.type) throw {code:'bad_shape'};
    S.conv.push({role:"assistant",content:JSON.stringify(out)});
    if(out.type==="question"){
      S.liveQs++; assistant(out.message||"Tell me a bit more.");
      if(out.options&&out.options.length) inline(out.options.slice(0,4).map(function(o){ return '<button type="button" class="pill" data-act="rt-answer">'+esc(o)+'</button>'; }).join(''));
      S.stage=(mode==='refine')?'refine':(mode==='change')?'rt-change':'rt1'; S.kind=prevKind; placeholder('In your own words…');
    } else if(out.type==="tasks"){
      mergeTasks(out.subgoals); if(mode==='refine'&&out.message) assistant(out.message);
      rtTaskPlan(); placeholder('What do you want to do?');
    } else if(out.items){
      assistant(out.message||"Here's what I think you can achieve by 31 December.");
      S.rt.items=normItems(out.items); S.rt.result=out.result||"Your sub-goals are updated";
      reviewCard(); S.stage='review-sg'; reviewButtons(); placeholder('What do you want to do?');
    } else throw {code:'bad_shape'};
  }).catch(function(e){
    if(S!==s0){ r.remove(); input.disabled=!!S.busy; return; }
    liveDone(r); S.stage=prevStage; S.kind=prevKind;
    if(S.conv.length&&S.conv[S.conv.length-1].role==='user') S.conv.pop();
    var code=e&&e.code;
    if(code==='not_granted'||code==='unavailable'){ LIVE=null; S.liveMode=false; assistant("I can't reach Claude from here, so I'll use my built-in plan instead."); if(mode==='talk'){ S.stage='rt2'; rethinkAnswer(text); } return; }
    if(code==='rate_limited') assistant("I'm getting a lot of requests right now. Give it a minute and send that again.");
    else if(code==='invalid_json') assistant("My answer got cut off before I finished. Try asking for one change at a time.");
    else assistant("Sorry, something went wrong on my side. Could you send that again?");
    if(mode==='tasks'||(mode==='change'&&(prevStage==='review-sg'||prevStage==='rt-approved'))){ S.stage='review-sg'; reviewButtons(); } else if(mode==='refine'){ S.stage='reviewing'; planButtons(); }
    if(typeof console!=='undefined') console.warn('Clarity live error',code,e&&e.message);
  });
}

/* ---------- Endpoint mode: the rethink runs on the Clarity AI backend (ADR12) ----------
   Turns on when this page is served from the Clarity AI site and /.netlify/functions/rethink
   answers. Otherwise the page keeps using Claude in the page (sample) or the built-in plans. */
var API={base:(window.CLARITY_API_BASE||''),on:false,signedIn:false};
function apiPost(body){
  return fetch(API.base+'/.netlify/functions/rethink',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
    .then(function(r){ return r.json().catch(function(){ return {}; }).then(function(j){ if(!r.ok){ var e=new Error(j.error||('Request failed ('+r.status+')')); e.status=r.status; e.code=j.code; e.requiresConnection=!!j.requiresConnection; throw e; } return j; }); });
}
function liveOn(){ return !!(S&&S.apiMode) || !!(S&&S.liveMode&&LIVE); }
function normName(t){ return String(t||'').toLowerCase().replace(/[“”"']/g,'').replace(/\s+/g,' ').trim(); }
function mergeIntentions(list){
  (list||[]).forEach(function(x){
    var hit=INTENTIONS.filter(function(it){ return normName(it.name)===normName(x.name); })[0];
    if(hit) hit.id=x.id;
    else { INTENTIONS.push({domain:'',name:x.name,keys:[],id:x.id}); INT_META.push('In your Notion'); }
  });
}
function apiProbe(){
  if(!/^https?:$/.test(location.protocol)&&!window.CLARITY_API_BASE) return;
  apiPost({action:'intentions'}).then(function(j){ API.on=true; API.signedIn=true; mergeIntentions(j.intentions); })
    .catch(function(e){ if(e.status===401){ API.on=true; API.signedIn=false; } });
}
apiProbe();

function connectNotion(){
  fetch(API.base+'/.netlify/functions/notion-auth-start',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:'{}'})
    .then(function(r){ return r.json(); }).then(function(j){ if(j.authUrl) location.href=j.authUrl; });
}

// Server sub-goals and tasks, in the shape the cards already render
function apiItems(subgoals){
  return (subgoals||[]).map(function(sg){ return {v:sg.verdict,was:sg.was||'',now:sg.now,why:sg.why||'',id:sg.id,tasks:(sg.tasks||[]).map(function(t){
    var o={name:t.name,repeat:t.repeat,template:t.template||'',existing:!!t.existing,hours:t.hours||0,subtasks:t.subtasks||[]};
    if(!t.repeat&&t.due){ var d=isoDay(t.due); if(d) o.when='by '+shortDay(d); }
    return o; })}; });
}
function apiWarnings(list){
  if(!list||!list.length) return;
  var w=document.createElement('div'); w.className='plan-warnings';
  w.innerHTML='<p>Clarity couldn\'t fully fix '+(list.length===1?'one thing':'a few things')+' here. Worth a look:</p><ul>'+list.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join('')+'</ul>';
  log.appendChild(w); scrollDown();
}
function apiError(e,r,retry){
  liveDone(r);
  if(e.requiresConnection){ API.signedIn=false; assistant('Connect your Notion planner so Clarity can read your intentions and save your plan.'); inline('<button type="button" class="pill-solid" data-act="connect-notion">Connect Notion</button>'); return; }
  assistant(e.code==='max_tokens'?'My answer got cut off. Try asking for one change at a time.':e.code==='refusal'?"I can't help with that one. Try putting it another way.":(e.message||'Something went wrong. Try again.'));
  if(retry) retry();
}

function apiStart(it){
  if(!API.signedIn){ user('Rethink these sub-goals'); assistant('Connect your Notion planner first, so I can read this intention and its sub-goals.'); inline('<button type="button" class="pill-solid" data-act="connect-notion">Connect Notion</button>'); return; }
  if(!it.id){ user('Rethink these sub-goals'); assistant("I can't find “"+it.name+"” in your Notion intentions, so I'll use my built-in plan instead."); S.apiMode=false; return false; }
  S.apiMode=true; S.apiSession='rt_'+Date.now().toString(36)+Math.random().toString(36).slice(2,8); S.rt=rethinkFor(it); S.conv=[]; S.liveQs=0;
  user(SUBS[it.domain]&&SUBS[it.domain].length?'Rethink these sub-goals':'Help me plan sub-goals');
  var r=liveThinking(), s0=S;
  apiPost({action:'start',sessionId:S.apiSession,intentionId:it.id}).then(function(res){
    if(S!==s0){ r.remove(); return; }
    liveDone(r); assistant(res.reply);
    if(S.rt.q1&&S.rt.q1.length) inline(S.rt.q1.map(function(o){ return '<button type="button" class="pill" data-act="rt-answer">'+esc(o)+'</button>'; }).join(''));
    S.stage='rt1'; placeholder('In your own words…');
  }).catch(function(e){ if(S!==s0){ r.remove(); return; } apiError(e,r); });
  return true;
}

function apiMessage(text,opt){
  opt=opt||{}; var mode=opt.mode||'talk', prevStage=S.stage, prevKind=S.kind;
  if(mode!=='tasks') snapshot(text,prevStage);
  var rows=log.querySelectorAll('.msg-row.user'), myRow=rows[rows.length-1];
  var body=mode==='tasks'?{action:'approve',sessionId:S.apiSession}:{action:'message',sessionId:S.apiSession,text:text};
  var r=liveThinking(), s0=S; S.stage='busy';
  apiPost(body).then(function(res){
    if(S!==s0){ r.remove(); return; }
    liveDone(r);
    var users=(res.transcript||[]).filter(function(t){ return t.role==='user'; }), last=users[users.length-1];
    var btn=myRow&&myRow.querySelector('.edit-msg'); if(btn&&last) btn.setAttribute('data-server-id',last.id);
    S.rt.items=apiItems(res.subgoals); S.rt.result=S.rt.items.length+' sub-goals';
    if(res.stage==='interview'){
      S.liveQs++; assistant(res.reply);
      if(res.options&&res.options.length) inline(res.options.slice(0,4).map(function(o){ return '<button type="button" class="pill" data-act="rt-answer">'+esc(o)+'</button>'; }).join(''));
      S.stage='rt1'; placeholder('In your own words…');
    } else if(res.stage==='review'){
      assistant(res.reply); reviewCard(); apiWarnings(res.warnings); S.stage='review-sg'; reviewButtons(); placeholder('What do you want to do?');
    } else {
      if(mode!=='tasks'&&res.reply) assistant(res.reply);
      rtTaskPlan(); apiWarnings(res.warnings); placeholder('What do you want to do?');
    }
  }).catch(function(e){
    if(S!==s0){ r.remove(); return; }
    S.stage=prevStage; S.kind=prevKind;
    apiError(e,r,function(){ if(mode==='tasks'||prevStage==='review-sg'){ S.stage='review-sg'; reviewButtons(); } else if(prevKind==='rtplan'){ S.stage='reviewing'; planButtons(); } });
  });
}

// Going back to an earlier message: the server restores its saved version first
function apiBack(btn,done){
  var id=btn.getAttribute('data-server-id'); if(!id){ done(); return; }
  var r=liveThinking();
  apiPost({action:'back',sessionId:S.apiSession,messageId:id}).then(function(){ liveDone(r); done(); }).catch(function(e){ apiError(e,r); });
}

function reviewCard(){
  var old=$('reviewWrap'); if(old) old.remove(); S._nyShown=false;
  var w=document.createElement('div'); w.className='plan-card-wrap'; w.id='reviewWrap';
  w.innerHTML='<div class="plan-card review-card"><h2 class="goal-title">'+esc(S.intention.name)+' · By 31 December</h2><ul class="review-list">'+S.rt.items.map(function(x){
    return (x.v==='Next year'&&!S._nyShown?(S._nyShown=true,'<li class="ny-head">Next year, in your 2027 plan</li>'):'')+'<li><span class="verdict v-'+x.v.toLowerCase().replace(' ','-')+'">'+esc(x.v)+'</span><div class="review-body"><div class="review-now">'+esc(x.now)+'</div>'+(x.was&&x.v!=='Keep'&&x.v!=='Park'&&x.v!=='Done'&&x.v!=='Next year'?'<div class="review-was">Was: '+esc(x.was)+'</div>':'')+'<div class="review-why">'+esc(x.why)+'</div>'+'</div></li>';
  }).join('')+'</ul></div>';
  log.appendChild(w); scrollDown();
}
function reviewButtons(){
  var old=$('planActions'); if(old) old.remove();
  var a=document.createElement('div'); a.className='plan-actions'; a.id='planActions';
  a.innerHTML = S.stage==='rt-approved'
    ? '<button type="button" class="pill-solid" data-act="rt-sync">Sync to Notion</button>'
    : '<button type="button" class="pill-solid" data-act="rt-use">Use these sub-goals</button><button type="button" class="pill" data-act="rt-change">Change something</button>';
  log.appendChild(a); scrollDown();
}
function rethinkSynced(){
  var first=S.rt.items.filter(function(x){ return x.v!=="Park"&&x.v!=="Done"&&x.v!=="Close"&&x.v!=="Next year"; })[0];
  S.rtFirst=first;
  var w=document.createElement('div'); w.className='synced-panel';
  w.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="#4A4D3C"/></svg><p>Your sub-goals are updated in Notion.</p><p class="synced-detail">'+esc(S.rt.result)+'. Nothing is deleted, and the old wording stays in each page\'s history.</p><div class="actions">'+(first?'<button type="button" class="pill-solid" data-act="rt-plan-first">'+(first.tasks&&first.tasks.length?'See the tasks and steps':'Plan the tasks for “'+esc(first.now)+'”')+'</button>':'')+'<button type="button" class="pill" data-act="new-goal">Plan something else</button></div>';
  log.appendChild(w); scrollDown(); S.stage='done';
}

function start(){
  log.innerHTML=''; S={rt:null,rtAnswers:[],rtFirst:null,picked:null,subsShown:[],tab:'month',existingTask:null,existingSub:null,stage:'start',text:'',kind:'',intention:null,deadline:null,money:null,mode:'',domain:'',mi:0,read:false,busy:false};
  placeholder('What do you want to do?');
  assistant("Hi, I’m Clarity. Pick what you’d like to focus on, or just tell me what you want to do and I’ll work out where it fits.");
  focusCard('month');
}

/* This month's sub-goals (November) and the intentions, from your planner */
var MONTH=[
  {name:"Pass HSBC graduate probation",tag:"Big 3 · Priority 1",meta:"7 of 7 tasks done",it:1,state:'done'},
  {name:"Gain “control” of my finances",tag:"Big 3 · Priority 2",meta:"No open tasks",it:2,state:'empty',plan:'control'},
  {name:"Submit 1st Class Development Project",tag:"Big 3 · Priority 3",meta:"No tasks yet",it:4,state:'empty',plan:'devproject'},
  {name:"Read 4 books",tag:"Ongoing",meta:"20 mins a day until 31 December",it:5,state:'ongoing',plan:'books'}
];
var INT_META=["22 open sub-goals","1 sub-goal","3 sub-goals","No sub-goals yet","1 open sub-goal","1 sub-goal","1 sub-goal"];
function focusCard(tab,noScroll){
  var old=$('focus'); if(old) old.remove();
  S.tab=tab; S.stage='start';
  var w=document.createElement('div'); w.className='plan-card intention-picker focus-card'; w.id='focus';
  var tabs='<div class="focus-tabs" role="tablist"><button type="button" role="tab" aria-selected="'+(tab==='month')+'" class="'+(tab==='month'?'pill-solid':'pill')+'" data-act="tab" data-tab="month">This month</button><button type="button" role="tab" aria-selected="'+(tab==='int')+'" class="'+(tab==='int'?'pill-solid':'pill')+'" data-act="tab" data-tab="int">Intentions</button></div>';
  var rows;
  if(tab==='month'){
    rows='<h2 class="goal-title">November</h2><ul class="intention-list">'+MONTH.map(function(m,i){ return '<li><button type="button" class="intention-row" data-act="pick-month" data-i="'+i+'"><span class="intention-domain">'+esc(m.tag)+'</span><span class="intention-name">'+esc(m.name)+'</span><span class="intention-meta'+(m.state==='empty'?' gap':'')+'">'+esc(m.meta)+'</span></button></li>'; }).join('')+'</ul>';
  } else {
    rows='<h2 class="goal-title">Your intentions for 2026</h2><ul class="intention-list">'+INTENTIONS.map(function(it,i){ return '<li><button type="button" class="intention-row" data-act="pick-int" data-i="'+i+'"><span class="intention-domain">'+esc(it.domain)+'</span><span class="intention-name">'+esc(it.name)+'</span><span class="intention-meta">'+esc(INT_META[i])+'</span></button></li>'; }).join('')+'<li><button type="button" class="intention-row" data-act="new-intention"><span class="intention-domain">New</span><span class="intention-name">Plan a new intention</span></button></li></ul>';
  }
  w.innerHTML=tabs+rows; log.appendChild(w); if(!noScroll) scrollDown();
}
function endOfMonth(){ var n=new Date(); return new Date(n.getFullYear(),n.getMonth()+1,0); }
function pickMonth(i){
  var m=MONTH[i]; clearInline(); user(m.name);
  S.intention=INTENTIONS[m.it]; S.picked=m;
  wait('Thinking',800,function(){
    if(m.state==='achieved'){ assistant("“"+m.name+"” is achieved. Want to add something new under “"+S.intention.name+"”?"); inline('<button type="button" class="pill-solid" data-act="month-add">Add something</button>'); }
    else if(m.state==='done'){
      assistant("All 7 tasks under “"+m.name+"” are done, and your probation review meeting was on 18 November. Is it achieved, or is there something left to do?");
      inline('<button type="button" class="pill-solid" data-act="mark-achieved">Mark it achieved</button><button type="button" class="pill" data-act="month-add">Add something to it</button>');
    } else if(m.state==='ongoing'){
      assistant("“"+m.name+"” is ongoing: 20 minutes of reading a day until 31 December. Want me to plan how you'll get through four books, or add something to it?");
      inline('<button type="button" class="pill-solid" data-act="month-plan">Plan it</button><button type="button" class="pill" data-act="month-add">Add something to it</button>');
    } else {
      assistant("“"+m.name+"” is one of your Big 3 this month, but it has "+m.meta.toLowerCase()+". Want me to plan the tasks for it, or add something specific?");
      inline('<button type="button" class="pill-solid" data-act="month-plan">Plan the tasks</button><button type="button" class="pill" data-act="month-add">Add something specific</button>');
    }
  });
}
function pickIntention(i){
  var it=INTENTIONS[i]; clearInline(); user(it.name); S.intention=it;
  wait('Thinking',800,function(){
    var subs=SUBS[it.domain]||[];
    if(it.domain==="Personal Development") subs=subs.filter(function(sg){ return it.name.indexOf("graduate")>-1 ? /Development Project/.test(sg.name) : /books/.test(sg.name); });
    var line = it.domain==="Projects" ? "You have 22 open sub-goals here, including “Public Launch” and “Recruit & Onboard Founding Members”." : (subs.length ? "Under this you have "+subs.map(function(sg){ return "“"+sg.name+"”"; }).join(", ")+"." : "You don't have any sub-goals here yet.");
    assistant(line+" What do you want to do within this intention?");
    S.stage='within'; placeholder('What do you want to do within it?');
    var rbtn = it.domain==="Projects"||subs.length ? '<button type="button" class="pill-solid" data-act="rethink">Rethink these sub-goals</button>' : '<button type="button" class="pill-solid" data-act="rethink">Help me plan sub-goals</button>';
    inline(rbtn+subs.slice(0,3).map(function(sg,k){ return '<button type="button" class="pill" data-act="plan-existing" data-k="'+k+'">Plan “'+esc(sg.name)+'”</button>'; }).join(''));
    S.subsShown=subs.slice(0,3);
  });
}
function within(text){
  S.text=text; S.kind=classify(text); if(S.kind==='intention') S.kind='subgoal';
  S.deadline=parseDeadline(text); S.money=parseMoney(text);
  var ex=existingSubgoal(text);
  if(ex){ S.existingSub=ex.sg; S.kind='subgoal'; }
  if(S.picked && S.picked.state!=='done' && !ex){ S.kind='task'; }
  wait('Thinking',900,function(){
    var where = S.picked ? "under “"+S.picked.name+"”" : "under “"+S.intention.name+"”";
    if(ex) assistant("That's already your sub-goal “"+ex.sg.name+"”, so I'll plan the tasks under it.");
    else assistant(S.kind==='task' ? "That's a task "+where+". I'll break it into steps." : "That's a new sub-goal "+where+". I'll plan the tasks under it.");
    if(!S.deadline){ S.stage='deadline'; placeholder('For example: end of January'); assistant(S.kind==='task'?"When does it need to be done by?":"By when would you like this done?"); }
    else afterDeadline();
  });
}

function onSendRetry(text){ var st=S.stage; if(st==='rt-change') return wait('Updating your sub-goals…',1300,function(){ assistant("Done. I've updated the list with that in mind. Have another look."); reviewCard(); S.stage='review-sg'; reviewButtons(); }); if(st==='refine') return wait('Building your plan…',1400,function(){ rtTaskPlan(); }); }
function onSend(text){
  if(S.busy) return;
  clearInline(); user(text); input.value='';
  var st=S.stage;
  if(st==='review-sg'||st==='rt-approved'){ var pa=$('planActions'); if(pa) pa.remove(); if(liveOn()) return liveAnswer(text,{mode:'change'}); S.stage='rt-change'; return onSendRetry(text); }
  if((st==='reviewing'||st==='approved')&&S.kind==='rtplan'){ var pb=$('planActions'); if(pb) pb.remove(); if(liveOn()) return liveAnswer(text,{mode:'refine'}); S.stage='refine'; return onSendRetry(text); }
  if(st==='start') return understand(text);
  if(st==='within') return within(text);
  if(st==='rt1'||st==='rt2'||st==='rt3') return rethinkAnswer(text);
  if(st==='rt-change'&&liveOn()){ return liveAnswer(text); }
  if(st==='rt-change'){ return wait('Updating your sub-goals…',1300,function(){ assistant("Done. I've updated the list with that in mind. Have another look."); reviewCard(); S.stage='review-sg'; reviewButtons(); }); }
  if(st==='intention-name'){ S.text=text; return wait('Thinking',800,intentionKnown); }
  if(st==='deadline'){ S.deadline=parseDeadline(text)||defaultDeadline(); return wait('Thinking',900,afterDeadline); }
  if(st==='income'){ return wait('Thinking',900,function(){ incomeAnswer(text); }); }
  if(st==='refine'&&S.kind==='rtplan'&&liveOn()){ return liveAnswer(text,{mode:'refine'}); }
  if(st==='refine'){ return wait('Building your plan…',1400,function(){ buildPlan(); }); }
  if(st==='pick'){ return wait('Thinking',600,function(){ showPicker("Pick the intention this belongs to."); }); }
  return understand(text);
}
function defaultDeadline(){ var n=new Date(); return new Date(n.getFullYear(),n.getMonth()+2,0); }

function understand(text){
  S.text=text; S.kind=classify(text); S.deadline=parseDeadline(text); S.money=parseMoney(text);
  wait('Thinking',1000,function(){
    if(S.kind==='intention'){ S.domain=guessDomain(text); return intentionKnown(); }
    var task=existingTask(text);
    if(task && S.kind!=='intention'){
      S.kind='task'; S.existingTask=task; S.suggested=INTENTIONS.filter(function(i){ return i.domain===task.domain; })[0]; S.stage='confirm';
      assistant("You already have “"+task.name+"” in your planner"+(task.due?". It was due "+task.due:"")+(task.carried?" and it's been carried over to this week":"")+". Rather than add it again, I'll break it into small steps so it actually gets done.");
      inline('<button type="button" class="pill-solid" data-act="confirm-intention">Break it down</button><button type="button" class="pill" data-act="pick-intention">Choose a different intention</button>');
      return;
    }
    var ex=existingSubgoal(text);
    if(ex){
      S.kind='subgoal'; S.existingSub=ex.sg; S.suggested=INTENTIONS.filter(function(i){ return i.domain===ex.domain; })[0]; S.stage='confirm';
      assistant("That's already one of your sub-goals: “"+ex.sg.name+"”, under “"+S.suggested.name+"”. It has "+(ex.sg.note==="no tasks yet"?"no tasks yet":"nothing planned yet")+". I'll plan the tasks under it instead of creating a duplicate.");
      inline('<button type="button" class="pill-solid" data-act="confirm-intention">Plan the tasks</button><button type="button" class="pill" data-act="pick-intention">Choose a different intention</button>');
      return;
    }
    var it=matchIntention(text);
    var what = S.kind==='task' ? "That's a task, so I'll break it into steps." : "That sounds like a sub-goal: something to achieve, with a few tasks under it.";
    if(it){
      S.suggested=it; S.stage='confirm';
      assistant(what+" It fits under your "+it.domain+" intention: “"+it.name+"”."+(S.kind==='subgoal'?subsLine(it):""));
      inline('<button type="button" class="pill-solid" data-act="confirm-intention">Yes, that\'s right</button><button type="button" class="pill" data-act="pick-intention">Choose a different intention</button><button type="button" class="pill" data-act="switch-kind">'+(S.kind==='task'?"It's bigger than a task":"It's just a task")+'</button>');
    } else {
      assistant(what+" Which intention does it belong to?");
      showPicker();
    }
  });
}
function showPicker(question){
  if(question) assistant(question);
  S.stage='pick';
  var w=document.createElement('div'); w.className='plan-card intention-picker'; w.id='picker';
  w.innerHTML='<h2 class="goal-title">Your intentions for 2026</h2><ul class="intention-list">'+INTENTIONS.map(function(it,i){ return '<li><button type="button" class="intention-row" data-act="choose-intention" data-i="'+i+'"><span class="intention-domain">'+esc(it.domain)+'</span><span class="intention-name">'+esc(it.name)+'</span></button></li>'; }).join('')+'<li><button type="button" class="intention-row" data-act="new-intention"><span class="intention-domain">New</span><span class="intention-name">It needs a new intention</span></button></li></ul>';
  log.appendChild(w); scrollDown();
}
function setIntention(it){
  clearInline(); S.intention=it; user(it.name);
  wait('Thinking',800,function(){
    if(!S.deadline){ S.stage='deadline'; placeholder('For example: end of January'); assistant(S.kind==='task'?"When does it need to be done by?":"By when would you like this done?"); }
    else afterDeadline();
  });
}
function afterDeadline(){
  if(S.kind==='task') return planNow();
  if(S.kind==='intention') return planNow();
  feasibility();
}

/* Is the sub-goal realistic by the date? */
function feasibility(){
  var months=monthsUntil(S.deadline);
  if(S.money){
    var perMonth=S.money/months;
    if(perMonth>250){
      S.stage='feasible';
      assistant("I don't think "+gbp(S.money)+" by "+fmt(S.deadline)+" is realistic right now. That's about "+gbp(perMonth)+" a month for the next "+months+" months.");
      assistant("Here's what I can see in your planner. This week you have “Apply to 5 jobs” and “Search for graduate opportunities”, so I'm assuming you're between jobs. You also have “Pay off 50% of credit card debt” and “Save first £500 of emergency fund in a HYSA”, and neither has started. Investing while you're paying credit card interest usually costs more than it earns.");
      assistant("So by "+fmt(S.deadline)+", this is what I think you can achieve, and it gets you as close to "+gbp(S.money)+" as you can get: land a job, finish your £500 emergency fund, pay off half your card, then open an ISA and start investing a small amount each month. Two of those are sub-goals you already have, so I'll link them rather than duplicate them.");
      inline('<button type="button" class="pill-solid" data-act="realistic">Plan the realistic version</button><button type="button" class="pill" data-act="have-income">I do have an income</button><button type="button" class="pill" data-act="keep-target">Keep my original target</button>');
      return;
    }
  }
  planNow();
}
function incomeAnswer(text){
  var m=text.match(/([\d,]+(?:\.\d+)?)\s?(k)?/i), per=m?parseFloat(m[1].replace(/,/g,''))*(m[2]?1000:1):0, months=monthsUntil(S.deadline);
  if(per*months>=S.money){ assistant("Then "+gbp(S.money)+" by "+fmt(S.deadline)+" is doable at "+gbp(per)+" a month. I'll plan for the full amount."); S.mode='full-invest'; }
  else { assistant("At "+gbp(per)+" a month you'd reach about "+gbp(per*months)+" by "+fmt(S.deadline)+". I'll plan for that, and keep "+gbp(S.money)+" as the next target."); S.mode='full-invest'; S.money=per*months; }
  planNow();
}
function intentionKnown(){
  S.kind='intention'; S.domain=S.domain||guessDomain(S.text);
  assistant("That's a new intention. I'd put it under "+S.domain+". By when would you like it to feel true?");
  S.stage='deadline'; placeholder('For example: end of next year');
}
var DOW={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
function isoDay(t){ var m=String(t||'').match(/(\d{4})-(\d{2})-(\d{2})/); return m?new Date(+m[1],+m[2]-1,+m[3]):null; }
function expandRepeat(rp){
  var today=new Date(); today.setHours(0,0,0,0);
  var from=isoDay(rp.from)||new Date(today.getTime()+864e5), until=isoDay(rp.until)||YEAR_END(), end=YEAR_END();
  if(from<today) from=today; if(until>end) until=end;
  var days=(rp.days||[]).map(function(d){ return DOW[String(d).slice(0,3).replace(/^./,function(c){return c.toUpperCase();})]; }).filter(function(x){ return x!==undefined; });
  var skip=(rp.skip||[]).map(function(x){ var d=isoDay(x); return d?d.getTime():0; });
  var out=[]; for(var d=new Date(from); d<=until && out.length<60; d.setDate(d.getDate()+1)){ if(days.indexOf(d.getDay())>-1 && skip.indexOf(d.getTime())<0) out.push(new Date(d)); }
  return out;
}
function shortDay(d){ return d.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'}); }
function hasTasks(){ return S.rt&&S.rt.items.some(function(x){ return x.tasks&&x.tasks.length; }); }
function rtTaskPlan(){
  var keep=S.rt.items.filter(function(x){ return ['Park','Done','Close','Next year'].indexOf(x.v)<0; });
  S.plan={subgoals:keep.map(function(x){ return {title:x.now,note:x.why,tasks:(x.tasks||[]).map(function(t){ var o=typeof t==='string'?{name:t}:t; if(o.repeat){ var ds=expandRepeat(o.repeat), steps=o.template?[]:(o.subtasks||[]); return {title:o.name,when:ds.length+' dated task'+(ds.length===1?'':'s')+(ds.length?', '+shortDay(ds[0])+' to '+shortDay(ds[ds.length-1]):'')+(o.template?' · '+o.template+' template':''),subs:[],dates:ds.map(shortDay),steps:steps,count:ds.length,subCount:ds.length*steps.length}; }
      return {title:o.name,when:(o.when||'')+(o.existing?(o.when?' · ':'')+'already in your planner':o.template?(o.when?' · ':'')+o.template+' template':''),subs:(o.template||o.existing)?[]:(o.subtasks||[]),count:o.existing?0:1,subCount:(o.template||o.existing)?0:(o.subtasks||[]).length}; })}; })};
  S.kind='rtplan'; S.existingSub=null;
  var keepMi=S.mi||0, refresh=!!$('planWrap'); if(refresh) supersedePlan();
  var old=$('planActions'); if(old) old.remove();
  S._refresh=refresh; buildPlan(); S._refresh=false;
  if(refresh){ S.mi=Math.min(keepMi,S.plan.subgoals.length-1); renderSubgoal(); }
}
function supersedePlan(){ var w=$('planWrap'); if(!w) return; w.removeAttribute('id'); w.classList.add('superseded'); w.querySelectorAll('[id]').forEach(function(el){ el.setAttribute('data-old-id',el.id); el.removeAttribute('id'); }); }
function revivePlan(){ if($('planWrap')) return; var ws=log.querySelectorAll('.plan-card-wrap.superseded'); var w=ws[ws.length-1]; if(!w) return; w.classList.remove('superseded'); w.id='planWrap'; w.querySelectorAll('[data-old-id]').forEach(function(el){ el.id=el.getAttribute('data-old-id'); el.removeAttribute('data-old-id'); }); }
var PAGER='<div class="milestone-pager"><button type="button" class="pager-btn" data-act="prev" aria-label="Previous sub-goal"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button><span class="milestone-pager-label" id="pagerLabel"></span><button type="button" class="pager-btn" data-act="next" aria-label="Next sub-goal"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button></div><div id="milestone-content"></div>';
function planNow(){ wait('Building your plan…',1500,buildPlan); }

function buildPlan(){
  if(!S._refresh){ supersedePlan(); var oldActs=$('planActions'); if(oldActs) oldActs.remove(); } S.mi=0;
  if(!S._refresh) assistant(S.kind==='rtplan'?"Now the tasks. Use the arrows to go through each sub-goal, and open a task to see its steps.":"Here's your plan. Take a look and let me know if anything needs adjusting.");
  var wrap=document.createElement('div'); wrap.className='plan-card-wrap'; wrap.id='planWrap';
  var h='<div class="plan-card">';
  if(S.kind==='task'){
    var p=taskPlan(); if(S.existingTask) p.title=S.existingTask.name; S.counts=[0,0,S.existingTask?0:1,p.subtasks.length];
    h+='<h2 class="goal-title">Task</h2><h3 class="milestone-title">'+esc(p.title)+'</h3><p class="milestone-description">Due '+fmt(S.deadline)+' · For “'+esc(S.intention.name)+'”</p><ol class="subtask-list solo">'+p.subtasks.map(function(s){ return '<li class="subtask-row"><div class="subtask-content"><span class="subtask-label">'+esc(s)+'</span></div></li>'; }).join('')+'</ol>';
  } else if(S.kind==='rtplan'){
    var nt=0,ns=0; S.plan.subgoals.forEach(function(g){ g.tasks.forEach(function(t){ nt+=(t.count!==undefined?t.count:1); ns+=(t.subCount!==undefined?t.subCount:t.subs.length); }); }); S.counts=[0,S.plan.subgoals.length,nt,ns];
    h+='<h2 class="goal-title">'+esc(S.intention.name)+' · By 31 December</h2>'+PAGER;
  } else if(S.kind==='intention'){
    S.plan=intentionPlan(); var n=0; S.plan.subgoals.forEach(function(g){ g.tasks.forEach(function(t){ n+=t.subs.length; }); });
    S.counts=[1,3,S.plan.subgoals.reduce(function(a,g){return a+g.tasks.length;},0),n];
    h+='<h2 class="goal-title">New intention · '+esc(S.domain)+'</h2><p class="plan-intention-lead">'+esc(S.plan.intention)+'</p><div class="milestone-pager"><button type="button" class="pager-btn" data-act="prev" aria-label="Previous sub-goal"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button><span class="milestone-pager-label" id="pagerLabel"></span><button type="button" class="pager-btn" data-act="next" aria-label="Next sub-goal"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button></div><div id="milestone-content"></div>';
  } else {
    var g=subgoalPlan(S.mode); var subs=0; g.tasks.forEach(function(t){ subs+=t.subs.length; }); S.counts=[0,S.existingSub?0:1,g.tasks.length,subs];
    h+='<h2 class="goal-title">'+(S.existingSub?'Existing sub-goal':'Sub-goal')+' · For “'+esc(S.intention.name)+'”</h2><h3 class="milestone-title">'+esc(g.title)+'</h3><p class="milestone-description">'+esc(g.note)+'</p>'+taskList(g.tasks);
  }
  wrap.innerHTML=h+'</div>'; log.appendChild(wrap);
  if(S.kind==='intention'||S.kind==='rtplan') renderSubgoal();
  S.stage='reviewing'; planButtons(); placeholder('What do you want to do?');
}
function taskList(tasks){
  return '<ul class="task-list">'+tasks.map(function(t){ if(t.dates&&t.dates.length) return '<li class="task-item"><details><summary class="task-summary">'+CHEV+'<span class="task-label">'+esc(t.title)+(t.when?' <span class="task-when">· '+esc(t.when)+'</span>':'')+'</span></summary><div class="date-chips">'+t.dates.map(function(d){ return '<span>'+esc(d)+'</span>'; }).join('')+'</div>'+(t.steps&&t.steps.length?'<p class="each-time">Each time: '+esc(t.steps.join(', '))+'</p>':'')+'</details></li>'; if(!t.subs||!t.subs.length) return '<li class="task-item"><div class="task-summary no-subs"><span class="task-label">'+esc(t.title)+(t.when?' <span class="task-when">· '+esc(t.when)+'</span>':'')+'</span></div></li>'; return '<li class="task-item"><details><summary class="task-summary">'+CHEV+'<span class="task-label">'+esc(t.title)+(t.when?' <span class="task-when">· '+esc(t.when)+'</span>':'')+'</span></summary><ol class="subtask-list">'+t.subs.map(function(s){ return '<li class="subtask-row"><div class="subtask-content"><span class="subtask-label">'+esc(s)+'</span></div></li>'; }).join('')+'</ol></details></li>'; }).join('')+'</ul>';
}
function renderSubgoal(){
  var g=S.plan.subgoals[S.mi];
  $('milestone-content').innerHTML='<h3 class="milestone-title">'+esc(g.title)+'</h3><p class="milestone-description">'+esc(g.note)+'</p>'+taskList(g.tasks);
  $('pagerLabel').innerHTML='<span class="pager-dots" aria-hidden="true">'+S.plan.subgoals.map(function(_,i){ return '<span'+(i===S.mi?' class="on"':'')+'></span>'; }).join('')+'</span><span>Sub-goal '+(S.mi+1)+' of '+S.plan.subgoals.length+'</span>';
  $('planWrap').querySelector('[data-act="prev"]').disabled=S.mi===0;
  $('planWrap').querySelector('[data-act="next"]').disabled=S.mi===S.plan.subgoals.length-1;
}
function planButtons(){
  var old=$('planActions'); if(old) old.remove();
  var a=document.createElement('div'); a.className='plan-actions'; a.id='planActions';
  a.innerHTML='<button type="button" class="icon-btn'+(S.read?' active':'')+'" data-act="read" aria-label="Read aloud" title="Read aloud">'+SPEAK+'</button>'+
    (S.stage==='approved'?'<button type="button" class="pill-solid" data-act="sync">Sync to Notion</button>':'<button type="button" class="pill-solid" data-act="happy">I\'m happy with this</button><button type="button" class="pill" data-act="refine">I want to refine it</button>');
  log.appendChild(a); scrollDown();
}
function plural(n,word){ return n+' '+word+(n===1?'':'s'); }
function synced(){
  var c=S.counts, parts=[];
  if(!c[0]&&!c[1]&&!c[2]&&c[3]) parts.push('steps added to your existing task'); if(c[0]) parts.push('1 intention'); if(c[1]) parts.push(plural(c[1],'sub-goal')); if(c[2]) parts.push(plural(c[2],'task')); if(c[3]) parts.push(plural(c[3],'subtask'));
  var where = S.kind==='intention' ? 'in your Intentions' : 'under “'+S.intention.name+'”';
  var w=document.createElement('div'); w.className='synced-panel';
  w.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="#4A4D3C"/></svg><p>'+(S.apiMode?'Your plan is saved in Clarity.':'Your plan is now in Notion, good luck!')+'</p><p class="synced-detail">'+esc(parts.join(', ').replace(/, ([^,]*)$/,' and $1'))+', '+esc(where)+'.</p><div class="actions"><a class="pill-solid" href="#clarity">Open in Notion</a><button type="button" class="pill" data-act="new-goal">Plan something else</button></div>';
  log.appendChild(w); scrollDown(); S.stage='done';
}

document.addEventListener('click',function(e){
  var t=e.target.closest('[data-view],[data-act]');
  if(!t){ if(!e.target.closest('.nav-right')) $('userMenuDropdown').classList.remove('show'); return; }
  if(t.dataset.view){ showView(t.dataset.view); return; }
  if(S&&S.busy&&t.closest('#chat-log')) return;
  var a=t.dataset.act;
  if(a==='user-menu'){ e.stopPropagation(); $('userMenuDropdown').classList.toggle('show'); }
  else if(a==='mobile-open'){ $('mobileMenuPanel').classList.add('open'); $('mobileMenuOverlay').classList.add('show'); }
  else if(a==='mobile-close') closeMobile();
  else if(a==='new-goal'){ showView('clarity'); start(); }
  else if(S.busy) return;
  else if(a==='example') onSend(t.textContent);
  else if(a==='rethink') startRethink();
  else if(a==='rt-answer'){ var txt=t.textContent; clearInline(); user(txt); rethinkAnswer(txt); }
  else if(a==='edit-msg'){ editMessage(t); }
  else if(a==='connect-notion'){ connectNotion(); }
  else if(a==='rt-use'&&liveOn()){ $('planActions').remove(); user('Use these sub-goals'); liveAnswer('Use these sub-goals',{mode:'tasks'}); }
  else if(a==='rt-use'&&hasTasks()){ $('planActions').remove(); user('Use these sub-goals'); wait('Planning the tasks…',900,rtTaskPlan); }
  else if(a==='rt-use'){ $('planActions').remove(); user('Use these sub-goals'); wait('Thinking',600,function(){ assistant('Great - I will update your sub-goals in Notion when you are ready.'); S.stage='rt-approved'; reviewButtons(); }); }
  else if(a==='rt-change'){ $('planActions').remove(); assistant("Sure. What would you like to change? For example, a date, one you'd rather keep as it was, or one I've missed."); S.stage='rt-change'; placeholder('What would you like to change?'); input.focus(); }
  else if(a==='rt-sync'){ $('planActions').remove(); wait('Syncing to Notion…',1400,rethinkSynced); }
  else if(a==='rt-plan-first'&&S.rtFirst&&S.rtFirst.tasks&&S.rtFirst.tasks.length){
    var keep=S.rt.items.filter(function(x){ return ['Park','Done','Close','Next year'].indexOf(x.v)<0; });
    S.plan={subgoals:keep.map(function(x){ return {title:x.now,note:x.why,tasks:(x.tasks||[]).map(function(t){ var o=typeof t==='string'?{name:t}:t; return {title:o.name,when:o.when||'',subs:o.subtasks||[]}; })}; })};
    S.kind='rtplan'; S.existingSub=null; planNow();
  }
  else if(a==='rt-plan-first'){ var f=S.rtFirst; S.existingSub={name:f.now,note:'this season'}; S.kind='subgoal'; S.text=f.now; S.deadline=parseDeadline(f.now)||defaultDeadline(); planNow(); }
  else if(a==='tab'){ var y=window.scrollY; focusCard(t.dataset.tab,true); window.scrollTo(0,y); }
  else if(a==='pick-month') pickMonth(+t.dataset.i);
  else if(a==='pick-int') pickIntention(+t.dataset.i);
  else if(a==='month-plan'){ clearInline(); user(t.textContent); var m=S.picked; S.existingSub={name:m.name,note:m.meta}; S.kind='subgoal'; S.deadline=m.plan==='books'?new Date(new Date().getFullYear(),11,31):endOfMonth(); planNow(); }
  else if(a==='month-add'){ clearInline(); user(t.textContent); wait('Thinking',600,function(){ assistant("What do you want to do within “"+S.picked.name+"”?"); S.stage='within'; placeholder('What do you want to do?'); }); }
  else if(a==='mark-achieved'){ clearInline(); user('Mark it achieved'); wait('Thinking',700,function(){ assistant("Brilliant, well done. I'll mark “"+S.picked.name+"” as achieved in Notion. What would you like to focus on next?"); S.picked.meta="Achieved"; S.picked.state='achieved'; S.picked=null; focusCard('month'); }); }
  else if(a==='plan-existing'){ clearInline(); var sg=S.subsShown[+t.dataset.k]; user(t.textContent); S.existingSub=sg; S.kind='subgoal'; S.text=sg.name; wait('Thinking',700,function(){ S.stage='deadline'; placeholder('For example: end of March'); assistant("By when would you like “"+sg.name+"” done?"); }); }
  else if(a==='new-intention'){ clearInline(); user('Plan a new intention'); S.kind='intention'; wait('Thinking',600,function(){ assistant("Lovely. What's the intention? Say it as if it's already true, like “I'm a confident public speaker”."); S.stage='intention-name'; placeholder("I'm…"); }); }
  else if(a==='confirm-intention') setIntention(S.suggested);
  else if(a==='pick-intention'){ clearInline(); showPicker("Pick the intention this belongs to."); }
  else if(a==='switch-kind'){ clearInline(); S.kind=S.kind==='task'?'subgoal':'task'; user(t.textContent); assistant(S.kind==='task'?"Got it, a task. I'll break it into steps.":"Got it, a sub-goal. I'll plan the tasks under it."); inline('<button type="button" class="pill-solid" data-act="confirm-intention">Keep it under “'+esc(S.suggested.name)+'”</button><button type="button" class="pill" data-act="pick-intention">Choose a different intention</button>'); }
  else if(a==='choose-intention') setIntention(INTENTIONS[+t.dataset.i]);
  else if(a==='realistic'){ clearInline(); user('Plan the realistic version'); S.mode='realistic-invest'; planNow(); }
  else if(a==='keep-target'){ clearInline(); user('Keep my original target'); S.mode='full-invest'; assistant("Okay, I'll plan for the full "+gbp(S.money)+". I'll tell you honestly each month whether you're on track."); planNow(); }
  else if(a==='have-income'){ clearInline(); user('I do have an income'); wait('Thinking',600,function(){ assistant("Thanks for telling me. Roughly how much could you invest each month?"); S.stage='income'; placeholder('For example: £300'); }); }
  else if(a==='prev'&&S.mi>0){ S.mi--; renderSubgoal(); }
  else if(a==='next'&&S.plan&&S.mi<S.plan.subgoals.length-1){ S.mi++; renderSubgoal(); }
  else if(a==='read'){ S.read=!S.read; t.classList.toggle('active',S.read); }
  else if(a==='happy'){ $('planActions').remove(); assistant('Great - I will write this into your Notion planner when you are ready.'); S.stage='approved'; planButtons(); }
  else if(a==='refine'){ $('planActions').remove(); assistant("No problem - tell me what you'd like to change, and I'll update your plan."); S.stage='refine'; placeholder('What would you like to change?'); input.focus(); }
  else if(a==='sync'){ $('planActions').remove(); wait('Syncing to Notion…',1400,synced); }
});
$('composerForm').addEventListener('submit',function(e){ e.preventDefault(); var v=input.value.trim(); if(!v) return; onSend(v); });

start();
var h=(location.hash||'').slice(1);
showView(['widgets','clarity','tutorials','settings'].indexOf(h)>-1?h:'clarity');
})();
