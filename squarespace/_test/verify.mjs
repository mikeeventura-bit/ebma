import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
await p.goto('http://127.0.0.1:8098/_test/sqsp-sim.html', { waitUntil: 'load' });
await p.waitForTimeout(300);

const checks = await p.evaluate(() => {
  const px = v => parseFloat(v);
  const cs = s => getComputedStyle(document.querySelector(s));
  const out = [];
  const t = (name, got, want, ok) => out.push({ check: name, got: String(got), expected: want, pass: ok });

  // 1. markers are invisible
  t('marker div hidden', cs('.ebma-mark').display, 'none', cs('.ebma-mark').display === 'none');

  // 2. :has() ground applies to the whole native section
  const statsBg = cs('#s-stats').backgroundColor;
  t('ink ground via :has()', statsBg, 'rgb(18, 16, 14)', statsBg === 'rgb(18, 16, 14)');
  const creamBg = cs('#s-campaign').backgroundColor;
  t('cream ground via :has()', creamBg, 'rgb(247, 242, 232)', creamBg === 'rgb(247, 242, 232)');

  // 3. native H2 inside a marked stats section gets stat treatment
  const statH2 = cs('#s-stats .fluid-engine h2');
  t('native H2 -> stat size', Math.round(px(statH2.fontSize)) + 'px', '>=48px', px(statH2.fontSize) >= 48);
  t('native H2 -> stat weight', statH2.fontWeight, '900', statH2.fontWeight === '900');
  t('native H2 -> cream on ink', statH2.color, 'rgb(247, 242, 232)', statH2.color === 'rgb(247, 242, 232)');

  // 4. native P inside stats gets label treatment
  const statP = cs('#s-stats .fluid-engine p');
  t('native P -> muted label', statP.color, 'rgb(201, 192, 179)', statP.color === 'rgb(201, 192, 179)');

  // 5. native H2 promoted to campaign type
  const camp = cs('#s-campaign .html-block h2');
  t('native H2 -> campaign case', camp.textTransform, 'uppercase', camp.textTransform === 'uppercase');
  t('native H2 -> campaign weight', camp.fontWeight, '900', camp.fontWeight === '900');
  t('native H2 -> campaign leading', camp.lineHeight, 'tight', px(camp.lineHeight) / px(camp.fontSize) < 0.95);

  // 6. hero scrim pseudo-element is generated
  const scrim = getComputedStyle(document.querySelector('#s-hero .section-background'), '::after');
  t('hero top scrim present', scrim.content, '""', scrim.content === '""');
  t('hero scrim has 2 gradients', (scrim.backgroundImage.match(/linear-gradient/g) || []).length, '2',
     (scrim.backgroundImage.match(/linear-gradient/g) || []).length === 2);

  // 7. accent tint on dark is the AA-safe one, not base radish
  const accent = cs('.ebma-hero-copy .ebma-campaign__accent').color;
  t('hero accent uses on-dark tint', accent, 'rgb(201, 69, 95)', accent === 'rgb(201, 69, 95)');

  // 8. native Squarespace buttons restyled
  const pri = cs('.sqs-button-element--primary');
  t('primary button ground', pri.backgroundColor, 'rgb(142, 31, 60)', pri.backgroundColor === 'rgb(142, 31, 60)');
  t('primary button case', pri.textTransform, 'uppercase', pri.textTransform === 'uppercase');
  t('button radius squared', pri.borderRadius, '2px', pri.borderRadius === '2px');

  // 9. image grade reaches native image blocks
  const img = cs('#s-hero .section-background img');
  t('photo grade on native img', img.filter !== 'none', 'true', img.filter !== 'none');

  return out;
});

console.table(checks);
const failed = checks.filter(c => !c.pass);
console.log(`\n${checks.length - failed.length}/${checks.length} passed`);
await b.close();
process.exit(failed.length ? 1 : 0);
