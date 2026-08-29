/* Drives the two reported bugs in a real browser. */
import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const out = [];
const t = (n, got, want, ok) => out.push({ check: n, got: String(got), want, pass: ok });

// ---------- dropdown ----------
const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:8099/index.html', { waitUntil: 'load' });
await p.waitForTimeout(400);

const first  = '.p-nav__item:nth-of-type(1) .p-nav__toggle';
const second = '.p-nav__item:nth-of-type(2) .p-nav__toggle';
const isOpen = i => p.evaluate(n => {
  const it = document.querySelectorAll('.p-nav__item')[n];
  return { open: it.classList.contains('is-open'),
           aria: it.querySelector('.p-nav__toggle').getAttribute('aria-expanded'),
           visible: getComputedStyle(it.querySelector('.p-nav__menu')).visibility };
}, i);

await p.click(first); await p.waitForTimeout(250);
let s1 = await isOpen(0);
t('click opens', `open=${s1.open} aria=${s1.aria} vis=${s1.visible}`, 'open/true/visible',
  s1.open && s1.aria === 'true' && s1.visible === 'visible');

// THE REPORTED BUG: clicking the same toggle again must close it
await p.click(first); await p.waitForTimeout(250);
let s2 = await isOpen(0);
t('click again closes', `open=${s2.open} aria=${s2.aria}`, 'closed/false',
  !s2.open && s2.aria === 'false');

// click outside closes
await p.click(first); await p.waitForTimeout(200);
await p.mouse.click(700, 700); await p.waitForTimeout(250);
let s3 = await isOpen(0);
t('outside click closes', `open=${s3.open} aria=${s3.aria}`, 'closed/false',
  !s3.open && s3.aria === 'false');

// Escape closes and restores focus
await p.click(first); await p.waitForTimeout(200);
await p.keyboard.press('Escape'); await p.waitForTimeout(250);
let s4 = await isOpen(0);
const focused = await p.evaluate(() => document.activeElement.classList.contains('p-nav__toggle'));
t('escape closes', `open=${s4.open} focusReturned=${focused}`, 'closed/true', !s4.open && focused);

// opening one closes the other
await p.click(first); await p.waitForTimeout(200);
await p.click(second); await p.waitForTimeout(250);
const a = await isOpen(0), c = await isOpen(1);
t('one at a time', `first=${a.open} second=${c.open}`, 'false/true', !a.open && c.open);

// ---------- marquee ----------
for (const w of [1440, 768, 390]) {
  const cx = await b.newContext({ viewport: { width: w, height: 900 } });
  const pg = await cx.newPage();
  await pg.goto('http://127.0.0.1:8099/index.html', { waitUntil: 'load' });
  await pg.waitForTimeout(700);
  const m = await pg.evaluate(() => {
    const track = document.querySelector('[data-ebma-marquee]');
    if (!track) return null;
    const container = track.parentElement;
    return {
      trackW: Math.round(track.scrollWidth),
      containerW: Math.round(container.offsetWidth),
      shift: track.style.getPropertyValue('--ebma-marquee-shift'),
      items: track.children.length,
    };
  });
  // The condition that was violated: one repeat must cover the visible area,
  // or the loop exposes a gap.
  const ok = m && m.trackW >= m.containerW * 2;
  t(`marquee seamless @${w}`, `track=${m.trackW} container=${m.containerW} shift=${m.shift} items=${m.items}`,
    'track >= 2x container', ok);
  await cx.close();
}

// ---------- shop link gone from chrome ----------
const chrome = await p.evaluate(() => {
  const inHeader = !!document.querySelector('.p-topbar a[href*="blackradishgrocery"]');
  const inFooter = !!document.querySelector('.p-footer a[href*="blackradishgrocery"]');
  return { inHeader, inFooter };
});
t('no shop link in chrome', `header=${chrome.inHeader} footer=${chrome.inFooter}`, 'false/false',
  !chrome.inHeader && !chrome.inFooter);

// ---------- Black Radish absent from every top menu ----------
const br = await p.evaluate(() =>
  Array.from(document.querySelectorAll('nav a, nav button'))
       .filter(el => /black radish/i.test(el.textContent)).length);
t('no Black Radish in nav', br, '0', br === 0);

console.table(out);
const bad = out.filter(r => !r.pass);
console.log(`\n${out.length - bad.length}/${out.length} behaviour checks pass`);
await b.close();
process.exit(bad.length ? 1 : 0);
