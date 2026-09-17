/* UI kit: icons, sounds, confetti, sheets, toasts, small helpers. */
(function () {
  'use strict';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => [...(root || document).querySelectorAll(sel)];

  // ---------- Icons (dog themed) ----------
  // A paw print inside a 24x24 box, scaled and placed at (x, y).
  const paw = (fill, x = 0, y = 0, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})" fill="${fill}"><ellipse cx="12" cy="15.6" rx="5.2" ry="4.3"/><ellipse cx="5.8" cy="9.6" rx="2.2" ry="2.7" transform="rotate(-20 5.8 9.6)"/><ellipse cx="9.6" cy="5.6" rx="2.2" ry="2.8"/><ellipse cx="14.4" cy="5.6" rx="2.2" ry="2.8"/><ellipse cx="18.2" cy="9.6" rx="2.2" ry="2.7" transform="rotate(20 18.2 9.6)"/></g>`;
  const bone = (fill, stroke) => `<g transform="rotate(-35 12 12)" fill="${fill}" stroke="${stroke}" stroke-width="1"><rect x="5" y="9.6" width="14" height="4.8" rx="2"/><circle cx="5" cy="9.4" r="3"/><circle cx="5" cy="14.6" r="3"/><circle cx="19" cy="9.4" r="3"/><circle cx="19" cy="14.6" r="3"/><rect x="5" y="9.6" width="14" height="4.8" stroke="none"/></g>`;
  const ICON = {
    paw: (fill = 'currentColor') => `<svg viewBox="0 0 24 24" class="ic">${paw(fill)}</svg>`,
    flame: (on = true) => `<svg viewBox="0 0 24 24" class="ic"><path d="M12 1.5c1.2 3.6 6.3 6.2 6.3 12A6.3 6.3 0 0 1 12 20a6.3 6.3 0 0 1-6.3-6.5c0-2.7 1.4-4.5 2.7-5.8.2 1.9 1 3.1 2.1 3.7C10.4 7.8 10.9 4.7 12 1.5z" fill="${on ? '#ff9600' : '#c9ced6'}"/>${paw(on ? '#fff3c4' : '#eef0f3', 7.3, 9.6, 0.4)}</svg>`,
    treat: () => `<svg viewBox="0 0 24 24" class="ic">${bone('#e8b97c', '#b9854a')}</svg>`,
    heart: (on = true) => `<svg viewBox="0 0 24 24" class="ic"><path d="M12 21s-8.5-5.3-8.5-11.2A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 8.5 3.2C20.5 15.7 12 21 12 21z" fill="${on ? '#ff4b4b' : '#c9ced6'}"/>${paw('#fff', 8, 8.2, 0.34)}</svg>`,
    bolt: () => '<svg viewBox="0 0 24 24" class="ic"><path d="M13.5 2L4 13.5h6.5L9.5 22 20 9.5h-6.8z" fill="#ffc800"/></svg>',
    bowl: (color = '#38b2f4') => `<svg viewBox="0 0 24 24" class="ic"><ellipse cx="12" cy="11.5" rx="8" ry="3" fill="#c28840"/><circle cx="9" cy="10.6" r="1.6" fill="#8a5a2b"/><circle cx="13" cy="10" r="1.6" fill="#8a5a2b"/><circle cx="15.5" cy="11.2" r="1.4" fill="#8a5a2b"/><path d="M3 11.5h18l-2.2 7.5a2 2 0 0 1-1.9 1.4H7.1a2 2 0 0 1-1.9-1.4z" fill="${color}"/>${paw('#fff', 9.2, 13, 0.24)}</svg>`,
    // Treat bag (was a treasure chest)
    chest: (open) => `<svg viewBox="0 0 48 48" class="ic"><path d="M9 17h30l3 25a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z" fill="${open ? '#d4d8de' : '#d9a15b'}"/><path d="M9 17l4-9h22l4 9z" fill="${open ? '#bfc5cc' : '#b9803f'}"/><path d="M13 8l2 9M35 8l-2 9" stroke="${open ? '#aab1bb' : '#9a6630'}" stroke-width="1.5"/><g transform="translate(12 18) scale(1)">${bone(open ? '#eef0f3' : '#fff7ea', open ? '#c9ced6' : '#9a6630')}</g></svg>`,
    trophy: (on = true) => `<svg viewBox="0 0 48 48" class="ic"><path d="M14 6h20v12a10 10 0 0 1-20 0z" fill="${on ? '#ffc800' : '#c9ced6'}"/><path d="M14 10H7a7 7 0 0 0 7 9M34 10h7a7 7 0 0 1-7 9" fill="none" stroke="${on ? '#e5a800' : '#aab1bb'}" stroke-width="3"/><rect x="21" y="27" width="6" height="8" fill="${on ? '#e5a800' : '#aab1bb'}"/><rect x="14" y="35" width="20" height="6" rx="2" fill="${on ? '#b87d00' : '#9aa1ab'}"/>${paw(on ? '#fff' : '#eef0f3', 17.5, 7, 0.55)}</svg>`,
    star: () => `<svg viewBox="0 0 24 24" class="ic">${paw('currentColor')}</svg>`,
    lock: () => '<svg viewBox="0 0 24 24" class="ic"><rect x="5" y="10" width="14" height="11" rx="2.5" fill="currentColor"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>',
    check: () => '<svg viewBox="0 0 24 24" class="ic"><path d="M4.5 12.5l5 5 10-11" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    close: () => '<svg viewBox="0 0 24 24" class="ic"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
    // Magnifying glass over a paw print (Scent Tracker)
    scent: () => `<svg viewBox="0 0 24 24" class="ic"><circle cx="10" cy="10" r="7" fill="#fff" stroke="#6366f1" stroke-width="2.6"/>${paw('#6366f1', 5.2, 5.4, 0.4)}<path d="M15.2 15.2l5.6 5.6" stroke="#6366f1" stroke-width="3.2" stroke-linecap="round"/></svg>`,
    // Tennis ball (practice)
    dumbbell: () => '<svg viewBox="0 0 24 24" class="ic"><circle cx="12" cy="12" r="9" fill="#c6e84a"/><path d="M4.5 7.5c3.5 1.5 4.5 7.5 1 11M19.5 7.5c-3.5 1.5-4.5 7.5-1 11" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
    // Tab bar icons
    home: () => `<svg viewBox="0 0 28 28" class="tab-ic">${paw('#38b2f4', 1, 11, 0.62)}${paw('#1a8ad1', 11, 1, 0.62)}</svg>`,
    league: () => `<svg viewBox="0 0 28 28" class="tab-ic"><path d="M8 3h12v8a6 6 0 0 1-12 0z" fill="#ffc800"/><path d="M8 5H4a4 4 0 0 0 4 6M20 5h4a4 4 0 0 1-4 6" fill="none" stroke="#e5a800" stroke-width="2"/><rect x="12.5" y="16.5" width="3" height="5" fill="#e5a800"/><rect x="8" y="21" width="12" height="4" rx="1.5" fill="#b87d00"/>${paw('#fff', 10, 3.2, 0.33)}</svg>`,
    quests: () => `<svg viewBox="0 0 28 28" class="tab-ic"><path d="M6 10h16l2 15H4z" fill="#d9a15b"/><path d="M6 10l2.5-6h11l2.5 6z" fill="#b9803f"/><g transform="translate(5 9) scale(.75)">${bone('#fff7ea', '#9a6630')}</g></svg>`,
    squad: () => `<svg viewBox="0 0 28 28" class="tab-ic"><g fill="#8fa3ad"><circle cx="19" cy="12" r="6.5"/><ellipse cx="13.6" cy="12" rx="2.6" ry="5" transform="rotate(15 13.6 12)"/><ellipse cx="24.4" cy="12" rx="2.6" ry="5" transform="rotate(-15 24.4 12)"/></g><g fill="#38b2f4"><circle cx="10" cy="16" r="7"/><ellipse cx="4.2" cy="16" rx="2.8" ry="5.4" transform="rotate(15 4.2 16)"/><ellipse cx="15.8" cy="16" rx="2.8" ry="5.4" transform="rotate(-15 15.8 16)"/></g><circle cx="7.5" cy="15" r="1.1" fill="#1f1f2e"/><circle cx="12.5" cy="15" r="1.1" fill="#1f1f2e"/><ellipse cx="10" cy="18.5" rx="1.6" ry="1.2" fill="#1f1f2e"/></svg>`,
    shop: () => '<svg viewBox="0 0 28 28" class="tab-ic"><path d="M14 2L2 12h3v13h18V12h3z" fill="#ff6b4a"/><path d="M5 12h18v13H5z" fill="#ffb37a"/><path d="M14 2L2 12h3l9-7.5 9 7.5h3z" fill="#d9442b"/><path d="M10 25v-6a4 4 0 0 1 8 0v6z" fill="#5a2f1a"/><rect x="11" y="9" width="6" height="3" rx="1" fill="#fff"/></svg>',
    profile: () => '<svg viewBox="0 0 28 28" class="tab-ic"><circle cx="14" cy="14" r="11" fill="#6366f1"/></svg>'
  };

  // Dogs (player avatars) and the mascot pair live in dogs.js.
  const dog = (avatar, opts) => window.DOGS.dog(avatar, opts);
  const duo = opts => window.DOGS.duo(opts);

  function leagueShield(tier, size) {
    const L = window.GAME.LEAGUES[tier] || window.GAME.LEAGUES[0];
    return `<svg class="shield" viewBox="0 0 40 46" width="${size || 40}" height="${(size || 40) * 1.15}" aria-label="${esc(L.name)} League">
      <path d="M20 2l16 5v14c0 11-7 18-16 23C11 39 4 32 4 21V7z" fill="${L.color}"/>
      <path d="M20 2v42C11 39 4 32 4 21V7z" fill="#fff" opacity=".18"/>
      <path d="M20 13l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L20 27.3l-5.6 2.9 1.1-6.2-4.5-4.4 6.2-.9z" fill="#fff" opacity=".9"/></svg>`;
  }

  // ---------- Sound (synthesized, no files) ----------
  let ctx = null;
  function tone(freq, start, dur, type, vol) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, ctx.currentTime + start);
    g.gain.exponentialRampToValueAtTime(vol || 0.18, ctx.currentTime + start + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
    o.connect(g).connect(ctx.destination);
    o.start(ctx.currentTime + start); o.stop(ctx.currentTime + start + dur + 0.05);
  }
  const SOUNDS = {
    correct: () => { tone(880, 0, 0.12, 'triangle'); tone(1318.5, 0.09, 0.22, 'triangle'); },
    wrong: () => { tone(220, 0, 0.18, 'square', 0.07); tone(174.6, 0.12, 0.28, 'square', 0.07); },
    complete: () => [523.3, 659.3, 784, 1046.5].forEach((f, i) => tone(f, i * 0.11, 0.35, 'triangle', 0.16)),
    chest: () => [1046.5, 1318.5, 1568, 2093].forEach((f, i) => tone(f, i * 0.06, 0.25, 'sine', 0.12)),
    tap: () => tone(600, 0, 0.05, 'sine', 0.06),
    combo: () => { tone(987.8, 0, 0.1, 'triangle', 0.12); tone(1318.5, 0.07, 0.1, 'triangle', 0.12); tone(1760, 0.14, 0.18, 'triangle', 0.12); }
  };
  function sound(name) {
    const G = window.GAME;
    if (!G.s || !G.s.settings.sound) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      SOUNDS[name] && SOUNDS[name]();
    } catch (e) { /* audio unavailable */ }
  }
  const buzz = ms => { try { if (navigator.vibrate && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) navigator.vibrate(ms); } catch (e) { /* ignore */ } };

  // ---------- Confetti ----------
  function confetti(amount) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const c = document.createElement('canvas');
    c.className = 'confetti';
    document.body.appendChild(c);
    const dpr = window.devicePixelRatio || 1;
    c.width = innerWidth * dpr; c.height = innerHeight * dpr;
    const g = c.getContext('2d'); g.scale(dpr, dpr);
    const colors = ['#58cc02', '#1cb0f6', '#ffc800', '#ff4b91', '#ff9600', '#9b5de5'];
    const parts = Array.from({ length: amount || 140 }, () => ({
      x: innerWidth / 2 + (Math.random() - 0.5) * innerWidth * 0.3, y: innerHeight * 0.35,
      vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 15 - 4, r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
      w: 6 + Math.random() * 6, h: 8 + Math.random() * 8, color: colors[Math.floor(Math.random() * colors.length)]
    }));
    let frame = 0;
    (function step() {
      g.clearRect(0, 0, innerWidth, innerHeight);
      for (const p of parts) {
        p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.color; g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.cos(frame / 6 + p.r)); g.restore();
      }
      if (++frame < 150 && c.isConnected) requestAnimationFrame(step); else c.remove();
    })();
    setTimeout(() => c.remove(), 3500);   // animation frames pause in background tabs
  }

  // ---------- Toasts and sheets ----------
  function toast(html, ms) {
    let host = $('#toasts');
    if (!host) { host = document.createElement('div'); host.id = 'toasts'; document.body.appendChild(host); }
    const t = document.createElement('div');
    t.className = 'toast'; t.innerHTML = html;
    host.appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, ms || 2600);
  }

  // A bottom sheet (mobile) / centered dialog (desktop). Returns { el, close }.
  function sheet(html, opts) {
    opts = opts || {};
    const wrap = document.createElement('div');
    wrap.className = 'sheet-wrap';
    wrap.innerHTML = `<div class="sheet ${opts.cls || ''}" role="dialog" aria-modal="true">${opts.noClose ? '' : `<button class="sheet-x" aria-label="Close">${ICON.close()}</button>`}${html}</div>`;
    document.body.appendChild(wrap);
    requestAnimationFrame(() => wrap.classList.add('in'));
    let closed = false;
    const close = () => {
      if (closed) return; closed = true;
      wrap.classList.remove('in');
      setTimeout(() => wrap.remove(), 220);
      document.removeEventListener('keydown', onKey);
      opts.onClose && opts.onClose();
    };
    const onKey = e => { if (e.key === 'Escape' && !opts.noClose) close(); };
    document.addEventListener('keydown', onKey);
    wrap.addEventListener('click', e => { if (e.target === wrap && !opts.noClose) close(); });
    const x = $('.sheet-x', wrap); if (x) x.addEventListener('click', close);
    return { el: $('.sheet', wrap), close };
  }
  // Promise-based confirm built on sheet.
  function confirmSheet({ title, body, yes, no, mood, danger }) {
    return new Promise(resolve => {
      let answer = false;
      const sh = sheet(`<div class="center">${mood ? `<div class="sheet-duo">${duo({ mood })}</div>` : ''}
        <h2>${title}</h2>${body ? `<p class="muted">${body}</p>` : ''}
        <div class="stack"><button class="btn ${danger ? 'red' : 'green'} wide" data-yes>${yes || 'OK'}</button>
        <button class="btn ghost wide" data-no>${no || 'Cancel'}</button></div></div>`, { onClose: () => resolve(answer) });
      $('[data-yes]', sh.el).addEventListener('click', () => { answer = true; sh.close(); });
      $('[data-no]', sh.el).addEventListener('click', () => sh.close());
    });
  }

  // ---------- Small helpers ----------
  function countUp(el, to, ms) {
    const from = 0, start = performance.now();
    ms = ms || 900;
    (function step(now) {
      const t = Math.min(1, (now - start) / ms);
      el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - t, 3))).toLocaleString();
      if (t < 1) requestAnimationFrame(step);
    })(start);
  }
  function fmtDur(ms) {
    const m = Math.floor(ms / 60000), sec = Math.floor(ms / 1000) % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  }
  function fmtLeft(ms) {
    const h = Math.floor(ms / 3600000), d = Math.floor(h / 24);
    if (d >= 1) return `${d} day${d > 1 ? 's' : ''}`;
    if (h >= 1) return `${h} hour${h > 1 ? 's' : ''}`;
    return `${Math.max(1, Math.ceil(ms / 60000))} min`;
  }
  function ago(iso) {
    const s = (Date.now() - new Date(iso)) / 1000;
    if (s < 60) return 'just now';
    if (s < 3600) return Math.floor(s / 60) + 'm ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago';
    return Math.floor(s / 86400) + 'd ago';
  }
  function ring(pct, size, color, inner) {
    const r = size / 2 - 5, c = 2 * Math.PI * r;
    return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="var(--line)" stroke-width="8" fill="none"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="${color}" stroke-width="8" fill="none" stroke-linecap="round"
        stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - Math.max(0, Math.min(1, pct)))}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
      ${inner || ''}</svg>`;
  }
  function download(name, text, type) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: type || 'text/plain' }));
    a.download = name; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); toast('Copied!'); } catch (e) { window.prompt('Copy this:', text); }
  }

  window.UI = { esc, $, $$, ICON, paw, dog, duo, leagueShield, sound, buzz, confetti, toast, sheet, confirmSheet, countUp, fmtDur, fmtLeft, ago, ring, download, copy };
})();
