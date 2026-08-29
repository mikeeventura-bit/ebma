/* ==========================================================================
   EBMA: house rules, enforced
   --------------------------------------------------------------------------
   Two rules matter enough to check mechanically, because both are the kind
   that regress silently one section at a time:

     1. THE UPPERCASE RULE. Uppercase belongs on the small tracked eyebrow
        label and nowhere else. All-caps headings and nav were the single
        cause of the first pass reading as loud.
     2. BRAND SEPARATION. Donations fund EBMA; purchases go to Black Radish
        (brief §07). A Donate CTA inside a Black Radish block, or a shop link
        inside an EBMA support block, is exactly the mixing to avoid.

   Also asserts the type hierarchy, since cutting the H1 without bringing the
   rest of the scale down would put the page's largest type on a statistic.
   ========================================================================== */
import { chromium } from 'playwright';

const BASE = process.env.EBMA_BASE || 'http://127.0.0.1:8099';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await ctx.newPage();
await page.goto(`${BASE}/index.html`, { waitUntil: 'load' });
await page.waitForTimeout(300);

const results = await page.evaluate(() => {
  const out = [];
  const fail = (rule, detail) => out.push({ rule, detail, pass: false });
  const pass = (rule, detail) => out.push({ rule, detail, pass: true });

  /* --- 1. Uppercase rule ------------------------------------------------ */
  /* The principle, not a class list: uppercase is fine on a SMALL tracked
     label (an eyebrow, a footer column heading, a stat note) and wrong on
     anything set at heading scale. 14px is the dividing line. */
  const LABEL_MAX_PX = 14;
  const offenders = [];
  document.querySelectorAll('h1, h2, h3, nav a, nav button').forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.textTransform !== 'uppercase') return;
    if (el.classList.contains('ebma-campaign--poster')) return;      // sanctioned poster
    if (parseFloat(cs.fontSize) <= LABEL_MAX_PX) return;             // it is a label
    offenders.push(`${el.tagName}.${el.className || '(no class)'} @${cs.fontSize}`.slice(0, 70));
  });
  offenders.length
    ? fail('uppercase rule', `${offenders.length} offender(s): ${offenders.join(', ')}`)
    : pass('uppercase rule', 'no uppercase headings or nav links');

  /* --- 2. Poster used at most once -------------------------------------- */
  const posters = document.querySelectorAll('.ebma-campaign--poster').length;
  posters <= 1
    ? pass('poster rarity', `${posters} poster statement on the page`)
    : fail('poster rarity', `${posters} poster statements: max 1 per page`);

  /* --- 3. Brand separation ---------------------------------------------- */
  const brBlocks = document.querySelectorAll('.ebma-radish-feature, .ebma-mark--black-radish');
  let bleed = [];
  brBlocks.forEach(b => {
    b.querySelectorAll('a[href]').forEach(a => {
      if (/donate/i.test(a.getAttribute('href')) || /^donate$/i.test(a.textContent.trim()))
        bleed.push(`Donate CTA inside a Black Radish block: "${a.textContent.trim()}"`);
    });
  });
  document.querySelectorAll('.ebma-router, .ebma-support__grid').forEach(b => {
    b.querySelectorAll('a[href]').forEach(a => {
      if (/blackradishgrocery/i.test(a.getAttribute('href')))
        bleed.push(`Shop link inside an EBMA support block: "${a.textContent.trim()}"`);
    });
  });
  bleed.length
    ? fail('brand separation', bleed.join(' | '))
    : pass('brand separation', 'no Donate CTA in Black Radish, no shop link in EBMA support');

  /* --- 4. Black Radish is always badged as an EBMA initiative ----------- */
  let unbadged = 0;
  brBlocks.forEach(b => { if (!/initiative of East Brooklyn Mutual Aid/i.test(b.textContent)) unbadged++; });
  unbadged
    ? fail('black radish badge', `${unbadged} block(s) missing "An initiative of East Brooklyn Mutual Aid"`)
    : pass('black radish badge', `${brBlocks.length} block(s) correctly badged`);

  /* --- 5. Type hierarchy: nothing outranks the headline ----------------- */
  const campaign = document.querySelector('.ebma-campaign');
  const capPx = campaign ? parseFloat(getComputedStyle(campaign).fontSize) : 0;
  let biggest = { px: 0, what: '' };
  document.querySelectorAll('h1,h2,h3,p,span,div,a,li').forEach(el => {
    const direct = Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim());
    if (!direct) return;
    const px = parseFloat(getComputedStyle(el).fontSize);
    if (px > biggest.px) biggest = { px, what: (el.className || el.tagName).toString().slice(0, 44) };
  });
  biggest.px <= capPx + 0.5
    ? pass('type hierarchy', `largest type is ${biggest.px}px (headline ${capPx}px), ${biggest.what}`)
    : fail('type hierarchy', `${biggest.what} renders at ${biggest.px}px, larger than the ${capPx}px headline`);

  /* --- 6. Adjacent sections must not share a ground ----------------------
     The rule whose absence made the hero and impact sections read as one dark
     mass. It is exactly the kind that returns quietly when a section is added
     later, so it is asserted rather than trusted. */
  const grounds = [];
  document.querySelectorAll('main > section, main > div').forEach(el => {
    const bg = getComputedStyle(el).backgroundColor;
    grounds.push({ bg, what: (el.className || el.tagName).toString().slice(0, 40) });
  });
  const collisions = [];
  for (let i = 1; i < grounds.length; i++) {
    if (grounds[i].bg === grounds[i - 1].bg)
      collisions.push(`${grounds[i - 1].what} + ${grounds[i].what} both ${grounds[i].bg}`);
  }
  collisions.length
    ? fail('section separation', collisions.join(' | '))
    : pass('section separation', `${grounds.length} sections, no adjacent pair shares a ground`);

  /* --- 7. No em dashes in rendered copy ---------------------------------- */
  const dashed = [];
  document.querySelectorAll('main, header, footer').forEach(root => {
    const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walk.nextNode())) {
      if (n.textContent.includes('\u2014')) {
        const t = n.textContent.trim().slice(0, 48);
        if (t && !dashed.includes(t)) dashed.push(t);
      }
    }
  });
  dashed.length
    ? fail('no em dashes', `${dashed.length}: ${dashed.slice(0, 3).join(' / ')}`)
    : pass('no em dashes', 'none in rendered copy');

  /* --- 8. Heading sizes follow heading level ----------------------------
     Two <h2>s rendering at different sizes make the hierarchy look broken
     even when the markup is correct. Every heading of a level must share one
     size, and sizes must never invert between levels.

     ONE documented exception: .ebma-campaign, the poster-statement device
     from brief §04. It is deliberately oversized, sits alone in a full-bleed
     section, and reads as a statement rather than as a section heading. */
  const byLevel = {};
  // Scoped to <main>: footer column labels and header chrome are navigation
  // furniture with their own sizing conventions, not content hierarchy.
  document.querySelectorAll('main h1, main h2, main h3').forEach(el => {
    if (el.closest('.ebma-campaign') || el.classList.contains('ebma-campaign')) return;
    const px = Math.round(parseFloat(getComputedStyle(el).fontSize));
    const lvl = el.tagName;
    (byLevel[lvl] = byLevel[lvl] || {})[px] = (byLevel[lvl][px] || 0) + 1;
  });
  const mixed = Object.entries(byLevel)
    .filter(([, sizes]) => Object.keys(sizes).length > 1)
    .map(([lvl, sizes]) => `${lvl} renders at ${Object.keys(sizes).join('px, ')}px`);

  // and levels must not invert: h1 >= h2 >= h3
  const sizeOf = lvl => {
    const s = byLevel[lvl]; if (!s) return null;
    return Math.max.apply(null, Object.keys(s).map(Number));
  };
  const h1 = sizeOf('H1'), h2 = sizeOf('H2'), h3 = sizeOf('H3');
  const inverted = [];
  if (h1 !== null && h2 !== null && h2 > h1) inverted.push(`H2 ${h2}px > H1 ${h1}px`);
  if (h2 !== null && h3 !== null && h3 > h2) inverted.push(`H3 ${h3}px > H2 ${h2}px`);

  const problems = mixed.concat(inverted);
  problems.length
    ? fail('heading scale', problems.join(' | '))
    : pass('heading scale', `H1 ${h1}px, H2 ${h2}px, H3 ${h3}px, consistent per level`);

  /* --- 9. Every §02 path reachable from the nav ------------------------- */
  const navText = document.querySelector('nav').textContent.toLowerCase();
  const missing = ['volunteer', 'partner', 'give', 'donate'].filter(v => !navText.includes(v));
  missing.length
    ? fail('brief §02 paths', `not reachable from the nav: ${missing.join(', ')}`)
    : pass('brief §02 paths', 'volunteer, partner, ways to give and donate all present');

  /* --- 10. Nav dropdowns link to real pages or in-page anchors, never to
     destinations that do not exist. Brief §05 defines exactly eight pages. */
  const PAGES = ['index','about','our-work','black-radish','impact','stories','get-involved','donate'];
  const strays = [];
  document.querySelectorAll('.p-nav__menu a').forEach(a => {
    const href = a.getAttribute('href') || '';
    const file = href.split('#')[0].replace('.html', '');
    if (file && !PAGES.includes(file)) strays.push(href);
  });
  strays.length
    ? fail('§05 page set', `nav points at non-pages: ${strays.join(', ')}`)
    : pass('§05 page set', 'every dropdown child is one of the eight pages or an anchor on it');

  return out;
});

console.table(results);
const failed = results.filter(r => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} rules pass`);
await browser.close();
process.exit(failed.length ? 1 : 0);
