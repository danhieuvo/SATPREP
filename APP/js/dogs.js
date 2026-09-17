/* Dogs: 20 breeds drawn from shared SVG parts, player color mixes, accessories, and the mascot pair
   (a black-and-white Shih Tzu and a white Maltese). */
(function () {
  'use strict';

  // The mascots: Gao (a girl, the white Maltese) and Soy (a boy, the black-and-white Shih Tzu).
  const MASCOTS = { shihtzu: 'Soy', maltese: 'Gao' };

  // Natural coat colors are free; the bright ones are unlocked in the shop.
  const COLORS = {
    white: { hex: '#f8f6f1', name: 'White' }, cream: { hex: '#f0dcb8', name: 'Cream' }, apricot: { hex: '#e9b27c', name: 'Apricot' },
    gold: { hex: '#d9a03f', name: 'Golden' }, red: { hex: '#c0652f', name: 'Red' }, tan: { hex: '#b9814a', name: 'Tan' },
    chocolate: { hex: '#6e4128', name: 'Chocolate' }, silver: { hex: '#c9ced5', name: 'Silver' }, grey: { hex: '#8f969e', name: 'Grey' },
    slate: { hex: '#56657a', name: 'Blue-grey' }, black: { hex: '#2b2b30', name: 'Black' },
    pink: { hex: '#ff8fc1', name: 'Bubblegum', fun: true }, mint: { hex: '#6ddcb2', name: 'Mint', fun: true },
    sky: { hex: '#6bb6ff', name: 'Sky Blue', fun: true }, lavender: { hex: '#b69cff', name: 'Lavender', fun: true },
    sunshine: { hex: '#ffd23f', name: 'Sunshine', fun: true }, neon: { hex: '#b8f000', name: 'Neon Lime', fun: true }
  };

  // ears: shape; head/earC/muzzleC: which color slot (c1, c2, c3; light = c1 lightened); marks: [pattern, slot]
  const BREEDS = [
    { id: 'shihtzu', name: 'Shih Tzu', ear: 'hairy', top: 'topknot', bow: '#ff4b6e', snout: 'flat', beard: true, slots: ['Coat', 'Markings'], colors: ['black', 'white'], marks: [['blaze', 'c2']], earC: 'c1', muzzleC: 'c2', paws: 'c2' },
    { id: 'maltese', name: 'Maltese', ear: 'hairy', top: 'topknot', bow: '#ff8fc1', snout: 'flat', beard: true, slots: ['Coat'], colors: ['white'], marks: [], earC: 'c1', muzzleC: 'c1' },
    { id: 'golden', name: 'Golden Retriever', ear: 'flop', snout: 'medium', slots: ['Coat', 'Muzzle'], colors: ['gold', 'cream'], marks: [], earC: 'c1', muzzleC: 'c2' },
    { id: 'lab', name: 'Labrador', ear: 'flop', snout: 'medium', slots: ['Coat'], colors: ['chocolate'], marks: [], earC: 'c1', muzzleC: 'light' },
    { id: 'shepherd', name: 'German Shepherd', ear: 'pointed', snout: 'medium', slots: ['Coat', 'Mask'], colors: ['tan', 'black'], marks: [['cap', 'c2'], ['longmask', 'c2']], earC: 'c2', muzzleC: 'c2', belly: 'light' },
    { id: 'husky', name: 'Husky', ear: 'pointed', snout: 'medium', eyes: 'blue', head: 'c2', slots: ['Coat', 'Face'], colors: ['slate', 'white'], marks: [['husky', 'c1']], earC: 'c1', muzzleC: 'c2', bodyC: 'c1', paws: 'c2', tail: 'curl' },
    { id: 'corgi', name: 'Corgi', ear: 'big', snout: 'short', slots: ['Coat', 'Markings'], colors: ['red', 'white'], marks: [['cheeks', 'c2'], ['blaze', 'c2']], earC: 'c1', muzzleC: 'c2', paws: 'c2' },
    { id: 'beagle', name: 'Beagle', ear: 'long', snout: 'medium', slots: ['Coat', 'Markings', 'Saddle'], colors: ['tan', 'white', 'black'], marks: [['cap', 'c3'], ['blaze', 'c2']], earC: 'c1', muzzleC: 'c2', paws: 'c2' },
    { id: 'dachshund', name: 'Dachshund', ear: 'long', snout: 'long', slots: ['Coat'], colors: ['red'], marks: [], earC: 'dark', muzzleC: 'light' },
    { id: 'poodle', name: 'Poodle', ear: 'curly', top: 'puff', snout: 'medium', slots: ['Coat'], colors: ['apricot'], marks: [], earC: 'c1', muzzleC: 'light' },
    { id: 'pug', name: 'Pug', ear: 'folded', snout: 'flat', slots: ['Coat', 'Mask'], colors: ['cream', 'black'], marks: [['wrinkles', 'c2']], earC: 'c2', muzzleC: 'c2', belly: 'light', tail: 'curl' },
    { id: 'frenchie', name: 'French Bulldog', ear: 'bat', snout: 'flat', slots: ['Coat', 'Markings'], colors: ['grey', 'white'], marks: [['blaze', 'c2']], earC: 'c1', muzzleC: 'c2', paws: 'c2' },
    { id: 'chihuahua', name: 'Chihuahua', ear: 'big', snout: 'short', slots: ['Coat', 'Markings'], colors: ['tan', 'cream'], marks: [['blaze', 'c2']], earC: 'c1', muzzleC: 'c2' },
    { id: 'pomeranian', name: 'Pomeranian', ear: 'small', top: 'ruff', snout: 'short', slots: ['Coat', 'Fluff'], colors: ['apricot', 'cream'], marks: [], earC: 'c1', muzzleC: 'c2', ruffC: 'c2', tail: 'curl' },
    { id: 'collie', name: 'Border Collie', ear: 'semi', snout: 'medium', slots: ['Coat', 'Markings'], colors: ['black', 'white'], marks: [['blaze', 'c2']], earC: 'c1', muzzleC: 'c2', paws: 'c2' },
    { id: 'dalmatian', name: 'Dalmatian', ear: 'flop', snout: 'medium', slots: ['Coat', 'Spots'], colors: ['white', 'black'], marks: [['spots', 'c2']], earC: 'c2', muzzleC: 'c1' },
    { id: 'shiba', name: 'Shiba Inu', ear: 'pointed', snout: 'short', slots: ['Coat', 'Cheeks'], colors: ['red', 'cream'], marks: [['cheeks', 'c2'], ['brows', 'c2']], earC: 'c1', muzzleC: 'c2', tail: 'curl' },
    { id: 'yorkie', name: 'Yorkshire Terrier', ear: 'small', top: 'topknot', bow: '#1cb0f6', snout: 'short', beard: true, slots: ['Face', 'Coat'], colors: ['tan', 'slate'], marks: [['cap', 'c2']], earC: 'c1', muzzleC: 'c1', bodyC: 'c2', paws: 'c1' },
    { id: 'boxer', name: 'Boxer', ear: 'folded', snout: 'flat', slots: ['Coat', 'Mask', 'Markings'], colors: ['tan', 'black', 'white'], marks: [['blaze', 'c3']], earC: 'c1', muzzleC: 'c2', belly: 'c3', paws: 'c3' },
    { id: 'cavalier', name: 'Cavalier King Charles', ear: 'long', snout: 'short', slots: ['Coat', 'Patches'], colors: ['white', 'red'], marks: [['patches', 'c2']], earC: 'c2', muzzleC: 'c1' }
  ];
  const BY_ID = Object.fromEntries(BREEDS.map(b => [b.id, b]));

  // ---------- Color helpers ----------
  function mix(a, b, t) {
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    const ch = s => [(s >> 16) & 255, (s >> 8) & 255, s & 255];
    const [r1, g1, b1] = ch(pa), [r2, g2, b2] = ch(pb);
    const h = v => Math.round(v).toString(16).padStart(2, '0');
    return '#' + h(r1 + (r2 - r1) * t) + h(g1 + (g2 - g1) * t) + h(b1 + (b2 - b1) * t);
  }
  const lum = hex => { const p = parseInt(hex.slice(1), 16); return (0.299 * ((p >> 16) & 255) + 0.587 * ((p >> 8) & 255) + 0.114 * (p & 255)) / 255; };

  // An avatar is { breed, colors: [key, key, key] | null, hat, eyes, neck, outfit }.
  function normalize(avatar) {
    const a = Object.assign({ breed: 'maltese', colors: null, hat: null, eyes: null, neck: null, outfit: null }, avatar || {});
    if (!BY_ID[a.breed]) a.breed = 'maltese';
    return a;
  }
  function palette(a) {
    const b = BY_ID[a.breed];
    const keys = b.colors.map((k, i) => (a.colors && COLORS[a.colors[i]] ? a.colors[i] : k));
    const hex = keys.map(k => COLORS[k].hex);
    const c1 = hex[0];
    const pick = ref => ({ c1, c2: hex[1] || mix(c1, '#ffffff', 0.55), c3: hex[2] || mix(c1, '#000000', 0.5), light: mix(c1, '#ffffff', lum(c1) > 0.7 ? 0.1 : 0.4), dark: mix(c1, '#000000', 0.25) }[ref] || c1);
    return { pick, c1 };
  }

  // ---------- Parts (left side; the right side is mirrored) ----------
  const MIRROR = 'matrix(-1 0 0 1 120 0)';
  const both = svg => `${svg}<g transform="${MIRROR}">${svg}</g>`;
  const EAR = {
    // drawn behind the head
    pointed: c => both(`<path d="M24 60 L30 8 L62 38 Z" fill="${c}"/><path d="M31 49 L34 21 L52 38 Z" fill="${mix(c, '#ffb3b3', 0.45)}"/>`),
    big: c => both(`<path d="M26 64 L8 2 L58 40 Z" fill="${c}"/><path d="M29 53 L16 15 L48 40 Z" fill="${mix(c, '#ffb3b3', 0.45)}"/>`),
    small: c => both(`<path d="M30 50 L36 18 L57 37 Z" fill="${c}"/><path d="M34 44 L38 26 L50 37 Z" fill="${mix(c, '#ffb3b3', 0.4)}"/>`),
    bat: c => both(`<path d="M24 58 C12 36 14 6 30 6 C46 6 60 30 60 40 Z" fill="${c}"/><path d="M30 48 C22 34 24 15 32 15 C42 17 52 32 52 40 Z" fill="${mix(c, '#ffb3b3', 0.45)}"/>`),
    semi: c => both(`<path d="M24 58 L32 16 L60 38 Z" fill="${c}"/><path d="M32 16 L18 34 L41 30 Z" fill="${mix(c, '#000000', 0.2)}"/>`),
    // drawn in front of the head
    flop: c => both(`<path d="M31 40 C13 38 5 60 7 82 C8 95 16 101 24 99 C33 96 35 82 35 66 C35 55 35 46 31 40 Z" fill="${c}"/>`),
    long: c => both(`<path d="M31 38 C11 36 1 62 3 93 C4 109 13 117 24 113 C35 109 37 90 37 70 C37 55 36 45 31 38 Z" fill="${c}"/>`),
    hairy: c => both(`<path d="M34 34 C10 32 -1 58 1 90 C2 106 7 119 15 117 C20 123 28 121 30 115 C37 117 41 106 39 92 C38 70 42 50 34 34 Z" fill="${c}"/><path d="M13 58 C9 78 11 98 15 112 M22 60 C20 80 22 98 25 110" stroke="${mix(c, lum(c) > 0.5 ? '#000000' : '#ffffff', 0.18)}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`),
    folded: c => both(`<path d="M22 46 C24 32 38 26 50 32 L38 58 C30 55 24 52 22 46 Z" fill="${c}"/>`),
    curly: c => both(`<g fill="${c}" stroke="${mix(c, '#000000', 0.12)}" stroke-width="1.5"><circle cx="20" cy="62" r="11"/><circle cx="15" cy="78" r="11"/><circle cx="19" cy="94" r="10"/><circle cx="27" cy="72" r="9"/></g>`)
  };
  const BEHIND = new Set(['pointed', 'big', 'small', 'bat', 'semi']);
  const HEAD = 'M60 30 C88 30 102 48 102 70 C102 94 84 108 60 108 C36 108 18 94 18 70 C18 48 32 30 60 30 Z';
  const MARK = {
    blaze: c => `<path d="M53 31 C55 44 50 60 47 82 L73 82 C70 60 65 44 67 31 C63 30 57 30 53 31 Z" fill="${c}"/>`,
    cheeks: c => `<path d="M60 70 C50 86 34 92 20 84 C26 100 42 108 60 108 C78 108 94 100 100 84 C86 92 70 86 60 70 Z" fill="${c}"/>`,
    cap: c => `<path d="M20 62 C21 42 38 30 60 30 C82 30 99 42 100 62 C90 54 78 51 70 55 C66 49 54 49 50 55 C42 51 30 54 20 62 Z" fill="${c}"/>`,
    husky: c => `<path d="M18 72 C18 44 36 30 60 30 C84 30 102 44 102 72 C94 58 82 54 72 58 L60 72 L48 58 C38 54 26 58 18 72 Z" fill="${c}"/>`,
    longmask: c => `<path d="M42 84 C42 70 51 64 60 64 C69 64 78 70 78 84 C78 98 70 106 60 106 C50 106 42 98 42 84 Z" fill="${c}"/>`,
    spots: c => `<g fill="${c}"><circle cx="34" cy="52" r="5"/><circle cx="82" cy="46" r="4"/><circle cx="90" cy="80" r="5"/><circle cx="29" cy="86" r="4"/><circle cx="63" cy="40" r="3.5"/><circle cx="74" cy="100" r="3.5"/><circle cx="46" cy="100" r="3"/></g>`,
    patches: c => `<ellipse cx="42" cy="62" rx="14" ry="15" fill="${c}"/><ellipse cx="78" cy="62" rx="14" ry="15" fill="${c}"/>`,
    brows: c => `<ellipse cx="43" cy="52" rx="4.5" ry="3" fill="${c}"/><ellipse cx="77" cy="52" rx="4.5" ry="3" fill="${c}"/>`,
    wrinkles: c => `<path d="M49 47 Q60 42 71 47 M51 53 Q60 49 69 53" stroke="${mix(c, '#000000', 0.1)}" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".55"/>`
  };
  const SNOUT = { flat: { cy: 86, rx: 17, ry: 12, ny: 80 }, short: { cy: 87, rx: 18, ry: 13, ny: 80 }, medium: { cy: 89, rx: 20, ry: 15, ny: 81 }, long: { cy: 93, rx: 19, ry: 18, ny: 82 } };

  // Accessories: several are music gear, to fit the app's dogs-and-music theme.
  const HATS = {
    cap: `<path d="M26 28 L60 14 L94 28 L60 42 Z" fill="#23232f"/><path d="M42 34 v9 c0 5 36 5 36 0 v-9 L60 42 Z" fill="#33333f"/><path d="M60 28 L88 32 L88 46" stroke="#ffc800" stroke-width="2.5" fill="none"/><circle cx="88" cy="48" r="3.5" fill="#ffc800"/>`,
    beanie: `<path d="M30 44 C30 10 90 10 90 44 Z" fill="#ff4b4b"/><rect x="27" y="38" width="66" height="11" rx="5.5" fill="#d93636"/><circle cx="60" cy="12" r="7" fill="#fff"/>`,
    party: `<path d="M45 38 L60 -2 L75 38 Z" fill="#1cb0f6"/><path d="M50 25 L70 25 M54 14 L66 14" stroke="#ffc800" stroke-width="4"/><circle cx="60" cy="-3" r="5" fill="#ff4b91"/>`,
    headphones: `<path d="M16 68 C14 16 106 16 104 68" stroke="#23232f" stroke-width="7" fill="none"/><rect x="7" y="56" width="16" height="28" rx="7" fill="#ff4b91"/><rect x="97" y="56" width="16" height="28" rx="7" fill="#ff4b91"/>`,
    rockstar: `<path d="M22 46 C22 30 40 22 60 22 C80 22 98 30 98 46 C86 40 74 38 60 38 C46 38 34 40 22 46 Z" fill="#2b2b30"/><path d="M30 44 L90 44" stroke="#ff4b4b" stroke-width="4"/><path d="M52 20 L56 30 L60 18 L64 30 L68 20" stroke="#ffd23f" stroke-width="3" fill="none" stroke-linejoin="round"/>`,
    wizard: `<path d="M34 42 L66 -6 L86 42 Z" fill="#6435c9"/><path d="M26 42 h68 a4 4 0 0 1 0 8 h-68 a4 4 0 0 1 0-8z" fill="#8e5cf7"/><path d="M62 16 l2.4 5 5.4.6-4 3.7 1.1 5.3-4.9-2.7-4.9 2.7 1.1-5.3-4-3.7 5.4-.6z" fill="#ffc800"/>`,
    crown: `<path d="M34 40 L38 12 L50 26 L60 6 L70 26 L82 12 L86 40 Z" fill="#ffc800" stroke="#e5a800" stroke-width="2.5" stroke-linejoin="round"/><circle cx="60" cy="30" r="4" fill="#ff4b4b"/><circle cx="45" cy="33" r="3" fill="#1cb0f6"/><circle cx="75" cy="33" r="3" fill="#58cc02"/>`
  };
  const EYES = {
    round: `<g fill="none" stroke="#23232f" stroke-width="3"><circle cx="44" cy="64" r="11"/><circle cx="76" cy="64" r="11"/><path d="M55 62 Q60 58 65 62"/></g>`,
    shades: `<path d="M31 56 h26 v8 a11 11 0 0 1-22 0 z M63 56 h26 v8 a11 11 0 0 1-22 0 z" fill="#15151f"/><path d="M57 59 h6" stroke="#15151f" stroke-width="3"/><path d="M36 59 l6 0" stroke="#fff" stroke-width="2" opacity=".5"/>`,
    stars: `<g fill="#ffd23f" stroke="#e5a800" stroke-width="1.5"><path d="M44 51 l3.8 8 8.7 1-6.4 6 1.7 8.6L44 70.3l-7.8 4.3 1.7-8.6-6.4-6 8.7-1z"/><path d="M76 51 l3.8 8 8.7 1-6.4 6 1.7 8.6L76 70.3l-7.8 4.3 1.7-8.6-6.4-6 8.7-1z"/></g>`
  };
  const NECK = {
    bandana: `<path d="M34 102 C50 110 70 110 86 102 L60 126 Z" fill="#ff4b4b"/><g fill="#fff" opacity=".8"><circle cx="50" cy="108" r="1.8"/><circle cx="66" cy="110" r="1.8"/><circle cx="58" cy="117" r="1.8"/></g>`,
    bowtie: `<path d="M60 112 L44 103 L44 121 Z M60 112 L76 103 L76 121 Z" fill="#23232f"/><circle cx="60" cy="112" r="4.5" fill="#3a3a48"/>`,
    collar: `<path d="M34 101 C48 109 72 109 86 101 L86 108 C72 116 48 116 34 108 Z" fill="#1cb0f6"/><circle cx="60" cy="118" r="6" fill="#ffc800" stroke="#e5a800" stroke-width="1.5"/>`,
    note: `<path d="M34 101 C48 109 72 109 86 101 L86 107 C72 115 48 115 34 107 Z" fill="#9b5de5"/><g fill="#ffd23f"><circle cx="56" cy="122" r="4.5"/><rect x="59.5" y="106" width="2.5" height="16"/><path d="M62 106 q7 2 6 9 q-2-4-6-4z"/></g>`
  };

  // Outfits for the full sitting dog. back = behind the body, body = over the torso, front = over the front legs.
  const SHIRT = 'M31 112 C25 132 25 160 29 180 L91 180 C95 160 95 132 89 112 C78 104 42 104 31 112 Z';
  const shortSleeves = c => `<rect x="28" y="143" width="22" height="18" rx="7" fill="${c}"/><rect x="70" y="143" width="22" height="18" rx="7" fill="${c}"/>`;
  const longSleeves = (c, cuff) => `<rect x="28" y="143" width="22" height="54" rx="10" fill="${c}"/><rect x="70" y="143" width="22" height="54" rx="10" fill="${c}"/>${cuff ? `<rect x="28" y="188" width="22" height="7" rx="3" fill="${cuff}"/><rect x="70" y="188" width="22" height="7" rx="3" fill="${cuff}"/>` : ''}`;
  const pawPrint = (x, y, c) => `<g fill="${c}"><ellipse cx="${x}" cy="${y + 5}" rx="8" ry="6.5"/><circle cx="${x - 9}" cy="${y - 4}" r="3.2"/><circle cx="${x - 3}" cy="${y - 8}" r="3.2"/><circle cx="${x + 3}" cy="${y - 8}" r="3.2"/><circle cx="${x + 9}" cy="${y - 4}" r="3.2"/></g>`;
  const OUTFITS = {
    tshirt: { body: `<path d="${SHIRT}" fill="#38b2f4"/>${pawPrint(60, 152, '#fff')}`, front: shortSleeves('#38b2f4') },
    raincoat: { body: `<path d="${SHIRT}" fill="#ffc800"/><path d="M60 118 V178" stroke="#e5a800" stroke-width="2"/><g fill="#8a6100"><circle cx="54" cy="132" r="2.6"/><circle cx="54" cy="148" r="2.6"/><circle cx="54" cy="164" r="2.6"/></g>`, front: longSleeves('#ffc800', '#e5a800') },
    hoodie: { body: `<path d="${SHIRT}" fill="#7c8594"/><path d="M33 114 C42 100 78 100 87 114 C76 124 44 124 33 114 Z" fill="#646c7a"/><path d="M54 118 V138 M66 118 V138" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="M42 158 H78 L74 176 H46 Z" fill="#646c7a"/>`, front: longSleeves('#7c8594', '#646c7a') },
    bandtee: { body: `<path d="${SHIRT}" fill="#23232f"/><g fill="#b69cff"><ellipse cx="55" cy="160" rx="6" ry="4.5" transform="rotate(-20 55 160)"/><rect x="59" y="132" width="3" height="28"/><path d="M62 132 q12 3 10 15 q-3-7-10-7z"/></g><text x="60" y="175" text-anchor="middle" font-family="system-ui, sans-serif" font-size="8" font-weight="900" fill="#ffd23f" letter-spacing="1">WOOF</text>`, front: shortSleeves('#23232f') },
    soccer: { body: `<path d="${SHIRT}" fill="#e53935"/><g fill="#fff"><rect x="46" y="113" width="7" height="65"/><rect x="57" y="112" width="7" height="66"/><rect x="68" y="113" width="7" height="65"/></g>`, front: `${shortSleeves('#e53935')}<rect x="28" y="155" width="22" height="5" fill="#fff"/><rect x="70" y="155" width="22" height="5" fill="#fff"/>` },
    basketball: { body: `<path d="M36 112 C30 132 28 160 31 180 L89 180 C92 160 90 132 84 112 C76 118 44 118 36 112 Z" fill="#1e40af"/><path d="M40 112 Q60 132 80 112" stroke="#ffc800" stroke-width="4" fill="none"/><text x="60" y="165" text-anchor="middle" font-family="system-ui, sans-serif" font-size="17" font-weight="900" fill="#fff" stroke="#ffc800" stroke-width=".8">800</text>`, front: '' },
    football: { body: `<path d="${SHIRT}" fill="#1f2937"/><ellipse cx="36" cy="124" rx="16" ry="11" fill="#374151"/><ellipse cx="84" cy="124" rx="16" ry="11" fill="#374151"/><text x="60" y="168" text-anchor="middle" font-family="system-ui, sans-serif" font-size="30" font-weight="900" fill="#fff">1</text>`, front: `${shortSleeves('#1f2937')}<rect x="28" y="152" width="22" height="3" fill="#ff9f1c"/><rect x="70" y="152" width="22" height="3" fill="#ff9f1c"/>` },
    varsity: { body: `<path d="${SHIRT}" fill="#1e3a8a"/><path d="M60 118 V178" stroke="#f5ecd7" stroke-width="2" stroke-dasharray="3 3"/><text x="74" y="146" text-anchor="middle" font-family="Georgia, serif" font-size="18" font-weight="900" fill="#f5ecd7">S</text><rect x="29" y="174" width="62" height="6" fill="#f5ecd7"/>`, front: longSleeves('#f5ecd7', '#1e3a8a') },
    tuxedo: { body: `<path d="${SHIRT}" fill="#16161d"/><path d="M48 108 L60 156 L72 108 Z" fill="#fff"/><path d="M48 108 L56 150 M72 108 L64 150" stroke="#3a3a48" stroke-width="3"/><g fill="#16161d"><circle cx="60" cy="130" r="1.8"/><circle cx="60" cy="140" r="1.8"/></g>`, front: longSleeves('#16161d', '#fff') },
    cape: { back: `<path d="M30 106 C10 150 0 190 -6 216 L126 216 C120 190 110 150 90 106 Z" fill="#e53935"/><path d="M-6 216 L126 216" stroke="#b71c1c" stroke-width="3"/>`, body: `<circle cx="60" cy="150" r="13" fill="#ffc800" stroke="#e53935" stroke-width="3"/><path d="M60 141 l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z" fill="#e53935"/><circle cx="36" cy="112" r="4" fill="#ffc800"/><circle cx="84" cy="112" r="4" fill="#ffc800"/>`, front: '' }
  };
  const LOVE = `<path d="M106 10 c-3-5-10-3-10 2 c0 5 10 11 10 11 s10-6 10-11 c0-5-7-7-10-2z" fill="#ff4b91"/><path d="M14 22 c-2-3.5-7-2-7 1.5 c0 3.5 7 7.5 7 7.5 s7-4 7-7.5 c0-3.5-5-5-7-1.5z" fill="#ff85b3"/>`;
  const BONE = (x, y) => `<g fill="#e0b27a" stroke="#b9854a" stroke-width="1"><rect x="${x - 9}" y="${y - 2.5}" width="18" height="5" rx="2"/><circle cx="${x - 10}" cy="${y - 3}" r="3.2"/><circle cx="${x - 10}" cy="${y + 3}" r="3.2"/><circle cx="${x + 10}" cy="${y - 3}" r="3.2"/><circle cx="${x + 10}" cy="${y + 3}" r="3.2"/></g>`;
  const THINK = `<g><circle cx="100" cy="34" r="3" fill="#fff" stroke="#c5ced8" stroke-width="1.5"/><circle cx="108" cy="22" r="5" fill="#fff" stroke="#c5ced8" stroke-width="1.5"/><ellipse cx="122" cy="2" rx="19" ry="14" fill="#fff" stroke="#c5ced8" stroke-width="1.5"/>${BONE(122, 2)}</g>`;

  // opts: { mood: normal|happy|love|worried|sad, body: true for the full sitting dog, think: show a hungry thought bubble }
  function dog(avatar, opts) {
    opts = opts || {};
    const a = normalize(avatar);
    const b = BY_ID[a.breed];
    const { pick } = palette(a);
    const head = pick(b.head || 'c1'), earC = pick(b.earC || 'c1'), muz = pick(b.muzzleC || 'c2');
    const ink = '#1f1f2e';
    const outline = 'rgba(0,0,0,.16)';
    const sn = SNOUT[b.snout] || SNOUT.medium;
    const mood = opts.mood || 'normal';
    const smiling = mood === 'happy' || mood === 'love';
    const eyeY = 64;
    // Eyes on dark fur get a light outline so they stay visible.
    const patch = b.marks.find(m => m[0] === 'patches');
    const darkFur = lum(patch ? pick(patch[1]) : head) < 0.3;
    const rim = darkFur ? 'rgba(255,255,255,.75)' : null;
    let eyes;
    if (smiling) eyes = [37, 69].map(x => `${rim ? `<path d="M${x} ${eyeY + 2} Q${x + 7} ${eyeY - 8} ${x + 14} ${eyeY + 2}" stroke="${rim}" stroke-width="8" fill="none" stroke-linecap="round"/>` : ''}<path d="M${x} ${eyeY + 2} Q${x + 7} ${eyeY - 8} ${x + 14} ${eyeY + 2}" stroke="${ink}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`).join('');
    else {
      const iris = b.eyes === 'blue' ? '#59b8ff' : ink;
      const r = mood === 'sad' ? 5.5 : 7;
      const y = mood === 'sad' ? eyeY + 2 : eyeY;
      eyes = [44, 76].map(x => `<circle cx="${x}" cy="${y}" r="${r}" fill="${iris}" ${rim ? `stroke="${rim}" stroke-width="2"` : ''}/>${b.eyes === 'blue' ? `<circle cx="${x}" cy="${y}" r="${r * 0.45}" fill="${ink}"/>` : ''}<circle cx="${x + 2.4}" cy="${y - 2.4}" r="2.2" fill="#fff"/>`).join('');
      if (mood === 'sad' || mood === 'worried') eyes += `<path d="M34 ${mood === 'sad' ? 60 : 57} L50 ${mood === 'sad' ? 54 : 52} M86 ${mood === 'sad' ? 60 : 57} L70 ${mood === 'sad' ? 54 : 52}" stroke="${rim || ink}" stroke-width="3.5" stroke-linecap="round"/>`;
      if (mood === 'sad') eyes += `<path d="M36 72 q-3 6 0 9 q3-3 0-9z" fill="#6cc4ff"/>`;
    }
    const ny = sn.ny;
    const lip = lum(muz) < 0.3 ? 'rgba(255,255,255,.55)' : ink;
    const mouth = smiling
      ? `<path d="M50 ${ny + 9} Q60 ${ny + 25} 70 ${ny + 9} Z" fill="#7a2e2e"/><ellipse cx="60" cy="${ny + 17}" rx="6" ry="6.5" fill="#ff7a93"/><path d="M60 ${ny + 13} v8" stroke="#e55a76" stroke-width="1.5"/>`
      : mood === 'sad' ? `<path d="M52 ${ny + 16} Q60 ${ny + 9} 68 ${ny + 16}" stroke="${lip}" stroke-width="3" fill="none" stroke-linecap="round"/>`
      : mood === 'worried' ? `<path d="M52 ${ny + 13} Q56 ${ny + 9} 60 ${ny + 13} Q64 ${ny + 17} 68 ${ny + 13}" stroke="${lip}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
      : `<path d="M51 ${ny + 10} Q55.5 ${ny + 15} 60 ${ny + 8} Q64.5 ${ny + 15} 69 ${ny + 10}" stroke="${lip}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    const earSvg = EAR[b.ear](earC);
    const marks = b.marks.map(([m, ref]) => MARK[m](pick(ref))).join('');
    const ruff = b.top === 'ruff' ? `<g fill="${pick(b.ruffC || 'c2')}" stroke="${outline}" stroke-width="1.5">${Array.from({ length: 16 }, (_, i) => { const t = (i / 16) * Math.PI * 2; return `<circle cx="${(60 + Math.cos(t) * 42).toFixed(1)}" cy="${(72 + Math.sin(t) * 40).toFixed(1)}" r="13"/>`; }).join('')}</g>` : '';
    const puff = b.top === 'puff' ? `<g fill="${head}" stroke="${mix(head, '#000000', 0.12)}" stroke-width="1.5"><circle cx="44" cy="38" r="12"/><circle cx="76" cy="38" r="12"/><circle cx="60" cy="30" r="17"/></g>` : '';
    const topknot = b.top === 'topknot' && !a.hat
      ? `<path d="M47 40 C43 26 53 16 60 11 C67 16 77 26 73 40 Z" fill="${earC}" stroke="${outline}" stroke-width="1.5"/><path d="M60 16 L45 7 L45 25 Z M60 16 L75 7 L75 25 Z" fill="${b.bow}"/><circle cx="60" cy="16" r="4.5" fill="${mix(b.bow, '#ffffff', 0.3)}"/>` : '';
    const beard = b.beard ? `<path d="M38 84 C38 102 47 117 60 119 C73 117 82 102 82 84 C74 93 67 95 60 90 C53 95 46 93 38 84 Z" fill="${muz}" stroke="${outline}" stroke-width="1.5"/>` : '';
    const headSvg = `${ruff}
      ${BEHIND.has(b.ear) ? `<g stroke="${outline}" stroke-width="1.5">${earSvg}</g>` : ''}
      <path d="${HEAD}" fill="${head}" stroke="${outline}" stroke-width="1.6"/>
      ${marks}${puff}${beard}
      <ellipse cx="60" cy="${sn.cy}" rx="${sn.rx}" ry="${sn.ry}" fill="${muz}"/>
      ${BEHIND.has(b.ear) ? '' : `<g stroke="${outline}" stroke-width="1.5">${earSvg}</g>`}
      ${topknot}
      <ellipse cx="33" cy="80" rx="6" ry="3.5" fill="#ff8fa3" opacity="${mood === 'love' ? 0.8 : 0.4}"/><ellipse cx="87" cy="80" rx="6" ry="3.5" fill="#ff8fa3" opacity="${mood === 'love' ? 0.8 : 0.4}"/>
      ${eyes}
      <ellipse cx="60" cy="${ny}" rx="7" ry="5.2" fill="${ink}" ${lum(muz) < 0.3 ? 'stroke="rgba(255,255,255,.45)" stroke-width="1.6"' : ''}/><ellipse cx="57.5" cy="${ny - 1.8}" rx="2.2" ry="1.3" fill="#fff" opacity=".7"/>
      ${mouth}
      ${a.eyes && EYES[a.eyes] ? EYES[a.eyes] : ''}
      ${a.neck && NECK[a.neck] ? NECK[a.neck] : ''}
      ${a.hat && HATS[a.hat] ? HATS[a.hat] : ''}
      ${mood === 'love' ? LOVE : ''}`;
    const label = `aria-label="${opts.label || b.name}"`;
    if (!opts.body) return `<svg class="dog ${opts.cls || ''}" viewBox="-2 -14 124 142" role="img" ${label}>${headSvg}</svg>`;

    // Full sitting dog: tail, haunches, chest, and two front paws.
    const coat = pick(b.bodyC || 'c1');
    const belly = pick(b.belly || b.muzzleC || 'c2');
    const paw = pick(b.paws || b.bodyC || 'c1');
    const outfit = a.outfit && OUTFITS[a.outfit];
    const tail = b.tail === 'curl'
      ? `<path d="M88 176 C112 178 124 156 112 144 C102 134 88 146 98 154 C104 158 108 150 104 148" stroke="${coat}" stroke-width="12" fill="none" stroke-linecap="round"/>`
      : `<path d="M86 198 C112 198 128 178 124 154 C121 148 114 150 113 157 C112 172 104 184 86 186 Z" fill="${coat}" stroke="${outline}" stroke-width="1.5"/>`;
    const fluffy = b.beard ? `<path d="M24 150 C20 180 18 200 20 216 C28 210 32 218 38 212 C44 220 52 212 60 218 C68 212 76 220 82 212 C88 218 92 210 100 216 C102 200 100 180 96 150 Z" fill="${coat}" stroke="${outline}" stroke-width="1.5"/>` : '';
    const bodySpots = b.marks.some(m => m[0] === 'spots') ? `<g fill="${pick('c2')}"><circle cx="24" cy="180" r="5"/><circle cx="96" cy="176" r="4"/><circle cx="36" cy="140" r="3.5"/><circle cx="84" cy="150" r="4.5"/></g>` : '';
    const toes = x => `<path d="M${x - 5} 206 v6 M${x} 205 v7 M${x + 5} 206 v6" stroke="rgba(0,0,0,.22)" stroke-width="1.5" stroke-linecap="round"/>`;
    const rumble = mood === 'sad' && opts.think ? `<path d="M2 150 q4-5 8 0 t8 0 M104 150 q4-5 8 0 t8 0" stroke="#ff6b6b" stroke-width="2.2" fill="none" stroke-linecap="round"/>` : '';
    return `<svg class="dog body ${opts.cls || ''}" viewBox="-16 -18 152 240" role="img" ${label}>
      ${outfit && outfit.back ? outfit.back : ''}
      ${tail}
      <ellipse cx="30" cy="186" rx="24" ry="26" fill="${coat}" stroke="${outline}" stroke-width="1.5"/><ellipse cx="90" cy="186" rx="24" ry="26" fill="${coat}" stroke="${outline}" stroke-width="1.5"/>
      <ellipse cx="10" cy="210" rx="15" ry="8" fill="${paw}" stroke="${outline}" stroke-width="1.5"/><ellipse cx="110" cy="210" rx="15" ry="8" fill="${paw}" stroke="${outline}" stroke-width="1.5"/>
      <path d="M36 104 C26 128 24 168 30 204 L90 204 C96 168 94 128 84 104 Z" fill="${coat}" stroke="${outline}" stroke-width="1.5"/>
      ${fluffy}
      ${belly !== coat ? `<path d="M48 108 C42 130 42 168 48 200 L72 200 C78 168 78 130 72 108 Z" fill="${belly}"/>` : ''}
      ${bodySpots}
      ${outfit && outfit.body ? outfit.body : ''}
      <rect x="30" y="146" width="18" height="62" rx="9" fill="${coat}" stroke="${outline}" stroke-width="1.5"/><rect x="72" y="146" width="18" height="62" rx="9" fill="${coat}" stroke="${outline}" stroke-width="1.5"/>
      ${outfit && outfit.front ? outfit.front : ''}
      <ellipse cx="39" cy="209" rx="13" ry="9" fill="${paw}" stroke="${outline}" stroke-width="1.5"/><ellipse cx="81" cy="209" rx="13" ry="9" fill="${paw}" stroke="${outline}" stroke-width="1.5"/>
      ${toes(39)}${toes(81)}
      ${rumble}
      ${headSvg}
      ${opts.think ? THINK : ''}
    </svg>`;
  }

  // The mascot pair, sitting side by side with floating music notes.
  function duo(opts) {
    opts = opts || {};
    const mood = opts.mood || 'happy';
    const notes = mood === 'sad' ? '' : '<span class="mnote n1" aria-hidden="true">♪</span><span class="mnote n2" aria-hidden="true">♫</span><span class="mnote n3" aria-hidden="true">♪</span>';
    return `<div class="duo ${opts.cls || ''}" role="img" aria-label="${MASCOTS.maltese} the Maltese and ${MASCOTS.shihtzu} the Shih Tzu">
      ${notes}
      <div class="duo-a">${dog({ breed: 'shihtzu', hat: opts.hatA || null, neck: opts.neckA || null, outfit: opts.outfitA || null }, { mood, body: true })}</div>
      <div class="duo-b">${dog({ breed: 'maltese', hat: opts.hatB || null, neck: opts.neckB || null, outfit: opts.outfitB || null }, { mood, body: true })}</div>
    </div>`;
  }

  window.DOGS = { BREEDS, BY_ID, COLORS, MASCOTS, HATS, EYES, NECK, OUTFITS, dog, duo, normalize };
})();
