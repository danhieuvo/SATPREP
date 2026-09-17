/* Game engine: profile state, XP, streaks, hearts, treats, quests, achievements, path, leagues.
   No DOM code here. Everything is saved per profile in localStorage and mirrored to the pack backend. */
(function () {
  'use strict';
  const S = window.SAT;

  // Shown at the bottom of every screen.
  const VERSION = 'Version 1 · September 2026';

  // ---------- Tunables ----------
  const MAX_HEARTS = 5;
  const HEART_MS = 60 * 60 * 1000;          // one heart back per hour
  const START_TREATS = 200;
  const PRICES = { freeze: 200, hearts: 350, boost: 300, repair: 400 };
  const MAX_FREEZES = 2;
  const BOOST_MS = 15 * 60 * 1000;
  const XP_PER = { 1: 10, 2: 15, 3: 20 };  // per correct answer, by difficulty
  const LESSON_BONUS = 10, PERFECT_BONUS = 10;
  const LESSON_TREATS = 5, PERFECT_TREATS = 5;   // treats for finishing a lesson / a perfect lesson

  // ---------- Feeding your dog ----------
  // Fullness runs 0-100 and drops about 33 points a day, so a dog needs a meal most days.
  const HUNGER_PER_HOUR = 100 / 72;
  const START_FULLNESS = 80;
  const FOODS = [
    { id: 'biscuit', name: 'Dog biscuit', icon: '🍪', price: 10, fill: 15 },
    { id: 'kibble', name: 'Bowl of kibble', icon: '🥣', price: 25, fill: 40 },
    { id: 'bone', name: 'Meaty bone', icon: '🍖', price: 45, fill: 75 },
    { id: 'pupcake', name: 'Pupcake', icon: '🧁', price: 80, fill: 100 }
  ];
  const HUNGER_STATES = [
    { min: 85, id: 'full', name: 'Full & happy', mood: 'love', color: '#10b981', say: 'Best owner ever!' },
    { min: 60, id: 'happy', name: 'Happy', mood: 'happy', color: '#38b2f4', say: 'Tail wagging!' },
    { min: 35, id: 'peckish', name: 'Peckish', mood: 'normal', color: '#f5b800', say: 'A snack would be nice…' },
    { min: 15, id: 'hungry', name: 'Hungry', mood: 'worried', color: '#ff9600', say: 'My tummy is rumbling!' },
    { min: 0, id: 'starving', name: 'Starving', mood: 'sad', color: '#ff4b4b', say: 'Please feed me…' }
  ];
  const GOALS = [
    { xp: 50, name: 'Casual', about: 'about 1 lesson a day' },
    { xp: 100, name: 'Regular', about: 'about 2 lessons a day' },
    { xp: 150, name: 'Serious', about: 'about 3 lessons a day' },
    { xp: 250, name: 'Intense', about: '4 or more lessons a day' }
  ];
  // ---------- The path: breed levels from toy dogs to Top Dog, then endless Top Dog ranks ----------
  const LADDER = ['chihuahua', 'yorkie', 'pomeranian', 'maltese', 'shihtzu', 'pug', 'dachshund', 'cavalier', 'frenchie', 'poodle',
    'shiba', 'corgi', 'beagle', 'collie', 'dalmatian', 'boxer', 'husky', 'lab', 'golden', 'shepherd'];
  const SIZE_CLASSES = [
    { from: 1, name: 'Toy dogs', color: '#38b2f4' }, { from: 6, name: 'Small dogs', color: '#6366f1' },
    { from: 11, name: 'Medium dogs', color: '#0d9488' }, { from: 16, name: 'Big dogs', color: '#f97316' },
    { from: 21, name: 'Top Dog', color: '#e5a800' }
  ];
  // Question types are introduced from the most approachable to the most demanding.
  const TYPE_ORDER = {
    rw: ['words-in-context', 'boundaries', 'transitions', 'form-structure', 'central-ideas', 'evidence-quant', 'synthesis',
      'text-structure', 'inferences', 'evidence-textual', 'cross-text'],
    math: ['linear-one-var', 'ratios-rates', 'percentages', 'linear-functions', 'one-var-data', 'area-volume', 'lines-angles',
      'linear-two-var', 'systems', 'inequalities', 'probability', 'equivalent-expressions', 'two-var-data', 'right-triangles',
      'nonlinear-equations', 'nonlinear-functions', 'circles', 'inference']
  };
  const CHALLENGE_PASS = 0.7, JUMP_PASS = 0.8;
  const LESSON_SIZE = 5;   // the smallest lesson (Level 1)

  // Three dials rise with the level: how many question types, how many questions, and how hard.
  function levelSpec(section, L) {
    const types = TYPE_ORDER[section].filter(id => S.countFor(section, null, id));
    const top = L > LADDER.length;
    const kOf = x => Math.min(types.length, 2 + Math.floor(((x - 1) * (types.length - 2)) / 15));
    const k = top ? types.length : kOf(L);
    const n = top ? 10 : Math.min(9, 5 + Math.floor((L - 1) / 4));
    const easy = top ? 0 : Math.max(0, 1 - (L - 1) * 0.1);
    const hard = top ? 0.8 : Math.max(0, Math.min(0.7, (L - 6) * 0.05));
    const cls = SIZE_CLASSES.filter(c => L >= c.from).pop();
    return {
      section, level: L, top, rank: top ? L - LADDER.length : 0,
      breed: top ? 'shepherd' : LADDER[L - 1], className: cls.name, color: cls.color,
      types: types.slice(0, k), newTypes: top || L === 1 ? [] : types.slice(kOf(L - 1), k),
      n, mix: [easy, Math.max(0, 1 - easy - hard), hard],
      lessons: top ? 6 : Math.min(6, 3 + Math.floor(L / 6)),
      challengeN: n + 3
    };
  }
  // Short labels for the radar maps.
  const TYPE_SHORT = {
    'words-in-context': 'Vocabulary', 'text-structure': 'Text structure', 'cross-text': 'Cross-text', 'central-ideas': 'Main idea',
    'evidence-textual': 'Text evidence', 'evidence-quant': 'Data evidence', 'inferences': 'Inferences', 'boundaries': 'Punctuation',
    'form-structure': 'Grammar', 'transitions': 'Transitions', 'synthesis': 'Synthesis',
    'linear-one-var': '1-var linear', 'linear-functions': 'Linear func.', 'linear-two-var': '2-var linear', 'systems': 'Systems',
    'inequalities': 'Inequalities', 'equivalent-expressions': 'Expressions', 'nonlinear-equations': 'Nonlinear eq.', 'nonlinear-functions': 'Nonlinear func.',
    'ratios-rates': 'Ratios & rates', 'percentages': 'Percentages', 'one-var-data': '1-var data', 'two-var-data': '2-var data',
    'probability': 'Probability', 'inference': 'Stats inference', 'area-volume': 'Area & volume', 'lines-angles': 'Lines & angles',
    'right-triangles': 'Right triangles', 'circles': 'Circles'
  };
  function typeName(section, id) {
    for (const d of S.TAXONOMY[section].domains) { const k = d.skills.find(x => x.id === id); if (k) return k.name; }
    return id;
  }
  const levelName = (section, L) => {
    const sp = levelSpec(section, L);
    return sp.top ? `Top Dog ★${sp.rank}` : window.DOGS.BY_ID[sp.breed].name;
  };
  const mixWords = mix => (mix[0] >= 0.9 ? 'all easy' : mix[0] >= 0.5 ? 'mostly easy' : mix[2] >= 0.6 ? 'mostly hard' : mix[2] >= 0.3 ? 'medium and hard' : mix[2] > 0 ? 'mostly medium, some hard' : 'easy and medium');

  const LEAGUES = [
    { name: 'Bronze', color: '#c47a3a' }, { name: 'Silver', color: '#9aa7b8' }, { name: 'Gold', color: '#f2b705' },
    { name: 'Sapphire', color: '#2f6fed' }, { name: 'Ruby', color: '#e0245e' }, { name: 'Emerald', color: '#10b981' },
    { name: 'Amethyst', color: '#9b5de5' }, { name: 'Pearl', color: '#d9c7b0' }, { name: 'Obsidian', color: '#3a3a4a' },
    { name: 'Diamond', color: '#38d5e0' }
  ];
  const LEAGUE_PRIZE = [100, 60, 40];

  // ---------- Dog gear (each player's avatar is a dog; see dogs.js for breeds and coat colors) ----------
  const COSMETICS = [
    { id: 'hat:headphones', kind: 'hat', name: 'Headphones', price: 300 },
    { id: 'hat:beanie', kind: 'hat', name: 'Beanie', price: 300 },
    { id: 'hat:party', kind: 'hat', name: 'Party Hat', price: 300 },
    { id: 'hat:cap', kind: 'hat', name: 'Grad Cap', price: 400 },
    { id: 'hat:rockstar', kind: 'hat', name: 'Rock Star Cap', price: 600 },
    { id: 'hat:wizard', kind: 'hat', name: 'Wizard Hat', price: 1000 },
    { id: 'hat:crown', kind: 'hat', name: 'Crown', price: 2000 },
    { id: 'eyes:round', kind: 'eyes', name: 'Study Specs', price: 300 },
    { id: 'eyes:shades', kind: 'eyes', name: 'Shades', price: 500 },
    { id: 'eyes:stars', kind: 'eyes', name: 'Star Glasses', price: 800 },
    { id: 'neck:bandana', kind: 'neck', name: 'Bandana', price: 250 },
    { id: 'neck:collar', kind: 'neck', name: 'Gold Tag Collar', price: 300 },
    { id: 'neck:bowtie', kind: 'neck', name: 'Bow Tie', price: 400 },
    { id: 'neck:note', kind: 'neck', name: 'Music Note Collar', price: 700 },
    { id: 'outfit:tshirt', kind: 'outfit', name: 'Paw Print Tee', price: 200 },
    { id: 'outfit:raincoat', kind: 'outfit', name: 'Raincoat', price: 300 },
    { id: 'outfit:hoodie', kind: 'outfit', name: 'Hoodie', price: 400 },
    { id: 'outfit:bandtee', kind: 'outfit', name: 'Band Tee', price: 400 },
    { id: 'outfit:soccer', kind: 'outfit', name: 'Soccer Jersey', price: 500 },
    { id: 'outfit:basketball', kind: 'outfit', name: 'Basketball Jersey', price: 500 },
    { id: 'outfit:football', kind: 'outfit', name: 'Football Jersey', price: 600 },
    { id: 'outfit:varsity', kind: 'outfit', name: 'Varsity Jacket', price: 800 },
    { id: 'outfit:tuxedo', kind: 'outfit', name: 'Tuxedo', price: 1000 },
    { id: 'outfit:cape', kind: 'outfit', name: 'Super Cape', price: 1200 },
    ...Object.entries(window.DOGS.COLORS).filter(([, c]) => c.fun).map(([k, c]) => ({ id: 'paint:' + k, kind: 'paint', name: c.name + ' coat', price: 500 }))
  ];

  // ---------- Dates ----------
  const pad = n => String(n).padStart(2, '0');
  const dayOf = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = () => dayOf(new Date());
  const parseDay = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (s, n) => { const d = parseDay(s); d.setDate(d.getDate() + n); return dayOf(d); };
  const dayDiff = (a, b) => Math.round((parseDay(b) - parseDay(a)) / 86400000);
  function weekOf(s) {           // weeks start on Monday
    const d = parseDay(s || today());
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return dayOf(d);
  }
  function msToWeekEnd() {
    const end = parseDay(addDays(weekOf(), 7));
    return end - new Date();
  }
  function msToMidnight() {
    const end = parseDay(addDays(today(), 1));
    return end - new Date();
  }

  // ---------- Seeded random (so quests and the Daily Challenge are stable for a day) ----------
  function hashStr(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    return () => { h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return (h ^= h >>> 16) >>> 0; };
  }
  function rng(seed) {
    let a = hashStr(String(seed))();
    return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const randId = n => { const a = new Uint8Array(n); crypto.getRandomValues(a); return [...a].map(b => b.toString(16).padStart(2, '0')).join(''); };
  const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : [randId(4), randId(2), '4' + randId(2).slice(1), '8' + randId(2).slice(1), randId(6)].join('-'));

  // ---------- Profiles on this device ----------
  const PROFILES_KEY = 'satquest.profiles';
  const pKey = id => 'satquest.p.' + id;
  const readJSON = k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  const writeJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage full or blocked */ } };
  let profiles = Object.assign({ current: null, list: {} }, readJSON(PROFILES_KEY) || {});
  let s = null;   // the signed-in player's state

  function blank(name) {
    const t = today();
    return {
      v: 1, id: uuid(), secret: randId(16), name, createdAt: t,
      squad: null, avatar: window.DOGS.normalize({ breed: 'shihtzu' }), owned: [],
      goal: 100, course: 'math', settings: { sound: true },
      xp: 0, xpByDay: {}, week: weekOf(t), weekXp: 0, prevWeek: null, prevWeekXp: 0, tier: 0, tierMax: 0, leagueHistory: [],
      streak: 0, bestStreak: 0, lastLessonDay: null, streakDays: [], frozenDays: [], freezes: 1, lostStreak: null,
      hearts: { n: MAX_HEARTS, t: Date.now() }, treats: START_TREATS, boostUntil: 0, fullness: { v: START_FULLNESS, t: Date.now() },
      path: { math: { level: 1, done: 0, bag: false }, rw: { level: 1, done: 0, bag: false } }, elo: {},
      seen: {}, seenGroups: {}, mistakes: [], combo: 0,
      stats: { lessons: 0, perfect: 0, correct: 0, answered: 0, hard: 0, bestCombo: 0, questsDone: 0, kudosGiven: 0, firsts: 0, top3: 0, ms: 0, levels: 0, night: 0, early: 0, fed: 0 },
      quests: null, friendQuest: {}, achievements: {},
      daily: null, nudgesSent: {}, seenEvent: 0, pending: []
    };
  }
  function save() {
    if (!s) return;
    writeJSON(pKey(s.id), s);
    profiles.list[s.id] = s.name;
    profiles.current = s.id;
    writeJSON(PROFILES_KEY, profiles);
  }
  function load(id) {
    const data = readJSON(pKey(id));
    if (!data) return false;
    adoptData(data);
    profiles.current = id;
    writeJSON(PROFILES_KEY, profiles);
    return true;
  }
  function adoptData(data) {
    s = Object.assign(blank(data.name), data);
    s.stats = Object.assign(blank('').stats, data.stats);
    s.avatar = window.DOGS.normalize(s.avatar);
    if (data.treats == null && data.gems != null) { s.treats = data.gems; delete s.gems; }   // gems were renamed to treats
    s.path = Object.assign(blank('').path, data.path);
    s.elo = data.elo || {};
    delete s.prof;   // replaced by Elo ratings
  }
  function create(name) { s = blank(name); save(); return s; }
  function adopt(data) { adoptData(data); save(); return s; }
  function signOut() { profiles.current = null; writeJSON(PROFILES_KEY, profiles); s = null; }
  function removeProfile(id) {
    try { localStorage.removeItem(pKey(id)); } catch (e) { /* ignore */ }
    delete profiles.list[id];
    if (profiles.current === id) { profiles.current = null; s = null; }
    writeJSON(PROFILES_KEY, profiles);
  }
  if (profiles.current && !load(profiles.current)) profiles.current = null;

  const pending = (kind, data) => s.pending.push(Object.assign({ kind }, data));

  // ---------- Hearts, treats, boosts ----------
  function hearts() {
    const h = s.hearts;
    if (h.n >= MAX_HEARTS) { h.t = Date.now(); return h.n; }
    const gained = Math.floor((Date.now() - h.t) / HEART_MS);
    if (gained > 0) { h.n = Math.min(MAX_HEARTS, h.n + gained); h.t += gained * HEART_MS; if (h.n >= MAX_HEARTS) h.t = Date.now(); save(); }
    return h.n;
  }
  const msToNextHeart = () => (hearts() >= MAX_HEARTS ? 0 : HEART_MS - (Date.now() - s.hearts.t));
  function loseHeart() { hearts(); if (s.hearts.n >= MAX_HEARTS) s.hearts.t = Date.now(); s.hearts.n = Math.max(0, s.hearts.n - 1); save(); return s.hearts.n; }
  function gainHeart() { hearts(); s.hearts.n = Math.min(MAX_HEARTS, s.hearts.n + 1); save(); }
  const boostActive = () => s.boostUntil > Date.now();

  function buy(item) {
    const price = PRICES[item];
    if (s.treats < price) return 'Not enough treats yet. Complete quests and lessons to earn more.';
    if (item === 'freeze') { if (s.freezes >= MAX_FREEZES) return `You can equip at most ${MAX_FREEZES} streak freezes.`; s.freezes++; }
    if (item === 'hearts') { if (hearts() >= MAX_HEARTS) return 'Your hearts are already full.'; s.hearts = { n: MAX_HEARTS, t: Date.now() }; }
    if (item === 'boost') s.boostUntil = Math.max(Date.now(), s.boostUntil) + BOOST_MS;
    if (item === 'repair') {
      if (!canRepair()) return 'There is no streak to repair.';
      const t = today(), lost = s.lostStreak;
      const doneToday = s.lastLessonDay === t;
      for (let d = addDays(lost.last, 1); d < t; d = addDays(d, 1)) if (!s.frozenDays.includes(d)) s.frozenDays.push(d);
      s.streak = lost.n + (doneToday ? s.streak : 0);
      if (!doneToday) s.lastLessonDay = addDays(t, -1);
      s.bestStreak = Math.max(s.bestStreak, s.streak);
      s.lostStreak = null;
    }
    s.treats -= price; save();
    return null;
  }
  function buyCosmetic(id) {
    const c = COSMETICS.find(x => x.id === id);
    if (!c || s.owned.includes(id)) return null;
    if (s.treats < c.price) return 'Not enough treats yet. Complete quests and lessons to earn more.';
    s.treats -= c.price; s.owned.push(id);
    if (c.kind !== 'paint') equip(id); else save();
    return null;
  }
  // Breed and coat colors are free to change anytime.
  function setDog(breed, colors) { s.avatar.breed = breed; s.avatar.colors = colors; save(); }
  function equip(id) {
    const [kind, val] = id.split(':');
    if (!s.owned.includes(id)) return;
    s.avatar[kind] = s.avatar[kind] === val && kind !== 'color' ? null : val;
    save();
  }
  // ---------- Hunger ----------
  const fullnessAt = f => Math.max(0, Math.min(100, (f ? f.v : START_FULLNESS) - ((Date.now() - (f ? f.t : Date.now())) / 3600000) * HUNGER_PER_HOUR));
  const hungerState = v => HUNGER_STATES.find(h => v >= h.min);
  const fullness = () => fullnessAt(s.fullness);
  function feed(foodId) {
    const f = FOODS.find(x => x.id === foodId);
    if (!f) return 'Unknown food.';
    const now = fullness();
    if (now >= 98) return 'Your dog is too full to eat right now!';
    if (s.treats < f.price) return 'Not enough treats yet. Finish lessons and quests to earn more.';
    s.treats -= f.price;
    s.fullness = { v: Math.min(100, now + f.fill), t: Date.now() };
    s.stats.fed++;
    if (s.quests) for (const q of s.quests.list) if (q.kind === 'feed') q.progress = Math.min(q.target, q.progress + 1);
    save();
    return null;
  }

  // ---------- Ratings (Elo underneath, shown on the SAT scale) ----------
  // Every question type keeps a hidden chess-style (Elo) rating. Each answer is a "match" against the
  // question: beating a hard question raises it a lot, missing an easy one lowers it a lot. More answers
  // make a rating more accurate, not automatically higher.
  // What players see is on the SAT scale: each question type and each section runs 200-800, and the
  // overall rating is Math + Reading & Writing, capped at 1600. 800 means you almost always beat hard questions.
  const ELO_START = 800;
  const Q_RATING = { 1: 700, 2: 1000, 3: 1300 };   // easy, medium, hard questions (hidden Elo)
  const LOW_EVIDENCE = 8;                           // fewer answers than this = rating still settling
  const RATING_TITLES = [                           // per section, 200-800 (overall uses half its value)
    { min: 750, name: 'Alpha', color: '#7c3aed' }, { min: 650, name: 'Champion', color: '#10b981' },
    { min: 550, name: 'Retriever', color: '#0d9488' }, { min: 450, name: 'Tracker', color: '#38b2f4' },
    { min: 300, name: 'Fetcher', color: '#f5b800' }, { min: -Infinity, name: 'Puppy', color: '#ff9600' }
  ];
  const expected = (r, qr) => 1 / (1 + Math.pow(10, (qr - r) / 400));
  function recordAnswer(skill, d, ok) {
    if (!skill || !Q_RATING[d]) return;
    const e = s.elo[skill] || (s.elo[skill] = { r: ELO_START, n: 0 });
    const k = e.n < 10 ? 64 : e.n < 30 ? 40 : 24;   // new ratings move fast, settled ones move slowly
    e.r = Math.round((e.r + k * ((ok ? 1 : 0) - expected(e.r, Q_RATING[d]))) * 10) / 10;
    e.n++;
  }
  const eloOf = skill => (s.elo[skill] || { r: ELO_START }).r;
  const attempts = skill => (s.elo[skill] || { n: 0 }).n;
  const round10 = v => Math.round(v / 10) * 10;
  // Hidden Elo -> 200-800: the chance of beating a hard question, scaled so a new player starts at 200.
  const P0 = expected(ELO_START, Q_RATING[3]);
  const satScale = elo => 200 + 600 * Math.max(0, Math.min(1, (expected(elo, Q_RATING[3]) - P0) / (1 - P0)));
  const rating = skill => round10(satScale(eloOf(skill)));
  const ratingTitle = (r, overall) => RATING_TITLES.find(x => (overall ? r / 2 : r) >= x.min);
  // Chance (0-100) of answering a typical hard question of this type correctly.
  const proficiency = skill => Math.round(100 * expected(eloOf(skill), Q_RATING[3]));

  function weighted(section, f) {
    const doms = S.TAXONOMY[section].domains;
    const total = doms.reduce((n, d) => n + d.perModule, 0);
    let v = 0;
    for (const d of doms) {
      const skills = d.skills.filter(k => S.countFor(section, d.id, k.id));
      for (const k of skills) v += (d.perModule / total / skills.length) * f(k.id);
    }
    return v;
  }
  // Section rating: 200-800, weighted like the real test's content domains.
  const sectionRating = section => Math.min(800, round10(weighted(section, k => satScale(eloOf(k)))));
  // Overall rating: Math + Reading & Writing, 400-1600.
  const overallRating = () => Math.min(1600, sectionRating('math') + sectionRating('rw'));
  // (The Learn screen's score bar is the section rating.)
  const practiceScore = sectionRating;
  // Ratings for any player's saved Elo map (used by the admin page).
  function ratingsFromElo(elo) {
    const e = k => (elo && elo[k] ? elo[k].r : ELO_START);
    const types = {};
    for (const sec of ['math', 'rw']) for (const k of TYPE_ORDER[sec]) types[k] = { rating: round10(satScale(e(k))), n: elo && elo[k] ? elo[k].n : 0 };
    const secR = sec => Math.min(800, round10(weighted(sec, k => satScale(e(k)))));
    const math = secR('math'), rw = secR('rw');
    return { types, math, rw, overall: Math.min(1600, math + rw) };
  }

  const canRepair = () => !!(s.lostStreak && s.lostStreak.day === today() && s.lostStreak.n >= 2);

  // ---------- Daily tick: streak check, quests, and the pending week rollover ----------
  function tick() {
    if (!s) return;
    hearts();
    const t = today();
    if (s.lastLessonDay && s.streak > 0) {
      const gap = dayDiff(s.lastLessonDay, t);
      if (gap > 1) {
        const missed = gap - 1;
        if (s.freezes >= missed) {
          for (let i = 1; i <= missed; i++) s.frozenDays.push(addDays(s.lastLessonDay, i));
          s.freezes -= missed;
          s.lastLessonDay = addDays(t, -1);
          pending('freezeUsed', { n: missed, streak: s.streak });
        } else {
          s.lostStreak = { n: s.streak, day: t, last: s.lastLessonDay };
          pending('streakLost', { n: s.streak });
          s.streak = 0;
        }
      }
    }
    if (s.lostStreak && s.lostStreak.day !== t) s.lostStreak = null;
    if (!s.quests || s.quests.day !== t) s.quests = makeQuests(t);
    // Keep stored history small.
    const cutoff = addDays(t, -120);
    for (const d of Object.keys(s.xpByDay)) if (d < cutoff) delete s.xpByDay[d];
    s.streakDays = s.streakDays.filter(d => d >= cutoff);
    s.frozenDays = s.frozenDays.filter(d => d >= cutoff);
    save();
  }
  const needsWeekRoll = () => s && s.week !== weekOf();

  // Standings for a finished week, from squad rows (null when offline: no promotion or demotion).
  function rollWeek(rows) {
    const cur = weekOf(), last = s.week;
    const lastXp = s.weekXp;
    let result = null;
    if (rows && last) {
      const board = rows.filter(r => r.id !== s.id).map(r => {
        const d = r.data || {};
        return { id: r.id, xp: d.week === last ? d.weekXp : d.prevWeek === last ? d.prevWeekXp : 0 };
      }).filter(r => r.xp > 0);
      board.push({ id: s.id, xp: lastXp });
      board.sort((a, b) => b.xp - a.xp);
      const n = board.length, rank = board.findIndex(r => r.id === s.id) + 1;
      const zone = Math.max(1, Math.floor(n * 0.3));
      let change = 0;
      if (lastXp > 0 && n >= 2 && rank <= zone) change = 1;
      else if (lastXp === 0 || (n >= 5 && rank > n - zone)) change = -1;
      const from = s.tier;
      s.tier = Math.max(0, Math.min(LEAGUES.length - 1, s.tier + change));
      s.tierMax = Math.max(s.tierMax, s.tier);
      const prize = lastXp > 0 && n >= 3 ? (LEAGUE_PRIZE[rank - 1] || 0) : 0;
      s.treats += prize;
      if (rank === 1 && n >= 2 && lastXp > 0) s.stats.firsts++;
      if (rank <= 3 && n >= 3 && lastXp > 0) s.stats.top3++;
      if (lastXp > 0 || change) {
        result = { week: last, rank, n, xp: lastXp, from, to: s.tier, prize };
        s.leagueHistory.unshift(result); s.leagueHistory = s.leagueHistory.slice(0, 20);
        pending('league', result);
      }
    }
    s.prevWeek = last; s.prevWeekXp = lastXp;
    s.week = cur; s.weekXp = 0;
    save();
    return result;
  }

  // ---------- XP ----------
  function addXp(n) {
    const t = today();
    s.xp += n; s.weekXp += n;
    s.xpByDay[t] = (s.xpByDay[t] || 0) + n;
    return n;
  }
  const todayXp = () => s.xpByDay[today()] || 0;

  // ---------- Quests ----------
  const QUEST_KINDS = {
    xp: { icon: '⚡', text: n => `Earn ${n} XP` },
    lessons: { icon: '📘', text: n => `Complete ${n} lessons`, targets: [2, 3, 4] },
    correct: { icon: '✅', text: n => `Answer ${n} questions correctly`, targets: [10, 15, 25] },
    combo: { icon: '🔥', text: n => `Get ${n} correct in a row`, targets: [4, 6, 9] },
    perfect: { icon: '🎯', text: n => n === 1 ? 'Finish a lesson with no mistakes' : `Finish ${n} lessons with no mistakes`, targets: [1, 2] },
    hard: { icon: '💪', text: n => `Answer ${n} hard questions correctly`, targets: [2, 4, 6] },
    minutes: { icon: '⏱️', text: n => `Learn for ${n} minutes`, targets: [10, 15, 20] },
    both: { icon: '⚖️', text: () => 'Do a Math lesson and a Reading & Writing lesson', targets: [2] },
    daily: { icon: '📅', text: () => 'Play the Daily Challenge', targets: [1] },
    feed: { icon: '🦴', text: () => 'Feed your dog', targets: [1] }
  };
  function makeQuests(day) {
    const r = rng(day + (s ? s.id : ''));
    // New players rarely see hard questions yet, so skip that quest until they have some experience.
    const kinds = Object.keys(QUEST_KINDS).filter(k => k !== 'xp' && !(k === 'hard' && (!s || s.stats.lessons < 8)));
    const picked = [];
    while (picked.length < 2) { const k = kinds[Math.floor(r() * kinds.length)]; if (!picked.includes(k)) picked.push(k); }
    const list = [{ kind: 'xp', target: s ? s.goal : 100, progress: 0, reward: 15, claimed: false, sections: [] }];
    for (const k of picked) {
      const tg = QUEST_KINDS[k].targets, i = Math.floor(r() * tg.length);
      list.push({ kind: k, target: tg[i], progress: 0, reward: 10 + 5 * i + Math.floor(r() * 6), claimed: false, sections: [] });
    }
    return { day, list };
  }
  function questText(q) { return QUEST_KINDS[q.kind].text(q.target); }
  // Apply one finished session to the quests. Returns quests that just became complete.
  function progressQuests(ev) {
    const done = [];
    for (const q of s.quests.list) {
      const before = q.progress;
      switch (q.kind) {
        case 'xp': q.progress = todayXp(); break;
        case 'lessons': if (ev.lesson) q.progress++; break;
        case 'correct': q.progress += ev.correct; break;
        case 'combo': q.progress = Math.max(q.progress, ev.maxCombo); break;
        case 'perfect': if (ev.lesson && ev.wrong === 0 && ev.total >= LESSON_SIZE) q.progress++; break;
        case 'hard': q.progress += ev.hardCorrect; break;
        case 'minutes': q.progress = Math.floor(((q.ms || 0) + ev.ms) / 60000); q.ms = (q.ms || 0) + ev.ms; break;
        case 'both': if (ev.lesson && !q.sections.includes(ev.section)) { q.sections.push(ev.section); q.progress = q.sections.length; } break;
        case 'daily': if (ev.mode === 'daily') q.progress = 1; break;
      }
      q.progress = Math.min(q.progress, q.target);
      if (before < q.target && q.progress >= q.target) done.push(q);
    }
    return done;
  }
  function claimQuest(i) {
    const q = s.quests.list[i];
    if (!q || q.claimed || q.progress < q.target) return 0;
    q.claimed = true; s.treats += q.reward; s.stats.questsDone++; save();
    return q.reward;
  }

  // ---------- Achievements ----------
  const skillsAtRating = (sec, min) => TYPE_ORDER[sec].filter(k => rating(k) >= min).length;
  const ACHIEVEMENTS = [
    { id: 'wildfire', name: 'Wildfire', icon: '🔥', text: n => `Reach a ${n}-day streak`, tiers: [3, 7, 14, 30, 60, 100, 365], val: () => s.bestStreak },
    { id: 'sage', name: 'Sage', icon: '📚', text: n => `Earn ${n.toLocaleString()} XP`, tiers: [250, 1000, 2500, 5000, 10000, 25000, 50000], val: () => s.xp },
    { id: 'scholar', name: 'Scholar', icon: '🎓', text: n => `Answer ${n.toLocaleString()} questions correctly`, tiers: [25, 100, 250, 500, 1000, 2500, 5000], val: () => s.stats.correct },
    { id: 'sharpshooter', name: 'Sharpshooter', icon: '🎯', text: n => `Finish ${n} perfect lessons`, tiers: [1, 5, 15, 30, 60, 100], val: () => s.stats.perfect },
    { id: 'lifter', name: 'Heavy Lifter', icon: '💪', text: n => `Answer ${n} hard questions correctly`, tiers: [10, 50, 150, 300, 600, 1000], val: () => s.stats.hard },
    { id: 'combo', name: 'Combo King', icon: '⚡', text: n => `Get ${n} correct in a row`, tiers: [5, 10, 15, 25, 40], val: () => s.stats.bestCombo },
    { id: 'mathwhiz', name: 'Math Whiz', icon: '📐', text: n => `Reach a 650 rating in ${n} Math question types`, tiers: [1, 3, 6, 10, 18], val: () => skillsAtRating('math', 650) },
    { id: 'wordsmith', name: 'Wordsmith', icon: '✍️', text: n => `Reach a 650 rating in ${n} Reading & Writing question types`, tiers: [1, 3, 6, 11], val: () => skillsAtRating('rw', 650) },
    { id: 'breeds', name: 'Dog Collector', icon: '🐕', text: n => `Earn ${n} breed badges`, tiers: [1, 5, 10, 20, 40], val: () => s.stats.levels },
    { id: 'topdog', name: 'Top Dog', icon: '👑', text: n => (n === 1 ? 'Reach Top Dog in Math or Reading & Writing' : 'Reach Top Dog in both sections'), tiers: [1, 2], val: () => ['math', 'rw'].filter(k => s.path[k].level > LADDER.length).length },
    { id: 'champion', name: 'Champion', icon: '🏆', text: n => `Finish #1 in your league ${n} times`, tiers: [1, 3, 5, 10, 25], val: () => s.stats.firsts },
    { id: 'climber', name: 'Climber', icon: '🧗', text: n => `Reach the ${LEAGUES[n].name} League`, tiers: [1, 3, 5, 7, 9], val: () => s.tierMax },
    { id: 'questmaster', name: 'Quest Master', icon: '📜', text: n => `Complete ${n} quests`, tiers: [5, 25, 75, 150, 300], val: () => s.stats.questsDone },
    { id: 'owner', name: 'Good Owner', icon: '🦴', text: n => `Feed your dog ${n} times`, tiers: [3, 15, 50, 120], val: () => s.stats.fed },
    { id: 'cheer', name: 'Cheerleader', icon: '👏', text: n => `Give ${n} high fives`, tiers: [5, 20, 50, 100], val: () => s.stats.kudosGiven },
    { id: 'nightowl', name: 'Night Owl', icon: '🌙', text: () => 'Finish a lesson after 10 PM', tiers: [1], val: () => s.stats.night },
    { id: 'earlybird', name: 'Early Bird', icon: '🌅', text: () => 'Finish a lesson before 7 AM', tiers: [1], val: () => s.stats.early }
  ];
  function checkAchievements() {
    const got = [];
    for (const a of ACHIEVEMENTS) {
      const v = a.val();
      let lvl = s.achievements[a.id] || 0;
      while (lvl < a.tiers.length && v >= a.tiers[lvl]) {
        lvl++;
        const treats = 10 * lvl;
        s.treats += treats;
        got.push({ a, level: lvl, treats });
      }
      s.achievements[a.id] = lvl;
    }
    return got;
  }

  // ---------- Path state ----------
  const pathOf = section => s.path[section];
  const BAG_AFTER = 2;   // the treat bag sits after the second lesson of every level
  function openBag(section) {
    const st = s.path[section];
    if (st.bag || st.done < BAG_AFTER) return 0;
    const treats = 15 + Math.floor(Math.random() * 26);
    st.bag = true; s.treats += treats; save();
    return treats;
  }

  // ---------- Finishing a session ----------
  // mode: lesson | challenge | jump | hunt | hardmix | review | daily
  // answers: [{ id, correct, difficulty, section, skill }]
  function finishSession({ mode, section, level, replay, answers, ms, maxCombo, quit }) {
    tick();
    const total = answers.length, correct = answers.filter(a => a.correct).length, wrong = total - correct;
    const hardCorrect = answers.filter(a => a.correct && a.difficulty === 3).length;
    const out = { mode, total, correct, wrong, ms, maxCombo, xpParts: [], levelUp: null, streak: null, quests: [], achievements: [], passed: null, events: [], treats: 0 };
    const scoreSection = section || (answers[0] && answers[0].section);
    out.score = { section: scoreSection, before: scoreSection ? practiceScore(scoreSection) : null, ratingBefore: scoreSection ? sectionRating(scoreSection) : null };

    // XP
    let base = answers.reduce((n, a) => n + (a.correct ? (mode === 'review' ? 5 : XP_PER[a.difficulty] || 10) : 0), 0);
    out.xpParts.push(['Correct answers', base]);
    if (!quit) {
      if (mode !== 'review') { base += LESSON_BONUS; out.xpParts.push(['Lesson complete', LESSON_BONUS]); }
      if (wrong === 0 && total >= LESSON_SIZE) { base += PERFECT_BONUS; out.xpParts.push(['Perfect lesson', PERFECT_BONUS]); }
    }
    let mult = 1;
    if (mode === 'daily') { mult *= 2; out.xpParts.push(['Daily Challenge', '×2']); }
    if (mode === 'challenge' && !quit) { mult *= 1.5; out.xpParts.push(['Level challenge', '×1.5']); }
    if (boostActive()) { mult *= 2; out.xpParts.push(['XP Boost', '×2']); }
    out.xp = addXp(Math.round(base * mult));

    // Stats and question memory
    s.stats.answered += total; s.stats.correct += correct; s.stats.hard += hardCorrect; s.stats.ms += ms;
    s.stats.bestCombo = Math.max(s.stats.bestCombo, maxCombo);
    for (const a of answers) {
      s.seen[a.id] = a.correct ? 1 : 0;
      if (a.group) s.seenGroups[a.group] = 1;
      recordAnswer(a.skill, a.difficulty, a.correct);
      if (!a.correct && !s.mistakes.includes(a.id)) s.mistakes.push(a.id);
      if (a.correct && mode === 'review') s.mistakes = s.mistakes.filter(x => x !== a.id);
    }
    s.mistakes = s.mistakes.slice(-200);

    const isLesson = !quit && mode !== 'review';
    if (isLesson) {
      out.treats = LESSON_TREATS + (wrong === 0 && total >= LESSON_SIZE ? PERFECT_TREATS : 0);
      s.treats += out.treats;
      s.stats.lessons++;
      if (wrong === 0 && total >= LESSON_SIZE) s.stats.perfect++;
      const hr = new Date().getHours();
      if (hr >= 22) s.stats.night++;
      if (hr < 7) s.stats.early++;
    }

    // The breed path
    if (!quit && section && s.path[section]) {
      const st = s.path[section];
      const need = total ? Math.ceil(total * (mode === 'jump' ? JUMP_PASS : CHALLENGE_PASS)) : 1;
      if (mode === 'lesson' && !replay && level === st.level) {
        st.done = Math.min(levelSpec(section, st.level).lessons, st.done + 1);
      } else if ((mode === 'challenge' && level === st.level) || (mode === 'jump' && level > st.level)) {
        out.passed = correct >= need;
        out.need = need;
        if (out.passed) {
          const from = st.level;
          st.level = mode === 'jump' ? level : st.level + 1;
          st.done = 0; st.bag = false;
          const badges = mode === 'jump' ? st.level - from : 1;
          s.stats.levels += badges;
          const reward = 20 + 5 * Math.min(from, 20);
          s.treats += reward;
          out.levelUp = { section, from, level: st.level, earned: levelName(section, mode === 'jump' ? level - 1 : from), next: levelName(section, st.level), treats: reward };
          out.events.push(['levelup', { section, level: st.level, name: levelName(section, st.level), done: levelName(section, st.level - 1) }]);
        }
      }
    }
    if (mode === 'daily' && !quit && (!s.daily || s.daily.day !== today())) {
      s.daily = { day: today(), score: correct, total, ms };
      out.events.push(['daily', { score: correct, total, ms }]);
    }

    // Streak: any finished lesson (not quitting, not review-only) keeps it alive for today.
    if (isLesson && s.lastLessonDay !== today()) {
      s.streak = (s.lastLessonDay === addDays(today(), -1) ? s.streak : 0) + 1;
      s.lastLessonDay = today();
      s.streakDays.push(today());
      s.bestStreak = Math.max(s.bestStreak, s.streak);
      if (s.lostStreak) s.lostStreak = null;
      out.streak = s.streak;
      if ([7, 14, 30, 50, 100, 150, 200, 365].includes(s.streak)) { s.treats += s.streak >= 100 ? 100 : 30; out.streakTreats = s.streak >= 100 ? 100 : 30; out.events.push(['streak', { n: s.streak }]); }
    }

    if (scoreSection) { out.score.after = practiceScore(scoreSection); out.score.ratingAfter = sectionRating(scoreSection); }
    out.goalReachedNow = todayXp() >= s.goal && todayXp() - out.xp < s.goal;
    out.quests = progressQuests({ lesson: isLesson, mode, section, correct, total, wrong, hardCorrect, ms, maxCombo });
    out.achievements = checkAchievements();
    out.achievements.filter(g => g.level >= 2 || g.a.tiers.length === 1).forEach(g => out.events.push(['achievement', { name: g.a.name, icon: g.a.icon, level: g.level }]));
    save();
    return out;
  }

  // ---------- Public row shared with the pack ----------
  function publicData() {
    return {
      name: s.name, avatar: s.avatar, xp: s.xp, week: s.week, weekXp: s.weekXp, prevWeek: s.prevWeek, prevWeekXp: s.prevWeekXp,
      tier: s.tier, streak: s.streak, lastLessonDay: s.lastLessonDay, day: today(), todayXp: todayXp(), goal: s.goal,
      daily: s.daily, fullness: s.fullness, scores: { math: practiceScore('math'), rw: practiceScore('rw') }, rating: overallRating(), ratings: { math: sectionRating('math'), rw: sectionRating('rw') }, achievements: Object.values(s.achievements).reduce((a, b) => a + b, 0),
      stats: { lessons: s.stats.lessons, correct: s.stats.correct, answered: s.stats.answered, perfect: s.stats.perfect, bestStreak: s.bestStreak, firsts: s.stats.firsts,
        levels: { math: s.path.math.level, rw: s.path.rw.level }, badges: s.stats.levels }
    };
  }

  window.GAME = {
    VERSION,
    FOODS, HUNGER_STATES, fullnessAt, hungerState, fullness, feed, practiceScore,
    MAX_HEARTS, HEART_MS, PRICES, MAX_FREEZES, BOOST_MS, GOALS, LEAGUES, COSMETICS, ACHIEVEMENTS, QUEST_KINDS, XP_PER,
    LESSON_SIZE, LADDER, SIZE_CLASSES, TYPE_ORDER, CHALLENGE_PASS, JUMP_PASS, BAG_AFTER,
    levelSpec, levelName, typeName, TYPE_SHORT, mixWords, pathOf, openBag, proficiency, attempts,
    ELO_START, Q_RATING, LOW_EVIDENCE, RATING_TITLES, rating, ratingTitle, sectionRating, overallRating, ratingsFromElo,
    get s() { return s; }, get profiles() { return profiles; },
    create, load, adopt, save, signOut, removeProfile,
    today, addDays, dayDiff, weekOf, msToWeekEnd, msToMidnight, rng, hashStr, randId,
    hearts, msToNextHeart, loseHeart, gainHeart, boostActive, buy, buyCosmetic, equip, setDog, canRepair,
    tick, needsWeekRoll, rollWeek, todayXp, questText, claimQuest, makeQuests,
    finishSession, publicData, checkAchievements
  };
})();
