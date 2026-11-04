// ===== من سيربح المليون =====
const LETTERS = ["أ", "ب", "ج", "د"];
const SEEN_KEY = "millionaire_seen_v2";
const $ = (s) => document.querySelector(s);

let DATA = null;
const state = {
  level: 0,          // رقم السؤال الحالي (0 - 14)
  current: null,     // { q, options, answer }
  lifelines: { fifty: true, audience: true, phone: true },
  hidden: [],        // الخيارات المحذوفة بـ 50:50
  timer: null,
  timeLeft: 0,
  locked: false,
};

// ---------- أصوات بسيطة ----------
let audioCtx;
function beep(freq, dur = 0.15, type = "sine", vol = 0.08) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.value = vol;
    o.connect(g); g.connect(audioCtx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
    o.stop(audioCtx.currentTime + dur);
  } catch (e) {}
}
const sound = {
  correct: () => { beep(523, 0.15); setTimeout(() => beep(784, 0.3), 150); },
  wrong: () => { beep(220, 0.25, "sawtooth"); setTimeout(() => beep(160, 0.45, "sawtooth"), 220); },
  tick: () => beep(900, 0.05, "square", 0.03),
  select: () => beep(440, 0.1),
};

// ---------- أدوات ----------
const money = (n) => n.toLocaleString("en-US") + "$";
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
function setMessage(text, kind = "") {
  const m = $("#message");
  m.textContent = text;
  m.className = "message" + (kind ? " " + kind : "");
}
function show(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $(id).classList.add("active");
}
function loadSeen() { try { return JSON.parse(localStorage.getItem(SEEN_KEY) || "{}"); } catch (e) { return {}; } }
function saveSeen(s) { try { localStorage.setItem(SEEN_KEY, JSON.stringify(s)); } catch (e) {} }

// ---------- تحميل الأسئلة ----------
// يجرّب النسخة المضغوطة أولاً (أسرع)، وإذا ما لقاها بيقرأ questions.json
async function fetchQuestions() {
  if ("DecompressionStream" in window) {
    try {
      const res = await fetch("questions.json.gz", { cache: "no-cache" });
      if (res.ok) {
        const buf = new Uint8Array(await res.arrayBuffer());
        let text;
        if (buf[0] === 0x1f && buf[1] === 0x8b) {
          const stream = new Blob([buf]).stream().pipeThrough(new DecompressionStream("gzip"));
          text = await new Response(stream).text();
        } else {
          text = new TextDecoder().decode(buf);
        }
        return JSON.parse(text);
      }
    } catch (e) {}
  }
  const res = await fetch("questions.json", { cache: "no-cache" });
  return res.json();
}
async function load() {
  try {
    DATA = await fetchQuestions();
    const total = DATA.levels.reduce((n, l) => n + l.questions.length, 0);
    $("#countInfo").textContent = `بنك الأسئلة: ${total.toLocaleString("en-US")} سؤال`;
    $("#startBtn").disabled = false;
    buildLadder();
  } catch (e) {
    $("#countInfo").textContent = "";
    $("#loadError").hidden = false;
  }
}

// ---------- سلّم الجوائز ----------
function buildLadder() {
  const ladder = $("#ladder");
  ladder.innerHTML = "";
  DATA.levels.forEach((lv, i) => {
    const row = document.createElement("div");
    row.className = "rung" + (lv.safe ? " safe" : "");
    row.dataset.i = i;
    row.innerHTML = `<span class="n">${i + 1}</span><span class="v">${money(lv.prize)}</span>`;
    ladder.prepend(row);
  });
}
function updateLadder() {
  document.querySelectorAll(".rung").forEach((r) => {
    const i = +r.dataset.i;
    r.classList.toggle("current", i === state.level);
    r.classList.toggle("done", i < state.level);
  });
}

// ---------- اختيار سؤال بدون تكرار ----------
function pickQuestion(lv) {
  const pool = DATA.levels[lv].questions;
  const seen = loadSeen();
  let used = seen[lv] || [];
  let avail = pool.map((_, i) => i).filter((i) => !used.includes(i));
  if (avail.length === 0) { used = []; avail = pool.map((_, i) => i); } // انتهت الأسئلة: نبدأ من جديد
  const idx = avail[Math.floor(Math.random() * avail.length)];
  used.push(idx);
  seen[lv] = used;
  saveSeen(seen);

  const q = pool[idx];
  const correctText = q.options[q.answer];
  const options = shuffle([...q.options]);
  return { q: q.q, options, answer: options.indexOf(correctText) };
}

