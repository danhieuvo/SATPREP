/* Lessons: choosing questions from the SAT bank, the lesson player, and the celebration screens after. */
(function () {
  'use strict';
  const S = window.SAT, G = window.GAME, U = window.UI;
  const { esc, $, $$, ICON } = U;
  const LETTERS = ['A', 'B', 'C', 'D'];

  // Remember which questions each chunk file holds (needed for the same-for-everyone Daily Challenge).
  const CHUNK_ITEMS = {};
  const origChunk = window.SAT_CHUNK;
  window.SAT_CHUNK = (key, items) => { CHUNK_ITEMS[key] = items; origChunk(key, items); };

  // ---------- Choosing questions ----------
  function apportion(n, weights) {
    const raw = weights.map(w => w * n), out = raw.map(Math.floor);
    let left = n - out.reduce((a, b) => a + b, 0);
    raw.map((r, i) => [r - Math.floor(r), i]).sort((a, b) => b[0] - a[0]).slice(0, left).forEach(([, i]) => out[i]++);
    return out;
  }
  const NEAREST = { 1: [1, 2, 3], 2: [2, 3, 1], 3: [3, 2, 1] };

  // No repeats: a question the player has ever answered is never picked again, and a passage or sentence
  // set they have already seen (a "group") is avoided too. More chunks of the bank are loaded as needed;
  // a seen question is used only if every question of that type and difficulty has been answered.
  //   rank 0 = new question from a new passage/sentence set, 1 = new question from a seen set, 2 = seen before
  function rankOf(q) {
    const s = G.s;
    if (s.seen[q.id] !== undefined) return 2;
    return q.group && s.seenGroups[q.group] ? 1 : 0;
  }
  async function bestFor(section, skill, d, taken) {
    let min = 40, last = -1, pool = [];
    for (;;) {
      pool = (await S.loadPool({ section, skill, diffs: [d], min })).filter(taken);
      if (pool.some(q => rankOf(q) === 0) || pool.length === last) break;   // found a fresh one, or nothing left to load
      last = pool.length;
      min = pool.length + 1;
    }
    if (!pool.length) return null;
    const best = Math.min(...pool.map(rankOf));
    const cands = pool.filter(q => rankOf(q) === best);
    return { q: cands[Math.floor(Math.random() * cands.length)], rank: best };
  }

  async function pick({ section, skills, mix, n }) {
    const diffs = [];
    apportion(n, mix).forEach((c, i) => { for (let k = 0; k < c; k++) diffs.push(i + 1); });
    const used = new Set(), groups = new Set(), out = [];
    const free = q => !used.has(q.id) && !(q.group && groups.has(q.group));
    for (let i = 0; i < diffs.length; i++) {
      const skill = skills[i % skills.length];
      // Take the nearest difficulty that still has a brand-new question; repeat only if all are used up.
      let got = null;
      for (const d of NEAREST[diffs[i]]) {
        const r = await bestFor(section, skill, d, free);
        if (r && (!got || r.rank < got.rank)) got = r;
        if (got && got.rank === 0) break;
      }
      if (!got) continue;
      used.add(got.q.id); if (got.q.group) groups.add(got.q.group);
      out.push(got.q);
    }
    // Easier questions first within a lesson.
    return out.sort((a, b) => a.difficulty - b.difficulty);
  }

  async function dailyQuestions(day) {
    const r = G.rng('daily:' + day);
    const plan = [['rw', 2], ['math', 2], ['rw', 2], ['math', 3], [r() < 0.5 ? 'rw' : 'math', 3]];
    const out = [], groups = new Set();
    for (const [sec, want] of plan) {
      for (const d of NEAREST[want]) {
        const keys = Object.keys(S.MANIFEST.chunks).filter(k => k.startsWith(sec + '/') && k.endsWith('/' + d)).sort();
        if (!keys.length) continue;
        const key = keys[Math.floor(r() * keys.length)];
        const k = Math.floor(r() * S.MANIFEST.chunks[key]);
        const chunk = `${key}/${k}`;
        await S.loadChunk(chunk);
        const items = (CHUNK_ITEMS[chunk] || []).slice().sort((a, b) => (a.id < b.id ? -1 : 1));
        let idx = Math.floor(r() * items.length), tries = 0;
        while (items.length && tries < items.length && (out.includes(items[idx]) || (items[idx].group && groups.has(items[idx].group)))) { idx = (idx + 1) % items.length; tries++; }
        if (!items.length) continue;
        const q = S.getQ(items[idx].id) || items[idx];
        out.push(q); if (q.group) groups.add(q.group);
        break;
      }
    }
    return out;
  }

  // Weakest question types first (Top Dog lessons and hunts focus on them).
  const weakestFirst = skills => skills.slice().sort((a, b) => G.rating(a) - G.rating(b) || Math.random() - 0.5);

  async function buildSession(opts) {
    const { mode, section } = opts;
    const allTypes = sec => G.TYPE_ORDER[sec].filter(id => S.countFor(sec, null, id));
    if (mode === 'lesson' || mode === 'challenge' || mode === 'jump') {
      // A jump test is set at the difficulty of the level just below the target.
      const spec = G.levelSpec(section, mode === 'jump' ? Math.max(1, opts.level - 1) : opts.level);
      const n = mode === 'lesson' ? spec.n : spec.challengeN;
      let skills;
      if (spec.top) {
        const weak = weakestFirst(spec.types);
        skills = weak.slice(0, 3).concat(S.shuffle(weak.slice(3)));
      } else {
        // Newly introduced types always show up in the level's lessons.
        skills = spec.newTypes.concat(S.shuffle(spec.types.filter(k => !spec.newTypes.includes(k))));
      }
      return pick({ section, skills, mix: spec.mix, n });
    }
    if (mode === 'hunt') {
      // Match the questions to the rating: easier for low ratings, harder as the rating climbs.
      const r = G.rating(opts.skill);
      const mix = r < 400 ? [0.5, 0.5, 0] : r < 600 ? [0.1, 0.6, 0.3] : [0, 0.3, 0.7];
      return pick({ section, skills: [opts.skill], mix, n: 5 });
    }
    if (mode === 'hardmix') return pick({ section, skills: S.shuffle(allTypes(section)), mix: [0, 0.3, 0.7], n: G.LESSON_SIZE });
    if (mode === 'daily') return dailyQuestions(G.today());
    if (mode === 'review') {
      const ids = S.shuffle(G.s.mistakes.filter(id => !section || (S.metaOf(id) || {}).section === section)).slice(0, G.LESSON_SIZE);
      await S.ensure(ids);
      const qs = ids.map(S.getQ).filter(Boolean);
      if (qs.length < G.LESSON_SIZE) {
        const sec = section || G.s.course;
        qs.push(...await pick({ section: sec, skills: S.shuffle(allTypes(sec)), mix: [0.5, 0.5, 0], n: G.LESSON_SIZE - qs.length }));
      }
      return qs;
    }
    return [];
  }

  // ---------- The lesson player ----------
  const PRAISE = ['Nicely done!', 'Awesome!', 'Correct!', 'Nailed it!', 'Great job!', 'You got it!', 'Excellent!', 'Brilliant!'];
  const OOPS = ['Not quite.', 'Almost!', 'Good try.', "Let's learn from this one."];

  async function start(opts) {
    const app = $('#app');
    const s = G.s;
    G.tick();
    const usesHearts = ['lesson', 'challenge', 'jump', 'hunt', 'hardmix'].includes(opts.mode);
    if (usesHearts && G.hearts() === 0) { window.SCREENS.heartsSheet(); return; }
    if (opts.mode === 'daily' && s.daily && s.daily.day === G.today()) { U.toast('You already played today\'s challenge. New one at midnight!'); return; }

    document.body.classList.add('in-lesson');
    app.innerHTML = `<div class="lesson loading"><div class="load-duo">${U.duo({ mood: 'happy' })}</div><p>Loading your lesson…</p></div>`;
    let queue;
    try { queue = await buildSession(opts); } catch (e) { queue = null; }
    if (!queue || !queue.length) {
      document.body.classList.remove('in-lesson');
      U.toast("Couldn't load questions. Check your connection and try again.");
      location.hash = '#/learn';
      window.APP.render();
      return;
    }

    const section = opts.section || queue[0].section;
    const mode = opts.mode;
    // Challenges end early once passing is out of reach.
    const maxWrong = mode === 'challenge' || mode === 'jump' ? queue.length - Math.ceil(queue.length * (mode === 'jump' ? G.JUMP_PASS : G.CHALLENGE_PASS)) : null;
    const t0 = Date.now();
    // The in-a-row count carries over from earlier lessons and only resets on a mistake.
    let idx = 0, combo = s.combo || 0, maxCombo = combo, response = null, checked = false, ended = false;
    const answers = [];

    app.innerHTML = `<div class="lesson">
      <header class="lesson-top">
        <button class="icon-btn" id="quit" aria-label="Quit lesson">${ICON.close()}</button>
        <div class="progress"><div class="progress-fill" id="bar"></div></div>
        <div class="lesson-hearts" id="hearts">${usesHearts ? `${ICON.heart()}<b>${G.hearts()}</b>` : mode === 'daily' ? '<span class="chip gold">×2 XP</span>' : `${ICON.heart()}<b>∞</b>`}</div>
      </header>
      <div class="combo-banner" id="combo" hidden></div>
      <div class="streak-chip ${combo >= 2 ? '' : 'off'}" id="inrow">${ICON.flame()}<b>${combo}</b> in a row</div>
      <main class="lesson-body" id="qbody"></main>
      <footer class="lesson-foot" id="foot">
        <div class="foot-inner">
          <div class="feedback" id="feedback"></div>
          <div class="foot-actions">
            <button class="btn ghost" id="skip">Skip</button>
            <button class="btn green" id="check" disabled>Check</button>
          </div>
        </div>
      </footer>
    </div>`;

    const qbody = $('#qbody'), foot = $('#foot'), feedback = $('#feedback'), checkBtn = $('#check'), skipBtn = $('#skip');

    function setBar() {
      $('#bar').style.width = `${(100 * answers.length) / queue.length}%`;
      $('#bar').classList.toggle('hot', combo >= 3);
    }

    function draw() {
      const q = queue[idx];
      response = null; checked = false;
      foot.className = 'lesson-foot';
      feedback.innerHTML = '';
      checkBtn.textContent = 'Check'; checkBtn.disabled = true; checkBtn.className = 'btn green';
      skipBtn.hidden = false;
      const tag = `<div class="q-tag"><span class="chip">${esc(S.skillName(q.section, q.domain, q.skill))}</span>
        <span class="chip diff d${q.difficulty}">${S.DIFFICULTY[q.difficulty]}</span>
        ${s.mistakes.includes(q.id) && mode !== 'review' ? '<span class="chip warn">Missed before</span>' : ''}</div>`;
      let answer;
      if (q.type === 'mcq') {
        answer = `<div class="tiles">${q.choices.map((c, i) => `<button class="tile" data-i="${i}"><span class="key">${LETTERS[i]}</span><span class="tile-text">${c}</span></button>`).join('')}</div>`;
      } else {
        answer = `<div class="spr-box"><label for="spr">Type your answer</label>
          <input id="spr" class="spr-in" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" maxlength="6" placeholder="e.g. 12, 3/4, -2.5">
          <p class="muted small">Whole number, decimal, or fraction. Up to 5 characters (6 with a minus sign).</p></div>`;
      }
      qbody.innerHTML = `<div class="q-card ${q.passage ? 'has-passage' : ''}">
        ${tag}
        ${q.passage ? `<div class="passage">${q.passage}</div>` : ''}
        <div class="prompt">${q.prompt}</div>
        ${answer}
      </div>`;
      if (q.section === 'math') S.renderMath(qbody);
      $$('.tile', qbody).forEach(b => b.addEventListener('click', () => choose(Number(b.dataset.i))));
      const inp = $('#spr', qbody);
      if (inp) {
        inp.addEventListener('input', () => { inp.value = inp.value.replace(/[^0-9./-]/g, ''); response = inp.value.trim() || null; checkBtn.disabled = !response; });
        setTimeout(() => inp.focus({ preventScroll: true }), 50);
      }
      setBar();
      qbody.scrollTop = 0; window.scrollTo(0, 0);
    }

    function choose(i) {
      if (checked) return;
      response = i;
      $$('.tile', qbody).forEach(b => b.classList.toggle('selected', Number(b.dataset.i) === i));
      checkBtn.disabled = false;
      U.sound('tap');
    }

    function check(skipped) {
      const q = queue[idx];
      checked = true;
      const ok = !skipped && S.isCorrect(q, response);
      answers.push({ id: q.id, correct: ok, difficulty: q.difficulty, section: q.section, skill: q.skill, group: q.group || null });
      combo = ok ? combo + 1 : 0;
      maxCombo = Math.max(maxCombo, combo);
      s.combo = combo; G.save();
      const chip = $('#inrow'); chip.innerHTML = `${ICON.flame()}<b>${combo}</b> in a row`; chip.classList.toggle('off', combo < 2);
      $$('.tile', qbody).forEach(b => {
        const i = Number(b.dataset.i);
        b.disabled = true;
        if (i === q.answer) b.classList.add('correct');
        else if (i === response) b.classList.add('wrong');
      });
      const inp = $('#spr', qbody); if (inp) { inp.disabled = true; inp.classList.add(ok ? 'correct' : 'wrong'); }

      let heartsLeft = null;
      if (ok) {
        U.sound('correct'); U.buzz(15);
        if (mode === 'review') G.gainHeart();
      } else {
        U.sound('wrong'); U.buzz([30, 40, 30]);
        if (usesHearts) {
          heartsLeft = G.loseHeart();
          const h = $('#hearts'); h.innerHTML = `${ICON.heart()}<b>${heartsLeft}</b>`; h.classList.remove('shake'); void h.offsetWidth; h.classList.add('shake');
        }
      }
      if (ok && (combo === 3 || combo === 5 || combo === 8 || (combo >= 10 && combo % 5 === 0))) showCombo(combo);

      const xp = ok ? (mode === 'review' ? 5 : G.XP_PER[q.difficulty]) : 0;
      foot.className = 'lesson-foot ' + (ok ? 'good' : 'bad');
      const expl = q.explanation ? `<details class="why" ${ok ? '' : 'open'}><summary>${ok ? 'See explanation' : 'Why?'}</summary><div class="why-body">${q.explanation}</div></details>` : '';
      feedback.innerHTML = `<div class="fb-head">
          <span class="fb-icon">${ok ? ICON.check() : ICON.close()}</span>
          <div><b class="fb-title">${ok ? PRAISE[Math.floor(Math.random() * PRAISE.length)] : skipped ? 'Skipped.' : OOPS[Math.floor(Math.random() * OOPS.length)]}</b>
          ${ok ? `<span class="fb-xp">+${xp} XP</span>` : `<div class="fb-answer">Correct answer: <b>${esc(S.correctAnswerText(q))}</b>${q.type === 'mcq' ? ` <span class="fb-choice">${q.choices[q.answer]}</span>` : ''}</div>`}</div>
        </div>${expl}`;
      if (q.section === 'math') S.renderMath(feedback);
      skipBtn.hidden = true;
      checkBtn.disabled = false;
      checkBtn.textContent = 'Continue';
      checkBtn.className = 'btn ' + (ok ? 'ok' : 'red');
      checkBtn.focus({ preventScroll: true });
      setBar();

      const wrongs = answers.filter(a => !a.correct).length;
      if (maxWrong !== null && wrongs > maxWrong) pendingEnd = 'failed';
      else if (usesHearts && heartsLeft === 0) pendingEnd = 'hearts';
    }
    let pendingEnd = null;

    function showCombo(n) {
      const el = $('#combo');
      el.innerHTML = `${ICON.flame()} <b>${n} in a row!</b>`;
      el.hidden = false; el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
      U.sound('combo');
      clearTimeout(showCombo.t); showCombo.t = setTimeout(() => { el.hidden = true; }, 1600);
    }

    async function next() {
      if (pendingEnd === 'hearts') {
        pendingEnd = null;
        const refill = await outOfHearts();
        if (!refill) return end(true);
        $('#hearts').innerHTML = `${ICON.heart()}<b>${G.hearts()}</b>`;
      }
      if (pendingEnd === 'failed') return end(false);
      if (idx + 1 >= queue.length) return end(false);
      idx++; draw();
    }

    function outOfHearts() {
      return new Promise(resolve => {
        let refilled = false;
        const sh = U.sheet(`<div class="center"><div class="sheet-duo">${U.duo({ mood: 'sad' })}</div>
          <h2>You ran out of hearts</h2>
          <p class="muted">Refill to keep going, or end here and keep the XP you earned. Hearts come back one per hour, and you can earn them in Mistakes review.</p>
          <div class="stack">
            <button class="btn blue wide" data-refill ${s.treats < G.PRICES.hearts ? 'disabled' : ''}>Refill hearts · ${ICON.treat()} ${G.PRICES.hearts}</button>
            <button class="btn ghost wide" data-end>End lesson</button>
          </div></div>`, { noClose: true, onClose: () => resolve(refilled) });
        $('[data-refill]', sh.el).addEventListener('click', () => { if (!G.buy('hearts')) { refilled = true; U.sound('chest'); } sh.close(); });
        $('[data-end]', sh.el).addEventListener('click', () => sh.close());
      });
    }

    checkBtn.addEventListener('click', () => (checked ? next() : check(false)));
    skipBtn.addEventListener('click', () => { if (!checked) check(true); });
    $('#quit').addEventListener('click', async () => {
      const leave = await U.confirmSheet({ title: 'Wait, don\'t go!', body: answers.length ? 'If you quit now, this lesson won\'t count toward your level or streak. You keep XP for correct answers.' : 'You\'re just getting started. One lesson keeps your streak alive!', yes: 'Keep learning', no: 'End session', mood: 'sad' });
      if (!leave) end(true);
    });
    function onKey(e) {
      if (ended || document.querySelector('.sheet-wrap')) return;
      if (e.target && e.target.tagName === 'INPUT' && e.key !== 'Enter') return;
      const q = queue[idx];
      if (e.key === 'Enter') { e.preventDefault(); if (!checkBtn.disabled) checkBtn.click(); return; }
      if (q.type === 'mcq' && !checked) {
        const i = '1234'.indexOf(e.key) >= 0 ? '1234'.indexOf(e.key) : 'abcd'.indexOf(e.key.toLowerCase());
        if (i >= 0 && e.key.length === 1) choose(i);
      }
    }
    document.addEventListener('keydown', onKey);

    function end(quit) {
      if (ended) return;
      ended = true;
      document.removeEventListener('keydown', onKey);
      if (!answers.length) { document.body.classList.remove('in-lesson'); location.hash = '#/learn'; window.APP.render(); return; }
      const out = G.finishSession({ mode, section, level: opts.level, replay: !!opts.replay, answers, ms: Date.now() - t0, maxCombo, quit });
      window.APP.afterSession(out);
      results(out, quit, opts);
    }

    draw();
  }

  // ---------- After the lesson ----------
  function results(out, quit, opts) {
    const app = $('#app'), s = G.s;
    const stages = [];
    stages.push(() => completeStage(out, quit, opts));
    if (out.levelUp) stages.push(() => levelUpStage(out.levelUp));
    if (out.streak) stages.push(() => streakStage(out));
    if (out.quests.length || out.goalReachedNow) stages.push(() => questStage(out));
    out.achievements.forEach(g => stages.push(() => achievementStage(g)));
    let i = 0;
    function show() {
      const st = stages[i]();
      app.innerHTML = `<div class="result">${st.html}<div class="result-foot"><button class="btn green wide" id="cont">Continue</button></div></div>`;
      st.after && st.after(app);
      $('#cont').addEventListener('click', () => {
        i++;
        if (i < stages.length) show();
        else { document.body.classList.remove('in-lesson'); location.hash = opts.mode === 'daily' ? '#/quests' : '#/learn'; window.APP.render(); }
      });
      $('#cont').focus({ preventScroll: true });
    }
    show();
  }

  function completeStage(out, quit, opts) {
    const s = G.s;
    const acc = out.total ? Math.round((100 * out.correct) / out.total) : 0;
    let title = 'Lesson complete!', mood = 'happy', party = true, sub = '';
    if (quit) { title = 'Session ended'; mood = 'normal'; party = false; sub = 'Nice effort. Finish a whole lesson to keep your streak and level up.'; }
    else if (out.mode === 'challenge' || out.mode === 'jump') {
      party = !!out.passed; mood = out.passed ? 'happy' : 'sad';
      title = out.passed ? (out.mode === 'jump' ? 'You jumped ahead!' : 'Level challenge passed!') : 'Not quite yet';
      sub = out.passed ? '' : `You needed ${out.need} of ${out.total} correct. Keep practicing and try again!`;
    }
    else if (out.mode === 'hunt') { title = 'Training complete!'; sub = `Your ${esc(G.typeName(opts.section, opts.skill))} scent just got stronger.`; }
    else if (out.mode === 'daily') { title = 'Daily Challenge done!'; sub = `You scored ${out.correct} of ${out.total}. See how your pack did.`; }
    else if (out.mode === 'review') { title = 'Review complete!'; sub = 'Each correct answer earned you a heart back.'; }
    else if (out.wrong === 0 && out.total >= G.LESSON_SIZE) title = 'Perfect lesson!';
    const extras = [];
    if (s.combo >= 3) extras.push(`<div class="banner orange">${ICON.flame()} <b>${s.combo}</b> correct in a row and counting!</div>`);
    if (out.treats) extras.push(`<div class="banner treat">${ICON.treat()} +${out.treats} dog treats${out.wrong === 0 && out.total >= G.LESSON_SIZE ? ' (perfect bonus!)' : ''}</div>`);
    if (out.score && out.score.ratingAfter != null && out.score.ratingAfter !== out.score.ratingBefore) {
      const diff = out.score.ratingAfter - out.score.ratingBefore;
      extras.push(`<div class="banner blue">${out.score.section === 'math' ? '📐 Math' : '📖 R&W'} rating <b>${out.score.ratingBefore} → ${out.score.ratingAfter}</b><small>/800</small> <span class="${diff > 0 ? 'up' : 'down'}">${diff > 0 ? '▲' : '▼'}${Math.abs(diff)}</span></div>`);
    }
    const accWord = acc === 100 ? 'Amazing' : acc >= 80 ? 'Great' : acc >= 60 ? 'Good' : 'Accuracy';
    return {
      html: `<div class="result-body">
        <div class="result-duo ${party ? 'bounce' : ''}">${U.duo({ mood, hatA: party && out.wrong === 0 ? 'headphones' : null })}</div>
        <h1 class="result-title ${party ? 'gold-text' : ''}">${title}</h1>
        ${sub ? `<p class="muted">${sub}</p>` : ''}
        <div class="stat-tiles">
          <div class="tile-stat gold"><div class="ts-label">Total XP</div><div class="ts-val">${ICON.bolt()}<span id="xpv">0</span></div></div>
          <div class="tile-stat green"><div class="ts-label">${accWord}</div><div class="ts-val">🎯<span>${acc}%</span></div></div>
          <div class="tile-stat blue"><div class="ts-label">Time</div><div class="ts-val">⏱️<span>${U.fmtDur(out.ms)}</span></div></div>
        </div>
        <details class="xp-parts"><summary>XP breakdown</summary>${out.xpParts.map(([k, v]) => `<div><span>${k}</span><b>${typeof v === 'number' ? '+' + v : v}</b></div>`).join('')}</details>
        <div class="banners">${extras.join('')}</div>
        ${G.fullness() < 35 ? `<p class="hungry-hint">${ICON.bowl('#ff9600')} Your dog is hungry! Feed it in the Doghouse.</p>` : ''}
      </div>`,
      after: app => { U.countUp($('#xpv', app), out.xp); if (party) { U.sound('complete'); setTimeout(() => U.confetti(), 150); } }
    };
  }

  function levelUpStage(lu) {
    const spec = G.levelSpec(lu.section, lu.level);
    const D = window.DOGS;
    const secName = lu.section === 'math' ? 'Math' : 'Reading & Writing';
    return {
      html: `<div class="result-body">
        <div class="kicker-chip" style="--u:${spec.color}">${esc(secName)} · ${esc(spec.className)}</div>
        <div class="levelup-dog pop">${U.dog({ breed: spec.breed, hat: spec.top ? 'crown' : null }, { mood: 'love', body: true })}</div>
        <h1 class="result-title gold-text">${spec.top ? `Top Dog ★${spec.rank}!` : `Level ${lu.level}: ${esc(D.BY_ID[spec.breed].name)}!`}</h1>
        <p class="muted">You earned the <b>${esc(lu.earned)}</b> badge · +${lu.treats} ${ICON.treat()}</p>
        <div class="dials">
          <div><b>${spec.types.length}</b><small>question types</small></div>
          <div><b>${spec.n}</b><small>questions per lesson</small></div>
          <div><b>${esc(G.mixWords(spec.mix))}</b><small>difficulty</small></div>
        </div>
        ${spec.newTypes.length ? `<p>New: ${spec.newTypes.map(k => `<span class="chip new">${esc(G.typeName(lu.section, k))}</span>`).join(' ')}</p>` : ''}
        ${spec.top ? '<p class="muted small">Top Dog ranks never end. Each one focuses on your weakest question types.</p>' : ''}
      </div>`,
      after: () => { U.sound('complete'); U.confetti(160); }
    };
  }

  function streakStage(out) {
    const s = G.s, t = G.today();
    const monday = G.weekOf(t);
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((l, i) => {
      const d = G.addDays(monday, i);
      const cls = s.streakDays.includes(d) ? 'done' : s.frozenDays.includes(d) ? 'frozen' : d === t ? 'today' : '';
      return `<div class="wk ${cls}"><span>${l}</span><i>${cls === 'done' ? ICON.check() : cls === 'frozen' ? '❄️' : ''}</i></div>`;
    }).join('');
    const msg = out.streak === 1 ? 'Streak started! Come back tomorrow to keep it going.'
      : `You're on fire! Practice every day to build your streak.`;
    return {
      html: `<div class="result-body">
        <div class="big-flame">${ICON.flame()}</div>
        <div class="streak-num" id="sn">${out.streak - 1}</div>
        <h1 class="result-title orange-text">day streak!</h1>
        <div class="week-row">${days}</div>
        <p class="muted">${msg}</p>
        ${out.streakTreats ? `<div class="banner gold">🎉 ${out.streak}-day milestone · +${out.streakTreats} ${ICON.treat()}</div>` : ''}
      </div>`,
      after: app => { setTimeout(() => { const el = $('#sn', app); if (!el) return; el.textContent = out.streak; el.classList.add('pop'); U.sound('combo'); }, 500); }
    };
  }

  function questStage(out) {
    const s = G.s;
    const goalPct = Math.min(1, G.todayXp() / s.goal);
    return {
      html: `<div class="result-body">
        <h1 class="result-title">${out.goalReachedNow ? 'Daily goal reached! 🎉' : 'Quest complete!'}</h1>
        <div class="goal-mini">${U.ring(goalPct, 84, '#ffc800', `<text x="42" y="48" text-anchor="middle" font-size="16" font-weight="800" fill="currentColor">${Math.round(goalPct * 100)}%</text>`)}
          <div><b>${G.todayXp()} / ${s.goal} XP</b><div class="muted small">today's goal</div></div></div>
        <div class="quest-list">${window.SCREENS.questRows(true)}</div>
      </div>`,
      after: app => { window.SCREENS.bindQuestClaims(app); if (out.goalReachedNow) U.sound('complete'); }
    };
  }

  function achievementStage(g) {
    return {
      html: `<div class="result-body">
        <div class="ach-big pop">${g.a.icon}<span class="ach-lvl">${g.a.tiers.length > 1 ? 'LEVEL ' + g.level : ''}</span></div>
        <h1 class="result-title">Achievement unlocked!</h1>
        <h2>${esc(g.a.name)}</h2>
        <p class="muted">${esc(g.a.text(g.a.tiers[g.level - 1]))}</p>
        <div class="banner gold">+${g.treats} ${ICON.treat()}</div>
      </div>`,
      after: () => { U.sound('chest'); U.confetti(80); }
    };
  }

  window.LESSON = { start };
})();
