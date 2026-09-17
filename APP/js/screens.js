/* Screens: welcome, learn path, leagues, quests, squad, shop, profile, and shared sheets. */
(function () {
  'use strict';
  const S = window.SAT, G = window.GAME, U = window.UI, B = window.BACKEND;
  const { esc, $, $$, ICON } = U;
  const COURSE_NAME = { math: 'Math', rw: 'Reading & Writing' };
  const D = window.DOGS, M = D.MASCOTS;
  // A dog's hunger for anyone in the pack (self uses live local state).
  const hungerOf = data => G.hungerState(data && data.me ? G.fullness() : G.fullnessAt(data && data.fullness));
  const moodOf = data => hungerOf(data).mood;
  const X_PATTERN = [0, 52, 78, 52, 0, -52, -78, -52];

  // ================= Welcome / onboarding =================
  function welcome(app, joinCode) {
    const known = Object.entries(G.profiles.list);
    const draft = { name: '', breed: 'shihtzu', colors: null, goal: 100, course: 'math', squad: joinCode ? 'join' : null, code: joinCode || '', squadName: '' };
    let step = 0;

    function frame(inner, opts) {
      opts = opts || {};
      app.innerHTML = `<div class="welcome">
        ${opts.progress != null ? `<div class="ob-top"><button class="icon-btn" id="ob-back" aria-label="Back">←</button><div class="progress"><div class="progress-fill" style="width:${opts.progress}%"></div></div></div>` : ''}
        <div class="ob-body">${inner}</div>
        ${opts.cta ? `<div class="ob-foot"><button class="btn green wide" id="ob-next" ${opts.disabled ? 'disabled' : ''}>${opts.cta}</button></div>` : ''}
      </div>`;
      const back = $('#ob-back'); if (back) back.addEventListener('click', () => { step = Math.max(0, step - 1); draw(); });
    }
    const bubble = (text, mood) => `<div class="speech"><div class="speech-duo">${U.duo({ mood: mood || 'happy' })}</div><div class="bubble">${text}</div></div>`;

    function draw() {
      if (step === 0) {
        app.innerHTML = `<div class="welcome hero">
          <div class="hero-duo bounce">${U.duo({ mood: 'happy', hatA: 'headphones', neckB: 'note' })}</div>
          <h1 class="brand-big">🐾 Fetch 1600</h1>
          <p class="hero-sub">Join ${esc(M.maltese)} and ${esc(M.shihtzu)}'s pack: the fun, free, daily way to crush the SAT with your friends.</p>
          ${joinCode ? `<p class="chip gold">You've been invited to pack ${esc(joinCode)}!</p>` : ''}
          <div class="stack narrow">
            <button class="btn green wide" id="go">Get started</button>
            ${B.mode === 'cloud' ? '<button class="btn ghost wide" id="transfer">I have a transfer code</button>' : ''}
          </div>
          ${known.length ? `<div class="known"><p class="muted small">Or continue as</p>${known.map(([id, name]) => `<button class="known-row" data-id="${id}">${U.dog((JSON.parse(localStorage.getItem('satquest.p.' + id) || '{}').avatar) || {}, {})}<b>${esc(name)}</b><span>›</span></button>`).join('')}</div>` : ''}
        </div>`;
        $('#go').addEventListener('click', () => { step = 1; draw(); });
        $$('.known-row').forEach(b => b.addEventListener('click', () => { G.load(b.dataset.id); window.APP.boot(joinCode); }));
        const tr = $('#transfer'); if (tr) tr.addEventListener('click', transferSheet);
        return;
      }
      if (step === 1) {
        frame(`${bubble(`Woof! We're ${esc(M.maltese)} and ${esc(M.shihtzu)}. What should your friends call you?`)}
          <input class="big-input" id="name" maxlength="24" placeholder="Your first name or nickname" value="${esc(draft.name)}" autocomplete="off">
          <p class="muted small">Your pack sees this name. No email or password needed.</p>`, { progress: 15, cta: 'Continue', disabled: !draft.name.trim() });
        const inp = $('#name'), nx = $('#ob-next');
        inp.focus();
        inp.addEventListener('input', () => { draft.name = inp.value; nx.disabled = !inp.value.trim(); });
        inp.addEventListener('keydown', e => { if (e.key === 'Enter' && inp.value.trim()) nx.click(); });
        nx.addEventListener('click', () => { step = 2; draw(); });
        return;
      }
      if (step === 2) {
        frame(`${bubble(`Nice to meet you, ${esc(draft.name.trim())}! Everyone in the pack is a dog. Which one are you?`)}
          <div class="breed-grid">${breedButtons(draft)}</div>`, { progress: 30, cta: 'Continue' });
        bindBreeds(app, draft, () => { const y = window.scrollY; draw(); window.scrollTo(0, y); });
        $('#ob-next').addEventListener('click', () => { step = 3; draw(); window.scrollTo(0, 0); });
        return;
      }
      if (step === 3) {
        frame(`<div class="mix-hero">${U.dog(draft, { mood: 'happy', body: true })}<h2>${esc(D.BY_ID[draft.breed].name)}</h2></div>
          <p class="center muted">Want a different color mix? It's optional.</p>
          <div class="mixer">${colorMixer(draft, null)}</div>`, { progress: 45, cta: 'Continue' });
        bindMixer(app, draft, null, () => { const y = window.scrollY; draw(); window.scrollTo(0, y); });
        $('#ob-next').addEventListener('click', () => { step = 4; draw(); window.scrollTo(0, 0); });
        return;
      }
      if (step === 4) {
        frame(`${bubble("What's your daily goal?")}
          <div class="options">${G.GOALS.map(g => `<button class="option ${draft.goal === g.xp ? 'on' : ''}" data-g="${g.xp}"><b>${g.name}</b><span>${g.xp} XP · ${g.about}</span></button>`).join('')}</div>`, { progress: 60, cta: 'Continue' });
        $$('.option').forEach(b => b.addEventListener('click', () => { draft.goal = Number(b.dataset.g); draw(); }));
        $('#ob-next').addEventListener('click', () => { step = 5; draw(); });
        return;
      }
      if (step === 5) {
        frame(`${bubble('Where do you want to start?')}
          <div class="options">
            <button class="option ${draft.course === 'math' ? 'on' : ''}" data-c="math"><b>📐 Math</b><span>Algebra, advanced math, data analysis, geometry</span></button>
            <button class="option ${draft.course === 'rw' ? 'on' : ''}" data-c="rw"><b>📖 Reading & Writing</b><span>Vocabulary, evidence, grammar, transitions</span></button>
          </div><p class="muted small">You can switch anytime. Both count toward your streak and league.</p>`, { progress: 80, cta: 'Continue' });
        $$('.option').forEach(b => b.addEventListener('click', () => { draft.course = b.dataset.c; draw(); }));
        $('#ob-next').addEventListener('click', () => { step = 6; draw(); });
        return;
      }
      if (step === 6) {
        frame(`${bubble('Studying is better as a pack. Join your friends!')}
          <div class="options">
            <button class="option ${draft.squad === 'join' ? 'on' : ''}" data-s="join"><b>🤝 Join a pack</b><span>A friend gave you a 6-letter code</span></button>
            ${draft.squad === 'join' ? `<input class="big-input code" id="code" maxlength="6" placeholder="ABC123" value="${esc(draft.code)}" autocomplete="off">` : ''}
            <button class="option ${draft.squad === 'create' ? 'on' : ''}" data-s="create"><b>🚀 Start a new pack</b><span>Get a code to share with your friends</span></button>
            ${draft.squad === 'create' ? `<input class="big-input" id="sqname" maxlength="30" placeholder="Pack name, like The 1600 Club" value="${esc(draft.squadName)}" autocomplete="off">` : ''}
            <button class="option ${draft.squad === 'none' ? 'on' : ''}" data-s="none"><b>🦊 Maybe later</b><span>Play solo for now</span></button>
          </div>
          <p class="err" id="err"></p>`, { progress: 95, cta: "Let's go!" });
        $$('.option').forEach(b => b.addEventListener('click', () => { draft.squad = b.dataset.s; draw(); const f = $('#code') || $('#sqname'); if (f) f.focus(); }));
        const code = $('#code'); if (code) code.addEventListener('input', () => { code.value = code.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); draft.code = code.value; });
        const sqn = $('#sqname'); if (sqn) sqn.addEventListener('input', () => { draft.squadName = sqn.value; });
        $('#ob-next').addEventListener('click', finish);
      }
    }

    async function finish() {
      const btn = $('#ob-next'), err = $('#err');
      btn.disabled = true; err.textContent = '';
      let squad = null;
      try {
        if (draft.squad === 'join') {
          if (draft.code.length !== 6) throw new Error('Pack codes have 6 letters and numbers.');
          squad = await B.getSquad(draft.code);
          if (!squad) throw new Error(B.mode === 'local' ? "No pack with that code on this device. (Friends on other phones need the pack server; see README.)" : 'No pack with that code. Check it and try again.');
        } else if (draft.squad === 'create') {
          squad = await B.createSquad(draft.squadName.trim() || `${draft.name.trim()}'s Pack`);
        }
      } catch (e) { err.textContent = e.message; btn.disabled = false; return; }
      const s = G.create(draft.name.trim());
      G.setDog(draft.breed, draft.colors);
      s.goal = draft.goal; s.course = draft.course; s.squad = squad;
      G.tick(); G.save();
      history.replaceState(null, '', location.pathname + '#/learn');
      await window.APP.sync();
      if (squad) B.post(s, 'joined', {}).catch(() => {});
      window.APP.boot();
      if (squad && draft.squad === 'create') setTimeout(() => inviteSheet(), 400);
    }
    draw();
  }

  function transferSheet() {
    const sh = U.sheet(`<h2>Move your progress</h2>
      <p class="muted">On your old device, open Profile → Settings → Transfer code, then enter it here.</p>
      <input class="big-input" id="tcode" placeholder="Paste transfer code" autocomplete="off">
      <p class="err" id="terr"></p>
      <button class="btn green wide" id="tgo">Restore my progress</button>`);
    $('#tgo', sh.el).addEventListener('click', async () => {
      const raw = $('#tcode', sh.el).value.trim();
      const [id, secret] = raw.split('.');
      try {
        if (!id || !secret) throw new Error('That code does not look right.');
        const data = await B.restore(id, secret);
        if (!data || !data.id) throw new Error('Transfer code not found.');
        G.adopt(data); sh.close(); window.APP.boot(); U.toast(`Welcome back, ${esc(data.name)}!`);
      } catch (e) { $('#terr', sh.el).textContent = e.message; }
    });
  }

  // ================= Top bar =================
  function topbar(tab) {
    const s = G.s, h = G.hearts();
    const doneToday = s.lastLessonDay === G.today();
    const hunger = G.hungerState(G.fullness());
    return `<header class="topbar">
      ${tab === 'learn' ? `<button class="course-btn" id="course">${s.course === 'math' ? '📐' : '📖'} <span>${COURSE_NAME[s.course]}</span> ▾</button>` : `<div class="top-title">${{ leagues: 'Leagues', quests: 'Quests', squad: 'Pack', shop: 'Doghouse', profile: 'Profile', tracker: 'Scent Tracker', practice: 'Practice' }[tab] || ''}</div>`}
      <div class="stats">
        ${G.boostActive() ? `<span class="stat boost" title="Double XP active">${ICON.bolt()}<b>2×</b></span>` : ''}
        <button class="stat" id="st-streak" title="Streak">${ICON.flame(doneToday)}<b class="${doneToday ? 'orange-text' : 'muted'}">${s.streak}</b></button>
        <button class="stat" id="st-treats" title="Dog treats">${ICON.treat()}<b class="treat-text">${s.treats.toLocaleString()}</b></button>
        <button class="stat ${hunger.min < 35 ? 'alert' : ''}" id="st-dog" title="Your dog is ${hunger.name.toLowerCase()}">${ICON.bowl(hunger.color)}</button>
        <button class="stat" id="st-hearts" title="Hearts">${ICON.heart(h > 0)}<b class="red-text">${h}</b></button>
      </div>
    </header>`;
  }
  function bindTopbar(app) {
    const c = $('#course', app);
    if (c) c.addEventListener('click', () => {
      const sh = U.sheet(`<h2>Choose a course</h2><div class="options">
        ${['math', 'rw'].map(k => `<button class="option ${G.s.course === k ? 'on' : ''}" data-c="${k}"><b>${k === 'math' ? '📐' : '📖'} ${COURSE_NAME[k]}</b><span>${courseSummary(k)}</span></button>`).join('')}</div>`);
      $$('[data-c]', sh.el).forEach(b => b.addEventListener('click', () => { G.s.course = b.dataset.c; G.save(); sh.close(); window.APP.render(); }));
    });
    $('#st-streak', app).addEventListener('click', streakSheet);
    $('#st-treats', app).addEventListener('click', () => { location.hash = '#/shop'; });
    $('#st-hearts', app).addEventListener('click', heartsSheet);
    $('#st-dog', app).addEventListener('click', () => { location.hash = '#/shop'; });
  }
  function courseSummary(sec) {
    const L = G.pathOf(sec).level;
    return `Level ${L}: ${G.levelName(sec, L)} · rating ${G.sectionRating(sec)}/800`;
  }

  function streakSheet() {
    const s = G.s, t = G.today();
    const doneToday = s.lastLessonDay === t;
    U.sheet(`<div class="center">
      <div class="big-flame sm">${ICON.flame(doneToday)}</div>
      <h2>${s.streak} day streak</h2>
      <p class="muted">${doneToday ? "You've extended your streak today. See you tomorrow!" : s.streak ? `Do a lesson today to make it ${s.streak + 1}!` : 'Do a lesson today to start a streak.'}</p>
      ${calendar()}
      <div class="info-row">❄️ <b>${s.freezes} / ${G.MAX_FREEZES}</b> streak freezes equipped <a href="#/shop" class="link">Get more</a></div>
      <p class="muted small">A streak freeze is used automatically if you miss a day. Best streak: ${s.bestStreak} days.</p>
    </div>`);
  }
  function calendar() {
    const s = G.s, now = new Date();
    const y = now.getFullYear(), m = now.getMonth();
    const first = new Date(y, m, 1), days = new Date(y, m + 1, 0).getDate();
    const lead = (first.getDay() + 6) % 7;
    const cells = [];
    for (let i = 0; i < lead; i++) cells.push('<i></i>');
    for (let d = 1; d <= days; d++) {
      const key = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const cls = s.streakDays.includes(key) ? 'done' : s.frozenDays.includes(key) ? 'frozen' : key === G.today() ? 'today' : '';
      cells.push(`<i class="${cls}">${d}</i>`);
    }
    return `<div class="cal"><div class="cal-head">${now.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</div>
      <div class="cal-grid">${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => `<b>${d}</b>`).join('')}${cells.join('')}</div></div>`;
  }

  function heartsSheet() {
    const s = G.s, h = G.hearts();
    const next = G.msToNextHeart();
    const sh = U.sheet(`<div class="center">
      <div class="hearts-row">${Array.from({ length: G.MAX_HEARTS }, (_, i) => ICON.heart(i < h)).join('')}</div>
      <h2>${h === G.MAX_HEARTS ? 'You have full hearts' : h === 0 ? 'Out of hearts!' : `${h} hearts left`}</h2>
      <p class="muted">${h < G.MAX_HEARTS ? `Next heart in ${U.fmtLeft(next)}. ` : ''}Each wrong answer in a lesson costs a heart, so read carefully instead of guessing.</p>
      <ul class="rules">
        <li><b>At 0 hearts</b> the lesson stops. Refill to keep going, or end it and keep the XP you earned (the lesson won't count toward your level or streak).</li>
        <li><b>Get hearts back:</b> 1 every hour, 1 for each correct answer in Mistakes review, or a full refill for ${G.PRICES.hearts} treats.</li>
        <li>The Daily Challenge and Mistakes review never cost hearts.</li>
      </ul>
      <div class="stack">
        <button class="btn blue wide" data-refill ${h >= G.MAX_HEARTS || s.treats < G.PRICES.hearts ? 'disabled' : ''}>Refill hearts · ${ICON.treat()} ${G.PRICES.hearts}</button>
        <button class="btn ghost wide" data-review>Mistakes review · earn hearts</button>
      </div></div>`);
    $('[data-refill]', sh.el).addEventListener('click', () => { const e = G.buy('hearts'); if (e) U.toast(esc(e)); else { U.sound('chest'); sh.close(); window.APP.render(); } });
    $('[data-review]', sh.el).addEventListener('click', () => { sh.close(); window.LESSON.start({ mode: 'review', section: null }); });
  }

  // ================= Section ratings bar (200-800 per section) =================
  function scoreStrip() {
    const bar = sec => {
      const v = G.sectionRating(sec);
      return `<div class="sc sc-${sec}"><div class="sc-top"><span>${sec === 'math' ? '📐 Math' : '📖 R&W'}</span><b>${v}<small>/800</small></b></div>
        <div class="sc-bar"><i style="width:${Math.max(2, ((v - 200) / 600) * 100)}%"></i></div></div>`;
    };
    return `<button class="score-strip" id="scores" aria-label="Ratings">${bar('math')}${bar('rw')}</button>`;
  }
  function scoreSheet() {
    const m = G.sectionRating('math'), r = G.sectionRating('rw'), all = G.overallRating(), tt = G.ratingTitle(all, true);
    U.sheet(`<div class="center"><div class="sheet-duo">${U.duo({ mood: 'happy', outfitA: 'varsity', outfitB: 'tshirt' })}</div>
      <h2>Rating: ${all}<small class="muted"> / 1600</small></h2><p><span class="rating-chip" style="--c:${tt.color}">${tt.name}</span></p></div>
      <div class="score-rows"><div><span>📐 Math</span><b>${m} / 800</b></div><div><span>📖 Reading & Writing</span><b>${r} / 800</b></div></div>
      <div class="note"><b>This is not your SAT score.</b> It doesn't predict what you'd get on the real test. It's a practice rating that works like a chess rating: beating hard questions raises it the most, and 800 means you almost always get hard questions right. The more you practice and improve, the better your chance of scoring high on the real SAT.</div>
      <p class="muted small">Each section rating combines your rating in every question type (see the Scent Tracker), weighted by how much of the real test each area covers. For a real estimate, take a timed practice test on the SAT Prep site or in College Board's Bluebook app.</p>
      <a class="btn blue wide" href="#/tracker">Open Scent Tracker</a>`);
  }

  // ================= Learn (the breed path) =================
  // Levels are dog breeds from toy dogs to Top Dog; after Level 20 the Top Dog ranks never end.
  function learn(app) {
    const s = G.s, sec = s.course;
    const st = G.pathOf(sec), L = st.level;
    const spec = G.levelSpec(sec, L);
    const secName = COURSE_NAME[sec];

    // Badge shelf: breeds already earned in this section.
    const earned = Array.from({ length: L - 1 }, (_, i) => i + 1);
    const shelf = earned.length ? `<div class="shelf" aria-label="Breed badges">${earned.slice(-40).reverse().map(l => {
      const sp = G.levelSpec(sec, l);
      return `<button class="badge-dog" data-replay="${l}" title="Level ${l}: ${esc(G.levelName(sec, l))}">${U.dog({ breed: sp.breed, hat: sp.top ? 'crown' : null }, { mood: 'happy' })}<span>${sp.top ? '★' + sp.rank : l}</span></button>`;
    }).join('')}</div>` : '';

    // Nodes for the current level: lessons, a treat bag after lesson 2, then the level challenge.
    const nodes = [];
    for (let i = 0; i < spec.lessons; i++) {
      nodes.push({ type: 'lesson', i, state: i < st.done ? 'done' : i === st.done ? 'active' : 'locked' });
      if (i === G.BAG_AFTER - 1) nodes.push({ type: 'bag', state: st.bag ? 'opened' : st.done >= G.BAG_AFTER ? 'active' : 'locked' });
    }
    nodes.push({ type: 'challenge', state: st.done >= spec.lessons ? 'active' : 'locked' });
    const firstActive = nodes.find(n => n.state === 'active' && n.type !== 'bag') || nodes.find(n => n.state === 'active');
    let k = 0;
    const nodesHtml = nodes.map((n, idx) => {
      const x = X_PATTERN[k++ % X_PATTERN.length];
      let cls = 'locked', inner = ICON.lock(), label = '', bubble = '';
      if (n.type === 'lesson') {
        label = `Lesson ${n.i + 1}`;
        if (n.state === 'done') { cls = 'gold'; inner = ICON.check(); }
        if (n.state === 'active') { cls = 'open'; inner = ICON.star(); }
      } else if (n.type === 'bag') {
        cls = `chest ${n.state === 'active' ? 'open' : n.state === 'opened' ? 'opened' : 'locked'}`;
        inner = ICON.chest(n.state === 'opened');
      } else {
        label = spec.top ? `Top Dog ★${spec.rank} challenge` : `${D.BY_ID[spec.breed].name} challenge`;
        cls = `trophy ${n.state === 'active' ? 'open' : 'locked'}`;
        inner = ICON.trophy(n.state === 'active');
      }
      if (n === firstActive) bubble = `<div class="start-bubble">${n.type === 'challenge' ? 'CHALLENGE' : n.type === 'bag' ? 'OPEN' : st.done ? 'CONTINUE' : 'START'}</div>`;
      const deco = idx === 1 ? `<div class="path-dog ${x >= 0 ? 'left' : 'right'}">${U.dog({ breed: spec.breed, hat: spec.top ? 'crown' : null }, { mood: 'happy', body: true })}</div>` : '';
      return `<div class="node-wrap ${n === firstActive ? 'active' : ''}" style="--x:${x}px">${bubble}
        <div class="node-ring"><button class="node ${cls}" data-node="${n.type}" data-i="${n.i == null ? '' : n.i}" data-state="${n.state}" aria-label="${esc(label || 'Treat bag')}">${inner}</button></div>
        ${label ? `<div class="node-label">${esc(label)}</div>` : ''}</div>${deco}`;
    }).join('');

    const upcoming = [L + 1, L + 2].map(l => {
      const sp = G.levelSpec(sec, l);
      return `<div class="next-level" style="--u:${sp.color}">
        <div class="nl-dog">${U.dog({ breed: sp.breed, hat: sp.top ? 'crown' : null }, {})}</div>
        <div class="nl-main"><div class="unit-kicker">${esc(sp.className)} · Level ${l}</div><b>${esc(G.levelName(sec, l))}</b>
          <small>${sp.types.length} question types · ${sp.n} questions · ${esc(G.mixWords(sp.mix))}</small></div>
        <button class="btn ghost sm" data-jump="${l}">Jump here</button></div>`;
    }).join('');

    app.innerHTML = `${topbar('learn')}
      ${scoreStrip()}
      <div class="learn-layout">
        <div class="path">
          ${shelf}
          <section class="unit" style="--u:${spec.color}">
            <div class="unit-head">
              <div><div class="unit-kicker">${esc(secName)} · ${esc(spec.className)} · Level ${L}</div>
                <h2>${spec.top ? `Top Dog ★${spec.rank}` : esc(D.BY_ID[spec.breed].name)}</h2>
                <div class="unit-sub">${spec.types.length} question types · ${spec.n} questions · ${esc(G.mixWords(spec.mix))}</div></div>
              <button class="unit-guide" id="level-info" aria-label="About this level">📘</button></div>
            <div class="nodes">${nodesHtml}</div>
          </section>
          <div class="section-head"><h2>Coming up</h2><span class="muted small">Levels never run out 🐾</span></div>
          ${upcoming}
        </div>
      </div>`;
    bindTopbar(app);
    $('#scores', app).addEventListener('click', scoreSheet);
    $('#level-info', app).addEventListener('click', () => levelSheet(sec, L));
    $$('[data-node]', app).forEach(b => b.addEventListener('click', () => nodeSheet(sec, spec, b.dataset.node, Number(b.dataset.i), b.dataset.state)));
    $$('[data-replay]', app).forEach(b => b.addEventListener('click', () => replaySheet(sec, Number(b.dataset.replay))));
    $$('[data-jump]', app).forEach(b => b.addEventListener('click', () => jumpSheet(sec, Number(b.dataset.jump))));
    const active = $('.node-wrap.active', app);
    if (active && learn.scrolledFor !== `${sec}${L}`) { learn.scrolledFor = `${sec}${L}`; setTimeout(() => active.scrollIntoView({ block: 'center' }), 30); }
  }

  function typeChips(sec, spec) {
    return `<div class="type-chips">${spec.types.map(k => `<span class="chip ${spec.newTypes.includes(k) ? 'new' : ''}">${esc(G.typeName(sec, k))}${spec.newTypes.includes(k) ? ' · NEW' : ''}</span>`).join('')}</div>`;
  }
  function levelSheet(sec, L) {
    const spec = G.levelSpec(sec, L);
    U.sheet(`<div class="node-sheet" style="--u:${spec.color}">
      <div class="ns-kicker">${esc(COURSE_NAME[sec])} · ${esc(spec.className)} · Level ${L}</div>
      <h2>${esc(G.levelName(sec, L))}</h2>
      <div class="dials">
        <div><b>${spec.types.length}</b><small>question types</small></div>
        <div><b>${spec.n}</b><small>questions per lesson</small></div>
        <div><b>${esc(G.mixWords(spec.mix))}</b><small>difficulty</small></div>
      </div>
      ${typeChips(sec, spec)}
      <p class="muted small">Finish ${spec.lessons} lessons, then pass the ${spec.challengeN}-question level challenge (${Math.ceil(spec.challengeN * G.CHALLENGE_PASS)} correct) to earn this breed's badge. Each level adds question types, more questions, or harder questions. ${spec.top ? 'Top Dog ranks never end and focus on your weakest question types.' : 'After Level 20 (German Shepherd) come the never-ending Top Dog ranks.'}</p></div>`);
  }
  function nodeSheet(sec, spec, type, i, state) {
    const s = G.s, L = spec.level;
    if (type === 'bag') {
      if (state === 'locked') return U.toast(`Finish ${G.BAG_AFTER} lessons to open this treat bag!`);
      if (state === 'opened') return U.toast('You already opened this treat bag.');
      const treats = G.openBag(sec);
      U.sound('chest'); U.confetti(70);
      U.sheet(`<div class="center"><div class="chest-big pop">${ICON.chest(true)}</div><h2>You found ${treats} treats!</h2><p class="muted">Feed your dog or buy gear in the Doghouse.</p></div>`, { onClose: () => window.APP.render() });
      return;
    }
    if (state === 'locked') return U.toast(type === 'challenge' ? `Finish all ${spec.lessons} lessons to unlock the challenge.` : 'Finish the lesson before this one first.');
    let body;
    if (type === 'challenge') {
      const need = Math.ceil(spec.challengeN * G.CHALLENGE_PASS);
      body = `<p>${spec.challengeN} questions from this level. Get <b>${need}</b> right to earn the badge and move up to <b>Level ${L + 1}: ${esc(G.levelName(sec, L + 1))}</b>.</p>
        <button class="btn gold wide" data-go="challenge">Start challenge · 1.5× XP</button>`;
    } else if (state === 'done') {
      body = `<p class="muted">You finished this lesson. Practice it again for XP and a stronger scent.</p><button class="btn green wide" data-go="replay">Practice again</button>`;
    } else {
      body = `<p class="muted">Lesson ${i + 1} of ${spec.lessons} · ${spec.n} questions · ${esc(G.mixWords(spec.mix))}</p>${typeChips(sec, spec)}
        <button class="btn green wide" data-go="lesson">Start</button>`;
    }
    const sh = U.sheet(`<div class="node-sheet" style="--u:${spec.color}">
      <div class="ns-kicker">${esc(COURSE_NAME[sec])} · Level ${L} · ${esc(G.levelName(sec, L))}</div>
      <h2>${type === 'challenge' ? 'Level challenge' : `Lesson ${i + 1}`}</h2>${body}</div>`);
    $$('[data-go]', sh.el).forEach(b => b.addEventListener('click', () => {
      sh.close();
      const go = b.dataset.go;
      window.LESSON.start({ mode: go === 'replay' ? 'lesson' : go, section: sec, level: L, replay: go === 'replay' });
    }));
  }
  function replaySheet(sec, L) {
    const spec = G.levelSpec(sec, L);
    const sh = U.sheet(`<div class="center"><div class="sheet-dog">${U.dog({ breed: spec.breed, hat: spec.top ? 'crown' : null }, { mood: 'love', body: true })}</div>
      <h2>${esc(G.levelName(sec, L))} badge</h2><p class="muted">Level ${L} · ${esc(spec.className)} · earned!</p>
      <button class="btn green wide" data-go>Practice this level</button></div>`);
    $('[data-go]', sh.el).addEventListener('click', () => { sh.close(); window.LESSON.start({ mode: 'lesson', section: sec, level: L, replay: true }); });
  }
  function jumpSheet(sec, L) {
    const spec = G.levelSpec(sec, L), test = G.levelSpec(sec, L - 1);
    const need = Math.ceil(test.challengeN * G.JUMP_PASS);
    const sh = U.sheet(`<div class="node-sheet" style="--u:${spec.color}">
      <div class="ns-kicker">${esc(COURSE_NAME[sec])} · Jump ahead</div>
      <h2>Jump to Level ${L}: ${esc(G.levelName(sec, L))}?</h2>
      <p>Take a ${test.challengeN}-question test at Level ${L - 1}'s difficulty. Get <b>${need}</b> right to skip ahead and earn the badges in between.</p>
      <button class="btn blue wide" data-go>Start jump test</button></div>`);
    $('[data-go]', sh.el).addEventListener('click', () => { sh.close(); window.LESSON.start({ mode: 'jump', section: sec, level: L }); });
  }

  // ================= Scent Tracker (proficiency radar maps) =================
  const SHORT = G.TYPE_SHORT;
  const LEVEL_RING = [350, 500, 650, 800];   // radar rings on the 200-800 scale; the edge is 800
  const radius = r => Math.max(0.03, Math.min(1, (r - 200) / 600));

  function radar(sec, color) {
    const types = G.TYPE_ORDER[sec].filter(id => S.countFor(sec, null, id));
    const size = 440, c = size / 2, R = 130, N = types.length;
    const pt = (i, r) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / N; return [c + r * Math.cos(a), c + r * Math.sin(a)]; };
    const ring = f => types.map((_, i) => pt(i, R * f).map(v => v.toFixed(1)).join(',')).join(' ');
    const vals = types.map(k => G.rating(k)), ns = types.map(k => G.attempts(k));
    const poly = vals.map((v, i) => pt(i, R * radius(v)).map(n => n.toFixed(1)).join(',')).join(' ');
    const labels = types.map((k, i) => {
      const [x, y] = pt(i, R + 22);
      const anchor = Math.abs(x - c) < 8 ? 'middle' : x > c ? 'start' : 'end';
      const settling = ns[i] < G.LOW_EVIDENCE;
      return `<text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="${anchor}" class="rl">${esc(SHORT[k] || k)}</text><text x="${x.toFixed(1)}" y="${(y + 18).toFixed(1)}" text-anchor="${anchor}" class="rv ${settling ? 'settling' : ''}">${ns[i] ? vals[i] + (settling ? '?' : '') : '—'}</text>`;
    }).join('');
    return `<svg class="radar" viewBox="0 0 ${size} ${size}" role="img" aria-label="${esc(COURSE_NAME[sec])} rating radar">
      ${LEVEL_RING.map(v => `<polygon points="${ring(radius(v))}" class="rg"/>`).join('')}
      ${types.map((_, i) => { const [x, y] = pt(i, R); return `<line x1="${c}" y1="${c}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" class="rg"/>`; }).join('')}
      ${LEVEL_RING.map(v => `<text x="${c + 3}" y="${(c - R * radius(v) + 11).toFixed(1)}" class="rring">${v}</text>`).join('')}
      <polygon points="${poly}" fill="${color}" fill-opacity=".28" stroke="${color}" stroke-width="3" stroke-linejoin="round"/>
      ${vals.map((v, i) => { const [x, y] = pt(i, R * radius(v)); return ns[i] >= G.LOW_EVIDENCE ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="${color}"/>` : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" fill="var(--surface)" stroke="${color}" stroke-width="2" stroke-dasharray="3 2"/>`; }).join('')}
      ${labels}
    </svg>`;
  }
  const ratingChip = r => { const tt = G.ratingTitle(r); return `<span class="rating-chip" style="--c:${tt.color}">🏅 ${r}/800 · ${tt.name}</span>`; };

  function tracker(app) {
    const s = G.s;
    const card = (sec, color) => {
      const types = G.TYPE_ORDER[sec].filter(id => S.countFor(sec, null, id));
      const rows = types.map(k => ({ k, v: G.rating(k), n: G.attempts(k) }));
      const tried = rows.filter(r => r.n > 0);
      const weakest = (tried.length >= 3 ? tried : rows).slice().sort((a, b) => a.v - b.v || a.n - b.n).slice(0, 3);
      const best = tried.filter(r => r.n >= G.LOW_EVIDENCE).sort((a, b) => b.v - a.v)[0];
      const secR = G.sectionRating(sec);
      return `<div class="card track-card">
        <div class="card-title">${sec === 'math' ? '📐 Math' : '📖 Reading & Writing'}${ratingChip(secR)}</div>
        <p class="muted small track-sub">Path level ${G.pathOf(sec).level}: ${esc(G.levelName(sec, G.pathOf(sec).level))}</p>
        ${radar(sec, color)}
        ${best ? `<p class="center small">💪 Strongest scent: <b>${esc(G.typeName(sec, best.k))}</b> (${best.v})</p>` : '<p class="center muted small">Answer a few questions of a type to see a solid rating.</p>'}
        <h3>🐾 Trails to follow</h3>
        <div class="hunt-list">${weakest.map(r => `<div class="hunt-row"><span>${esc(G.typeName(sec, r.k))}<small class="muted"> · ${r.n ? r.v : 'not tried yet'}</small></span><button class="btn blue sm" data-hunt="${sec}:${r.k}">Train</button></div>`).join('')}</div>
        <details class="all-scents"><summary>All ${types.length} question types</summary>
          ${rows.map(r => { const tt = G.ratingTitle(r.v); const settling = r.n < G.LOW_EVIDENCE; return `<div class="scent-row ${settling ? 'settling' : ''}"><span>${esc(G.typeName(sec, r.k))}</span><span class="scent-bar"><i style="width:${radius(r.v) * 100}%;background:${tt.color}"></i></span><b>${r.v}</b><small style="color:${tt.color}">${tt.name}${settling ? ` · keep sniffing (${r.n}/${G.LOW_EVIDENCE})` : ` · ${r.n} answers`}</small><button class="link" data-hunt="${sec}:${r.k}">Train</button></div>`; }).join('')}
        </details>
      </div>`;
    };
    const overall = G.overallRating(), tt = G.ratingTitle(overall, true);
    app.innerHTML = `${topbar('tracker')}<div class="page">
      <div class="tracker-hero"><div class="tracker-dogs">${U.duo({ mood: 'happy' })}</div>
        <div><h1>Scent Tracker</h1>
          <div class="overall-rating" style="--c:${tt.color}"><span>Overall rating</span><b>${overall}</b><span>/1600</span><em>${tt.name}</em></div>
          <p class="muted small">Ratings work like chess ratings, on the SAT scale: every question type and each section runs <b>200–800</b>, and your overall rating is Math + Reading & Writing, up to <b>1600</b>. Everyone starts at 200. Beating a hard question raises a rating a lot; missing an easy one lowers it a lot. Answering more makes a rating more accurate, not automatically higher. A <b>?</b> or dashed dot means it's still settling. This is a practice rating, not a predicted SAT score.</p>
          <p class="muted small">Titles (per 800): ${G.RATING_TITLES.slice().reverse().map(x => `<span style="color:${x.color};font-weight:900">${x.name}</span>${x.min > -Infinity ? ` ${x.min}+` : ''}`).join(' · ')}</p></div></div>
      <div class="two-col track-grid">${card('rw', '#6366f1')}${card('math', '#38b2f4')}</div>
    </div>`;
    bindTopbar(app);
    $$('[data-hunt]', app).forEach(b => b.addEventListener('click', () => {
      const [sec, skill] = b.dataset.hunt.split(':');
      window.LESSON.start({ mode: 'hunt', section: sec, skill });
    }));
  }

  // ================= Practice =================
  function practice(app) {
    const s = G.s;
    const dailyDone = s.daily && s.daily.day === G.today();
    app.innerHTML = `${topbar('practice')}<div class="page narrow">
      <div class="tracker-hero"><div class="tracker-dogs">${U.duo({ mood: 'happy', outfitA: 'soccer', outfitB: 'tshirt' })}</div>
        <div><h1>Practice</h1><p class="muted">Extra workouts outside the path.</p></div></div>
      <div class="options">
        <button class="option" data-p="daily" ${dailyDone ? 'disabled' : ''}><b>📅 Daily Challenge ${dailyDone ? '· done ✓' : '· 2× XP'}</b><span>The same 5 questions for your whole pack today, Math and Reading & Writing. Who scores best?</span></button>
        <button class="option" data-p="review"><b>🩹 Mistakes review · ${s.mistakes.length}</b><span>Redo questions you missed. No hearts lost, and each correct answer earns one back. Pick Math, Reading & Writing, or both.</span></button>
        <button class="option" data-p="hunt"><b>🐾 Train your weakest scent</b><span>Five questions on your weakest question type. Pick Math or Reading & Writing.</span></button>
        <button class="option" data-p="hardmix"><b>💪 Hard mix</b><span>Five tough questions from any question type. Pick Math or Reading & Writing.</span></button>
      </div>
    </div>`;
    bindTopbar(app);
    const go = (mode, sec) => {
      if (mode === 'hunt') {
        const types = G.TYPE_ORDER[sec].filter(id => S.countFor(sec, null, id));
        const tried = types.filter(k => G.attempts(k) > 0);
        const pool = tried.length ? tried : types.slice(0, 2);
        const skill = pool.sort((a, b) => G.rating(a) - G.rating(b))[0];
        return window.LESSON.start({ mode, section: sec, skill });
      }
      window.LESSON.start({ mode, section: sec });
    };
    $$('[data-p]', app).forEach(b => b.addEventListener('click', () => {
      const mode = b.dataset.p;
      // The Daily Challenge stays mixed so the whole pack gets the same questions.
      if (mode === 'daily') return window.LESSON.start({ mode, section: null });
      // Everything else asks which section first.
      const missed = sec => s.mistakes.filter(id => !sec || (S.metaOf(id) || {}).section === sec).length;
      const sub = sec => (mode === 'review' ? `${missed(sec)} missed question${missed(sec) === 1 ? '' : 's'}` : `Rating ${G.sectionRating(sec)}/800`);
      const choices = mode === 'review' ? ['math', 'rw', 'both'] : ['math', 'rw'];
      const title = { hunt: '🐾 Train your weakest scent', hardmix: '💪 Hard mix', review: '🩹 Mistakes review' }[mode];
      const sh = U.sheet(`<h2>${title}</h2>
        <p class="muted">Which section?</p>
        <div class="options">${choices.map(sec => sec === 'both'
          ? `<button class="option" data-sec="both"><b>📐📖 Both</b><span>${missed(null)} missed questions</span></button>`
          : `<button class="option" data-sec="${sec}"><b>${sec === 'math' ? '📐' : '📖'} ${COURSE_NAME[sec]}</b><span>${sub(sec)}</span></button>`).join('')}</div>`);
      $$('[data-sec]', sh.el).forEach(x => x.addEventListener('click', () => {
        sh.close();
        const sec = x.dataset.sec === 'both' ? null : x.dataset.sec;
        if (mode === 'review') return window.LESSON.start({ mode, section: sec });
        go(mode, sec);
      }));
    }));
  }

  // ================= Quests =================
  function questRows(big) {
    const s = G.s;
    return s.quests.list.map((q, i) => {
      const pct = Math.min(1, q.progress / q.target);
      const done = q.progress >= q.target;
      return `<div class="quest ${done ? 'done' : ''}">
        <div class="q-icon">${G.QUEST_KINDS[q.kind].icon}</div>
        <div class="q-main"><div class="q-text">${esc(G.questText(q))}</div>
          <div class="qbar"><div class="qbar-fill" style="width:${pct * 100}%"></div><span>${q.progress} / ${q.target}</span></div></div>
        <div class="q-reward">${q.claimed ? `<span class="claimed">${ICON.check()}</span>` : done ? `<button class="btn gold sm" data-claim="${i}">${ICON.chest(false)}</button>` : `<span class="q-chest">${ICON.chest(false)}</span>`}</div>
      </div>`;
    }).join('');
  }
  function bindQuestClaims(root) {
    $$('[data-claim]', root).forEach(b => b.addEventListener('click', () => {
      const treats = G.claimQuest(Number(b.dataset.claim));
      if (!treats) return;
      U.sound('chest'); U.confetti(60);
      const sh = U.sheet(`<div class="center"><div class="chest-big pop">${ICON.chest(true)}</div><h2>+${treats} treats!</h2><p class="muted">Quest reward collected.</p></div>`);
      b.replaceWith(Object.assign(document.createElement('span'), { className: 'claimed', innerHTML: ICON.check() }));
      const newAch = G.checkAchievements(); G.save();
      newAch.forEach(g => U.toast(`${g.a.icon} <b>${esc(g.a.name)}</b> Level ${g.level} unlocked · +${g.treats} treats`, 3500));
      setTimeout(() => { if (document.body.contains(sh.el)) sh.close(); }, 1800);
      const treatStat = $('#st-treats b'); if (treatStat) treatStat.textContent = G.s.treats.toLocaleString();
    }));
  }

  function quests(app) {
    const s = G.s;
    const pct = Math.min(1, G.todayXp() / s.goal);
    const sq = window.APP.squad;
    const members = squadRows();
    const weekTotal = members.reduce((a, r) => a + r.xp, 0);
    const fqTarget = Math.min(5000, 400 * Math.max(2, members.length));
    const fqDone = weekTotal >= fqTarget;
    const fqClaimed = !!s.friendQuest[G.weekOf()];
    const dailyDone = s.daily && s.daily.day === G.today();
    const dailyBoard = members.filter(r => r.daily && r.daily.day === G.today()).sort((a, b) => b.daily.score - a.daily.score || a.daily.ms - b.daily.ms);

    app.innerHTML = `${topbar('quests')}<div class="page">
      <div class="hero-card gold-bg">
        <div><div class="hc-kicker">Daily goal</div><h2>${pct >= 1 ? 'Goal reached! 🎉' : `${s.goal - G.todayXp()} XP to go`}</h2><p>${G.todayXp()} / ${s.goal} XP today</p></div>
        <div class="hc-ring">${U.ring(pct, 92, '#fff', `<text x="46" y="52" text-anchor="middle" font-size="18" font-weight="900" fill="#fff">${Math.round(pct * 100)}%</text>`)}</div>
      </div>

      <div class="section-head"><h2>Daily quests</h2><span class="muted small">⏳ ${U.fmtLeft(G.msToMidnight())} left</span></div>
      <div class="card quest-list">${questRows(true)}</div>

      <div class="section-head"><h2>Daily Challenge</h2><span class="chip gold">2× XP</span></div>
      <div class="card">
        <p>The same 5 questions for everyone today. Score the most, fastest, to top your pack.</p>
        ${dailyDone ? `<p><b>Your score: ${s.daily.score}/${s.daily.total}</b> in ${U.fmtDur(s.daily.ms)}</p>` : '<button class="btn green wide" id="daily">Play today\'s challenge</button>'}
        ${s.squad ? `<div class="daily-board">${dailyBoard.length ? dailyBoard.map((r, i) => `<div class="mini-row ${r.me ? 'me' : ''}"><span>${['🥇', '🥈', '🥉'][i] || i + 1}</span>${U.dog(r.avatar, {})}<b>${esc(r.name)}</b><span>${r.daily.score}/${r.daily.total} · ${U.fmtDur(r.daily.ms)}</span></div>`).join('') : '<p class="muted small">Nobody in your pack has played yet today. Be first!</p>'}</div>` : ''}
      </div>

      <div class="section-head"><h2>Friends quest</h2><span class="muted small">⏳ ${U.fmtLeft(G.msToWeekEnd())} left</span></div>
      <div class="card">
        ${s.squad ? `<p><b>Earn ${fqTarget.toLocaleString()} XP together this week</b></p>
          <div class="qbar big"><div class="qbar-fill" style="width:${Math.min(100, (100 * weekTotal) / fqTarget)}%"></div><span>${weekTotal.toLocaleString()} / ${fqTarget.toLocaleString()}</span></div>
          <div class="avatars">${members.slice(0, 10).map(r => `<span title="${esc(r.name)}: ${r.xp} XP">${U.dog(r.avatar, {})}</span>`).join('')}</div>
          ${fqDone && !fqClaimed ? '<button class="btn gold wide" id="fq">Claim 50 treats</button>' : fqClaimed ? '<p class="muted">Reward claimed. Great teamwork! 🤝</p>' : '<p class="muted small">Everyone gets 50 treats when the pack reaches the goal.</p>'}`
        : '<p class="muted">Join a pack to team up on a weekly XP goal.</p><a class="btn blue" href="#/squad">Find your pack</a>'}
      </div>
    </div>`;
    bindTopbar(app); bindQuestClaims(app);
    const d = $('#daily', app); if (d) d.addEventListener('click', () => window.LESSON.start({ mode: 'daily' }));
    const fq = $('#fq', app); if (fq) fq.addEventListener('click', () => { s.friendQuest[G.weekOf()] = true; s.treats += 50; G.save(); U.sound('chest'); U.confetti(); window.APP.render(); });
    if (s.squad && !sq.at) window.APP.refreshSquad();
  }

  // ================= Leagues =================
  function squadRows() {
    const s = G.s, sq = window.APP.squad, week = G.weekOf();
    const rows = (sq.players || []).filter(p => p.id !== s.id).map(p => {
      const d = p.data || {};
      return { id: p.id, name: d.name || 'Friend', avatar: d.avatar, xp: d.week === week ? d.weekXp || 0 : 0, tier: d.tier || 0, streak: d.lastLessonDay && G.dayDiff(d.lastLessonDay, G.today()) <= 1 ? d.streak || 0 : 0, doneToday: d.lastLessonDay === G.today(), daily: d.daily, data: d, updated: p.updated_at };
    });
    rows.push({ id: s.id, me: true, name: s.name, avatar: s.avatar, xp: s.weekXp, tier: s.tier, streak: s.streak, doneToday: s.lastLessonDay === G.today(), daily: s.daily, data: Object.assign(G.publicData(), { me: true }) });
    return rows;
  }
  function leagueBoard() { return squadRows().sort((a, b) => b.xp - a.xp || (a.me ? -1 : 1)); }

  function leagues(app) {
    const s = G.s, L = G.LEAGUES[s.tier];
    const board = leagueBoard();
    const n = board.length, zone = Math.max(1, Math.floor(n * 0.3));
    const rows = board.map((r, i) => {
      const rank = i + 1;
      let line = '';
      if (n >= 2 && rank === zone + 1) line = `<div class="zone up">⬆ Promotion zone</div>`;
      if (n >= 5 && rank === n - zone + 1) line += `<div class="zone down">⬇ Demotion zone</div>`;
      return `${line}<div class="lb-row ${r.me ? 'me' : ''} ${rank <= zone && r.xp > 0 ? 'promo' : ''} ${n >= 5 && rank > n - zone ? 'demo' : ''}" data-id="${r.id}">
        <span class="lb-rank">${rank <= 3 && r.xp > 0 ? ['🥇', '🥈', '🥉'][rank - 1] : rank}</span>
        <span class="lb-av">${U.dog(r.avatar, { mood: moodOf(r.data) })}</span>
        <span class="lb-name"><b>${esc(r.name)}${r.me ? ' (you)' : ''}</b><small>${leagueTag(r.tier)}${r.streak ? ` · 🔥 ${r.streak}` : ''}</small></span>
        <span class="lb-xp">${r.xp.toLocaleString()} XP</span></div>`;
    }).join('');
    app.innerHTML = `${topbar('leagues')}<div class="page">
      <div class="shields">${G.LEAGUES.map((l, i) => `<span class="${i === s.tier ? 'cur' : i > s.tier ? 'dim' : ''}">${U.leagueShield(i, i === s.tier ? 56 : 24)}</span>`).join('')}</div>
      <h1 class="center">${L.name} League</h1>
      <p class="center muted">${s.squad ? `${zone === 1 ? 'The top player advances' : `The top ${zone} advance`} to the next league · ⏳ ${U.fmtLeft(G.msToWeekEnd())} left` : 'Leagues are weekly competitions with your pack.'}</p>
      ${s.squad ? `<div class="card lb">${rows}</div>
        ${n < 2 ? `<div class="card center"><p>You're the only one here so far. Invite your friends!</p><button class="btn green" id="invite">Invite friends</button></div>` : ''}
        <p class="muted small center">XP earned Monday–Sunday counts. Top finishers win treats: 🥇 100 · 🥈 60 · 🥉 40. With 5 or more players, the bottom ${zone === 1 ? 'player drops' : zone + ' drop'} a league.</p>`
        : `<div class="card center"><div class="duo-mid">${U.duo({ mood: 'happy' })}</div><h2>Compete with your friends</h2><p class="muted">Create or join a pack. Each week, whoever earns the most XP climbs from Bronze all the way to Diamond.</p><a class="btn green" href="#/squad">Join a pack</a></div>`}
      ${s.leagueHistory.length ? `<div class="section-head"><h2>Past weeks</h2></div><div class="card">${s.leagueHistory.slice(0, 6).map(h => `<div class="hist-row"><span>Week of ${h.week}</span><span>#${h.rank} of ${h.n} · ${h.xp} XP</span><span>${h.to > h.from ? '⬆ ' : h.to < h.from ? '⬇ ' : ''}${G.LEAGUES[h.to].name}</span></div>`).join('')}</div>` : ''}
    </div>`;
    bindTopbar(app);
    const inv = $('#invite', app); if (inv) inv.addEventListener('click', inviteSheet);
    $$('.lb-row', app).forEach(r => r.addEventListener('click', () => memberSheet(board.find(x => x.id === r.dataset.id))));
    if (s.squad) window.APP.refreshSquad();
  }
  const leagueTag = t => `<span class="tag" style="--c:${G.LEAGUES[t || 0].color}">${G.LEAGUES[t || 0].name}</span>`;

  // ================= Squad =================
  function squad(app) {
    const s = G.s;
    if (!s.squad) {
      app.innerHTML = `${topbar('squad')}<div class="page narrow">
        <div class="center"><div class="duo-mid">${U.duo({ mood: 'happy' })}</div><h1>Find your pack</h1>
        <p class="muted">Packs are groups of friends who race each other in weekly leagues, cheer each other on, and team up on quests.</p></div>
        ${B.mode === 'local' ? localNote() : ''}
        <div class="card"><h3>Join with a code</h3><div class="row"><input class="big-input code" id="code" maxlength="6" placeholder="ABC123" autocomplete="off"><button class="btn green" id="join">Join</button></div><p class="err" id="jerr"></p></div>
        <div class="card"><h3>Start a new pack</h3><div class="row"><input class="big-input" id="sqname" maxlength="30" placeholder="Pack name" autocomplete="off"><button class="btn blue" id="create">Create</button></div><p class="err" id="cerr"></p></div>
      </div>`;
      bindTopbar(app);
      const code = $('#code', app);
      code.addEventListener('input', () => { code.value = code.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); });
      $('#join', app).addEventListener('click', () => joinSquad(code.value, $('#jerr', app)));
      $('#create', app).addEventListener('click', async () => {
        try {
          const sq = await B.createSquad($('#sqname', app).value.trim() || `${s.name}'s Pack`);
          s.squad = sq; G.save(); await window.APP.sync(); B.post(s, 'joined', {}).catch(() => {});
          window.APP.render(); inviteSheet();
        } catch (e) { $('#cerr', app).textContent = e.message; }
      });
      return;
    }
    const sq = window.APP.squad;
    const members = squadRows().sort((a, b) => (b.doneToday - a.doneToday) || b.streak - a.streak);
    const byId = Object.fromEntries(members.map(m => [m.id, m]));
    const doneCount = members.filter(m => m.doneToday).length;
    const feed = (sq.events || []).filter(e => e.kind !== 'nudge').slice(0, 40);
    app.innerHTML = `${topbar('squad')}<div class="page">
      <div class="hero-card blue-bg">
        <div><div class="hc-kicker">Your pack</div><h2>${esc(s.squad.name)}</h2><p>Code <b class="mono">${esc(s.squad.code)}</b> · ${members.length} member${members.length === 1 ? '' : 's'}</p></div>
        <button class="btn white" id="invite">Invite</button>
      </div>
      ${B.mode === 'local' ? localNote() : ''}
      <div class="section-head"><h2>Today</h2><span class="muted small">${doneCount} of ${members.length} practiced</span></div>
      <div class="card members">${members.map(m => `<button class="member ${m.me ? 'me' : ''}" data-id="${m.id}">
          <span class="lb-av">${U.dog(m.avatar, { mood: moodOf(m.data) })}</span>
          <span class="lb-name"><b>${esc(m.name)}${m.me ? ' (you)' : ''}</b><small>${leagueTag(m.tier)} · ${esc(hungerOf(m.data).name)}</small></span>
          <span class="m-streak ${m.doneToday ? '' : 'off'}">${ICON.flame(m.doneToday)}<b>${m.streak}</b></span>
          <span class="m-done">${m.doneToday ? '✅' : '⏳'}</span></button>`).join('')}
      </div>
      <div class="section-head"><h2>Activity</h2>${sq.loading ? '<span class="muted small">Updating…</span>' : ''}</div>
      <div class="card feed">${feed.length ? feed.map(e => feedRow(e, byId)).join('') : '<p class="muted">No activity yet. Finish a lesson and it will show up here!</p>'}</div>
      <p class="center"><button class="link-btn" id="leave">Leave pack</button></p>
    </div>`;
    bindTopbar(app);
    $('#invite', app).addEventListener('click', inviteSheet);
    $$('.member', app).forEach(b => b.addEventListener('click', () => memberSheet(members.find(m => m.id === b.dataset.id))));
    $$('[data-kudos]', app).forEach(b => b.addEventListener('click', async () => {
      b.disabled = true; b.classList.add('given');
      const cnt = b.querySelector('b'); cnt.textContent = Number(cnt.textContent || 0) + 1;
      U.sound('combo');
      s.stats.kudosGiven++; G.checkAchievements().forEach(g => U.toast(`${g.a.icon} <b>${esc(g.a.name)}</b> Level ${g.level} · +${g.treats} treats`)); G.save();
      try { await B.kudos(s, Number(b.dataset.kudos)); } catch (e) { /* offline: count stays local */ }
      window.APP.refreshSquad(true);
    }));
    $('#leave', app).addEventListener('click', async () => {
      if (!(await U.confirmSheet({ title: 'Leave this pack?', body: 'You can rejoin later with the code.', yes: 'Leave pack', no: 'Stay', danger: true }))) return;
      s.squad = null; G.save(); window.APP.squad = { players: [], events: [], at: 0 }; await window.APP.sync(); window.APP.render();
    });
    window.APP.refreshSquad();
  }
  function localNote() {
    return `<div class="note">📱 <b>Device-only mode.</b> Packs only include profiles on this device. To compete with friends on their own phones, connect the free pack server (see README).</div>`;
  }
  async function joinSquad(code, errEl) {
    const s = G.s;
    try {
      if (!/^[A-Z0-9]{6}$/.test(code)) throw new Error('Pack codes have 6 letters and numbers.');
      const sq = await B.getSquad(code);
      if (!sq) throw new Error('No pack with that code.');
      s.squad = sq; G.save(); window.APP.squad = { players: [], events: [], at: 0 };
      await window.APP.sync(); B.post(s, 'joined', {}).catch(() => {});
      U.toast(`Welcome to ${esc(sq.name)}! 🎉`); U.confetti(80);
      window.APP.render();
    } catch (e) { if (errEl) errEl.textContent = e.message; else U.toast(esc(e.message)); }
  }

  function feedRow(e, byId) {
    const p = byId[e.player] || { name: 'A friend', avatar: {} };
    const b = e.body || {};
    const L = G.LEAGUES;
    const text = {
      joined: 'joined the pack 👋',
      levelup: `reached ${b.section === 'math' ? 'Math' : 'R&W'} Level ${esc(b.level)}: <b>${esc(b.name)}</b> 🐕`,
      level5: `reached Level 5 in <b>${esc(b.skill)}</b> 👑`,
      legendary: `went Legendary in <b>${esc(b.skill)}</b> 💜`,
      checkpoint: `conquered the <b>${esc(b.unit)}</b> checkpoint 🏰`,
      streak: `hit a <b>${esc(b.n)}-day streak</b> 🔥`,
      daily: `scored <b>${esc(b.score)}/${esc(b.total)}</b> on the Daily Challenge 📅`,
      achievement: `unlocked ${esc(b.icon)} <b>${esc(b.name)}</b>${b.level > 1 ? ` Level ${esc(b.level)}` : ''}`,
      league: b.to > b.from ? `finished #${esc(b.rank)} and moved up to <b>${esc((L[b.to] || L[0]).name)} League</b> 🏆` : `finished #${esc(b.rank)} in the league`
    }[e.kind];
    if (!text) return '';
    const mine = e.player === G.s.id;
    const given = (e.kudos || []).includes(G.s.id);
    return `<div class="feed-row"><span class="lb-av">${U.dog(p.avatar, { mood: 'happy' })}</span>
      <div class="feed-main"><div><b>${esc(p.name)}</b> ${text}</div><small class="muted">${U.ago(e.created_at)}</small></div>
      <button class="kudos ${given ? 'given' : ''}" data-kudos="${e.id}" ${mine || given ? 'disabled' : ''} aria-label="High five">👏 <b>${(e.kudos || []).length || ''}</b></button></div>`;
  }

  function memberSheet(m) {
    if (!m) return;
    const s = G.s, d = m.data || {}, st = d.stats || {};
    const acc = st.answered ? Math.round((100 * st.correct) / st.answered) : 0;
    const nudged = s.nudgesSent[m.id] === G.today();
    const sh = U.sheet(`<div class="center">
      <div class="member-dog">${U.dog(m.avatar, { mood: moodOf(d), body: true, think: hungerOf(d).min < 35 })}</div>
      <h2>${esc(m.name)}</h2><p>${leagueTag(m.tier)} · ${esc(hungerOf(d).name)}</p>
      ${d.scores ? `<div class="score-rows">${d.rating ? `<div><span>🏅 Overall rating</span><b>${d.rating}/1600 · ${G.ratingTitle(d.rating, true).name}</b></div>` : ''}<div><span>📐 Math rating</span><b>${d.ratings ? d.ratings.math : d.scores.math}/800</b></div><div><span>📖 R&W rating</span><b>${d.ratings ? d.ratings.rw : d.scores.rw}/800</b></div></div>` : ''}
      <div class="stat-grid">
        <div><b>🔥 ${m.streak}</b><small>day streak</small></div>
        <div><b>⚡ ${(d.xp || 0).toLocaleString()}</b><small>total XP</small></div>
        <div><b>📘 ${st.lessons || 0}</b><small>lessons</small></div>
        <div><b>🎯 ${acc}%</b><small>accuracy</small></div>
        <div><b>🐕 ${d.levels ? `${d.levels.math} · ${d.levels.rw}` : '1 · 1'}</b><small>Math · R&W level</small></div>
        <div><b>🏆 ${st.firsts || 0}</b><small>league wins</small></div>
      </div>
      ${m.me ? '' : m.doneToday ? '<p class="muted">Already practiced today ✅</p>' : `<button class="btn orange wide" id="nudge" ${nudged ? 'disabled' : ''}>${nudged ? 'Nudged today 👉' : `👉 Nudge ${esc(m.name)}`}</button>`}
    </div>`);
    const nb = $('#nudge', sh.el);
    if (nb) nb.addEventListener('click', async () => {
      const msgs = ['Your streak misses you! 🔥', 'Quick 5-question lesson? You got this 💪', "I'm coming for your spot on the leaderboard 👀", 'Fetch 1600 time! 🐶'];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      try { await B.post(s, 'nudge', { msg }, m.id); s.nudgesSent[m.id] = G.today(); G.save(); nb.disabled = true; nb.textContent = 'Nudged today 👉'; U.toast(`You nudged ${esc(m.name)}!`); }
      catch (e) { U.toast("Couldn't send the nudge. Try again later."); }
    });
  }

  function inviteSheet() {
    const s = G.s;
    if (!s.squad) return;
    const link = `${location.origin}${location.pathname}?join=${s.squad.code}`;
    const text = `Join my Fetch 1600 pack "${s.squad.name}"! Code: ${s.squad.code}\n${link}`;
    const sh = U.sheet(`<div class="center">
      <div class="sheet-duo">${U.duo({ mood: 'happy' })}</div>
      <h2>Invite your friends</h2>
      <p class="muted">Share this code or link. Friends enter it when they sign up (or on the Pack tab).</p>
      <div class="big-code">${esc(s.squad.code)}</div>
      <div class="stack">
        ${navigator.share ? '<button class="btn green wide" id="share">Share invite</button>' : ''}
        <button class="btn blue wide" id="copy">Copy invite link</button>
      </div>
      ${B.mode === 'local' ? '<p class="note small">Device-only mode: invites only work for profiles on this device until the pack server is connected.</p>' : ''}
    </div>`);
    const sb = $('#share', sh.el); if (sb) sb.addEventListener('click', () => navigator.share({ title: 'Fetch 1600', text, url: link }).catch(() => {}));
    $('#copy', sh.el).addEventListener('click', () => U.copy(text));
  }

  // ================= Shop =================
  function shop(app) {
    const s = G.s;
    const power = [
      { id: 'freeze', icon: '❄️', name: 'Streak Freeze', desc: `Protects your streak if you miss a day. Equipped: ${s.freezes} / ${G.MAX_FREEZES}.`, off: s.freezes >= G.MAX_FREEZES },
      { id: 'hearts', icon: '❤️', name: 'Heart Refill', desc: 'Get full hearts right now.', off: G.hearts() >= G.MAX_HEARTS },
      { id: 'boost', icon: '⚡', name: 'Double XP (15 min)', desc: G.boostActive() ? `Active: ${U.fmtLeft(G.s.boostUntil - Date.now())} left. Buying adds 15 minutes.` : 'Earn twice the XP for 15 minutes. Great before the league ends!', off: false }
    ];
    if (G.canRepair()) power.unshift({ id: 'repair', icon: '🩹', name: `Repair your ${s.lostStreak.n}-day streak`, desc: 'Available today only.', off: false });
    const kinds = { outfit: 'Shirts, jerseys & jackets', hat: 'Hats & headphones', eyes: 'Glasses', neck: 'Collars & bandanas', paint: 'Fun coat colors' };
    const full = G.fullness(), hunger = G.hungerState(full);
    app.innerHTML = `${topbar('shop')}<div class="page">
      <div class="card doghouse" style="--h:${hunger.color}">
        <div class="dh-dog ${hunger.min >= 60 ? 'wag' : ''}">${U.dog(s.avatar, { mood: hunger.mood, body: true, think: hunger.min < 35 })}</div>
        <div class="dh-info">
          <div class="dh-name">${esc(s.name)}'s ${esc(D.BY_ID[s.avatar.breed].name)}</div>
          <div class="dh-state">${esc(hunger.name)}</div>
          <p class="dh-say">“${esc(hunger.say)}”</p>
          <div class="meter"><i style="width:${full}%"></i></div>
          <div class="muted small">Fullness ${Math.round(full)}% · ${full >= 35 ? `hungry again in about ${U.fmtLeft(((full - 35) / (100 / 72)) * 3600000 + 60000)}` : 'feed me soon!'}</div>
          <button class="btn ghost sm" id="edit-dog">Breed & colors · free</button>
        </div>
      </div>
      <div class="section-head"><h2>Feed your dog</h2><span class="treats-big">${ICON.treat()} ${s.treats.toLocaleString()}</span></div>
      <div class="foods">${G.FOODS.map(f => `<button class="food" data-food="${f.id}" ${s.treats < f.price ? 'disabled' : ''}><span class="food-ic">${f.icon}</span><b>${f.name}</b><small>+${f.fill}% full</small><span class="cos-price">${ICON.treat()} ${f.price}</span></button>`).join('')}</div>

      <div class="section-head"><h2>Dog wardrobe</h2></div>
      <div class="wardrobe">
        <div class="wardrobe-items">${Object.entries(kinds).map(([k, label]) => `<h3>${label}</h3><div class="cos-grid">${G.COSMETICS.filter(c => c.kind === k).map(c => {
          const [, val] = c.id.split(':');
          const owned = s.owned.includes(c.id);
          const on = k !== 'paint' && s.avatar[k] === val;
          const preview = k === 'paint'
            ? Object.assign({}, s.avatar, { colors: [val].concat((s.avatar.colors || D.BY_ID[s.avatar.breed].colors).slice(1)) })
            : Object.assign({}, s.avatar, { [k]: val });
          return `<button class="cos ${on ? 'on' : ''} ${owned ? 'owned' : ''}" data-cos="${c.id}">${U.dog(preview, k === 'outfit' || k === 'paint' ? { body: true } : {})}<span class="cos-name">${c.name}</span>
            <span class="cos-price">${on ? 'Wearing' : owned ? (k === 'paint' ? 'Unlocked' : 'Owned') : `${ICON.treat()} ${c.price}`}</span></button>`;
        }).join('')}</div>`).join('')}</div>
      </div>
      <div class="section-head"><h2>Power-ups</h2></div>
      <div class="shop-grid">${power.map(p => `<div class="card shop-item"><div class="si-icon">${p.icon}</div><div class="si-main"><b>${p.name}</b><p class="muted small">${p.desc}</p></div>
        <button class="btn ${s.treats >= G.PRICES[p.id] && !p.off ? 'blue' : 'ghost'} sm" data-buy="${p.id}" ${p.off ? 'disabled' : ''}>${ICON.treat()} ${G.PRICES[p.id]}</button></div>`).join('')}</div>
      <p class="muted small center">Earn treats from every lesson, quests, treat bags on the path, level-ups, streak milestones, achievements, and league finishes.</p>
    </div>`;
    bindTopbar(app);
    $('#edit-dog', app).addEventListener('click', dogSheet);
    $$('[data-food]', app).forEach(b => b.addEventListener('click', () => {
      const err = G.feed(b.dataset.food);
      if (err) return U.toast(esc(err));
      const f = G.FOODS.find(x => x.id === b.dataset.food);
      U.sound('chest'); U.buzz(20);
      U.toast(`${f.icon} Yum! Your dog is ${G.hungerState(G.fullness()).name.toLowerCase()}.`);
      if (G.fullness() >= 85) U.confetti(50);
      G.checkAchievements().forEach(g => U.toast(`${g.a.icon} <b>${esc(g.a.name)}</b> Level ${g.level} · +${g.treats} treats`, 3500));
      G.save(); window.APP.render(); window.APP.sync();
    }));
    $$('[data-buy]', app).forEach(b => b.addEventListener('click', () => {
      const err = G.buy(b.dataset.buy);
      if (err) return U.toast(esc(err));
      U.sound('chest'); U.toast('Purchased! ✨'); window.APP.render(); window.APP.sync();
    }));
    $$('[data-cos]', app).forEach(b => b.addEventListener('click', async () => {
      const id = b.dataset.cos, c = G.COSMETICS.find(x => x.id === id);
      if (G.s.owned.includes(id)) {
        if (c.kind === 'paint') return dogSheet('mix');
        G.equip(id); U.sound('tap'); window.APP.render(); window.APP.sync(); return;
      }
      if (!(await U.confirmSheet({ title: `Buy ${c.name}?`, body: `This costs ${c.price} treats. You have ${G.s.treats}.${c.kind === 'paint' ? ' You can use it anywhere in your color mix.' : ''}`, yes: 'Buy it', no: 'Not now' }))) return;
      const err = G.buyCosmetic(id);
      if (err) return U.toast(esc(err));
      U.sound('chest'); U.confetti(60); G.save(); window.APP.render(); window.APP.sync();
    }));
  }

  // ================= Dog picker (breed + color mix) =================
  function breedButtons(av) {
    return D.BREEDS.map(b => `<button class="breed ${av.breed === b.id ? 'on' : ''}" data-breed="${b.id}">${U.dog({ breed: b.id }, {})}<span>${esc(b.name)}</span></button>`).join('');
  }
  function bindBreeds(root, av, redraw) {
    $$('[data-breed]', root).forEach(b => b.addEventListener('click', () => { av.breed = b.dataset.breed; av.colors = null; U.sound('tap'); redraw(); }));
  }
  // owned: unlocked cosmetic ids, or null for natural colors only (during sign-up)
  function colorMixer(av, owned) {
    const b = D.BY_ID[av.breed];
    const cur = b.colors.map((k, i) => (av.colors && av.colors[i]) || k);
    const keys = Object.keys(D.COLORS).filter(k => !D.COLORS[k].fun || (owned && owned.includes('paint:' + k)));
    const locked = owned ? Object.keys(D.COLORS).filter(k => D.COLORS[k].fun && !owned.includes('paint:' + k)).length : 0;
    return b.slots.map((label, i) => `<div class="slot"><div class="slot-label">${esc(label)}</div><div class="swatches">${keys.map(k =>
      `<button class="swatch ${cur[i] === k ? 'on' : ''}" data-slot="${i}" data-color="${k}" style="--sw:${D.COLORS[k].hex}" title="${esc(D.COLORS[k].name)}" aria-label="${esc(label)}: ${esc(D.COLORS[k].name)}"></button>`).join('')}</div></div>`).join('')
      + `<div class="mix-actions"><button class="btn ghost sm" data-reset>Classic colors</button>${locked ? `<span class="muted small">🎨 ${locked} fun colors in the shop</span>` : ''}</div>`;
  }
  function bindMixer(root, av, owned, redraw) {
    $$('[data-slot]', root).forEach(btn => btn.addEventListener('click', () => {
      const b = D.BY_ID[av.breed];
      const cur = b.colors.map((k, i) => (av.colors && av.colors[i]) || k);
      cur[Number(btn.dataset.slot)] = btn.dataset.color;
      av.colors = cur; U.sound('tap'); redraw();
    }));
    const r = $('[data-reset]', root); if (r) r.addEventListener('click', () => { av.colors = null; redraw(); });
  }
  function dogSheet(startTab) {
    const s = G.s;
    const av = { breed: s.avatar.breed, colors: s.avatar.colors ? s.avatar.colors.slice() : null };
    const sh = U.sheet('<div id="dog-edit"></div>', { cls: 'wide', onClose: () => window.APP.render() });
    let tab = startTab === 'mix' ? 'mix' : 'breed';
    function draw() {
      const box = $('#dog-edit', sh.el);
      box.innerHTML = `<div class="mix-hero">${U.dog(Object.assign({}, s.avatar, av), { mood: 'happy', body: true })}<h2>${esc(D.BY_ID[av.breed].name)}</h2></div>
        <div class="seg"><button class="${tab === 'breed' ? 'on' : ''}" data-tab="breed">1. Breed</button><button class="${tab === 'mix' ? 'on' : ''}" data-tab="mix">2. Color mix</button></div>
        ${tab === 'breed' ? `<div class="breed-grid">${breedButtons(av)}</div>` : `<div class="mixer">${colorMixer(av, s.owned)}</div>`}
        <div class="sheet-foot"><button class="btn green wide" id="dog-save">Save my dog</button></div>`;
      $$('[data-tab]', box).forEach(b => b.addEventListener('click', () => { tab = b.dataset.tab; draw(); }));
      bindBreeds(box, av, draw);
      bindMixer(box, av, s.owned, draw);
      $('#dog-save', box).addEventListener('click', () => { G.setDog(av.breed, av.colors); U.sound('complete'); sh.close(); window.APP.sync(); U.toast('Looking good! 🐶'); });
    }
    draw();
  }

  // ================= Profile =================
  function profile(app) {
    const s = G.s;
    const acc = s.stats.answered ? Math.round((100 * s.stats.correct) / s.stats.answered) : 0;
    const t = G.today();
    const week = Array.from({ length: 7 }, (_, i) => G.addDays(t, i - 6));
    const maxXp = Math.max(s.goal, ...week.map(d => s.xpByDay[d] || 0));
    app.innerHTML = `${topbar('profile')}<div class="page">
      <div class="profile-head">
        <div class="profile-dog">${U.dog(s.avatar, { mood: G.hungerState(G.fullness()).mood, body: true })}</div>
        <div><h1>${esc(s.name)}</h1><p class="muted">Joined ${s.createdAt}${s.squad ? ` · ${esc(s.squad.name)}` : ''}</p>
        <button class="btn ghost sm" id="edit-dog">Change my dog</button></div>
      </div>
      <div class="section-head"><h2>Statistics</h2></div>
      <div class="stat-grid big">
        <div>${ICON.flame(s.streak > 0)}<b>${s.streak}</b><small>Day streak</small></div>
        <div>${ICON.bolt()}<b>${s.xp.toLocaleString()}</b><small>Total XP</small></div>
        <div>${U.leagueShield(s.tier, 22)}<b>${G.LEAGUES[s.tier].name}</b><small>Current league</small></div>
        <div>🏅<b>${s.stats.top3}</b><small>Top 3 finishes</small></div>
        <div>📘<b>${s.stats.lessons}</b><small>Lessons</small></div>
        <div>🎯<b>${acc}%</b><small>Accuracy (${s.stats.answered} answered)</small></div>
        <div>🏅<b>${G.overallRating()}</b><small>Overall rating /1600 · ${G.ratingTitle(G.overallRating(), true).name}</small></div>
        <div>📐<b>${G.sectionRating('math')}</b><small>Math rating /800</small></div>
        <div>📖<b>${G.sectionRating('rw')}</b><small>R&W rating /800</small></div>
        <div>🦴<b>${s.treats.toLocaleString()}</b><small>Dog treats</small></div>
      </div>
      <div class="two-col">
        <div class="card"><div class="card-title">XP this week</div>
          <div class="bars">${week.map(d => { const v = s.xpByDay[d] || 0; return `<div class="bar-col"><span class="bar-v">${v || ''}</span><div class="bar" style="height:${Math.round((100 * v) / maxXp)}%" data-goal="${v >= s.goal}"></div><small>${'SMTWTFS'[new Date(d + 'T12:00').getDay()]}</small></div>`; }).join('')}
          <div class="goal-line" style="bottom:calc(${(100 * s.goal) / maxXp}% * .78 + 22px)"></div></div></div>
        <div class="card">${calendar()}</div>
      </div>
      <div class="section-head"><h2>Achievements</h2></div>
      <div class="ach-grid">${G.ACHIEVEMENTS.map(a => {
        const lvl = s.achievements[a.id] || 0, max = a.tiers.length;
        const nextT = a.tiers[Math.min(lvl, max - 1)], v = a.val();
        return `<div class="ach ${lvl ? '' : 'locked'}"><div class="ach-icon">${a.icon}${max > 1 ? `<span>${lvl ? 'LV ' + lvl : ''}</span>` : ''}</div>
          <div class="ach-main"><b>${esc(a.name)}</b><small>${esc(a.text(nextT))}</small>
          ${lvl < max ? `<div class="qbar"><div class="qbar-fill" style="width:${Math.min(100, (100 * v) / nextT)}%"></div><span>${Math.min(v, nextT)} / ${nextT}</span></div>` : '<small class="gold-text">Maxed out! ✨</small>'}</div></div>`;
      }).join('')}</div>
      <div class="section-head"><h2>Levels & scents</h2></div>
      <div class="two-col">${['math', 'rw'].map(sec => { const L = G.pathOf(sec).level, sp = G.levelSpec(sec, L); return `<a class="card level-card" href="#/tracker" style="--u:${sp.color}">
        <div class="nl-dog">${U.dog({ breed: sp.breed, hat: sp.top ? 'crown' : null }, { mood: 'happy' })}</div>
        <div><div class="unit-kicker">${COURSE_NAME[sec]}</div><b>Level ${L}: ${esc(G.levelName(sec, L))}</b><small class="muted">Rating ${G.sectionRating(sec)}/800 · open Scent Tracker ›</small></div></a>`; }).join('')}</div>
      <div class="section-head"><h2>Settings</h2></div>
      <div class="card settings">
        <label class="set-row"><span>Daily goal</span><select id="goal">${G.GOALS.map(g => `<option value="${g.xp}" ${s.goal === g.xp ? 'selected' : ''}>${g.name} · ${g.xp} XP</option>`).join('')}</select></label>
        <label class="set-row"><span>Sound effects</span><input type="checkbox" id="sound" ${s.settings.sound ? 'checked' : ''}></label>
        <div class="set-row"><span>Daily reminder<small class="muted">Adds a repeating reminder to your phone's calendar</small></span><span class="row"><input type="time" id="rtime" value="16:00"><button class="btn ghost sm" id="ics">Add</button></span></div>
        ${B.mode === 'cloud' ? '<div class="set-row"><span>Transfer code<small class="muted">Use it to move your progress to a new device</small></span><button class="btn ghost sm" id="tcode">Show</button></div>' : ''}
        <div class="set-row"><span>Switch profile</span><button class="btn ghost sm" id="switch">Switch</button></div>
        <div class="set-row"><span>Delete this profile from this device</span><button class="btn red sm" id="del">Delete</button></div>
      </div>
      <p class="muted small center footer-note">Fetch 1600 uses the original practice questions from the SAT Prep site. Not affiliated with College Board. SAT® is a trademark registered by the College Board, which does not endorse this app. <a href="../index.html">Open the full SAT Prep site</a> for timed practice tests.</p>
    </div>`;
    bindTopbar(app);
    $('#edit-dog', app).addEventListener('click', dogSheet);
    $('#goal', app).addEventListener('change', e => { s.goal = Number(e.target.value); s.quests.list[0].target = s.goal; s.quests.list[0].progress = Math.min(G.todayXp(), s.goal); G.save(); U.toast('Daily goal updated'); });
    $('#sound', app).addEventListener('change', e => { s.settings.sound = e.target.checked; G.save(); U.sound('correct'); });
    $('#ics', app).addEventListener('click', () => reminderIcs($('#rtime', app).value));
    const tc = $('#tcode', app);
    if (tc) tc.addEventListener('click', async () => {
      await window.APP.sync();
      const code = `${s.id}.${s.secret}`;
      const sh = U.sheet(`<h2>Your transfer code</h2><p class="muted">Keep it private. Anyone with this code can load your progress.</p><div class="big-code small mono">${esc(code)}</div><button class="btn blue wide" id="cp">Copy</button>`);
      $('#cp', sh.el).addEventListener('click', () => U.copy(code));
    });
    $('#switch', app).addEventListener('click', () => { G.signOut(); window.APP.boot(); });
    $('#del', app).addEventListener('click', async () => {
      if (!(await U.confirmSheet({ title: `Delete ${esc(s.name)}?`, body: 'This removes all progress for this profile on this device. It cannot be undone.', yes: 'Delete profile', no: 'Cancel', danger: true, mood: 'sad' }))) return;
      G.removeProfile(s.id); window.APP.boot();
    });
  }
  function reminderIcs(time) {
    const [hh, mm] = (time || '16:00').split(':');
    const d = G.today().replace(/-/g, '');
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    const url = location.origin + location.pathname;
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Fetch 1600//EN', 'BEGIN:VEVENT', `UID:satquest-${G.randId(6)}@satquest`, `DTSTAMP:${stamp}`,
      `DTSTART:${d}T${hh}${mm}00`, 'DURATION:PT10M', 'RRULE:FREQ=DAILY', 'SUMMARY:Fetch 1600: keep your streak alive 🔥', `DESCRIPTION:5 questions a day. ${url}`, `URL:${url}`,
      'BEGIN:VALARM', 'TRIGGER:PT0M', 'ACTION:DISPLAY', 'DESCRIPTION:Time for your Fetch 1600 lesson!', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    U.download('fetch-1600-reminder.ics', ics, 'text/calendar');
    U.toast('Open the downloaded file to add the reminder to your calendar.', 4000);
  }

  // ================= Pending pop-ups (streak freeze, lost streak, league results, nudges) =================
  function showPending() {
    const s = G.s;
    if (!s || !s.pending.length || document.querySelector('.sheet-wrap') || document.body.classList.contains('in-lesson')) return;
    const p = s.pending.shift(); G.save();
    const next = () => setTimeout(showPending, 250);
    if (p.kind === 'freezeUsed') {
      U.sheet(`<div class="center"><div class="big-emoji">❄️</div><h2>Streak saved!</h2><p class="muted">A streak freeze covered ${p.n === 1 ? 'the day you missed' : `${p.n} missed days`}. Your ${p.streak}-day streak is safe. Do a lesson today to keep it going.</p></div>`, { onClose: next });
    } else if (p.kind === 'streakLost') {
      const sh = U.sheet(`<div class="center"><div class="sheet-duo">${U.duo({ mood: 'sad' })}</div><h2>Your ${p.n}-day streak ended</h2>
        <p class="muted">It happens! ${G.canRepair() ? `You can repair it today for ${G.PRICES.repair} treats, or start fresh.` : 'Start a new one today.'}</p>
        <div class="stack">${G.canRepair() ? `<button class="btn orange wide" data-repair ${s.treats < G.PRICES.repair ? 'disabled' : ''}>🩹 Repair streak · ${ICON.treat()} ${G.PRICES.repair}</button>` : ''}
        <button class="btn green wide" data-fresh>Start a new streak</button></div></div>`, { onClose: next });
      const r = $('[data-repair]', sh.el);
      if (r) r.addEventListener('click', () => { const e = G.buy('repair'); if (e) U.toast(esc(e)); else { U.sound('complete'); U.confetti(); sh.close(); window.APP.render(); window.APP.sync(); } });
      $('[data-fresh]', sh.el).addEventListener('click', () => sh.close());
    } else if (p.kind === 'league') {
      const up = p.to > p.from, down = p.to < p.from;
      if (p.rank === 1 || up) { U.sound('complete'); setTimeout(() => U.confetti(), 200); }
      U.sheet(`<div class="center"><div class="shield-big">${U.leagueShield(p.to, 96)}</div>
        <h2>${up ? `Promoted to ${G.LEAGUES[p.to].name}!` : down ? `Moved to ${G.LEAGUES[p.to].name}` : `You stayed in ${G.LEAGUES[p.to].name}`}</h2>
        <p class="muted">Last week you finished <b>#${p.rank} of ${p.n}</b> with ${p.xp} XP.${p.prize ? ` You won <b>${p.prize} treats</b>!` : ''}</p>
        <p>${up ? 'Keep climbing!' : down ? "A new week, a fresh start. You've got this!" : 'Push for the top spots this week!'}</p></div>`, { onClose: next });
      if (up || p.rank === 1) B.post(s, 'league', { rank: p.rank, from: p.from, to: p.to }).catch(() => {});
    } else if (p.kind === 'nudge') {
      const sh = U.sheet(`<div class="center"><div class="sheet-dog">${U.dog(p.avatar, { mood: 'happy' })}</div><h2>${esc(p.from)} barked at you! 🐾</h2><p class="big-quote">“${esc(p.msg)}”</p>
        <button class="btn green wide" data-go>Start a lesson</button></div>`, { onClose: next });
      $('[data-go]', sh.el).addEventListener('click', () => { sh.close(); location.hash = '#/learn'; });
    } else next();
  }

  window.SCREENS = { welcome, learn, practice, tracker, leagues, quests, squad, shop, profile, heartsSheet, questRows, bindQuestClaims, showPending, joinSquad, inviteSheet };
})();
