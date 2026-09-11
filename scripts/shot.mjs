// Headless screenshotter + console/WebGL probe for the bar.
//   node scripts/shot.mjs [outName] [width] [height] [scrollY] [waitMs]
// Prints console errors and a render-stats probe as text so iteration is cheap.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const [, , name = 'shot', w = '1440', h = '900', scrollY = '0', waitMs = '5000'] = process.argv;
mkdirSync('.shots', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: +w, height: +h },
  deviceScaleFactor: 1,
  reducedMotion: 'no-preference',
});

const errors = [];
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${m.type()}] ${m.text().slice(0, 400)}`);
});
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));

await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
await page.waitForTimeout(+waitMs);
if (+scrollY) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), +scrollY);
  await page.waitForTimeout(1200);
}

const probe = await page.evaluate(() => {
  const s = window.__stage;
  const c = document.querySelector('canvas');
  return {
    canvas: !!c,
    stageMounted: !!s,
    frames: s?.gl?.info?.render?.frame ?? null,
    calls: s?.gl?.info?.render?.calls ?? null,
    triangles: s?.gl?.info?.render?.triangles ?? null,
    geometries: s?.gl?.info?.memory?.geometries ?? null,
    docHeight: document.body.scrollHeight,
    hScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  };
});

await page.screenshot({ path: `.shots/${name}.png`, fullPage: false });
console.log('PROBE ' + JSON.stringify(probe));
console.log(errors.length ? 'ERRORS:\n' + errors.slice(0, 12).join('\n') : 'ERRORS: none');
await browser.close();
