/* Squad backend. "cloud" talks to a Supabase project (see supabase.sql and README) so friends on
   different phones share leagues and a feed. Without config it runs in "local" mode: squads only
   include profiles on this device, which is enough to try everything out. */
(function () {
  'use strict';
  const cfg = window.SQ_CONFIG || {};
  const G = window.GAME;
  const cloud = !!(cfg.supabaseUrl && cfg.supabaseKey);

  // ---------- Supabase over plain fetch (no SDK) ----------
  const base = cloud ? cfg.supabaseUrl.replace(/\/+$/, '') + '/rest/v1' : '';
  function headers() {
    const h = { apikey: cfg.supabaseKey, 'Content-Type': 'application/json' };
    if (/^eyJ/.test(cfg.supabaseKey)) h.Authorization = 'Bearer ' + cfg.supabaseKey;   // legacy anon JWT keys
    return h;
  }
  async function rest(path, opts) {
    const res = await fetch(base + path, Object.assign({ headers: headers() }, opts));
    if (!res.ok) {
      let msg = res.status + '';
      try { const j = await res.json(); msg = j.message || j.hint || msg; } catch (e) { /* not JSON */ }
      throw new Error(msg);
    }
    const txt = await res.text();
    return txt ? JSON.parse(txt) : null;
  }
  const rpc = (fn, args) => rest('/rpc/' + fn, { method: 'POST', body: JSON.stringify(args) });
  const enc = encodeURIComponent;

  const Cloud = {
    mode: 'cloud',
    async createSquad(name) {
      for (let tries = 0; tries < 5; tries++) {
        const code = newCode();
        try { await rpc('sq_create_squad', { p_code: code, p_name: name }); return { code, name }; } catch (e) { if (!/exists|duplicate/i.test(e.message)) throw e; }
      }
      throw new Error('Could not create a pack code. Try again.');
    },
    async getSquad(code) {
      const rows = await rest(`/sq_squads?code=eq.${enc(code)}&select=code,name`);
      return rows && rows[0] ? rows[0] : null;
    },
    async players(code) {
      return rest(`/sq_players?squad=eq.${enc(code)}&select=id,data,updated_at&limit=100`);
    },
    async events(code) {
      return rest(`/sq_events?squad=eq.${enc(code)}&select=id,player,target,kind,body,kudos,created_at&order=id.desc&limit=60`);
    },
    async save(s) {
      const { pending, ...priv } = s;
      await rpc('sq_save', { p_id: s.id, p_secret: s.secret, p_squad: s.squad ? s.squad.code : null, p_public: G.publicData(), p_private: priv });
    },
    async restore(id, secret) {
      return rpc('sq_restore', { p_id: id, p_secret: secret });
    },
    async post(s, kind, body, target) {
      if (!s.squad) return;
      await rpc('sq_post', { p_id: s.id, p_secret: s.secret, p_squad: s.squad.code, p_kind: kind, p_target: target || null, p_body: body || {} });
    },
    async kudos(s, eventId) {
      await rpc('sq_kudos', { p_id: s.id, p_secret: s.secret, p_event: eventId });
    }
  };

  // ---------- Local (this device only) ----------
  const DB_KEY = 'satquest.db';
  const db = () => { try { return Object.assign({ squads: {}, players: {}, events: [], seq: 0 }, JSON.parse(localStorage.getItem(DB_KEY))); } catch (e) { return { squads: {}, players: {}, events: [], seq: 0 }; } };
  const put = d => { try { localStorage.setItem(DB_KEY, JSON.stringify(d)); } catch (e) { /* ignore */ } };
  const Local = {
    mode: 'local',
    async createSquad(name) { const d = db(); let code; do { code = newCode(); } while (d.squads[code]); d.squads[code] = { code, name }; put(d); return { code, name }; },
    async getSquad(code) { return db().squads[code] || null; },
    async players(code) { return Object.values(db().players).filter(p => p.squad === code); },
    async events(code) { return db().events.filter(e => e.squad === code).slice(-60).reverse(); },
    async save(s) {
      const d = db();
      d.players[s.id] = { id: s.id, squad: s.squad ? s.squad.code : null, data: G.publicData(), updated_at: new Date().toISOString() };
      put(d);
    },
    async restore() { throw new Error('Transfer codes need the online pack server.'); },
    async post(s, kind, body, target) {
      if (!s.squad) return;
      const d = db();
      d.events.push({ id: ++d.seq, squad: s.squad.code, player: s.id, target: target || null, kind, body: body || {}, kudos: [], created_at: new Date().toISOString() });
      d.events = d.events.slice(-300);
      put(d);
    },
    async kudos(s, eventId) {
      const d = db(); const e = d.events.find(x => x.id === eventId);
      if (e && !e.kudos.includes(s.id)) e.kudos.push(s.id);
      put(d);
    }
  };

  // Pack codes avoid look-alike characters so they are easy to read aloud.
  function newCode() {
    const abc = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    const a = new Uint8Array(6); crypto.getRandomValues(a);
    return [...a].map(b => abc[b % abc.length]).join('');
  }

  window.BACKEND = cloud ? Cloud : Local;
})();
