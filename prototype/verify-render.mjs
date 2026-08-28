import { chromium } from 'playwright';
const OUT = process.env.EBMA_SHOTS || './shots';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

const sizes = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'tablet',  width: 768,  height: 1000 },
  { name: 'mobile',  width: 390,  height: 844  },
];

for (const s of sizes) {
  const ctx = await browser.newContext({ viewport: { width: s.width, height: s.height }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/fonts\.g|favicon/.test(m.location()?.url || '')) errs.push('console: ' + m.text()); });
  await page.goto('http://127.0.0.1:8099/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(500);

  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({top: y, behavior: 'instant'}); await new Promise(r => requestAnimationFrame(() => setTimeout(r, 120)));
    }
    window.scrollTo({top: 0, behavior: 'instant'});
    await new Promise(r => setTimeout(r, 300));
  });

  const stuck = await page.evaluate(() => document.querySelectorAll('.ebma-reveal:not(.is-visible)').length);
  const height = await page.evaluate(() => document.body.scrollHeight);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

  await page.screenshot({ path: `${OUT}/home-${s.name}-full.png`, fullPage: true });
  await page.screenshot({ path: `${OUT}/home-${s.name}-hero.png` });

  console.log(`${s.name.padEnd(8)} height=${height}px overflow=${overflow}px unrevealed=${stuck} errors=${errs.length}`);
  errs.forEach(e => console.log('   ' + e));
  await ctx.close();
}
await browser.close();
