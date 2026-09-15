/* Shared question rendering + untimed skill practice. */
(function () {
  'use strict';
  const S = window.SAT;
  const { esc, LETTERS } = S;

  // Renders a question into `el`. opts: { response, eliminated, locked, showResult, onAnswer, onEliminate }
  function renderQuestion(el, q, opts) {
    opts = opts || {};
    const eliminated = opts.eliminated || [];
    const hasPassage = !!q.passage;
    let answerHtml;

    if (q.type === 'mcq') {
      answerHtml = '<div class="choices">' + q.choices.map((c, i) => {
        const cls = ['choice'];
        if (opts.response === i) cls.push('selected');
        if (eliminated.includes(i)) cls.push('eliminated');
        if (opts.showResult) {
          if (i === q.answer) cls.push('correct');
          else if (opts.response === i) cls.push('wrong');
        }
        return `<div class="choice-row">
          <button class="${cls.join(' ')}" data-choice="${i}" ${opts.locked ? 'disabled' : ''}>
            <span class="letter">${LETTERS[i]}</span><span class="choice-text">${c}</span>
          </button>
          ${opts.onEliminate && !opts.locked ? `<button class="strike" data-strike="${i}" title="Cross out">${eliminated.includes(i) ? 'Undo' : `<s>${LETTERS[i]}</s>`}</button>` : ''}
        </div>`;
      }).join('') + '</div>';
    } else {
      const val = opts.response == null ? '' : opts.response;
      let result = '';
      if (opts.showResult) {
        result = S.isCorrect(q, val)
          ? '<span class="pill ok">Correct</span>'
          : `<span class="pill bad">Correct answer: ${esc(S.correctAnswerText(q))}</span>`;
      }
      answerHtml = `<div class="spr">
        <label>Your answer <input class="spr-input" type="text" inputmode="decimal" maxlength="6"
          value="${esc(val)}" ${opts.locked ? 'disabled' : ''} autocomplete="off" spellcheck="false"></label>
        <span class="spr-preview"></span> ${result}
        <p class="hint">Enter a whole number, decimal, or fraction (like 3/4 or -2.5). Up to 5 characters, or 6 with a negative sign.</p>
      </div>`;
    }

    el.innerHTML = `<div class="question ${hasPassage ? 'split' : 'single'}">
      ${hasPassage ? `<div class="passage">${q.passage}</div>` : ''}
      <div class="stem">
        <div class="prompt">${q.prompt}</div>
        ${answerHtml}
      </div>
    </div>`;

    if (q.section === 'math') S.renderMath(el);

    el.querySelectorAll('[data-choice]').forEach(b => b.addEventListener('click', () => {
      const i = Number(b.dataset.choice);
      if (opts.onAnswer) opts.onAnswer(opts.response === i && opts.toggle ? null : i);
    }));
    el.querySelectorAll('[data-strike]').forEach(b => b.addEventListener('click', () => {
      opts.onEliminate(Number(b.dataset.strike));
    }));
    const inp = el.querySelector('.spr-input');
    if (inp) {
      const preview = el.querySelector('.spr-preview');
      const update = () => {
        const v = inp.value.trim();
        preview.innerHTML = /^-?\d+\/\d+$/.test(v) ? '= ' + esc(v) : '';
      };
      update();
      inp.addEventListener('input', () => {
        inp.value = inp.value.replace(/[^0-9./-]/g, '');
        update();
        if (opts.onAnswer) opts.onAnswer(inp.value);
      });
      inp.addEventListener('keydown', e => { if (e.key === 'Enter' && opts.onEnter) opts.onEnter(); });
    }
  }

  // ---------- Practice home ----------
  const SET_SIZE = 10;
  let stats = {};
  function skillStats(section, domain, skill) {
    const skills = skill ? [skill] : S.domainOf(section, domain).skills.map(s => s.id);
    const agg = skills.reduce((a, s) => { const x = stats[s] || { tried: 0, right: 0 }; a.tried += x.tried; a.right += x.right; return a; }, { tried: 0, right: 0 });
    return { total: S.countFor(section, domain, skill), ...agg };
  }

  function statBar(st) {
    const pct = st.tried ? Math.round(100 * st.right / st.tried) : null;
    return `<span class="stat">${st.tried.toLocaleString()} done of ${st.total.toLocaleString()}${pct === null ? '' : ` · <b>${pct}%</b>`}</span>
      <span class="bar"><span style="width:${st.tried ? Math.max(2, 100 * st.right / st.tried) : 0}%"></span></span>`;
  }

  function practiceHome(app) {
    stats = S.attemptStats();
    const missed = S.missedIds().length;
    let html = `<section class="page">
      <h1>Practice</h1>
      <p class="lede">Untimed questions with instant feedback. Pick a skill, or mix everything together.</p>
      <div class="filters card">
        <span>Difficulty:</span>
        ${[1, 2, 3].map(d => `<label><input type="checkbox" class="diff" value="${d}" checked> ${S.DIFFICULTY[d]}</label>`).join('')}
        <label class="sep"><input type="checkbox" id="unseen"> Only questions I haven't done</label>
      </div>
      <div class="quick">
        <a class="btn" href="#/practice/session?section=rw">Mixed Reading &amp; Writing</a>
        <a class="btn" href="#/practice/session?section=math">Mixed Math</a>
        <a class="btn ghost ${missed ? '' : 'disabled'}" href="#/practice/session?missed=1">Redo my mistakes (${missed})</a>
      </div>`;

    for (const sec of ['rw', 'math']) {
      const tax = S.TAXONOMY[sec];
      html += `<h2>${tax.name}</h2><div class="domains">`;
      for (const d of tax.domains) {
        html += `<div class="card domain">
          <a class="domain-head" href="#/practice/session?section=${sec}&domain=${d.id}">
            <h3>${d.name}</h3>${statBar(skillStats(sec, d.id))}
          </a>
          <ul>${d.skills.map(s => {
            const st = skillStats(sec, d.id, s.id);
            return `<li><a href="#/practice/session?section=${sec}&domain=${d.id}&skill=${s.id}" class="${st.total ? '' : 'disabled'}">
              <span>${s.name}</span>${statBar(st)}</a></li>`;
          }).join('')}</ul>
        </div>`;
      }
      html += '</div>';
    }
    app.innerHTML = html + '</section>';

    // Remember filter choices and append them to session links.
    let prefs = {};
    try { prefs = JSON.parse(sessionStorage.getItem('practicePrefs')) || {}; } catch (e) { /* ignore */ }
    const diffs = [...app.querySelectorAll('.diff')], unseen = app.querySelector('#unseen');
    if (prefs.diff) diffs.forEach(c => { c.checked = prefs.diff.includes(Number(c.value)); });
    if (prefs.unseen) unseen.checked = true;
    const persist = () => {
      prefs = { diff: diffs.filter(c => c.checked).map(c => Number(c.value)), unseen: unseen.checked };
      try { sessionStorage.setItem('practicePrefs', JSON.stringify(prefs)); } catch (e) { /* ignore */ }
    };
    [...diffs, unseen].forEach(c => c.addEventListener('change', persist));
    persist();
  }

  // ---------- Practice session ----------
  async function practiceSession(app, params) {
    let prefs = {};
    try { prefs = JSON.parse(sessionStorage.getItem('practicePrefs')) || {}; } catch (e) { /* ignore */ }
    const diffs = prefs.diff && prefs.diff.length ? prefs.diff : [1, 2, 3];
    const hashAtStart = location.hash;
    app.innerHTML = '<section class="page"><div class="card empty">Loading questions…</div></section>';

    let pool;
    let title;
    try {
      if (params.missed) {
        const ids = S.shuffle(S.missedIds()).slice(0, SET_SIZE);
        await S.ensure(ids);
        pool = ids.map(S.getQ).filter(Boolean);
        title = 'Redo my mistakes';
      } else {
        pool = (await S.loadPool({ section: params.section, domain: params.domain, skill: params.skill, diffs, min: SET_SIZE * 8 }))
          .filter(q => !prefs.unseen || !S.lastAttempt(q.id));
        title = params.skill ? S.skillName(params.section, params.domain, params.skill)
          : params.domain ? S.domainOf(params.section, params.domain).name
          : 'Mixed ' + S.TAXONOMY[params.section].name;
      }
    } catch (e) {
      app.innerHTML = `<section class="page"><div class="card empty">Couldn't load questions (${esc(e.message)}). <a href="#/practice">Back to practice</a></div></section>`;
      return;
    }
    if (location.hash !== hashAtStart) return;   // the user navigated away while loading
    // Unseen questions first, then previously missed, then the rest; one set at a time.
    const rank = q => { const a = S.lastAttempt(q.id); return !a ? 0 : a.c ? 2 : 1; };
    const queue = S.shuffle(pool).sort((a, b) => rank(a) - rank(b)).slice(0, SET_SIZE);

    if (!queue.length) {
      app.innerHTML = `<section class="page"><h1>${esc(title)}</h1>
        <div class="card empty">No questions match these filters yet. <a href="#/practice">Back to practice</a></div></section>`;
      return;
    }

    let idx = 0, right = 0, done = 0;
    let response = null, checked = false, eliminated = [];

    function draw() {
      const q = queue[idx];
      app.innerHTML = `<section class="practice">
        <div class="practice-bar">
          <a href="#/practice" class="back">← Practice</a>
          <div class="title"><b>${esc(title)}</b>
            <span class="muted">${params.skill ? '' : esc(S.skillName(q.section, q.domain, q.skill)) + ' · '}${S.DIFFICULTY[q.difficulty]}</span></div>
          <div class="score">${done ? `${right}/${done} correct` : ''} <span class="muted">Question ${idx + 1} of ${queue.length}</span></div>
        </div>
        <div id="q"></div>
        <div class="explain" id="explain" hidden></div>
        <div class="practice-actions">
          <button class="btn" id="check" ${response === null || response === '' ? 'disabled' : ''}>Check answer</button>
          <button class="btn" id="next" hidden>${idx + 1 < queue.length ? 'Next question →' : 'Finish'}</button>
        </div>
      </section>`;

      const qEl = app.querySelector('#q');
      const checkBtn = app.querySelector('#check'), nextBtn = app.querySelector('#next');
      const paint = () => renderQuestion(qEl, q, {
        response, eliminated, locked: checked, showResult: checked,
        onAnswer: r => { response = r; checkBtn.disabled = r === null || r === ''; if (q.type === 'mcq') paint(); },
        onEliminate: i => { eliminated = eliminated.includes(i) ? eliminated.filter(x => x !== i) : [...eliminated, i]; if (response === i) response = null; paint(); checkBtn.disabled = response === null; },
        onEnter: () => { if (!checkBtn.disabled && !checked) check(); }
      });
      paint();
      const inp = qEl.querySelector('.spr-input');
      if (inp) inp.focus();

      function check() {
        checked = true;
        const ok = S.isCorrect(q, response);
        S.recordAttempt(q.id, ok, 'practice');
        done++; if (ok) right++;
        paint();
        const ex = app.querySelector('#explain');
        ex.hidden = false;
        ex.innerHTML = `<div class="verdict ${ok ? 'ok' : 'bad'}">${ok ? 'Correct!' : 'Not quite. The answer is ' + esc(S.correctAnswerText(q)) + '.'}</div>
          <div>${q.explanation}</div>`;
        if (q.section === 'math') S.renderMath(ex);
        checkBtn.hidden = true;
        nextBtn.hidden = false;
        nextBtn.focus();
        app.querySelector('.score').innerHTML = `${right}/${done} correct <span class="muted">Question ${idx + 1} of ${queue.length}</span>`;
      }
      checkBtn.addEventListener('click', check);
      nextBtn.addEventListener('click', () => {
        if (idx + 1 >= queue.length) return finish();
        idx++; response = null; checked = false; eliminated = [];
        draw();
        window.scrollTo(0, 0);
      });
    }

    function finish() {
      app.innerHTML = `<section class="page narrow">
        <div class="card center">
          <h1>Set complete</h1>
          <p class="big">${right} / ${done}</p>
          <p class="muted">${esc(title)}</p>
          <div class="quick"><button class="btn" id="again">Next set of ${SET_SIZE}</button><a class="btn ghost" href="#/practice">Back to practice</a></div>
        </div></section>`;
      app.querySelector('#again').addEventListener('click', () => practiceSession(app, params));
    }

    draw();
  }

  window.SAT.renderQuestion = renderQuestion;
  window.SAT.practiceHome = practiceHome;
  window.SAT.practiceSession = practiceSession;
})();
