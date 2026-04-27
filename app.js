document.addEventListener("DOMContentLoaded", function () {
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

  const meetings = [
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
    {type:"NA",day:"Every day",time:"Various",name:"NA Online Meetings",venue:"Online",address:"Official online finder",postcode:"Online",source:"https://meetings.ukna.org/meeting/search/online"},
    {type:"AA",day:"Every day",time:"Various",name:"AA Meetings",venue:"Nationwide or online",address:"Search by postcode",postcode:"UK",source:"https://www.alcoholics-anonymous.org.uk/find-a-meeting/"}
  ];

  const steps = [
    "Admit powerlessness and that life had become unmanageable.",
    "Believe help and recovery are possible.",
    "Decide to turn towards recovery and support.",
    "Take an honest personal inventory.",
    "Share the truth with someone safe.",
    "Become ready to change harmful patterns.",
    "Ask for help removing those patterns.",
    "List people harmed and become willing to make amends.",
    "Make amends where possible, without causing harm.",
    "Keep taking inventory and admit wrongs quickly.",
    "Use prayer or meditation to stay connected and grounded.",
    "Carry the message and practise these principles."
  ];

  const recoveryCards = [
    "You do not need to fix everything today. Just do the next right thing.",
    "A bad day does not erase progress.",
    "Online counts. Showing up counts. Trying counts.",
    "You are one decision away from a better evening.",
    "Call someone before the craving makes the decision for you.",
    "Progress is built by small choices repeated."
  ];

  const badgeDef = [
    ["First meeting",1,"You showed up."],
    ["3 meetings",3,"Momentum started."],
    ["One week",7,"A strong week."],
    ["Two weeks",14,"Keep building."],
    ["30 days",30,"Massive progress."],
    ["60 days",60,"Real commitment."],
    ["90 days",90,"Recovery warrior."],
    ["100 meetings",100,"Outstanding consistency."]
  ];

  const cleanMilestones = [
    [1, "Day one. Keep going."],
    [7, "One week clean and serene."],
    [30, "30 days clean and serene."],
    [60, "60 days clean and serene."],
    [90, "90 days clean and serene."],
    [180, "6 months clean and serene."],
    [365, "1 year clean and serene."]
  ];

  let state = loadState();

  function byId(id){ return document.getElementById(id); }

  function loadState() {
    try {
      const raw = localStorage.getItem("recovery_companion_clean_serene");
      if (raw) return JSON.parse(raw);
    } catch(e) {}
    return {attended:[], plan:[], goal:3, allowMultiple:false, countOnline:true, mood:"", earnedBadges:[], dailyCardIndex:0, cleanDate:"", cleanMilestonesShown:[]};
  }

  function save() {
    localStorage.setItem("recovery_companion_clean_serene", JSON.stringify(state));
    render();
  }

  function todayKey() {
    return new Date().toISOString().slice(0,10);
  }

  function cleanDays() {
    if (!state.cleanDate) return 0;
    const start = new Date(state.cleanDate + "T00:00:00");
    const now = new Date();
    const diff = now - start;
    if (diff < 0) return 0;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  function showToast(text) {
    const el = byId("toast");
    el.textContent = text;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 2200);
  }

  function launchConfetti() {
    const colours = ["#2563eb","#7c3aed","#22c55e","#f59e0b","#ef4444","#06b6d4"];
    for (let i = 0; i < 80; i++) {
      const p = document.createElement("div");
      p.className = "confetti-piece";
      p.style.left = Math.random() * 100 + "vw";
      p.style.background = colours[Math.floor(Math.random() * colours.length)];
      p.style.animationDelay = Math.random() * 0.35 + "s";
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 2400);
    }
  }

  function showCelebration(title, text) {
    launchConfetti();
    byId("modalTitle").textContent = title;
    byId("modalText").textContent = text;
    byId("modal").classList.remove("hidden");
  }

  byId("closeModal").addEventListener("click", function(){
    byId("modal").classList.add("hidden");
  });

  function weekStart() {
    const d = new Date();
    const day = d.getDay() || 7;
    d.setDate(d.getDate() - day + 1);
    d.setHours(0,0,0,0);
    return d;
  }

  function weeklyCount() {
    const start = weekStart();
    return state.attended.filter(item => {
      const dateOk = new Date(item.date) >= start;
      const onlineOk = state.countOnline || item.kind !== "Online";
      return dateOk && onlineOk;
    }).length;
  }

  function streakCount() {
    let count = 0;
    const doneDates = new Set(state.attended.map(x => x.date));
    const d = new Date();
    while (doneDates.has(d.toISOString().slice(0,10))) {
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }

  function xp() {
    return state.attended.length * 10 + streakCount() * 5 + weeklyCount() * 5;
  }

  function level() {
    return Math.floor(xp() / 75) + 1;
  }

  function encouragement() {
    const doneToday = state.attended.some(x => x.date === todayKey());
    if (!doneToday) return "Just one meeting today. In person or online both count.";
    if (weeklyCount() >= state.goal) return "Weekly goal hit. That is real progress.";
    if (streakCount() >= 7) return "Strong consistency. Keep building.";
    return "Good start. Keep going.";
  }

  function checkCleanMilestones() {
    const days = cleanDays();
    cleanMilestones.forEach(function(m){
      const target = m[0], text = m[1];
      const key = "clean_" + target;
      if (days >= target && !state.cleanMilestonesShown.includes(key)) {
        state.cleanMilestonesShown.push(key);
        setTimeout(function(){ showCelebration(text, "Clean and serene for " + days + " days."); }, 200);
      }
    });
  }

  function checkNewBadges(beforeCount) {
    const afterCount = state.attended.length;
    badgeDef.forEach(function(b){
      const badgeName = b[0], target = b[1], text = b[2];
      if (beforeCount < target && afterCount >= target && !state.earnedBadges.includes(badgeName)) {
        state.earnedBadges.push(badgeName);
        setTimeout(function(){ showCelebration("Badge unlocked: " + badgeName, text); }, 150);
      }
    });

    if (weeklyCount() >= state.goal && !state.earnedBadges.includes("Weekly goal hit")) {
      state.earnedBadges.push("Weekly goal hit");
      setTimeout(function(){ showCelebration("Weekly goal complete", "You hit your target this week."); }, 250);
    }
  }

  function markAttendance(kind) {
    const key = todayKey();
    if (!state.allowMultiple && state.attended.some(x => x.date === key)) {
      showToast("Today is already counted");
      return;
    }

    const before = state.attended.length;
    state.attended.push({
      date: key,
      kind: kind,
      mood: state.mood || "",
      note: byId("note").value.trim()
    });

    byId("todayMessage").textContent = kind + " meeting counted for today.";
    byId("note").value = "";
    showToast("Meeting counted");
    checkNewBadges(before);
    save();
  }

  function addToPlan(meeting) {
    state.plan.push(Object.assign({}, meeting));
    showToast("Added to plan");
    save();
  }

  function removeFromPlan(index) {
    state.plan.splice(index, 1);
    save();
  }

  window.removeFromPlan = removeFromPlan;

  function renderCleanSerene() {
    byId("cleanDate").value = state.cleanDate || "";
    const days = cleanDays();

    if (!state.cleanDate) {
      byId("cleanText").textContent = "Set your clean date";
      byId("cleanMilestone").textContent = "";
      return;
    }

    byId("cleanText").textContent = "Clean and serene for " + days + " day" + (days === 1 ? "" : "s");

    let msg = "Every day counts.";
    for (let i = cleanMilestones.length - 1; i >= 0; i--) {
      if (days >= cleanMilestones[i][0]) {
        msg = cleanMilestones[i][1];
        break;
      }
    }
    byId("cleanMilestone").textContent = msg;
  }

  function renderMeetings() {
    const list = byId("meetingList");
    const search = byId("searchBox").value.toLowerCase();
    const day = byId("dayFilter").value;
    const type = byId("typeFilter").value;

    list.innerHTML = "";

    meetings.filter(m => {
      const text = Object.values(m).join(" ").toLowerCase();
      const searchOk = !search || text.includes(search);
      const dayOk = !day || m.day === day || m.day === "Every day";
      const typeOk = !type || m.type.includes(type) || (type === "Online" && (m.name + m.venue).toLowerCase().includes("online"));
      return searchOk && dayOk && typeOk;
    }).forEach(m => {
      const map = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(m.venue + " " + m.address + " " + m.postcode);
      const card = document.createElement("article");
      card.className = "meeting-card";
      card.innerHTML =
        '<div class="meeting-title">' + escapeHtml(m.name) + '</div>' +
        '<span class="pill">' + escapeHtml(m.type) + '</span>' +
        '<div class="meeting-meta"><b>' + escapeHtml(m.day) + '</b> ' + escapeHtml(m.time) + '<br>' +
        escapeHtml(m.venue) + '<br>' + escapeHtml(m.address) + '<br>' + escapeHtml(m.postcode) + '</div>' +
        '<div class="meeting-actions">' +
        '<button type="button" class="small addBtn">Add to plan</button>' +
        '<a class="small" target="_blank" rel="noopener" href="' + m.source + '">Check source</a>' +
        '<a class="small" target="_blank" rel="noopener" href="' + map + '">Map</a>' +
        '</div>';

      card.querySelector(".addBtn").addEventListener("click", () => addToPlan(m));
      list.appendChild(card);
    });
  }

  function renderCalendar() {
    const cal = byId("miniCalendar");
    cal.innerHTML = "";
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0,10);
      const div = document.createElement("div");
      div.className = "calday" + (state.attended.some(x => x.date === key) ? " done" : "");
      div.textContent = d.getDate();
      cal.appendChild(div);
    }
  }

  function renderPlan() {
    const holder = byId("weekPlan");
    holder.innerHTML = days.map(day => {
      const items = state.plan.map((p, index) => ({p, index})).filter(obj => obj.p.day === day || obj.p.day === "Every day");
      const body = items.length
        ? items.map(obj =>
          '<div class="plan-item"><span><b>' + escapeHtml(obj.p.type) + '</b> ' + escapeHtml(obj.p.time || "") + '<br>' +
          escapeHtml(obj.p.name || "Chosen meeting") + '<br>' +
          escapeHtml((obj.p.venue || "") + " " + (obj.p.postcode || "")) +
          '</span><button type="button" onclick="removeFromPlan(' + obj.index + ')">Remove</button></div>'
        ).join("")
        : '<p class="muted">No meeting chosen yet.</p>';
      return '<div class="day-box"><h3>' + day + '</h3>' + body + '</div>';
    }).join("");
  }

  function renderJournal() {
    const entries = state.attended.slice().reverse().filter(x => x.note || x.mood).slice(0, 10);
    byId("journalList").innerHTML = entries.length
      ? entries.map(x => '<div class="journal-item"><b>' + escapeHtml(x.date) + '</b> • ' + escapeHtml(x.kind) + ' • ' + escapeHtml(x.mood || "No mood") + '<br>' + escapeHtml(x.note || "") + '</div>').join("")
      : '<p class="muted">No journal entries yet.</p>';
  }

  function renderNextBadge() {
    const next = badgeDef.find(b => state.attended.length < b[1]);
    byId("nextBadgeText").textContent = next
      ? "Next badge: " + next[0] + " at " + next[1] + " meetings."
      : "All main meeting badges unlocked. Keep building.";
  }

  function render() {
    byId("goalCount").value = String(state.goal);
    byId("allowMultiple").checked = !!state.allowMultiple;
    byId("countOnline").checked = !!state.countOnline;

    document.querySelectorAll(".moods button").forEach(btn => {
      btn.classList.toggle("selected", btn.dataset.mood === state.mood);
    });

    byId("statTotal").textContent = state.attended.length;
    byId("statWeek").textContent = weeklyCount();
    byId("statStreak").textContent = streakCount();
    byId("statLevel").textContent = level();

    byId("encouragement").textContent = encouragement();
    byId("xpText").textContent = xp() + " XP • Level " + level() + " • " + state.attended.length + " meetings logged";

    const percent = Math.min(100, Math.round((weeklyCount() / state.goal) * 100));
    byId("weeklyBar").style.width = percent + "%";
    byId("weeklyText").textContent = weeklyCount() + " / " + state.goal + " this week";
    byId("weeklyPercent").textContent = percent + "%";

    byId("badges").innerHTML = badgeDef.map(([name, target]) => {
      const earned = state.attended.length >= target;
      return '<div class="badge ' + (earned ? "earned" : "") + '">🏅 ' + escapeHtml(name) + '<br><small>' + (earned ? "Unlocked" : "Locked") + '</small></div>';
    }).join("");

    byId("stepsList").innerHTML = steps.map((s, i) => '<div class="step"><b>Step ' + (i+1) + '</b><p>' + escapeHtml(s) + '</p></div>').join("");
    byId("dailyCard").textContent = recoveryCards[state.dailyCardIndex % recoveryCards.length];

    renderCleanSerene();
    checkCleanMilestones();
    renderNextBadge();
    renderCalendar();
    renderPlan();
    renderJournal();
    renderMeetings();
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  byId("cleanDate").addEventListener("change", () => {
    state.cleanDate = byId("cleanDate").value;
    state.cleanMilestonesShown = [];
    save();
  });

  byId("btnPerson").addEventListener("click", () => markAttendance("In person"));
  byId("btnOnline").addEventListener("click", () => markAttendance("Online"));

  document.querySelectorAll(".moods button").forEach(btn => {
    btn.addEventListener("click", () => {
      state.mood = btn.dataset.mood;
      save();
    });
  });

  byId("goalCount").addEventListener("change", () => {
    state.goal = Number(byId("goalCount").value);
    save();
  });

  byId("allowMultiple").addEventListener("change", () => {
    state.allowMultiple = byId("allowMultiple").checked;
    save();
  });

  byId("countOnline").addEventListener("change", () => {
    state.countOnline = byId("countOnline").checked;
    save();
  });

  byId("searchBox").addEventListener("input", renderMeetings);
  byId("dayFilter").addEventListener("change", renderMeetings);
  byId("typeFilter").addEventListener("change", renderMeetings);

  byId("addManual").addEventListener("click", () => {
    addToPlan({
      type: byId("manualType").value,
      day: byId("manualDay").value,
      time: byId("manualTime").value || "Time TBC",
      name: "Chosen meeting",
      venue: byId("manualPlace").value || "Venue TBC",
      address: "",
      postcode: "",
      source: ""
    });
    byId("manualTime").value = "";
    byId("manualPlace").value = "";
  });

  byId("quickPick").addEventListener("click", () => {
    const todayName = days[(new Date().getDay() + 6) % 7];
    const pick = meetings.find(m => m.day === todayName) || meetings.find(m => m.day === "Every day") || meetings[0];

    byId("quickResult").innerHTML =
      '<article class="meeting-card"><div class="meeting-title">' + escapeHtml(pick.name) + '</div>' +
      '<div class="meeting-meta">' + escapeHtml(pick.day) + ' ' + escapeHtml(pick.time) + '<br>' + escapeHtml(pick.venue) + '<br>' + escapeHtml(pick.postcode) + '</div>' +
      '<div class="meeting-actions"><a class="small" target="_blank" rel="noopener" href="' + pick.source + '">Check now</a><button type="button" class="small" id="quickAdd">Add to plan</button></div></article>';

    byId("quickAdd").addEventListener("click", () => addToPlan(pick));
  });

  byId("newCardBtn").addEventListener("click", () => {
    state.dailyCardIndex = (state.dailyCardIndex + 1) % recoveryCards.length;
    save();
  });

  render();
});