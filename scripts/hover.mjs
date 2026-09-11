// Hovers points on the canvas and reports any label that appears.
import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
await page.waitForTimeout(5000);

const points = [
  ['group head', 1030, 505],
  ['buttons', 1020, 435],
  ['gauge', 838, 480],
  ['books a', 820, 200],
  ['books b', 930, 215],
  ['books c', 990, 225],
  ['grinder', 690, 470],
  ['bean bowl', 770, 705],
  ['printer', 1335, 760],
  ['sign', 1420, 275],
  ['tamper', 1200, 690],
  ['wand', 700, 520],
];

for (const [name, x, y] of points) {
  await page.mouse.move(x, y);
  await page.waitForTimeout(700);
  const labels = await page.evaluate(() =>
    [...document.querySelectorAll('span')]
      .filter((s) => s.className.includes('pointer-events-none') && s.className.includes('crema'))
      .map((s) => s.textContent.trim())
      .filter(Boolean),
  );
  const cursor = await page.evaluate(() => document.body.style.cursor);
  console.log(`${name.padEnd(12)} -> ${labels.join(' | ') || '(nothing)'}  [cursor: ${cursor || 'default'}]`);
  await page.mouse.move(20, 880);
  await page.waitForTimeout(300);
}
await browser.close();
