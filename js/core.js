/* Core: taxonomy, storage, question helpers, test assembly, scoring. */
(function () {
  'use strict';

  // ---------- Taxonomy (mirrors the digital SAT content domains) ----------
  const TAXONOMY = {
    rw: {
      name: 'Reading and Writing',
      moduleSize: 27,
      minutes: 32,
      domains: [
        { id: 'craft', name: 'Craft and Structure', perModule: 8, skills: [
          { id: 'words-in-context', name: 'Words in Context' },
          { id: 'text-structure', name: 'Text Structure and Purpose' },
          { id: 'cross-text', name: 'Cross-Text Connections' } ] },
        { id: 'info', name: 'Information and Ideas', perModule: 7, skills: [
          { id: 'central-ideas', name: 'Central Ideas and Details' },
          { id: 'evidence-textual', name: 'Command of Evidence: Textual' },
          { id: 'evidence-quant', name: 'Command of Evidence: Quantitative' },
          { id: 'inferences', name: 'Inferences' } ] },
        { id: 'conventions', name: 'Standard English Conventions', perModule: 7, skills: [
          { id: 'boundaries', name: 'Boundaries' },
          { id: 'form-structure', name: 'Form, Structure, and Sense' } ] },
        { id: 'expression', name: 'Expression of Ideas', perModule: 5, skills: [
          { id: 'transitions', name: 'Transitions' },
          { id: 'synthesis', name: 'Rhetorical Synthesis' } ] }
      ]
    },
    math: {
      name: 'Math',
      moduleSize: 22,
      minutes: 35,
      domains: [
        { id: 'algebra', name: 'Algebra', perModule: 8, skills: [
          { id: 'linear-one-var', name: 'Linear equations in one variable' },
          { id: 'linear-functions', name: 'Linear functions' },
          { id: 'linear-two-var', name: 'Linear equations in two variables' },
          { id: 'systems', name: 'Systems of two linear equations' },
          { id: 'inequalities', name: 'Linear inequalities' } ] },
        { id: 'advanced', name: 'Advanced Math', perModule: 8, skills: [
          { id: 'equivalent-expressions', name: 'Equivalent expressions' },
          { id: 'nonlinear-equations', name: 'Nonlinear equations and systems' },
          { id: 'nonlinear-functions', name: 'Nonlinear functions' } ] },
        { id: 'data', name: 'Problem-Solving and Data Analysis', perModule: 3, skills: [
          { id: 'ratios-rates', name: 'Ratios, rates, and units' },
          { id: 'percentages', name: 'Percentages' },
          { id: 'one-var-data', name: 'One-variable data' },
          { id: 'two-var-data', name: 'Two-variable data and models' },
          { id: 'probability', name: 'Probability' },
          { id: 'inference', name: 'Inference and margin of error' } ] },
        { id: 'geometry', name: 'Geometry and Trigonometry', perModule: 3, skills: [
          { id: 'area-volume', name: 'Area and volume' },
          { id: 'lines-angles', name: 'Lines, angles, and triangles' },
          { id: 'right-triangles', name: 'Right triangles and trigonometry' },
          { id: 'circles', name: 'Circles' } ] }
      ]
    }
  };

  const DIFFICULTY = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };

  function domainOf(section, domainId) {
    return TAXONOMY[section].domains.find(d => d.id === domainId);
  }
  function skillName(section, domainId, skillId) {
    const d = domainOf(section, domainId);
    const s = d && d.skills.find(k => k.id === skillId);
    return s ? s.name : skillId;
  }

  // ---------- Bank ----------
  // Hand-written questions (window.SAT_BANK) load with the page. Generated questions live in small
  // chunk files, one set per section/skill/difficulty, listed in bank/gen/manifest.js and loaded on
  // demand. Generated ids look like g.<section>.<skill>.<difficulty>.<hash>, so a question's chunk
  // can be found from its id alone.
  const MANIFEST = window.SAT_MANIFEST || { chunks: {}, counts: {} };
  const SKILL_INFO = {};
  for (const sec of Object.keys(TAXONOMY)) {
    for (const d of TAXONOMY[sec].domains) for (const s of d.skills) SKILL_INFO[s.id] = { section: sec, domain: d.id };
  }
  const BY_ID = new Map();
  const BY_KEY = new Map();   // "section/skill/difficulty" -> loaded questions
  function register(q) {
    if (BY_ID.has(q.id)) return;
    q.type = q.type || (q.choices ? 'mcq' : 'spr');
    if (q.type === 'mcq' && typeof q.answer === 'string') q.answer = 'ABCD'.indexOf(q.answer);
    if (q.type === 'spr' && !Array.isArray(q.answer)) q.answer = [String(q.answer)];
    q.domain = q.domain || SKILL_INFO[q.skill].domain;
    BY_ID.set(q.id, q);
    const key = `${q.section}/${q.skill}/${q.difficulty}`;
    if (!BY_KEY.has(key)) BY_KEY.set(key, []);
    BY_KEY.get(key).push(q);
  }
  const ORIGINAL = window.SAT_BANK || [];
  ORIGINAL.forEach(register);
  const ORIGINAL_COUNTS = {};
  ORIGINAL.forEach(q => { const k = `${q.section}/${q.skill}/${q.difficulty}`; ORIGINAL_COUNTS[k] = (ORIGINAL_COUNTS[k] || 0) + 1; });
  const getQ = id => BY_ID.get(id);

  const LOADED = new Set(), PENDING = {};
  window.SAT_CHUNK = (key, items) => { items.forEach(register); LOADED.add(key); };
  function loadChunk(key) {
    if (LOADED.has(key)) return Promise.resolve();
    if (!PENDING[key]) {
      const [sec, skill, d, k] = key.split('/');
      PENDING[key] = new Promise((resolve, reject) => {
        const el = document.createElement('script');
        el.src = (window.SAT_BASE || '') + `bank/gen/${sec}/${skill}/d${d}-${k}.js`;
        el.onload = () => resolve();
        el.onerror = () => { delete PENDING[key]; reject(new Error('Could not load ' + el.src)); };
        document.head.appendChild(el);
      });
    }
    return PENDING[key];
  }

  // Section, skill, and difficulty of any question id, loaded or not.
  function metaOf(id) {
    if (id.startsWith('g.')) {
      const [, section, skill, d, hash] = id.split('.');
      return { section, skill, domain: (SKILL_INFO[skill] || {}).domain, difficulty: +d, hash };
    }
    const q = BY_ID.get(id);
    return q ? { section: q.section, skill: q.skill, domain: q.domain, difficulty: q.difficulty } : null;
  }
  function chunkOf(id) {
    const m = metaOf(id);
    if (!m || !m.hash) return null;
    const n = MANIFEST.chunks[`${m.section}/${m.skill}/${m.difficulty}`];
    return n ? `${m.section}/${m.skill}/${m.difficulty}/${parseInt(m.hash.slice(0, 8), 16) % n}` : null;
  }
  async function ensure(ids) {
    const keys = new Set();
    ids.forEach(id => { if (!BY_ID.has(id)) { const c = chunkOf(id); if (c) keys.add(c); } });
    await Promise.all([...keys].map(loadChunk));
  }

  function skillsMatching(section, domain, skill) {
    if (skill) return [skill];
    return TAXONOMY[section].domains.filter(d => !domain || d.id === domain).flatMap(d => d.skills.map(s => s.id));
  }
  function countFor(section, domain, skill, diffs = [1, 2, 3]) {
    let n = 0;
    for (const s of skillsMatching(section, domain, skill)) {
      for (const d of diffs) { const k = `${section}/${s}/${d}`; n += (MANIFEST.counts[k] || 0) + (ORIGINAL_COUNTS[k] || 0); }
    }
    return n;
  }
  function loadedMatching(section, domain, skill, diffs) {
    const out = [];
    for (const s of skillsMatching(section, domain, skill)) for (const d of diffs) out.push(...(BY_KEY.get(`${section}/${s}/${d}`) || []));
    return out;
  }
  // Load random chunks until at least `min` matching questions are available (or everything is loaded).
  async function loadPool({ section, domain, skill, diffs = [1, 2, 3], min = 40 }) {
    const keys = [];
    for (const s of skillsMatching(section, domain, skill)) {
      for (const d of diffs) {
        const n = MANIFEST.chunks[`${section}/${s}/${d}`] || 0;
        for (let k = 0; k < n; k++) keys.push(`${section}/${s}/${d}/${k}`);
      }
    }
    const todo = shuffle(keys.filter(k => !LOADED.has(k)));
    while (loadedMatching(section, domain, skill, diffs).length < min && todo.length) {
      await Promise.all(todo.splice(0, 3).map(loadChunk));
    }
    return loadedMatching(section, domain, skill, diffs);
  }

  // ---------- Storage (one progress record per name; no passwords) ----------
  const LEGACY_KEY = 'satprep.v1';
  const PROFILES_KEY = 'satprep.profiles';
  function blankState() { return { attempts: {}, tests: [], activeTest: null }; }
  const readJSON = k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  const writeJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } };
  const normName = n => String(n || '').trim().replace(/\s+/g, ' ');
  const userKey = n => 'satprep.user.' + normName(n).toLowerCase();

  let profiles = Object.assign({ current: null, names: {} }, readJSON(PROFILES_KEY) || {});
  let state = blankState();

  function loadUser() {
    state = profiles.current ? Object.assign(blankState(), readJSON(userKey(profiles.current)) || {}) : blankState();
  }
  function signIn(name) {
    const display = normName(name);
    if (!display) return false;
    const id = display.toLowerCase();
    // First person to sign in on a device that has pre-profile progress inherits it.
    const legacy = readJSON(LEGACY_KEY);
    if (legacy && !readJSON(userKey(display))) { writeJSON(userKey(display), legacy); try { localStorage.removeItem(LEGACY_KEY); } catch (e) { /* ignore */ } }
    profiles.names[id] = display;
    profiles.current = display;
    writeJSON(PROFILES_KEY, profiles);
    loadUser();
    return true;
  }
  function signOut() { profiles.current = null; writeJSON(PROFILES_KEY, profiles); loadUser(); }
  function save() { if (profiles.current) writeJSON(userKey(profiles.current), state); }
  loadUser();
  function recordAttempt(qid, correct, mode) {
    (state.attempts[qid] = state.attempts[qid] || []).push({ c: correct ? 1 : 0, t: Date.now(), m: mode });
    save();
  }
  function lastAttempt(qid) {
    const a = state.attempts[qid];
    return a && a.length ? a[a.length - 1] : null;
  }
  function resetAll() { state = blankState(); save(); }
  // { skillId: { tried, right } } using the latest attempt at each question.
  function attemptStats() {
    const out = {};
    for (const [id, list] of Object.entries(state.attempts)) {
      const m = metaOf(id);
      if (!m || !list.length) continue;
      const s = out[m.skill] || (out[m.skill] = { tried: 0, right: 0 });
      s.tried++; s.right += list[list.length - 1].c;
    }
    return out;
  }
  const missedIds = () => Object.keys(state.attempts).filter(id => { const a = lastAttempt(id); return a && !a.c && metaOf(id); });

  // ---------- Helpers ----------
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const LETTERS = ['A', 'B', 'C', 'D'];

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function renderMath(el) {
    if (window.renderMathInElement) {
      window.renderMathInElement(el, {
        delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }],
        throwOnError: false
      });
    }
  }

  function fmtTime(sec) {
    sec = Math.max(0, Math.round(sec));
    return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  }

  // ---------- Answer checking ----------
  function parseNum(str) {
    const s = String(str).trim().replace(/\s+/g, '');
    if (/^-?\d+\/\d+$/.test(s)) {
      const [n, d] = s.split('/').map(Number);
      return d === 0 ? NaN : n / d;
    }
    if (/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return Number(s);
    return NaN;
  }

  // Grid-in rules: fractions or decimals are accepted; a decimal approximation of a
  // non-terminating value must fill the 5-character field (truncated or rounded).
  function sprCorrect(input, accepted) {
    const raw = String(input || '').trim().replace(/\s+/g, '');
    if (!raw) return false;
    const val = parseNum(raw);
    if (isNaN(val)) return false;
    return accepted.some(ans => {
      const truth = parseNum(ans);
      if (Math.abs(val - truth) < 1e-9) return true;
      if (!raw.includes('.')) return false;
      const dp = raw.split('.')[1].length;
      const f = Math.pow(10, dp);
      const trunc = Math.trunc(truth * f) / f;
      const round = Math.round(truth * f) / f;
      const matches = Math.abs(val - trunc) < 1e-9 || Math.abs(val - round) < 1e-9;
      return matches && raw.replace('-', '').length >= 5;
    });
  }

  function isCorrect(q, response) {
    if (response === undefined || response === null || response === '') return false;
    return q.type === 'spr' ? sprCorrect(response, q.answer) : response === q.answer;
  }

  function correctAnswerText(q) {
    return q.type === 'spr' ? q.answer.join(' or ') : LETTERS[q.answer];
  }

  // ---------- Test assembly ----------
  // Module 1 spans all levels; the harder Module 2 is mostly hard questions, the easier one mostly easy/medium.
  const DIFF_MIX = {
    m1:   [0.30, 0.40, 0.30],
    hard: [0.05, 0.30, 0.65],
    easy: [0.45, 0.45, 0.10]
  };

  // Split n into integer counts proportional to weights (largest remainder).
  function apportion(n, weights) {
    const raw = weights.map(w => w * n);
    const out = raw.map(Math.floor);
    let left = n - out.reduce((a, b) => a + b, 0);
    raw.map((r, i) => [r - Math.floor(r), i]).sort((a, b) => b[0] - a[0] || Math.random() - 0.5)
      .slice(0, left).forEach(([, i]) => out[i]++);
    return out;
  }

  // size: total questions (defaults to a full module); domains keep the blueprint's proportions.
  async function assembleModule(section, level, exclude, size) {
    const tax = TAXONOMY[section];
    const fullSize = tax.domains.reduce((s, d) => s + d.perModule, 0);
    const domCounts = apportion(size || fullSize, tax.domains.map(d => d.perModule / fullSize));
    const picked = [];
    const used = new Set(exclude);
    const usedGroups = new Set(exclude.map(id => (getQ(id) || {}).group).filter(Boolean));
    const unseenFirst = qs => shuffle(qs).sort((a, b) => (state.attempts[a.id] ? 1 : 0) - (state.attempts[b.id] ? 1 : 0));

    function take(pool, n) {
      // Spread picks across skills (least-picked skill first); never reuse a passage/sentence group.
      const counts = {};
      const cands = unseenFirst(pool.filter(q => !used.has(q.id) && !(q.group && usedGroups.has(q.group))));
      const got = [];
      while (got.length < n && cands.length) {
        cands.sort((a, b) => (counts[a.skill] || 0) - (counts[b.skill] || 0));
        const q = cands.shift();
        if (q.group && usedGroups.has(q.group)) continue;
        counts[q.skill] = (counts[q.skill] || 0) + 1;
        used.add(q.id);
        if (q.group) usedGroups.add(q.group);
        got.push(q);
      }
      return got;
    }

    for (const [di, dom] of tax.domains.entries()) {
      const targets = apportion(domCounts[di], DIFF_MIX[level]);
      let short = 0;
      for (const [i, d] of [1, 2, 3].entries()) {
        if (!targets[i]) continue;
        const pool = await loadPool({ section, domain: dom.id, diffs: [d], min: targets[i] * 6 });
        const got = take(pool, targets[i]);
        picked.push(...got);
        short += targets[i] - got.length;
      }
      // Borrow the nearest difficulty if a level runs short: hard modules borrow from harder first.
      for (const d of (level === 'easy' ? [1, 2, 3] : [3, 2, 1])) {
        if (short <= 0) break;
        const got = take(await loadPool({ section, domain: dom.id, diffs: [d], min: short * 6 }), short);
        picked.push(...got); short -= got.length;
      }
      if (short > 0) picked.push(...take(await loadPool({ section, min: short * 6 }), short));
    }

    // Order: R&W grouped by domain/skill as on the real test; Math roughly easy → hard.
    if (section === 'rw') {
      const dIdx = {}, sIdx = {};
      tax.domains.forEach((d, i) => { dIdx[d.id] = i; d.skills.forEach((s, j) => { sIdx[s.id] = j; }); });
      picked.sort((a, b) => dIdx[a.domain] - dIdx[b.domain] || sIdx[a.skill] - sIdx[b.skill] || a.difficulty - b.difficulty);
    } else {
      picked.sort((a, b) => a.difficulty - b.difficulty || Math.random() - 0.5);
    }
    return picked.map(q => q.id);
  }

  // ---------- Scoring (an estimate, not the official IRT model) ----------
  // Each question is worth its difficulty (1-3 points). A section's performance ratio is
  // compared with the maximum available on the harder route; the lower route's second
  // module is discounted so its ceiling sits below 800, as on the adaptive test.
  const HARD_WEIGHT = DIFF_MIX.hard.reduce((s, w, i) => s + w * (i + 1), 0);
  const EASY_DISCOUNT = 0.8;
  const pts = id => (getQ(id) || { difficulty: 0 }).difficulty;

  function moduleEarned(mod) {
    return mod.qids.reduce((s, id) => s + (getQ(id) && isCorrect(getQ(id), mod.answers[id]) ? pts(id) : 0), 0);
  }
  function moduleMax(mod) { return mod.qids.reduce((s, id) => s + pts(id), 0); }
  function moduleCorrect(mod) { return mod.qids.filter(id => getQ(id) && isCorrect(getQ(id), mod.answers[id])).length; }

  function routeFor(mod1) {
    return moduleEarned(mod1) / moduleMax(mod1) >= 0.5 ? 'hard' : 'easy';
  }

  function toScaled(ratio) {
    const s = 200 + 600 * Math.pow(Math.min(1, Math.max(0, ratio)), 0.85);
    return Math.round(s / 10) * 10;
  }

  // Plain-language explanation shown wherever scores appear. The margins are a deliberately
  // conservative rough guide: this estimate has NOT been validated against official SAT results.
  const MARGIN = { full: { section: 100, total: 150 }, half: { section: 150, total: 200 } };
  function scoreRange(score, kind, part) {
    const m = MARGIN[kind === 'half' ? 'half' : 'full'][part];
    const lo = part === 'total' ? 400 : 200, hi = part === 'total' ? 1600 : 800;
    return `${Math.max(lo, score - m)}–${Math.min(hi, score + m)}`;
  }
  const SCORE_NOTE = `<details class="score-note card">
    <summary>How is my score estimated, and how accurate is it?</summary>
    <p><b>How it works.</b> Like the real digital SAT, each section has two modules, and how you do on Module 1 decides whether Module 2 is harder or easier. Here, every question is worth points based on its difficulty (easy 1, medium 2, hard 3). If you earn at least half of Module 1's points, you get the harder Module 2. Your section points are then converted to the 200–800 scale. Points from the easier Module 2 count for less, so that route can't reach 800, just as on the real test. Your total is the sum of the two sections (400–1600).</p>
    <p><b>How it differs from the real SAT.</b> College Board scores the test with a statistical model built from how thousands of students answered each question. It also includes a few unscored trial questions and doesn't publish its routing cutoff. On this site, question difficulty is rated by the question writers, the routing cutoff is an approximation, and there are no trial questions.</p>
    <p><b>How far off it may be.</b> These estimates have not yet been compared with students' official SAT scores, so we can't give a measured margin of error. As a conservative rough guide, expect your official score to fall within about <b>±100 points per section</b> and <b>±150 points total</b> of a full-test estimate. Half tests use half as many questions, so allow about <b>±150 per section</b> and <b>±200 total</b>. Use the estimate to track your progress over time rather than to predict an exact score. Official practice tests in College Board's Bluebook app give the closest preview.</p>
  </details>`;

  function sectionScore(mods) {
    const m1 = mods[0], m2 = mods[1];
    if (!m2) return toScaled(moduleEarned(m1) / moduleMax(m1));
    if (m2.level === 'hard') {
      const max = moduleMax(m1) + Math.max(moduleMax(m2), m2.qids.length * HARD_WEIGHT);
      return toScaled((moduleEarned(m1) + moduleEarned(m2)) / max);
    }
    const max = moduleMax(m1) + m2.qids.length * HARD_WEIGHT;
    return toScaled((moduleEarned(m1) + EASY_DISCOUNT * moduleEarned(m2)) / max);
  }

  window.SAT = {
    TAXONOMY, DIFFICULTY, LETTERS, MANIFEST, ORIGINAL, getQ, domainOf, skillName,
    metaOf, ensure, loadPool, loadChunk, countFor, attemptStats, missedIds,
    get state() { return state; }, save, recordAttempt, lastAttempt, resetAll,
    get user() { return profiles.current; }, get knownUsers() { return Object.values(profiles.names); }, signIn, signOut,
    esc, shuffle, renderMath, fmtTime,
    isCorrect, sprCorrect, correctAnswerText,
    assembleModule, routeFor, sectionScore, moduleCorrect, scoreRange, SCORE_NOTE
  };
})();
