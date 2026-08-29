/* ==========================================================================
   EBMA: placeholder image generator
   --------------------------------------------------------------------------
   Produces warm, tonal SVG stand-ins so the layout can be judged with real
   photographic weight rather than flat grey boxes. Every file states the shot
   the brief calls for, so the design and the asset list can never disagree.

   These are NOT art direction. They exist to hold the right visual mass at
   the right crop until EBMA's real photography arrives: see
   docs/05-assets-checklist.md.

   Run:  node prototype/assets/img/_generate.mjs
   ========================================================================== */
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const OUT = dirname(fileURLToPath(import.meta.url));

/* Palette drawn from tokens.css so placeholders sit inside the system. */
const P = {
  ink:    '#12100E',
  soft:   '#2A2622',
  cream:  '#F7F2E8',
  deep:   '#EDE4D3',
  radish: '#8E1F3C',
  green:  '#2F5D3A',
  clay:   '#B85C38',
};

/* Deterministic pseudo-random so regenerating gives identical files. */
function rng(seed) {
  let s = [...seed].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 17);
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

/* A soft mesh of overlapping radial gradients reads as an out-of-focus
   photograph far better than a flat fill or a stripe pattern does. */
function svg({ id, w, h, tones, label, dark }) {
  const r = rng(id);
  const blobs = [];
  const defs = [];
  const n = 7;
  for (let i = 0; i < n; i++) {
    const cx = Math.round(r() * w);
    const cy = Math.round(r() * h);
    const rad = Math.round((0.28 + r() * 0.42) * Math.max(w, h));
    const tone = tones[Math.floor(r() * tones.length)];
    const op = (0.30 + r() * 0.45).toFixed(2);
    defs.push(
      `<radialGradient id="${id}-g${i}" cx="50%" cy="50%" r="50%">` +
      `<stop offset="0%" stop-color="${tone}" stop-opacity="${op}"/>` +
      `<stop offset="100%" stop-color="${tone}" stop-opacity="0"/>` +
      `</radialGradient>`
    );
    blobs.push(`<circle cx="${cx}" cy="${cy}" r="${rad}" fill="url(#${id}-g${i})"/>`);
  }

  const base = dark ? P.ink : P.deep;
  const ink  = dark ? 'rgba(247,242,232,0.34)' : 'rgba(18,16,14,0.34)';
  /* Fixed relative to a nominal 1000px reference rather than to the viewBox,
     so a 2400px hero does not render its annotation four times larger than a
     card does. Capped so it stays an annotation, never a caption. */
  const fs   = Math.max(11, Math.min(26, Math.round(Math.min(w, h) * 0.026)));

  // Wrap the label by hand, SVG has no automatic text wrapping.
  const words = label.split(' ');
  const perLine = Math.max(3, Math.floor(w / (fs * 0.58)));
  const lines = [];
  let cur = '';
  for (const word of words) {
    if ((cur + ' ' + word).trim().length > perLine) { lines.push(cur.trim()); cur = word; }
    else cur += ' ' + word;
  }
  if (cur.trim()) lines.push(cur.trim());

  const text = lines.map((l, i) =>
    `<text x="${Math.round(fs * 1.4)}" y="${h - Math.round(fs * 1.4) - (lines.length - 1 - i) * Math.round(fs * 1.35)}" ` +
    `font-family="Helvetica,Arial,sans-serif" font-size="${fs}" font-weight="600" ` +
    `letter-spacing="${(fs * 0.09).toFixed(2)}" fill="${ink}">${l.toUpperCase()}</text>`
  ).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}">
<defs>
${defs.join('\n')}
<filter id="${id}-grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3"/><feColorMatrix type="saturate" values="0"/></filter>
</defs>
<rect width="${w}" height="${h}" fill="${base}"/>
${blobs.join('\n')}
<rect width="${w}" height="${h}" filter="url(#${id}-grain)" opacity="${dark ? 0.10 : 0.07}"/>
${text}
</svg>`;
}

const warm  = [P.clay, P.radish, '#D08A5A', P.deep];
const field = [P.green, P.clay, '#6E8F4E', P.deep];
const room  = [P.clay, P.soft, P.radish, '#8A7A66'];

const set = [
  { id:'hero',        w:2400, h:1350, tones:warm,  dark:true,
    label:'Hero, EBMA community members at a market or grocery delivery. Wide, faces visible, East Brooklyn context.' },
  { id:'deliveries',  w:1000, h:1250, tones:room,  dark:true,
    label:'Grocery delivery: volunteer handing bags to a neighbor.' },
  { id:'black-radish',w:1000, h:1250, tones:warm,  dark:true,
    label:'Black Radish: produce crates, branded packaging, market stall.' },
  { id:'farmers',     w:1000, h:1250, tones:field, dark:true,
    label:'A New York farmer or producer on their farm.' },
  { id:'youth',       w:1000, h:1250, tones:room,  dark:true,
    label:'Youth program: young people working a market or packing session.' },
  { id:'markets',     w:1000, h:1250, tones:field, dark:true,
    label:'Community market, RAMS, produce tables, shoppers.' },
  { id:'br-produce',  w:900,  h:1200, tones:warm,  dark:true,
    label:'Black Radish produce: close, saturated, textural.' },
  { id:'br-customer', w:900,  h:1200, tones:room,  dark:true,
    label:'A Black Radish customer or market moment.' },
  { id:'origin',      w:1600, h:1067, tones:room,  dark:true,
    label:'Archival COVID-era EBMA, 2020–21: volunteers packing or distributing.' },
];

for (const s of set) {
  writeFileSync(join(OUT, `${s.id}.svg`), svg(s));
  console.log(`${s.id}.svg  ${s.w}x${s.h}`);
}

/* --------------------------------------------------------------------------
   Partner logo stand-ins.
   Monochrome wordmarks in a single ink tone. Real partner logos arrive in many
   colours and weights; rendering the placeholders flat keeps the strip reading
   as one quiet credibility band instead of a row of competing marks.
   The partner list itself is unconfirmed. See docs/01-audit.md.
   -------------------------------------------------------------------------- */
function logo(name, id) {
  const w = 360, h = 96;
  const fs = 34;
  const words = name.split(' ');
  const lines = words.length > 2 ? [words.slice(0, 2).join(' '), words.slice(2).join(' ')] : [name];
  const y0 = lines.length === 1 ? h / 2 + fs * 0.35 : h / 2 - fs * 0.12;
  const text = lines.map((l, i) =>
    `<text x="${w / 2}" y="${y0 + i * fs * 1.08}" text-anchor="middle" ` +
    `font-family="Helvetica,Arial,sans-serif" font-size="${fs}" font-weight="800" ` +
    `letter-spacing="-0.5" fill="${P.ink}">${l.toUpperCase()}</text>`
  ).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${name}">
<rect width="${w}" height="${h}" fill="none"/>
${text}
</svg>`;
}

const partners = [
  ['CCC', 'logo-ccc'],
  ['RAMS', 'logo-rams'],
  ['Black Yard Farm', 'logo-black-yard-farm'],
  ['Chestnut Commons', 'logo-chestnut-commons'],
  ['Partner Name', 'logo-partner-5'],
  ['Partner Name', 'logo-partner-6'],
];
for (const [name, id] of partners) {
  writeFileSync(join(OUT, `${id}.svg`), logo(name, id));
  console.log(`${id}.svg  360x96`);
}

console.log(`\n${set.length} photo placeholders + ${partners.length} logo placeholders generated.`);
