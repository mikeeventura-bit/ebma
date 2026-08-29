import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const F = []; // findings
const add = (sev, area, what) => F.push({ sev, area, what });

const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } });
const p = await ctx.newPage();
const consoleErrs = [];
p.on('pageerror', e => consoleErrs.push(e.message));
await p.goto('http://127.0.0.1:8099/index.html', { waitUntil: 'load' });
await p.waitForTimeout(500);

const r = await p.evaluate(() => {
  const out = {};

  // --- document basics ---
  out.lang = document.documentElement.lang;
  out.title = document.title;
  out.desc = document.querySelector('meta[name=description]')?.content || null;
  out.og = document.querySelectorAll('meta[property^="og:"]').length;
  out.favicon = !!document.querySelector('link[rel*="icon"]');
  out.viewport = !!document.querySelector('meta[name=viewport]');

  // --- duplicate ids ---
  const ids = {}, dupes = [];
  document.querySelectorAll('[id]').forEach(el => {
    ids[el.id] = (ids[el.id] || 0) + 1;
    if (ids[el.id] === 2) dupes.push(el.id);
  });
  out.dupeIds = dupes;

  // --- heading outline: no skipped levels ---
  const hs = Array.from(document.querySelectorAll('main h1,main h2,main h3,main h4'))
    .map(h => +h.tagName[1]);
  const skips = [];
  for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i-1] > 1) skips.push(`h${hs[i-1]} -> h${hs[i]}`);
  out.headingSkips = skips;
  out.h1Count = document.querySelectorAll('main h1').length;

  // --- landmarks ---
  out.landmarks = {
    header: document.querySelectorAll('header').length,
    nav: document.querySelectorAll('nav').length,
    main: document.querySelectorAll('main').length,
    footer: document.querySelectorAll('footer').length,
  };

  // --- images ---
  const imgs = Array.from(document.querySelectorAll('img'));
  out.imgTotal = imgs.length;
  out.imgNoAlt = imgs.filter(i => !i.hasAttribute('alt')).length;
  out.imgEmptyAlt = imgs.filter(i => i.getAttribute('alt') === '').length;
  out.imgAltIsFilename = imgs.filter(i => /\.(svg|jpg|png)$/i.test(i.alt || '')).length;
  out.imgNoDims = imgs.filter(i => !i.getAttribute('width') && !i.getAttribute('height')).length;
  out.imgNoLazy = imgs.filter(i => !i.hasAttribute('loading') && i.getAttribute('fetchpriority') !== 'high').length;

  // --- links ---
  const links = Array.from(document.querySelectorAll('a[href]'));
  out.linkTotal = links.length;
  out.emptyLinks = links.filter(a => !a.textContent.trim() && !a.getAttribute('aria-label') && !a.querySelector('img[alt]:not([alt=""])')).length;
  out.vagueLinks = links.filter(a => /^(click here|here|read more|learn more|more)$/i.test(a.textContent.trim())).length;
  out.extNoRel = links.filter(a => /^https?:/.test(a.getAttribute('href')) && a.target === '_blank' && !/noopener/.test(a.rel || '')).length;
  out.placeholderLinks = links.filter(a => a.getAttribute('href') === '#').length;

  // --- forms ---
  const inputs = Array.from(document.querySelectorAll('input,select,textarea'));
  out.inputsTotal = inputs.length;
  out.inputsUnlabelled = inputs.filter(i => {
    if (i.getAttribute('aria-label') || i.getAttribute('aria-labelledby')) return false;
    return !(i.id && document.querySelector(`label[for="${i.id}"]`));
  }).length;

  // --- buttons with no accessible name ---
  const btns = Array.from(document.querySelectorAll('button'));
  out.btnNoName = btns.filter(x => !x.textContent.trim() && !x.getAttribute('aria-label')).length;

  // --- mobile menu button: does it control anything? ---
  const mb = document.querySelector('.p-menu-btn');
  out.mobileBtn = mb ? {
    exists: true,
    hasAriaControls: mb.hasAttribute('aria-controls'),
    ariaExpanded: mb.getAttribute('aria-expanded'),
  } : { exists: false };

  return out;
});

