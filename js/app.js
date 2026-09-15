/* Router, sign-in landing, home dashboard, progress page. */
(function () {
  'use strict';
  const S = window.SAT;
  const { esc } = S;
  const app = document.getElementById('app');

  function skillRows() {
    const rows = [];
    const stats = S.attemptStats();
    for (const sec of ['rw', 'math']) {
      for (const d of S.TAXONOMY[sec].domains) {
        for (const s of d.skills) {
          const { tried, right } = stats[s.id] || { tried: 0, right: 0 };
          rows.push({ sec, d, s, total: S.countFor(sec, d.id, s.id), tried, right, pct: tried ? right / tried : null });
        }
      }
    }
    return rows;
  }

  // ---------- Landing: enter your name ----------
  function landing() {
    const known = S.knownUsers;
    app.innerHTML = `<section class="page narrow landing">
      <div class="card center">
        <h1>SAT Prep</h1>
        <p class="lede">Practice by skill and take full or half practice tests.</p>
        <form id="signin" autocomplete="off">
          <label for="name" class="field-label">Enter your name</label>
          <input id="name" class="text-input" type="text" maxlength="60" placeholder="e.g. Dan Vo" required>
          <button class="btn" type="submit">Continue</button>
        </form>
        <p class="muted small">No password needed. Your progress is saved under your name on this device and browser.</p>
        ${known.length ? `<div class="known"><span class="muted small">Recently used on this device:</span>
          <div class="row center-row">${known.map(n => `<button class="chip" data-name="${esc(n)}">${esc(n)}</button>`).join('')}</div></div>` : ''}
      </div>
    </section>`;
    const go = name => { if (S.signIn(name)) { location.hash = '#/'; route(); } };
    app.querySelector('#signin').addEventListener('submit', e => { e.preventDefault(); go(app.querySelector('#name').value); });
    app.querySelectorAll('[data-name]').forEach(b => b.addEventListener('click', () => go(b.dataset.name)));
    app.querySelector('#name').focus();
  }

  // ---------- Home ----------
  function sectionStats(rows, sec) {
    const mine = rows.filter(r => r.sec === sec);
    const tried = mine.reduce((a, r) => a + r.tried, 0);
    const right = mine.reduce((a, r) => a + r.right, 0);
    const weakest = mine.filter(r => r.tried >= 3).sort((a, b) => a.pct - b.pct)[0];
    return { tried, right, weakest, bank: mine.reduce((a, r) => a + r.total, 0) };
  }

  function home() {
    const rows = skillRows();
    const recent = S.state.tests.slice(-3).reverse();
    const statCard = sec => {
      const st = sectionStats(rows, sec);
      return `<div class="card section-stats">
        <h3>${S.TAXONOMY[sec].name}</h3>
        <div class="stat-pair">
          <div><span class="muted">Questions answered</span><b>${st.tried.toLocaleString()}</b></div>
          <div><span class="muted">Accuracy</span><b>${st.tried ? Math.round(100 * st.right / st.tried) + '%' : '—'}</b></div>
        </div>
        <p class="muted small">${st.weakest
          ? `Focus next: <a href="#/practice/session?section=${sec}&domain=${st.weakest.d.id}&skill=${st.weakest.s.id}">${st.weakest.s.name}</a> (${Math.round(100 * st.weakest.pct)}%)`
          : `${st.bank.toLocaleString()} questions available`}</p>
      </div>`;
    };

    app.innerHTML = `<section class="page">
      <h1>Welcome, ${esc(S.user)}</h1>
      <p class="lede">Practice by skill, then take timed tests in the digital SAT format.</p>
      <div class="hero-cards">
        <a class="card hero" href="#/practice">
          <h2>Practice</h2>
          <p>Untimed questions by skill with instant explanations.</p>
          <span class="btn">Start practicing →</span>
        </a>
        <a class="card hero" href="#/tests">
          <h2>Practice tests</h2>
          <p>A full adaptive test (2 h 14 min) or a half test (67 min), with an estimated score and full review.</p>
          <span class="btn">${S.state.activeTest ? 'Resume test →' : 'Take a test →'}</span>
        </a>
      </div>

      <h2>Your progress</h2>
      <div class="two-stats">${statCard('rw')}${statCard('math')}</div>

      <h2>Recent test scores</h2>
      ${recent.length ? `<div class="recent-tests">${recent.map(t => `
        <a class="card recent" href="#/results/${t.id}">
          <span class="muted small">${new Date(t.finishedAt).toLocaleDateString()} · ${t.kind === 'full' ? 'Full test' : 'Half test'}</span>
          <span class="total">${t.scores.total}</span>
          <span class="muted small">R&amp;W ${t.scores.rw} · Math ${t.scores.math}</span>
          <span class="muted small">Likely range ${S.scoreRange(t.scores.total, t.kind, 'total')}</span>
        </a>`).join('')}</div>${S.SCORE_NOTE}`
        : '<div class="card empty">No tests yet. Your last three test scores will appear here.</div>'}

      <div class="reset-row"><button class="btn danger" id="reset">Reset progress</button></div>
    </section>`;

    app.querySelector('#reset').addEventListener('click', () => {
      if (confirm(`Are you sure you want to reset all progress for ${S.user}? This erases practice history and test results and can't be undone.`)) {
        S.resetAll();
        home();
      }
    });
  }

  // ---------- Progress ----------
  function progress() {
    const rows = skillRows();
    const tests = S.state.tests;
    const table = sec => `<table class="history"><thead><tr><th>Skill</th><th>Done</th><th>Accuracy</th><th></th></tr></thead><tbody>
      ${rows.filter(r => r.sec === sec).map(r => `<tr>
        <td><a href="#/practice/session?section=${sec}&domain=${r.d.id}&skill=${r.s.id}">${r.s.name}</a><br><span class="muted small">${r.d.name}</span></td>
        <td>${r.tried}/${r.total.toLocaleString()}</td>
        <td>${r.pct === null ? '—' : Math.round(100 * r.pct) + '%'}</td>
        <td class="barcell"><span class="bar ${r.pct !== null && r.pct < 0.6 ? 'warn' : ''}"><span style="width:${r.pct === null ? 0 : 100 * r.pct}%"></span></span></td>
      </tr>`).join('')}</tbody></table>`;

    app.innerHTML = `<section class="page">
      <h1>Progress</h1>
      <p class="lede">Accuracy uses your most recent attempt at each question, from practice and tests.</p>
      ${tests.length ? `<div class="card"><h3>Test scores</h3><div class="trend">${tests.map(t =>
        `<a href="#/results/${t.id}" class="tbar" title="${new Date(t.finishedAt).toLocaleDateString()}">
          <span class="tval">${t.scores.total}</span>
          <span class="tfill ${t.kind}" style="height:${Math.max(4, (t.scores.total - 400) / 12)}px"></span>
          <span class="tlab">${t.kind === 'full' ? 'Full' : 'Half'}</span></a>`).join('')}</div></div>` : ''}
      <div class="two-col">
        <div><h2>Reading and Writing</h2>${table('rw')}</div>
        <div><h2>Math</h2>${table('math')}</div>
      </div>
    </section>`;
  }

  // ---------- Router ----------
  function route() {
    S.stopTimer();
    document.body.classList.remove('testing');
    const hash = location.hash.replace(/^#/, '') || '/';
    const [path, qs] = hash.split('?');
    const params = Object.fromEntries(new URLSearchParams(qs || ''));
    const parts = path.split('/').filter(Boolean);

    const signedIn = !!S.user;
    document.body.classList.toggle('signed-out', !signedIn);
    document.getElementById('whoami').innerHTML = signedIn
      ? `<span class="muted small">${esc(S.user)}</span> <button class="link small" id="switchUser">Switch user</button>` : '';
    const sw = document.getElementById('switchUser');
    if (sw) sw.addEventListener('click', () => { S.signOut(); location.hash = '#/'; route(); });

    document.querySelectorAll('.topnav nav a').forEach(a => {
      a.classList.toggle('active', path.startsWith(a.getAttribute('href').slice(1)));
    });

    if (!signedIn) landing();
    else if (!parts.length) home();
    else if (parts[0] === 'practice' && parts[1] === 'session') S.practiceSession(app, params);
    else if (parts[0] === 'practice') S.practiceHome(app);
    else if (parts[0] === 'tests') S.testsHome(app);
    else if (parts[0] === 'test' && parts[1] === 'run') S.runTest(app);
    else if (parts[0] === 'results') S.results(app, parts[1]);
    else if (parts[0] === 'progress') progress();
    else home();
    if (!document.body.classList.contains('testing')) window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', route);
  route();
})();
