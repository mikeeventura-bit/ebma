import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', deviceScaleFactor: 2 });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:8099/index.html', { waitUntil: 'load' });
await p.waitForTimeout(900);

const r = await p.evaluate(() => {
  const card = document.querySelector('.ebma-card .ebma-photo > *');
  const cardCs = card ? getComputedStyle(card) : null;
  return {
    cardHoverTransition: cardCs ? cardCs.transitionDuration : 'n/a',
    htmlHasJsClass: document.documentElement.classList.contains('ebma-js'),
    revealsHidden: document.querySelectorAll('.ebma-reveal:not(.is-visible)').length,
    totalReveals: document.querySelectorAll('.ebma-reveal').length,
    anyZeroOpacity: Array.from(document.querySelectorAll('.ebma-reveal'))
      .filter(el => parseFloat(getComputedStyle(el).opacity) < 0.99).length,
  };
});
console.log('--- prefers-reduced-motion: reduce ---');
console.log(JSON.stringify(r, null, 2));
console.log(r.anyZeroOpacity === 0 ? 'PASS: all content visible' : 'FAIL: content hidden');
const noMotion = parseFloat(r.cardHoverTransition) < 0.01;
console.log(noMotion ? 'PASS: transitions suppressed' : 'FAIL: motion still active');
await p.screenshot({ path: (process.env.EBMA_SHOTS || './shots') + '/home-reduced-motion.png', fullPage: true });

// --- JS entirely disabled ---
const ctx2 = await b.newContext({ viewport: { width: 1440, height: 1000 }, javaScriptEnabled: false });
const p2 = await ctx2.newPage();
await p2.goto('http://127.0.0.1:8099/index.html', { waitUntil: 'load' });
await p2.waitForTimeout(300);
const noJs = await p2.evaluate ? null : null;
const hidden = await p2.$$eval('.ebma-reveal', els => els.filter(e => parseFloat(getComputedStyle(e).opacity) < 0.99).length);
console.log('\n--- JavaScript disabled ---');
console.log(hidden === 0 ? `PASS: all ${(await p2.$$('.ebma-reveal')).length} reveal blocks visible without JS` : `FAIL: ${hidden} blocks hidden`);
await b.close();