// ---------- report basics ----------
if (!r.lang) add('HIGH','a11y','<html> has no lang attribute');
if (!r.desc) add('HIGH','seo','No meta description');
if (r.og === 0) add('MED','seo','No Open Graph tags: shared links will preview poorly');
if (!r.favicon) add('MED','seo','No favicon');
if (r.dupeIds.length) add('HIGH','html',`Duplicate ids: ${r.dupeIds.join(', ')}`);
if (r.headingSkips.length) add('MED','a11y',`Skipped heading levels: ${r.headingSkips.join(', ')}`);
if (r.h1Count !== 1) add('HIGH','a11y',`main contains ${r.h1Count} h1 elements, expected exactly 1`);
if (r.imgNoAlt) add('HIGH','a11y',`${r.imgNoAlt} images missing alt`);
if (r.imgAltIsFilename) add('HIGH','a11y',`${r.imgAltIsFilename} images whose alt is a filename`);
if (r.imgNoDims) add('MED','perf',`${r.imgNoDims} images without width/height: causes layout shift`);
if (r.emptyLinks) add('HIGH','a11y',`${r.emptyLinks} links with no accessible name`);
if (r.vagueLinks) add('MED','a11y',`${r.vagueLinks} vague link texts`);
if (r.extNoRel) add('MED','sec',`${r.extNoRel} target=_blank links without rel=noopener`);
if (r.inputsUnlabelled) add('HIGH','a11y',`${r.inputsUnlabelled} form fields without a label`);
if (r.btnNoName) add('HIGH','a11y',`${r.btnNoName} buttons with no accessible name`);
if (r.mobileBtn.exists && !r.mobileBtn.hasAriaControls)
  add('HIGH','a11y','Mobile menu button has no aria-controls');

console.log('--- document ---');
console.log(JSON.stringify(r, null, 1));
console.log('\n--- console errors ---', consoleErrs.length ? consoleErrs : 'none');

// ---------- mobile: does the menu button work at all? ----------
const m = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
const mp = await m.newPage();
await mp.goto('http://127.0.0.1:8099/index.html', { waitUntil: 'load' });
await mp.waitForTimeout(500);
const navBefore = await mp.evaluate(() => document.getElementById('mobile-nav').hidden);
await mp.click('.p-menu-btn').catch(()=>{});
await mp.waitForTimeout(400);
const navAfter = await mp.evaluate(() => document.getElementById('mobile-nav').hidden);
const reachable = await mp.evaluate(() =>
  Array.from(document.querySelectorAll('#mobile-nav a')).filter(a => a.offsetParent !== null).length);
console.log(`\n--- mobile menu --- nav display before=${navBefore} after=${navAfter}, visible nav links=${reachable}`);
if (navAfter !== false || reachable === 0)
  add('CRITICAL','a11y','Mobile menu button does nothing: navigation is unreachable below 940px');

// tap targets
const small = await mp.evaluate(() => {
  const bad = [];
  document.querySelectorAll('a,button,input[type=submit]').forEach(el => {
    if (el.offsetParent === null) return;
    const r = el.getBoundingClientRect();
    if (r.width && r.height && (r.width < 44 || r.height < 44))
      bad.push(`${el.tagName.toLowerCase()}"${(el.textContent||'').trim().slice(0,22)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
  });
  return bad;
});
if (small.length) add('MED','mobile',`${small.length} tap targets under 44px: ${small.slice(0,4).join(' | ')}`);
console.log(`\n--- tap targets under 44px --- ${small.length}`);
small.slice(0,8).forEach(s => console.log('   ' + s));

console.log('\n================ FINDINGS ================');
const order = { CRITICAL:0, HIGH:1, MED:2, LOW:3 };
F.sort((a,b)=>order[a.sev]-order[b.sev]);
if (!F.length) console.log('none');
F.forEach(f => console.log(`[${f.sev}] ${f.area}: ${f.what}`));
await b.close();
