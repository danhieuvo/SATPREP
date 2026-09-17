/* App shell: boot, hash router, tab bar, and syncing with the pack backend. */
(function () {
  'use strict';
  const G = window.GAME, U = window.UI, B = window.BACKEND, SC = window.SCREENS;
  const { $, esc, ICON } = U;
  const TABS = [
    ['learn', 'Learn', ICON.home], ['practice', 'Practice', ICON.dumbbell], ['leagues', 'Leagues', ICON.league], ['quests', 'Quests', ICON.quests],
    ['squad', 'Pack', ICON.squad], ['shop', 'Doghouse', ICON.shop], ['tracker', 'Scent Tracker', ICON.scent],
    ['profile', 'Profile', () => `<i class="tab-ic tab-dog">${U.dog(G.s.avatar, { mood: G.hungerState(G.fullness()).mood })}</i>`]
  ];

  const APP = {
    squad: { players: [], events: [], at: 0, loading: false },
    syncWarned: false,

    async boot(joinCode) {
      const params = new URLSearchParams(location.search);
      joinCode = joinCode || (params.get('join') || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) || null;
      document.body.classList.remove('in-lesson');
      if (!G.s) { renderTabs(null); SC.welcome($('#app'), joinCode); return; }
      if (params.has('join')) history.replaceState(null, '', location.pathname + (location.hash || '#/learn'));
      G.tick();
      if (G.needsWeekRoll()) {
        let rows = null;
        if (G.s.squad) { try { rows = await B.players(G.s.squad.code); } catch (e) { rows = null; } } else rows = [];
        G.rollWeek(rows);
      }
      if (!location.hash || location.hash === '#/') location.hash = '#/learn';
      APP.render();
      APP.sync();
      if (joinCode && (!G.s.squad || G.s.squad.code !== joinCode)) {
        const ok = await U.confirmSheet({ title: `Join pack ${esc(joinCode)}?`, body: G.s.squad ? `You'll leave ${esc(G.s.squad.name)}.` : 'Compete with your friends in weekly leagues.', yes: 'Join pack', no: 'Not now' });
        if (ok) await SC.joinSquad(joinCode);
      }
      APP.refreshSquad(true);
      setTimeout(SC.showPending, 400);
    },

    render() {
      if (!G.s) return APP.boot();
      if (document.body.classList.contains('in-lesson')) return;
      const tab = (location.hash.match(/^#\/(\w+)/) || [])[1] || 'learn';
      const app = $('#app');
      const view = SC[tab] && TABS.some(t => t[0] === tab) ? SC[tab] : SC.learn;
      const y = APP.lastTab === tab ? window.scrollY : 0;
      view(app);
      renderTabs(tab);
      if (APP.lastTab === tab) window.scrollTo(0, y);
      else if (tab !== 'learn') window.scrollTo(0, 0);
      APP.lastTab = tab;
    },

    // Push this player's progress to the backend (public squad row + private backup).
    async sync() {
      if (!G.s) return;
      try { await B.save(G.s); }
      catch (e) {
        if (!APP.syncWarned && B.mode === 'cloud') { APP.syncWarned = true; U.toast("Couldn't reach the pack server. Your progress is saved on this device.", 3500); }
      }
    },

    async refreshSquad(force) {
      const s = G.s;
      if (!s || !s.squad || APP.squad.loading) return;
      if (!force && Date.now() - APP.squad.at < 30000) return;
      APP.squad.loading = true;
      try {
        const [players, events] = await Promise.all([B.players(s.squad.code), B.events(s.squad.code)]);
        APP.squad = { players: players || [], events: events || [], at: Date.now(), loading: false };
        checkNudges();
        const tab = (location.hash.match(/^#\/(\w+)/) || [])[1];
        if (['leagues', 'quests', 'squad', 'learn'].includes(tab) && !document.querySelector('.sheet-wrap') && !document.body.classList.contains('in-lesson')) APP.render();
      } catch (e) {
        APP.squad.loading = false;
      }
    },

    afterSession(out) {
      const s = G.s;
      (async () => {
        await APP.sync();
        for (const [kind, body] of out.events) { try { await B.post(s, kind, body); } catch (e) { /* offline */ } }
        APP.refreshSquad(true);
      })();
    }
  };

  function checkNudges() {
    const s = G.s;
    const byId = Object.fromEntries(APP.squad.players.map(p => [p.id, p.data || {}]));
    const fresh = APP.squad.events.filter(e => e.kind === 'nudge' && e.target === s.id && e.id > (s.seenEvent || 0));
    if (!fresh.length) return;
    s.seenEvent = Math.max(...fresh.map(e => e.id));
    const e = fresh[0], from = byId[e.player] || {};
    if (s.lastLessonDay !== G.today()) s.pending.push({ kind: 'nudge', from: from.name || 'A friend', avatar: from.avatar, msg: (e.body || {}).msg || 'Time to practice!' });
    G.save();
    setTimeout(SC.showPending, 300);
  }

  function renderTabs(active) {
    const nav = $('#tabs');
    if (!active) { nav.innerHTML = ''; nav.hidden = true; return; }
    nav.hidden = false;
    const s = G.s;
    const badge = {
      quests: s.quests && s.quests.list.some(q => q.progress >= q.target && !q.claimed),
      learn: s.lastLessonDay !== G.today(),
      shop: G.fullness() < 35
    };
    nav.innerHTML = `<a class="side-brand" href="#/learn">🐾 Fetch 1600</a>` + TABS.map(([id, label, icon]) =>
      `<a href="#/${id}" class="tab ${id === active ? 'on' : ''}" aria-label="${label}">${icon()}<span>${label}</span>${badge[id] ? '<i class="dot"></i>' : ''}</a>`).join('');
  }

  window.addEventListener('hashchange', () => { if (G.s && !document.body.classList.contains('in-lesson')) APP.render(); });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible' || !G.s || document.body.classList.contains('in-lesson')) return;
    const day = G.today();
    if (APP.day !== day || G.needsWeekRoll()) { APP.day = day; APP.boot(); }
    else APP.refreshSquad();
  });
  APP.day = G.today();

  window.APP = APP;
  $('#app-version').textContent = `Fetch 1600 · ${G.VERSION}`;
  APP.boot();

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