// ---------- اللعب ----------
function startGame() {
  state.level = 0;
  state.lifelines = { fifty: true, audience: true, phone: true };
  ["#llFifty", "#llAudience", "#llPhone"].forEach((id) => ($(id).disabled = false));
  show("#gameScreen");
  nextQuestion();
}

function timeFor(lv) { return lv < 5 ? 30 : lv < 10 ? 45 : 0; }

function nextQuestion() {
  state.current = pickQuestion(state.level);
  state.hidden = [];
  state.locked = false;
  const lv = DATA.levels[state.level];

  $("#qNumber").textContent = `السؤال ${state.level + 1} من 15`;
  $("#qPrize").textContent = money(lv.prize);
  $("#questionText").textContent = state.current.q;
  setMessage("");
  $("#nextBtn").hidden = true;
  $("#walkBtn").disabled = false;

  const box = $("#answers");
  box.innerHTML = "";
  state.current.options.forEach((opt, i) => {
    const b = document.createElement("button");
    b.className = "answer";
    b.innerHTML = `<span class="letter">${LETTERS[i]}</span><span class="txt"></span>`;
    b.querySelector(".txt").textContent = opt;
    b.onclick = () => choose(i, b);
    box.appendChild(b);
  });
  updateLadder();
  startTimer(timeFor(state.level));
}

function startTimer(sec) {
  clearInterval(state.timer);
  const t = $("#timer");
  if (!sec) { $("#timerText").textContent = "∞"; t.style.setProperty("--p", 1); t.classList.remove("low"); return; }
  state.timeLeft = sec;
  $("#timerText").textContent = sec;
  t.style.setProperty("--p", 1);
  t.classList.remove("low");
  state.timer = setInterval(() => {
    state.timeLeft--;
    $("#timerText").textContent = state.timeLeft;
    t.style.setProperty("--p", state.timeLeft / sec);
    if (state.timeLeft <= 10) { t.classList.add("low"); sound.tick(); }
    if (state.timeLeft <= 0) {
      clearInterval(state.timer);
      timeUp();
    }
  }, 1000);
}

function timeUp() {
  if (state.locked) return;
  state.locked = true;
  revealCorrect();
  sound.wrong();
  setMessage("انتهى الوقت", "bad");
  setTimeout(() => endGame(false), 2200);
}

function choose(i, btn) {
  if (state.locked || state.hidden.includes(i)) return;
  state.locked = true;
  clearInterval(state.timer);
  $("#walkBtn").disabled = true;
  sound.select();
  btn.classList.add("selected");
  setMessage("إجابة نهائية… لنرَ");

  setTimeout(() => {
    const ok = i === state.current.answer;
    revealCorrect();
    if (ok) {
      sound.correct();
      if (state.level === 14) {
        setMessage("مبروك! ربحت المليون", "ok");
        setTimeout(() => endGame(true, true), 2200);
        return;
      }
      setMessage(`إجابة صحيحة — ربحت ${money(DATA.levels[state.level].prize)}`, "ok");
      $("#nextBtn").hidden = false;
    } else {
      btn.classList.remove("selected");
      btn.classList.add("wrong");
      sound.wrong();
      setMessage("إجابة خاطئة", "bad");
      setTimeout(() => endGame(false), 2400);
    }
  }, 1600);
}

function revealCorrect() {
  document.querySelectorAll(".answer")[state.current.answer].classList.add("correct");
}

function goNext() {
  state.level++;
  nextQuestion();
}

// ---------- المبالغ ----------
function guaranteed() {
  // أعلى مبلغ مضمون تم تجاوزه
  let amount = 0;
  for (let i = 0; i < state.level; i++) if (DATA.levels[i].safe) amount = DATA.levels[i].prize;
  return amount;
}
function currentWinnings() {
  return state.level === 0 ? 0 : DATA.levels[state.level - 1].prize;
}

function walkAway() {
  if (state.locked) return;
  clearInterval(state.timer);
  state.locked = true;
  revealCorrect();
  const amount = currentWinnings();
  setMessage("انسحبت. هذه كانت الإجابة الصحيحة.");
  setTimeout(() => endGame(true, false, amount), 1800);
}

