import { chromium } from 'playwright';

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:8099/index.html', { waitUntil: 'load' });
await p.evaluate(async () => {
  const step = window.innerHeight * 0.6;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo({top:y, behavior:'instant'}); await new Promise(r => setTimeout(r, 80));
  }
  window.scrollTo({top: window.innerHeight * 1.6, behavior:'instant'});
});
await p.waitForTimeout(400);

const results = await p.evaluate(() => {
  function parse(c) {
    const m = c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
    return m ? { r:+m[1], g:+m[2], b:+m[3], a: m[4] === undefined ? 1 : +m[4] } : null;
  }
  function lum({r,g,b}) {
    const f = v => { v /= 255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); };
    return 0.2126*f(r) + 0.7152*f(g) + 0.0722*f(b);
  }
  function over(fg, bg) { // composite fg (with alpha) onto bg
    const a = fg.a;
    return { r: fg.r*a + bg.r*(1-a), g: fg.g*a + bg.g*(1-a), b: fg.b*a + bg.b*(1-a), a: 1 };
  }
  function effectiveBg(el) {
    let n = el;
    let stack = [];
    while (n && n !== document.documentElement) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (c && c.a > 0) { stack.push(c); if (c.a === 1) break; }
      n = n.parentElement;
    }
    let base = { r:255, g:255, b:255, a:1 };
    for (let i = stack.length - 1; i >= 0; i--) base = over(stack[i], base);
    return base;
  }
  function ratio(a, b) {
    const l1 = lum(a), l2 = lum(b);
    return (Math.max(l1,l2) + 0.05) / (Math.min(l1,l2) + 0.05);
  }

  const out = [];
  const seen = new Set();
  const sel = 'p, h1, h2, h3, a, li, span, button, input, figcaption, label';
  document.querySelectorAll(sel).forEach(el => {
    const text = (el.textContent || '').trim();
    if (!text) return;
    // only elements that directly render text
    const direct = Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim());
    if (!direct) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') return;
    if (el.closest('.p-notice')) return;                 // prototype chrome
    if (parseFloat(cs.opacity) < 0.9 && !el.closest('.ebma-stat--tbd')) return;

    const fgRaw = parse(cs.color); if (!fgRaw) return;
    const bg = effectiveBg(el);
    const fg = over(fgRaw, bg);
    const size = parseFloat(cs.fontSize);
    const weight = parseInt(cs.fontWeight, 10) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const need = large ? 3 : 4.5;
    const cr = ratio(fg, bg);

    const key = `${cs.color}|${bg.r},${bg.g},${bg.b}|${large}`;
    if (seen.has(key)) return;
    seen.add(key);

    out.push({
      sample: text.slice(0, 34),
      cls: (el.className || el.tagName).toString().slice(0, 30),
      fg: cs.color, bg: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
      px: Math.round(size), w: weight, large,
      ratio: +cr.toFixed(2), need, pass: cr >= need,
    });
  });
  return out;
});

const fails = results.filter(r => !r.pass);
console.log(`Checked ${results.length} distinct foreground/background pairs.`);
console.log(`PASS: ${results.length - fails.length}   FAIL: ${fails.length}\n`);
if (fails.length) { console.log('--- FAILURES ---'); console.table(fails); }
console.log('--- ALL PAIRS ---');
console.table(results.map(r => ({ sample: r.sample, fg: r.fg, bg: r.bg, px: r.px, w: r.w, large: r.large, ratio: r.ratio, need: r.need, pass: r.pass })));
import { writeFileSync } from 'fs';
writeFileSync(process.env.EBMA_SHOTS ? process.env.EBMA_SHOTS + '/contrast-results.json' : './contrast-results.json', JSON.stringify(results, null, 2));
await b.close();
process.exit(fails.length ? 1 : 0);
