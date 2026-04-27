const days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const db=[
{type:"NA",day:"Thursday",time:"19:00",name:"Shrewsbury Newcomers",venue:"St Winefrides Convent",address:"College Hill, Shrewsbury",postcode:"SY1 1LS",source:"https://meetings.ukna.org/"},
{type:"NA",day:"Sunday",time:"19:00",name:"Shrewsbury Sunday",venue:"St Winefrides Convent",address:"College Hill, Shrewsbury",postcode:"SY1 1LS",source:"https://meetings.ukna.org/"},
{type:"NA",day:"Tuesday",time:"14:00",name:"Telford Daytime",venue:"Strickland House",address:"Wellington",postcode:"TF1 3BX",source:"https://meetings.ukna.org/"},
{type:"NA",day:"Friday",time:"11:30",name:"Telford Park Lane",venue:"Park Lane Centre",address:"Woodside, Telford",postcode:"TF7 5QZ",source:"https://meetings.ukna.org/"},
{type:"NA",day:"Tuesday",time:"19:30",name:"Wolverhampton ESH Shares",venue:"St Patrick’s RC Church",address:"299 Wolverhampton Road",postcode:"WV10 0QQ",source:"https://meetings.ukna.org/"},
{type:"NA",day:"Wednesday",time:"19:30",name:"Wolverhampton Spiritual Sisters",venue:"St Patrick’s RC Church",address:"299 Wolverhampton Road",postcode:"WV10 0QQ",source:"https://meetings.ukna.org/"},
{type:"NA",day:"Friday",time:"19:00",name:"Wolverhampton Friday Night",venue:"All Saints Church",address:"All Saints Road",postcode:"WV2 1EL",source:"https://meetings.ukna.org/"},
{type:"NA",day:"Saturday",time:"18:30",name:"Wolverhampton Saturday",venue:"St Mary & St John Church",address:"Snow Hill",postcode:"WV2 4AD",source:"https://meetings.ukna.org/"},
{type:"NA",day:"Monday",time:"19:30",name:"Walsall Monday Message",venue:"CGL Walsall",address:"30 Station Street",postcode:"WS2 9JZ",source:"https://meetings.ukna.org/"},
{type:"NA",day:"Wednesday",time:"19:30",name:"Stafford NA",venue:"Chase Recovery",address:"Stafford",postcode:"ST16 2PT",source:"https://meetings.ukna.org/"},
{type:"NA",day:"Thursday",time:"19:30",name:"Cannock NA",venue:"St Luke’s Church",address:"Cannock",postcode:"WS11 1DE",source:"https://meetings.ukna.org/"},
{type:"NA",day:"Friday",time:"11:00",name:"Rugeley NA",venue:"Community Centre",address:"Rugeley",postcode:"WS15 2HX",source:"https://meetings.ukna.org/"},
{type:"NA",day:"Saturday",time:"18:00",name:"Lichfield NA",venue:"Wade Street Church",address:"Lichfield",postcode:"WS13 6HL",source:"https://meetings.ukna.org/"},
{type:"NA",day:"Tuesday",time:"19:30",name:"Solihull NA",venue:"St Augustine’s",address:"Solihull",postcode:"B91 3QE",source:"https://meetings.ukna.org/"},
{type:"NA",day:"Wednesday",time:"19:30",name:"Dudley NA",venue:"Here4Youth Centre",address:"Dudley",postcode:"DY1 1LA",source:"https://meetings.ukna.org/"},
{type:"NA",day:"Friday",time:"19:30",name:"Erdington NA",venue:"Six Ways Baptist Church",address:"Birmingham",postcode:"B24 8AD",source:"https://meetings.ukna.org/"},
{type:"NA Online",day:"Every day",time:"Various",name:"NA Online Meetings",venue:"Online",address:"Official online finder",postcode:"Online",source:"https://meetings.ukna.org/meeting/search/online"},
{type:"AA Online",day:"Every day",time:"Various",name:"AA Online Meetings",venue:"Online",address:"Official AA finder",postcode:"Online",source:"https://www.alcoholics-anonymous.org.uk/find-a-meeting/"},
{type:"AA",day:"Every day",time:"Various",name:"AA Physical Meetings",venue:"Nationwide",address:"Search by postcode",postcode:"UK",source:"https://www.alcoholics-anonymous.org.uk/find-a-meeting/"}
];
const steps=["Admit powerlessness and that life had become unmanageable.","Believe help and recovery are possible.","Decide to turn towards recovery and support.","Take an honest personal inventory.","Share the truth with someone safe.","Become ready to change harmful patterns.","Ask for help removing those patterns.","List people harmed and become willing to make amends.","Make amends where possible, without causing harm.","Keep taking inventory and admit wrongs quickly.","Use prayer or meditation to stay connected and grounded.","Carry the message and practise these principles."];
const badgeDef=[["First meeting",1],["3 meetings",3],["One week",7],["Two weeks",14],["30 days",30],["60 days",60],["90 days",90],["100 meetings",100]];
let state=JSON.parse(localStorage.getItem("rc_premium")||'{"attended":[],"plan":[],"goal":3,"allowMultiple":false,"countOnline":true,"mood":""}');
function save(){localStorage.setItem("rc_premium",JSON.stringify(state));render();}
function today(){return new Date().toISOString().slice(0,10);}
function toast(t){const el=document.getElementById("toast");el.textContent=t;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2200);}
function weekStart(){const d=new Date();const day=d.getDay()||7;d.setDate(d.getDate()-day+1);d.setHours(0,0,0,0);return d;}
function weeklyCount(){const s=weekStart();return state.attended.filter(x=>new Date(x.date)>=s && (state.countOnline||x.kind!=="Online")).length;}
function streak(){let s=0,d=new Date(),set=new Set(state.attended.map(x=>x.date));while(set.has(d.toISOString().slice(0,10))){s++;d.setDate(d.getDate()-1);}return s;}
function xp(){return state.attended.length*10 + streak()*5;}
function level(){return Math.floor(xp()/75)+1;}
function encouragement(){if(!state.attended.find(x=>x.date===today())) return "Just one meeting today. In person or online both count."; if(streak()>=7) return "Strong consistency. Keep building."; if(weeklyCount()>=state.goal) return "Weekly goal hit. That is real progress."; return "Good start. Keep going.";}
function mark(kind){const d=today(); if(!state.allowMultiple && state.attended.find(x=>x.date===d)){toast("Today is already counted");return;} const note=document.getElementById("note").value.trim(); state.attended.push({date:d,kind,mood:state.mood,note}); todayResult.textContent=`Done. ${kind} meeting counted.`; toast("Meeting counted"); save();}
document.getElementById("attendPerson").onclick=()=>mark("In person");
document.getElementById("attendOnline").onclick=()=>mark("Online");
document.querySelectorAll(".moods button").forEach(b=>b.onclick=()=>{state.mood=b.dataset.mood;save();});
goalCount.onchange=()=>{state.goal=Number(goalCount.value);save();};
allowMultiple.onchange=()=>{state.allowMultiple=allowMultiple.checked;save();};
countOnline.onchange=()=>{state.countOnline=countOnline.checked;save();};
function addPlan(m){state.plan.push({...m});toast("Added to plan");save();location.hash="#plan";}
function removePlan(i){state.plan.splice(i,1);save();}
window.removePlan=removePlan;
addManual.onclick=()=>addPlan({type:manualType.value,day:manualDay.value,time:manualTime.value||"Time TBC",name:"Chosen meeting",venue:manualPlace.value||"Venue TBC",address:"",postcode:"",source:""});
function renderMeetings(){const q=search.value.toLowerCase(),df=dayFilter.value,tf=typeFilter.value;meetingList.innerHTML="";db.filter(m=>{const txt=Object.values(m).join(" ").toLowerCase();return (!q||txt.includes(q))&&(!df||m.day===df||m.day==="Every day")&&(!tf||m.type.includes(tf));}).forEach(m=>{const map=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.venue+" "+m.address+" "+m.postcode)}`;let el=document.createElement("article");el.className="meeting-card";el.innerHTML=`<div class="meeting-top"><div><div class="meeting-title">${m.name}</div><div class="meeting-meta"><b>${m.day}</b> ${m.time}<br>${m.venue}<br>${m.address}<br>${m.postcode}</div></div><span class="pill">${m.type}</span></div><div class="meeting-actions"><button class="small add">Add to plan</button><a class="small" target="_blank" href="${m.source}">Check source</a><a class="small" target="_blank" href="${map}">Map</a></div>`;el.querySelector(".add").onclick=()=>addPlan(m);meetingList.appendChild(el);});}
[search,dayFilter,typeFilter].forEach(x=>x.oninput=renderMeetings);
quickPick.onclick=()=>{let todayName=days[(new Date().getDay()+6)%7];let m=db.find(x=>x.day===todayName)||db.find(x=>x.type.includes("Online"));quickResult.innerHTML=`<article class="meeting-card"><div class="meeting-title">${m.name}</div><div class="meeting-meta">${m.day} ${m.time}<br>${m.venue}<br>${m.postcode}</div><div class="meeting-actions"><a class="small" target="_blank" href="${m.source}">Check now</a><button class="small" id="quickAdd">Add to plan</button></div></article>`;quickAdd.onclick=()=>addPlan(m);};
function openCrisis(){document.getElementById("crisisBox").scrollIntoView({behavior:"smooth"});}
window.openCrisis=openCrisis;
function render(){
goalCount.value=state.goal;allowMultiple.checked=state.allowMultiple;countOnline.checked=state.countOnline;
document.querySelectorAll(".moods button").forEach(b=>b.classList.toggle("selected",b.dataset.mood===state.mood));
totalMeetings.textContent=state.attended.length;weekMeetings.textContent=weeklyCount();streakCount.textContent=streak();level.textContent=level();encouragement.textContent=encouragement();xpText.textContent=`${xp()} XP • Level ${level()} • ${state.attended.length} meetings logged`;
let pct=Math.min(100,Math.round(weeklyCount()/state.goal*100));weeklyBar.style.width=pct+"%";weeklyText.textContent=`${weeklyCount()} / ${state.goal} this week`;weeklyPercent.textContent=pct+"%";
badges.innerHTML=badgeDef.map(([name,num])=>`<div class="badge ${state.attended.length>=num?'earned':''}">🏅 ${name}<br><small>${state.attended.length>=num?'Unlocked':'Locked'}</small></div>`).join("");
miniCalendar.innerHTML="";for(let i=13;i>=0;i--){let d=new Date();d.setDate(d.getDate()-i);let key=d.toISOString().slice(0,10);let div=document.createElement("div");div.className="calday"+(state.attended.find(x=>x.date===key)?" done":"");div.textContent=d.getDate();miniCalendar.appendChild(div);}
weekPlan.innerHTML=days.map(day=>{let items=state.plan.filter(p=>p.day===day||p.day==="Every day");return `<div class="day-box"><h3>${day}</h3>${items.length?items.map(p=>`<div class="plan-item"><span><b>${p.type}</b> ${p.time}<br>${p.name}<br>${p.venue} ${p.postcode||""}</span><button onclick="removePlan(${state.plan.indexOf(p)})">Remove</button></div>`).join(""):'<p class="muted">No meeting chosen yet.</p>'}</div>`}).join("");
journalList.innerHTML=state.attended.slice().reverse().filter(x=>x.note||x.mood).slice(0,10).map(x=>`<div class="journal-item"><b>${x.date}</b> • ${x.kind} • ${x.mood||"No mood"}<br>${x.note||""}</div>`).join("")||'<p class="muted">No journal entries yet.</p>';
stepsList.innerHTML=steps.map((s,i)=>`<div class="step"><b>Step ${i+1}</b><p>${s}</p></div>`).join("");
renderMeetings();
}
render();
