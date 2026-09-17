/* Admin page: sign in with a Supabase Auth account whose email is listed in sq_admins, then see every
   player, their pack, ratings, levels, streaks, and per-question-type radar maps.
   The password is sent only to Supabase; nothing about the login is stored in this code. */
(function () {
  'use strict';
  const cfg = window.SQ_CONFIG || {};
  const G = window.GAME, D = window.DOGS;
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => [...(root || document).querySelectorAll(sel)];
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const app = $('#admin');
  const base = (cfg.supabaseUrl || '').replace(/\/+$/, '');
  const SESSION_KEY = 'fetch1600.admin.session';   // sessionStorage: cleared when the browser tab closes

  // ---------- Supabase Auth + RPC (plain fetch) ----------
  const readSession = () => { try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); } catch (e) { return null; } };
  const writeSession = v => { try { v ? sessionStorage.setItem(SESSION_KEY, JSON.stringify(v)) : sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ } };
  async function auth(grant, body) {
    const res = await fetch(`${base}/auth/v1/token?grant_type=${grant}`, {
      method: 'POST', headers: { apikey: cfg.supabaseKey, 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(j.error_description || j.msg || j.message || 'Sign-in failed');
    const session = { token: j.access_token, refresh: j.refresh_token, expires: Date.now() + (j.expires_in || 3600) * 1000, email: j.user && j.user.email };
    writeSession(session);
    return session;
  }
  async function token() {
    let s = readSession();
    if (!s) return null;
    if (Date.now() > s.expires - 60000) {
      try { s = await auth('refresh_token', { refresh_token: s.refresh }); } catch (e) { writeSession(null); return null; }
    }
    return s.token;
  }
  async function rpc(fn) {
    const t = await token();
    if (!t) throw new Error('signed-out');
    const res = await fetch(`${base}/rest/v1/rpc/${fn}`, {
      method: 'POST', headers: { apikey: cfg.supabaseKey, Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' }, body: '{}'
    });
    const j = await res.json().catch(() => null);
    if (!res.ok) throw new Error((j && (j.message || j.hint)) || 'Request failed (' + res.status + ')');
    return j;
  }

  // ---------- Screens ----------
  function shell(inner) {
    const s = readSession();
    app.innerHTML = `<header class="admin-top"><div class="admin-brand">🐾 Fetch 1600 <span>Admin</span></div>
      ${s ? `<div class="admin-who"><span class="muted small">${esc(s.email || '')}</span><button class="btn ghost sm" id="refresh">Refresh</button><button class="btn ghost sm" id="logout">Sign out</button></div>` : ''}</header>
      <div class="admin-body">${inner}</div>`;
    const lo = $('#logout'); if (lo) lo.addEventListener('click', () => { writeSession(null); loginScreen(); });
    const rf = $('#refresh'); if (rf) rf.addEventListener('click', load);
  }

  function notConfigured() {
    shell(`<div class="card admin-card center"><h2>Pack server not connected</h2>
      <p class="muted">The admin page reads players from the Supabase pack server. Fill in <code>APP/config.js</code> and run <code>APP/supabase.sql</code> first (see the README).</p></div>`);
  }

  function loginScreen(msg) {
    shell(`<form class="card admin-card" id="login">
      <h2>Admin sign in</h2>
      <p class="muted small">Use the admin account you created in Supabase (Authentication → Users).</p>
      <label class="admin-label">Email<input class="big-input" id="email" type="email" autocomplete="username" required></label>
      <label class="admin-label">Password<input class="big-input" id="password" type="password" autocomplete="current-password" required></label>
      <p class="err" id="err">${esc(msg || '')}</p>
      <button class="btn green wide" type="submit" id="go">Sign in</button>
    </form>`);
    $('#login').addEventListener('submit', async e => {
      e.preventDefault();
      const btn = $('#go'); btn.disabled = true; $('#err').textContent = '';
      try {
        await auth('password', { email: $('#email').value.trim(), password: $('#password').value });
        load();
      } catch (err) { $('#err').textContent = err.message; btn.disabled = false; }
    });
  }

  let rows = [];
  const view = { q: '', pack: '', sort: 'active' };

  async function load() {
    shell('<div class="card admin-card center muted">Loading players…</div>');
    try {
      const ok = await rpc('sq_is_admin');
      if (!ok) { writeSession(null); return loginScreen('This account is not an admin. Add its email to sq_admins in the Supabase SQL Editor.'); }
      rows = (await rpc('sq_admin_overview')).map(shape);
      dashboard();
    } catch (e) {
      if (e.message === 'signed-out') return loginScreen();
      shell(`<div class="card admin-card center"><h2>Couldn't load players</h2><p class="muted">${esc(e.message)}</p><button class="btn green" id="again">Try again</button></div>`);
      $('#again').addEventListener('click', load);
    }
  }

  // Flatten one player row for display.
  function shape(r) {
    const d = r.data || {}, st = d.stats || {}, lv = st.levels || { math: 1, rw: 1 };
    const ratings = G.ratingsFromElo(r.elo || {});
    const today = G.today();
    const daysAgo = d.lastLessonDay ? G.dayDiff(d.lastLessonDay, today) : null;
    const full = G.fullnessAt(d.fullness);
    return {
      id: r.id, name: d.name || '(no name)', avatar: d.avatar, pack: r.squad_name || '', packCode: r.squad || '',
      overall: ratings.overall, math: ratings.math, rw: ratings.rw, types: ratings.types,
      mathLevel: lv.math || 1, rwLevel: lv.rw || 1,
      streak: daysAgo != null && daysAgo <= 1 ? d.streak || 0 : 0,
      daysAgo, lessons: st.lessons || 0, answered: st.answered || 0,
      accuracy: st.answered ? Math.round((100 * st.correct) / st.answered) : null,
      xp: d.xp || 0, weekXp: d.week === G.weekOf() ? d.weekXp || 0 : 0, hunger: G.hungerState(full), updated: r.updated_at
    };
  }

  const lastLabel = n => (n == null ? 'never' : n === 0 ? 'today' : n === 1 ? 'yesterday' : `${n} days ago`);

  function dashboard() {
    const packs = [...new Set(rows.map(r => r.pack).filter(Boolean))].sort();
    const today = rows.filter(r => r.daysAgo === 0).length;
    const week = rows.filter(r => r.daysAgo != null && r.daysAgo < 7).length;
    const avg = rows.length ? Math.round(rows.reduce((a, r) => a + r.overall, 0) / rows.length) : 0;
    shell(`
      <div class="admin-tiles">
        <div><b>${rows.length}</b><small>kids</small></div>
        <div><b>${packs.length}</b><small>packs</small></div>
        <div><b>${today}</b><small>practiced today</small></div>
        <div><b>${week}</b><small>active this week</small></div>
        <div><b>${avg}</b><small>avg rating /1600</small></div>
      </div>
      <div class="admin-controls">
        <input class="big-input" id="q" placeholder="Search by name" value="${esc(view.q)}">
        <select id="pack"><option value="">All packs</option>${packs.map(p => `<option ${view.pack === p ? 'selected' : ''}>${esc(p)}</option>`).join('')}<option value="__none" ${view.pack === '__none' ? 'selected' : ''}>No pack</option></select>
        <select id="sort">${[['active', 'Last active'], ['overall', 'Overall rating'], ['streak', 'Streak'], ['lessons', 'Lessons'], ['name', 'Name']].map(([v, l]) => `<option value="${v}" ${view.sort === v ? 'selected' : ''}>Sort: ${l}</option>`).join('')}</select>
        <button class="btn ghost sm" id="csv">Download CSV</button>
      </div>
      <div class="card admin-table-wrap"><table class="admin-table"><thead><tr>
        <th>Kid</th><th>Pack</th><th>Overall</th><th>Math</th><th>R&amp;W</th><th>Math level</th><th>R&amp;W level</th><th>Streak</th><th>Last lesson</th><th>Lessons</th><th>Accuracy</th><th>XP this week</th><th>Dog</th>
      </tr></thead><tbody id="tbody"></tbody></table></div>
      <p class="muted small center">Click a row for that kid's radar maps and every question-type rating.</p>`);
    const draw = () => {
      let list = rows.filter(r => r.name.toLowerCase().includes(view.q.toLowerCase()));
      if (view.pack === '__none') list = list.filter(r => !r.pack); else if (view.pack) list = list.filter(r => r.pack === view.pack);
      const by = {
        active: (a, b) => (a.daysAgo ?? 1e9) - (b.daysAgo ?? 1e9), overall: (a, b) => b.overall - a.overall,
        streak: (a, b) => b.streak - a.streak, lessons: (a, b) => b.lessons - a.lessons, name: (a, b) => a.name.localeCompare(b.name)
      }[view.sort];
      list.sort(by);
      $('#tbody').innerHTML = list.map(r => `<tr data-id="${r.id}">
        <td class="kid"><span class="kid-dog">${D.dog(r.avatar, { mood: r.hunger.mood })}</span><b>${esc(r.name)}</b></td>
        <td>${esc(r.pack) || '<span class="muted">—</span>'}</td>
        <td><b>${r.overall}</b><small class="muted">/1600</small></td>
        <td>${r.math}</td><td>${r.rw}</td>
        <td>${r.mathLevel} · ${esc(G.levelName('math', r.mathLevel))}</td>
        <td>${r.rwLevel} · ${esc(G.levelName('rw', r.rwLevel))}</td>
        <td>${r.streak ? '🔥 ' + r.streak : '—'}</td>
        <td class="${r.daysAgo === 0 ? 'ok-text' : r.daysAgo == null || r.daysAgo > 2 ? 'warn-text' : ''}">${lastLabel(r.daysAgo)}</td>
        <td>${r.lessons}</td><td>${r.accuracy == null ? '—' : r.accuracy + '%'}</td><td>${r.weekXp}</td>
        <td><span style="color:${r.hunger.color};font-weight:800">${esc(r.hunger.name)}</span></td>
      </tr>`).join('') || '<tr><td colspan="13" class="center muted">No players match.</td></tr>';
      $$('#tbody tr[data-id]').forEach(tr => tr.addEventListener('click', () => detail(rows.find(r => r.id === tr.dataset.id))));
    };
    $('#q').addEventListener('input', e => { view.q = e.target.value; draw(); });
    $('#pack').addEventListener('change', e => { view.pack = e.target.value; draw(); });
    $('#sort').addEventListener('change', e => { view.sort = e.target.value; draw(); });
    $('#csv').addEventListener('click', csv);
    draw();
  }

  function radar(sec, r, color) {
    const types = G.TYPE_ORDER[sec].filter(id => window.SAT.countFor(sec, null, id));
    const size = 440, c = size / 2, R = 130, N = types.length;
    const radius = v => Math.max(0.03, Math.min(1, (v - 200) / 600));
    const pt = (i, rr) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / N; return [c + rr * Math.cos(a), c + rr * Math.sin(a)]; };
    const ring = f => types.map((_, i) => pt(i, R * f).map(v => v.toFixed(1)).join(',')).join(' ');
    const vals = types.map(k => r.types[k].rating);
    return `<svg class="radar" viewBox="0 0 ${size} ${size}" role="img" aria-label="${sec === 'math' ? 'Math' : 'Reading and Writing'} radar">
      ${[350, 500, 650, 800].map(v => `<polygon points="${ring(radius(v))}" class="rg"/>`).join('')}
      ${types.map((_, i) => { const [x, y] = pt(i, R); return `<line x1="${c}" y1="${c}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" class="rg"/>`; }).join('')}
      <polygon points="${vals.map((v, i) => pt(i, R * radius(v)).map(n => n.toFixed(1)).join(',')).join(' ')}" fill="${color}" fill-opacity=".28" stroke="${color}" stroke-width="3"/>
      ${types.map((k, i) => { const [x, y] = pt(i, R + 22); const anchor = Math.abs(x - c) < 8 ? 'middle' : x > c ? 'start' : 'end';
        return `<text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="${anchor}" class="rl">${esc(G.TYPE_SHORT[k] || G.typeName(sec, k))}</text><text x="${x.toFixed(1)}" y="${(y + 18).toFixed(1)}" text-anchor="${anchor}" class="rv">${r.types[k].n ? vals[i] : '—'}</text>`; }).join('')}
    </svg>`;
  }

  function detail(r) {
    const wrap = document.createElement('div');
    wrap.className = 'sheet-wrap in';
    const typeRows = sec => G.TYPE_ORDER[sec].map(k => {
      const t = r.types[k], tt = G.ratingTitle(t.rating);
      return `<tr><td>${esc(G.typeName(sec, k))}</td><td><b>${t.rating}</b></td><td style="color:${tt.color};font-weight:800">${tt.name}</td><td>${t.n}${t.n < G.LOW_EVIDENCE ? ' <span class="muted">(settling)</span>' : ''}</td></tr>`;
    }).join('');
    wrap.innerHTML = `<div class="sheet wide admin-detail" role="dialog" aria-modal="true"><button class="sheet-x" aria-label="Close">✕</button>
      <div class="admin-detail-head"><div class="kid-dog big">${D.dog(r.avatar, { mood: r.hunger.mood, body: true })}</div>
        <div><h2>${esc(r.name)}</h2><p class="muted">${esc(r.pack || 'No pack')} · last lesson ${lastLabel(r.daysAgo)} · ${r.lessons} lessons · ${r.answered} questions${r.accuracy == null ? '' : ` · ${r.accuracy}% correct`}</p>
        <p><b>Overall ${r.overall}/1600</b> · Math ${r.math}/800 (Level ${r.mathLevel}) · R&amp;W ${r.rw}/800 (Level ${r.rwLevel}) · 🔥 ${r.streak}</p></div></div>
      <div class="two-col">
        <div class="card"><div class="card-title">📖 Reading &amp; Writing · ${r.rw}/800</div>${radar('rw', r, '#6366f1')}<table class="admin-mini"><tr><th>Question type</th><th>Rating</th><th>Title</th><th>Answers</th></tr>${typeRows('rw')}</table></div>
        <div class="card"><div class="card-title">📐 Math · ${r.math}/800</div>${radar('math', r, '#38b2f4')}<table class="admin-mini"><tr><th>Question type</th><th>Rating</th><th>Title</th><th>Answers</th></tr>${typeRows('math')}</table></div>
      </div></div>`;
    document.body.appendChild(wrap);
    const close = () => wrap.remove();
    $('.sheet-x', wrap).addEventListener('click', close);
    wrap.addEventListener('click', e => { if (e.target === wrap) close(); });
    document.addEventListener('keydown', function onKey(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); } });
  }

  function csv() {
    const head = ['name', 'pack', 'overall_1600', 'math_800', 'rw_800', 'math_level', 'rw_level', 'streak', 'last_lesson_days_ago', 'lessons', 'questions', 'accuracy_pct', 'xp_total', 'xp_this_week',
      ...['rw', 'math'].flatMap(sec => G.TYPE_ORDER[sec].map(k => `${sec}:${k}`))];
    const cell = v => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;
    const lines = [head.join(',')].concat(rows.map(r => [r.name, r.pack, r.overall, r.math, r.rw, r.mathLevel, r.rwLevel, r.streak, r.daysAgo, r.lessons, r.answered, r.accuracy, r.xp, r.weekXp,
      ...['rw', 'math'].flatMap(sec => G.TYPE_ORDER[sec].map(k => r.types[k].rating))].map(cell).join(',')));
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/csv' }));
    a.download = `fetch1600-players-${G.today()}.csv`;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  if (!base || !cfg.supabaseKey) notConfigured();
  else if (readSession()) load();
  else loginScreen();
})();