function endGame(won, million = false, walked = null) {
  clearInterval(state.timer);
  let amount, title, eyebrow, note;
  if (million) {
    amount = 1000000; title = "أنت مليونير!"; eyebrow = "إنجاز كامل"; note = "أجبت عن الأسئلة الخمسة عشر كلها.";
  } else if (walked !== null) {
    amount = walked; title = "انسحاب ذكي"; eyebrow = "النتيجة النهائية"; note = `انسحبت عند السؤال ${state.level + 1}.`;
  } else {
    amount = guaranteed(); title = "انتهت اللعبة"; eyebrow = "النتيجة النهائية";
    note = amount ? "رجعت بالمبلغ المضمون." : "لم تصل إلى أي مبلغ مضمون هذه المرة.";
  }
  $("#endEyebrow").textContent = eyebrow;
  $("#endTitle").textContent = title;
  $("#endAmount").textContent = money(amount);
  $("#endNote").textContent = note;
  show("#endScreen");
}

// ---------- وسائل المساعدة ----------
function visibleWrong() {
  return [0, 1, 2, 3].filter((i) => i !== state.current.answer && !state.hidden.includes(i));
}

function fiftyFifty() {
  if (!state.lifelines.fifty || state.locked) return;
  state.lifelines.fifty = false;
  $("#llFifty").disabled = true;
  const wrong = shuffle(visibleWrong()).slice(0, 2);
  state.hidden.push(...wrong);
  const btns = document.querySelectorAll(".answer");
  wrong.forEach((i) => btns[i].classList.add("gone"));
}

function askAudience() {
  if (!state.lifelines.audience || state.locked) return;
  state.lifelines.audience = false;
  $("#llAudience").disabled = true;

  const lv = state.level;
  const active = [0, 1, 2, 3].filter((i) => !state.hidden.includes(i));
  // الجمهور أدق في الأسئلة السهلة
  let correctPct = Math.round(Math.max(30, 80 - lv * 3.5) + Math.random() * 15);
  if (active.length === 2) correctPct = Math.min(95, correctPct + 15);
  let rest = 100 - correctPct;
  const votes = [0, 0, 0, 0];
  votes[state.current.answer] = correctPct;
  const others = active.filter((i) => i !== state.current.answer);
  others.forEach((i, k) => {
    const v = k === others.length - 1 ? rest : Math.round(Math.random() * rest);
    votes[i] = v; rest -= v;
  });
  // في الأسئلة الصعبة قد يخطئ الجمهور أحياناً
  if (lv >= 10 && Math.random() < 0.25 && others.length) {
    const j = others[Math.floor(Math.random() * others.length)];
    [votes[j], votes[state.current.answer]] = [votes[state.current.answer], votes[j]];
  }

  const body = active.map((i) => `
    <div class="bar-row">
      <span class="bl">${LETTERS[i]}</span>
      <div class="bar"><div class="fill" style="width:${votes[i]}%"></div></div>
      <span class="bp">${votes[i]}%</span>
    </div>`).join("");
  openModal("رأي الجمهور", body);
}

function phoneFriend() {
  if (!state.lifelines.phone || state.locked) return;
  state.lifelines.phone = false;
  $("#llPhone").disabled = true;

  const lv = state.level;
  const chance = Math.max(0.4, 0.95 - lv * 0.04);
  const right = Math.random() < chance;
  const wrong = visibleWrong();
  const pickI = right || !wrong.length ? state.current.answer : wrong[Math.floor(Math.random() * wrong.length)];
  const text = state.current.options[pickI];
  const confident = right && Math.random() < 0.7;
  const msg = confident
    ? `"متأكد تقريباً… الجواب هو <b>${LETTERS[pickI]}: ${escapeHtml(text)}</b>"`
    : `"والله مو متأكد كتير… بس إذا بدك رأيي بختار <b>${LETTERS[pickI]}: ${escapeHtml(text)}</b>"`;
  openModal("اتصال بصديق", `<p class="friend">${msg}</p>`);
}

function escapeHtml(s) { return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

function openModal(title, html) {
  $("#modalTitle").textContent = title;
  $("#modalBody").innerHTML = html;
  $("#modal").hidden = false;
}

// ---------- تثبيت التطبيق (PWA) ----------
let deferredPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  $("#installBtn").hidden = false;
});
window.addEventListener("appinstalled", () => { $("#installBtn").hidden = true; });
$("#installBtn").onclick = async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  $("#installBtn").hidden = true;
};
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}

// ---------- الأحداث ----------
$("#startBtn").onclick = startGame;
$("#againBtn").onclick = startGame;
$("#nextBtn").onclick = goNext;
$("#walkBtn").onclick = walkAway;
$("#llFifty").onclick = fiftyFifty;
$("#llAudience").onclick = askAudience;
$("#llPhone").onclick = phoneFriend;
$("#modalClose").onclick = () => ($("#modal").hidden = true);
$("#ladderToggle").onclick = () => $("#ladder").classList.toggle("open");

load();
