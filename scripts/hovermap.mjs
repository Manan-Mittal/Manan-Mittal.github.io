// Sweeps a grid of points over the canvas and reports what each one hits,
// so overlapping hover targets show up as ranges rather than guesses.
import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
await page.waitForTimeout(6000);

const label = () => page.evaluate(() =>
  [...document.querySelectorAll('span')]
    .filter((s) => s.className.includes('pointer-events-none') && s.className.includes('crema'))
    .map((s) => s.textContent.trim().replace(/\s+/g, ' '))
    .join('') || '-',
);

// Sweep the bean-bowl / grinder region
for (let y = 620; y <= 780; y += 40) {
  const row = [];
  for (let x = 560; x <= 880; x += 40) {
    await page.mouse.move(x, y);
    await page.waitForTimeout(190);
    const l = await label();
    row.push(`${x}:${l.slice(0, 18)}`);
  }
  console.log(`y=${y}  ` + row.join('  |  '));
  await page.mouse.move(20, 880);
  await page.waitForTimeout(120);
}
await browser.close();
