/* Practice tests: full (adaptive, 4 modules) and half (1 module per section). */
(function () {
  'use strict';
  const S = window.SAT;
  const { esc } = S;
  const BREAK_SECONDS = 600;
  let timerHandle = null;

  function stopTimer() { if (timerHandle) { clearInterval(timerHandle); timerHandle = null; } }

  const REFERENCE_SHEET = `
    <h3>Area and perimeter</h3>
    <p>Rectangle: $A = \\ell w$ &nbsp;·&nbsp; Triangle: $A = \\tfrac{1}{2}bh$ &nbsp;·&nbsp; Trapezoid: $A = \\tfrac{1}{2}(b_1 + b_2)h$</p>
    <p>Circle: $A = \\pi r^2$, $C = 2\\pi r$ &nbsp;·&nbsp; Arc length $= \\tfrac{\\theta}{360}\\cdot 2\\pi r$ ($\\theta$ in degrees)</p>
    <h3>Volume</h3>
    <p>Rectangular prism: $V = \\ell w h$ &nbsp;·&nbsp; Cylinder: $V = \\pi r^2 h$ &nbsp;·&nbsp; Sphere: $V = \\tfrac{4}{3}\\pi r^3$</p>
    <p>Cone: $V = \\tfrac{1}{3}\\pi r^2 h$ &nbsp;·&nbsp; Pyramid: $V = \\tfrac{1}{3}\\ell w h$</p>
    <h3>Triangles and trigonometry</h3>
    <p>Pythagorean theorem: $a^2 + b^2 = c^2$</p>
    <p>Special right triangles: $x,\\ x\\sqrt{3},\\ 2x$ (30°-60°-90°) &nbsp;·&nbsp; $s,\\ s,\\ s\\sqrt{2}$ (45°-45°-90°)</p>
    <p>$\\sin\\theta = \\tfrac{\\text{opp}}{\\text{hyp}}$, $\\cos\\theta = \\tfrac{\\text{adj}}{\\text{hyp}}$, $\\tan\\theta = \\tfrac{\\text{opp}}{\\text{adj}}$ &nbsp;·&nbsp; $\\pi$ radians $= 180^\\circ$</p>
    <h3>Coordinate geometry and algebra</h3>
    <p>Slope: $m = \\dfrac{y_2 - y_1}{x_2 - x_1}$ &nbsp;·&nbsp; Distance: $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$</p>
    <p>Circle: $(x-h)^2 + (y-k)^2 = r^2$ &nbsp;·&nbsp; Quadratic formula: $x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$</p>`;

  // ---------- Test hub ----------
  function testsHome(app) {
    stopTimer();
    const active = S.state.activeTest;
    const history = S.state.tests.slice().reverse();
    app.innerHTML = `<section class="page">
      <h1>Practice Tests</h1>
      <p class="lede">Timed, in the same format as the digital SAT. Your score is an estimate based on question difficulty.</p>
      ${S.SCORE_NOTE}
      ${active ? `<div class="card resume">
        <div><b>You have a ${active.kind} test in progress.</b>
        <span class="muted">Started ${new Date(active.startedAt).toLocaleString()}</span></div>
        <div class="row"><a class="btn" href="#/test/run">Resume</a><button class="btn ghost" id="discard">Discard</button></div>
      </div>` : ''}
      <div class="test-options">
        <div class="card option">
          <h2>Full test</h2>
          <p class="big">2 h 14 min</p>
          <ul>
            <li>Reading &amp; Writing: 2 modules × 27 questions, 32 min each</li>
            <li>10-minute break</li>
            <li>Math: 2 modules × 22 questions, 35 min each</li>
            <li>Adaptive: your Module 1 result sets Module 2's difficulty</li>
          </ul>
          <button class="btn" data-start="full" ${active ? 'disabled' : ''}>Start full test</button>
        </div>
        <div class="card option">
          <h2>Half test</h2>
          <p class="big">67 min</p>
          <ul>
            <li>Reading &amp; Writing: 1 module × 27 questions, 32 min</li>
            <li>Math: 1 module × 22 questions, 35 min</li>
            <li>No break. Good for a weeknight check-in</li>
          </ul>
          <button class="btn" data-start="half" ${active ? 'disabled' : ''}>Start half test</button>
        </div>
      </div>
      <h2>History</h2>
      ${history.length ? `<table class="history"><thead><tr><th>Date</th><th>Type</th><th>R&amp;W</th><th>Math</th><th>Total</th><th></th></tr></thead><tbody>
        ${history.map(t => `<tr><td>${new Date(t.finishedAt).toLocaleDateString()}</td><td>${t.kind === 'full' ? 'Full' : 'Half'}</td>
          <td>${t.scores.rw}</td><td>${t.scores.math}</td><td><b>${t.scores.total}</b></td>
          <td><a href="#/results/${t.id}">Review</a></td></tr>`).join('')}
      </tbody></table>` : '<p class="muted">No tests taken yet.</p>'}
    </section>`;

    app.querySelectorAll('[data-start]').forEach(b => b.addEventListener('click', async () => {
      loadingScreen(app, 'Building your test…');
      try {
        await startTest(b.dataset.start);
        location.hash = '#/test/run';
      } catch (e) {
        alert("Couldn't build the test: " + e.message);
        testsHome(app);
      }
    }));
    const d = app.querySelector('#discard');
    if (d) d.addEventListener('click', () => {
      if (confirm('Discard the test in progress? Your answers will be lost.')) {
        S.state.activeTest = null; S.save(); testsHome(app);
      }
    });
  }

  async function newModule(section, level, exclude) {
    return {
      section, level, qids: await S.assembleModule(section, level, exclude),
      answers: {}, marked: {}, elim: {}, qIndex: 0,
      timeLeft: S.TAXONOMY[section].minutes * 60, timeUsed: 0
    };
  }

  async function startTest(kind) {
    S.state.activeTest = {
      id: 't' + Date.now(), kind, startedAt: Date.now(),
      modules: [await newModule('rw', 'm1', [])],
      current: 0, phase: 'intro', breakLeft: BREAK_SECONDS
    };
    S.save();
  }

  function loadingScreen(app, text) {
    app.innerHTML = `<section class="page narrow"><div class="card center"><p class="big">${esc(text)}</p></div></section>`;
  }

  function moduleLabel(t, i) {
    const m = t.modules[i];
    const secNum = m.section === 'rw' ? 1 : 2;
    const name = S.TAXONOMY[m.section].name;
    if (t.kind === 'half') return `Section ${secNum}: ${name}`;
    return `Section ${secNum}, Module ${m.level === 'm1' ? 1 : 2}: ${name}`;
  }

  // ---------- Runner ----------
  async function runTest(app) {
    stopTimer();
    const t = S.state.activeTest;
    if (!t) { location.hash = '#/tests'; return; }
    document.body.classList.add('testing');
    const cur = t.modules[t.current];
    if (cur.qids.some(id => !S.getQ(id))) {
      loadingScreen(app, 'Loading questions…');
      await S.ensure(t.modules.flatMap(m => m.qids));
      if (location.hash !== '#/test/run') return;
    }
    if (t.phase === 'intro') return intro(app, t);
    if (t.phase === 'break') return breakScreen(app, t);
    return moduleView(app, t);
  }

  function intro(app, t) {
    const m = t.modules[t.current];
    const tax = S.TAXONOMY[m.section];
    app.innerHTML = `<section class="page narrow"><div class="card center">
      <p class="muted">${t.kind === 'full' ? 'Full practice test' : 'Half practice test'}</p>
      <h1>${esc(moduleLabel(t, t.current))}</h1>
      <p class="big">${m.qids.length} questions · ${tax.minutes} minutes</p>
      <p class="muted">${m.section === 'math'
        ? 'A graphing calculator and reference sheet are available. About a quarter of questions ask you to type your own answer.'
        : 'Each question has its own short passage. Questions are grouped by type.'}
        The timer starts when you click Start.</p>
      <div class="quick"><button class="btn" id="go">Start</button> <a class="btn ghost" href="#/tests" id="exit">Save &amp; exit</a></div>
    </div></section>`;
    app.querySelector('#go').addEventListener('click', () => { t.phase = 'module'; S.save(); runTest(app); });
  }

  function breakScreen(app, t) {
    app.innerHTML = `<section class="page narrow"><div class="card center">
      <h1>Break</h1>
      <p class="big" id="brk">${S.fmtTime(t.breakLeft)}</p>
      <p class="muted">Section 2 (Math) starts when the break ends or when you continue.</p>
      <div class="quick"><button class="btn" id="go">Resume testing</button></div>
    </div></section>`;
    const go = () => { stopTimer(); t.phase = 'intro'; S.save(); runTest(app); };
    app.querySelector('#go').addEventListener('click', go);
    timerHandle = setInterval(() => {
      t.breakLeft--;
      const el = document.getElementById('brk');
      if (el) el.textContent = S.fmtTime(t.breakLeft);
      if (t.breakLeft % 5 === 0) S.save();
      if (t.breakLeft <= 0) go();
    }, 1000);
  }

  function moduleView(app, t) {
    const m = t.modules[t.current];
    const isMath = m.section === 'math';
    let onReview = false;
    let elimMode = false;
    let timerHidden = false;

    app.innerHTML = `<div class="test-shell">
      <header class="test-head">
        <div class="t-label">${esc(moduleLabel(t, t.current))}</div>
        <div class="t-timer"><span id="clock">${S.fmtTime(m.timeLeft)}</span> <button class="link" id="hideTimer">Hide</button></div>
        <div class="t-tools">
          ${isMath ? '<button class="tool" id="calcBtn">Calculator</button><button class="tool" id="refBtn">Reference</button>' : ''}
        </div>
      </header>
      <div class="test-body" id="body"></div>
      <footer class="test-foot">
        <div class="foot-left"><a class="link" href="#/tests">Save &amp; exit</a></div>
        <div class="foot-mid"><button class="nav-btn" id="navBtn"></button></div>
        <div class="foot-right"><button class="btn ghost" id="back">Back</button><button class="btn" id="next">Next</button></div>
      </footer>
      <div class="popover" id="navPop" hidden></div>
      ${isMath ? `<div class="calc-panel" id="calc" hidden>
        <div class="calc-head"><span>Desmos Graphing Calculator</span><button class="link" id="calcClose">Close</button></div>
        <iframe src="https://www.desmos.com/testing/cb-digital-sat/graphing" title="Graphing calculator"></iframe>
      </div>
      <div class="modal" id="ref" hidden><div class="modal-card">
        <div class="calc-head"><span>Math Reference Sheet</span><button class="link" id="refClose">Close</button></div>
        <div class="ref-body">${REFERENCE_SHEET}</div>
      </div></div>` : ''}
    </div>`;

    const body = app.querySelector('#body');
    const navPop = app.querySelector('#navPop');
    const backBtn = app.querySelector('#back'), nextBtn = app.querySelector('#next'), navBtn = app.querySelector('#navBtn');

    function gridHtml(big) {
      return `<div class="legend"><span><i class="sq"></i> Unanswered</span><span><i class="sq ans"></i> Answered</span><span><i class="sq flag"></i> For review</span></div>
        <div class="qgrid ${big ? 'big' : ''}">${m.qids.map((id, i) => {
          const a = m.answers[id];
          const cls = ['cell'];
          if (a !== undefined && a !== null && a !== '') cls.push('ans');
          if (m.marked[id]) cls.push('flag');
          if (!onReview && i === m.qIndex) cls.push('here');
          return `<button class="${cls.join(' ')}" data-go="${i}">${i + 1}</button>`;
        }).join('')}</div>`;
    }

    function draw() {
      navPop.hidden = true;
      if (onReview) {
        body.innerHTML = `<div class="review-page">
          <h2>Check your work</h2>
          <p class="muted">On test day you can't move on to the next module until time expires or you submit. Click a number to go back to that question.</p>
          <div class="card">${gridHtml(true)}</div>
          <div class="center"><button class="btn" id="submitMod">Submit module</button></div>
        </div>`;
        body.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => { m.qIndex = Number(b.dataset.go); onReview = false; draw(); }));
        body.querySelector('#submitMod').addEventListener('click', () => {
          const blank = m.qids.filter(id => m.answers[id] === undefined || m.answers[id] === null || m.answers[id] === '').length;
          const msg = blank ? `You have ${blank} unanswered question${blank > 1 ? 's' : ''}. Submit this module anyway?` : 'Submit this module? You can\'t return to it.';
          if (confirm(msg)) submitModule(app, t);
        });
        navBtn.textContent = 'Check your work';
        nextBtn.textContent = 'Submit';
        nextBtn.onclick = () => body.querySelector('#submitMod').click();
        backBtn.disabled = false;
        backBtn.onclick = () => { onReview = false; draw(); };
        return;
      }

      const id = m.qids[m.qIndex];
      const q = S.getQ(id);
      body.innerHTML = `<div class="q-head">
          <span class="qnum">${m.qIndex + 1}</span>
          <button class="mark ${m.marked[id] ? 'on' : ''}" id="mark">${m.marked[id] ? '★' : '☆'} Mark for Review</button>
          ${q.type === 'mcq' ? `<button class="abc ${elimMode ? 'on' : ''}" id="abc" title="Answer eliminator"><s>ABC</s></button>` : ''}
        </div>
        <div id="qwrap"></div>`;
      const qwrap = body.querySelector('#qwrap');
      const paint = () => S.renderQuestion(qwrap, q, {
        response: m.answers[id],
        eliminated: m.elim[id] || [],
        toggle: false,
        onAnswer: r => {
          m.answers[id] = r;
          if (q.type === 'mcq') { m.elim[id] = (m.elim[id] || []).filter(x => x !== r); paint(); }
          S.save();
        },
        onEliminate: elimMode ? i => {
          const e = m.elim[id] || [];
          m.elim[id] = e.includes(i) ? e.filter(x => x !== i) : [...e, i];
          if (m.answers[id] === i) delete m.answers[id];
          S.save(); paint();
        } : null,
        onEnter: () => nextBtn.click()
      });
      paint();

      body.querySelector('#mark').addEventListener('click', () => {
        if (m.marked[id]) delete m.marked[id]; else m.marked[id] = true;
        S.save(); draw();
      });
      const abc = body.querySelector('#abc');
      if (abc) abc.addEventListener('click', () => { elimMode = !elimMode; draw(); });

      navBtn.innerHTML = `Question ${m.qIndex + 1} of ${m.qids.length} ▴`;
      backBtn.disabled = m.qIndex === 0;
      backBtn.onclick = () => { m.qIndex--; S.save(); draw(); };
      nextBtn.textContent = 'Next';
      nextBtn.onclick = () => {
        if (m.qIndex + 1 < m.qids.length) m.qIndex++; else onReview = true;
        S.save(); draw();
        window.scrollTo(0, 0);
      };
    }

    navBtn.addEventListener('click', () => {
      if (onReview) return;
      navPop.hidden = !navPop.hidden;
      if (navPop.hidden) return;
      navPop.innerHTML = `<div class="pop-title">${esc(moduleLabel(t, t.current))}</div>${gridHtml(false)}
        <div class="center"><button class="btn ghost" id="toReview">Go to review page</button></div>`;
      navPop.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => { m.qIndex = Number(b.dataset.go); S.save(); draw(); }));
      navPop.querySelector('#toReview').addEventListener('click', () => { onReview = true; draw(); });
    });

    app.querySelector('#hideTimer').addEventListener('click', e => {
      timerHidden = !timerHidden;
      app.querySelector('#clock').style.visibility = timerHidden ? 'hidden' : 'visible';
      e.target.textContent = timerHidden ? 'Show' : 'Hide';
    });

    if (isMath) {
      const calc = app.querySelector('#calc'), ref = app.querySelector('#ref');
      app.querySelector('#calcBtn').addEventListener('click', () => { calc.hidden = !calc.hidden; });
      app.querySelector('#calcClose').addEventListener('click', () => { calc.hidden = true; });
      app.querySelector('#refBtn').addEventListener('click', () => { ref.hidden = false; S.renderMath(ref); });
      app.querySelector('#refClose').addEventListener('click', () => { ref.hidden = true; });
      ref.addEventListener('click', e => { if (e.target === ref) ref.hidden = true; });
      makeDraggable(calc, calc.querySelector('.calc-head'));
    }

    draw();

    timerHandle = setInterval(() => {
      m.timeLeft--; m.timeUsed++;
      const clock = document.getElementById('clock');
      if (clock) {
        clock.textContent = S.fmtTime(m.timeLeft);
        clock.classList.toggle('low', m.timeLeft <= 300);
        if (m.timeLeft === 300 && timerHidden) { clock.style.visibility = 'visible'; }
      }
      if (m.timeLeft % 5 === 0) S.save();
      if (m.timeLeft <= 0) {
        stopTimer();
        alert('Time is up for this module. Your answers have been submitted.');
        submitModule(app, t);
      }
    }, 1000);
  }

  function makeDraggable(panel, handle) {
    let sx, sy, ox, oy;
    handle.addEventListener('pointerdown', e => {
      if (e.target.tagName === 'BUTTON') return;
      const r = panel.getBoundingClientRect();
      sx = e.clientX; sy = e.clientY; ox = r.left; oy = r.top;
      handle.setPointerCapture(e.pointerId);
      const move = ev => {
        panel.style.left = Math.max(0, ox + ev.clientX - sx) + 'px';
        panel.style.top = Math.max(0, oy + ev.clientY - sy) + 'px';
        panel.style.right = 'auto';
      };
      const up = () => { handle.removeEventListener('pointermove', move); handle.removeEventListener('pointerup', up); };
      handle.addEventListener('pointermove', move);
      handle.addEventListener('pointerup', up);
    });
  }

  async function submitModule(app, t) {
    stopTimer();
    const m = t.modules[t.current];
    const exclude = t.modules.flatMap(x => x.qids);
    if (!(t.kind === 'full' && m.level === 'm1') && m.section !== 'rw') return finishTest(t);
    loadingScreen(app, 'Preparing the next module…');

    if (t.kind === 'full' && m.level === 'm1') {
      t.modules.push(await newModule(m.section, S.routeFor(m), exclude));
      t.current++; t.phase = 'intro';
    } else if (m.section === 'rw') {
      t.modules.push(await newModule('math', 'm1', exclude));
      t.current++;
      t.phase = t.kind === 'full' ? 'break' : 'intro';
    } else {
      return finishTest(t);
    }
    S.save();
    runTest(app);
  }

  function finishTest(t) {
    const bySec = sec => t.modules.filter(m => m.section === sec);
    const rw = S.sectionScore(bySec('rw')), math = S.sectionScore(bySec('math'));
    const record = {
      id: t.id, kind: t.kind, startedAt: t.startedAt, finishedAt: Date.now(),
      modules: t.modules.map(m => ({ section: m.section, level: m.level, qids: m.qids, answers: m.answers, marked: m.marked, timeUsed: m.timeUsed })),
      scores: { rw, math, total: rw + math }
    };
    t.modules.forEach(m => m.qids.forEach(id => S.recordAttempt(id, S.isCorrect(S.getQ(id), m.answers[id]), 'test')));
    S.state.tests.push(record);
    S.state.activeTest = null;
    S.save();
    location.hash = '#/results/' + t.id;
  }

  // ---------- Results ----------
  async function results(app, id) {
    stopTimer();
    const t = S.state.tests.find(x => x.id === id);
    if (!t) { app.innerHTML = '<section class="page"><div class="card empty">Test not found. <a href="#/tests">Back</a></div></section>'; return; }
    const allIds = t.modules.flatMap(m => m.qids);
    if (allIds.some(q => !S.getQ(q))) {
      loadingScreen(app, 'Loading your results…');
      await S.ensure(allIds);
      if (location.hash !== '#/results/' + id) return;
    }

    const sections = ['rw', 'math'].map(sec => {
      const mods = t.modules.filter(m => m.section === sec);
      const tax = S.TAXONOMY[sec];
      const domains = tax.domains.map(d => {
        let n = 0, c = 0;
        mods.forEach(m => m.qids.forEach(qid => {
          const q = S.getQ(qid);
          if (q.domain === d.id) { n++; if (S.isCorrect(q, m.answers[qid])) c++; }
        }));
        return { name: d.name, n, c };
      });
      return { sec, tax, mods, domains };
    });

    let filter = 'all';
    const rows = [];
    sections.forEach(s => s.mods.forEach((m, mi) => m.qids.forEach((qid, qi) => {
      rows.push({ q: S.getQ(qid), resp: m.answers[qid], marked: !!m.marked[qid],
        where: `${s.sec === 'rw' ? 'R&W' : 'Math'} M${mi + 1} · Q${qi + 1}` });
    })));

    app.innerHTML = `<section class="page">
      <p class="muted"><a href="#/tests">← Practice Tests</a></p>
      <h1>${t.kind === 'full' ? 'Full' : 'Half'} test results</h1>
      <p class="muted">${new Date(t.finishedAt).toLocaleString()}</p>
      <div class="score-hero card">
        <div><span class="muted">Estimated total</span><span class="total">${t.scores.total}</span><span class="muted">out of 1600</span></div>
        <div><span class="muted">Reading and Writing</span><span class="sub">${t.scores.rw}</span></div>
        <div><span class="muted">Math</span><span class="sub">${t.scores.math}</span></div>
      </div>
      <p class="muted small">Likely range: R&amp;W ${S.scoreRange(t.scores.rw, t.kind, 'section')}, Math ${S.scoreRange(t.scores.math, t.kind, 'section')}, total ${S.scoreRange(t.scores.total, t.kind, 'total')}. This is an estimate, not an official College Board score.</p>
      ${S.SCORE_NOTE}
      <div class="breakdown">${sections.map(s => `<div class="card">
        <h3>${s.tax.name}</h3>
        <p class="muted">${s.mods.map((m, i) => `Module ${i + 1}: ${S.moduleCorrect(m)}/${m.qids.length} correct${m.level !== 'm1' ? ` (${m.level === 'hard' ? 'harder' : 'easier'} module)` : ''} · ${S.fmtTime(m.timeUsed)} used`).join('<br>')}</p>
        ${s.domains.map(d => `<div class="dom-row"><span>${d.name}</span><span>${d.c}/${d.n}</span>
          <span class="bar"><span style="width:${d.n ? 100 * d.c / d.n : 0}%"></span></span></div>`).join('')}
      </div>`).join('')}</div>
      <h2>Question review</h2>
      <div class="tabs"><button data-f="all" class="on">All</button><button data-f="wrong">Incorrect or blank</button><button data-f="marked">Marked for review</button></div>
      <div id="rows"></div>
    </section>`;

    const rowsEl = app.querySelector('#rows');
    function drawRows() {
      const list = rows.filter(r => filter === 'all' || (filter === 'wrong' ? !S.isCorrect(r.q, r.resp) : r.marked));
      rowsEl.innerHTML = list.length ? list.map((r, i) => {
        const ok = S.isCorrect(r.q, r.resp);
        const blank = r.resp === undefined || r.resp === null || r.resp === '';
        const yours = blank ? '—' : r.q.type === 'mcq' ? S.LETTERS[r.resp] : esc(r.resp);
        return `<details class="rrow">
          <summary><span class="pill ${ok ? 'ok' : 'bad'}">${ok ? '✓' : blank ? 'Blank' : '✗'}</span>
            <span class="where">${r.where}${r.marked ? ' ★' : ''}</span>
            <span class="skill">${esc(S.skillName(r.q.section, r.q.domain, r.q.skill))}</span>
            <span class="muted">${S.DIFFICULTY[r.q.difficulty]}</span>
            <span class="ans">You: <b>${yours}</b> · Key: <b>${esc(S.correctAnswerText(r.q))}</b></span></summary>
          <div class="rbody" data-i="${i}"></div>
        </details>`;
      }).join('') : '<p class="muted">Nothing here.</p>';
      rowsEl.querySelectorAll('details').forEach((det, i) => det.addEventListener('toggle', () => {
        const box = det.querySelector('.rbody');
        if (!det.open || box.childElementCount) return;
        const r = list[i];
        const qdiv = document.createElement('div');
        box.appendChild(qdiv);
        S.renderQuestion(qdiv, r.q, { response: r.resp, locked: true, showResult: true });
        const ex = document.createElement('div');
        ex.className = 'explain';
        ex.innerHTML = r.q.explanation;
        box.appendChild(ex);
        if (r.q.section === 'math') S.renderMath(ex);
      }));
    }
    app.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => {
      app.querySelectorAll('.tabs button').forEach(x => x.classList.toggle('on', x === b));
      filter = b.dataset.f; drawRows();
    }));
    drawRows();
  }

  Object.assign(window.SAT, { testsHome, runTest, results, stopTimer });
})();
