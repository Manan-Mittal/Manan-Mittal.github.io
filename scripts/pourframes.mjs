// Grabs a strip of frames through one extraction so the pour can be judged.
import { chromium } from 'playwright';
const [, , which = '0', name = 'espresso'] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
await page.waitForTimeout(4500);
await page.locator('#top ul li button').nth(+which).click();

const marks = [0.15, 0.35, 0.6, 0.9];
for (const m of marks) {
  await page.waitForFunction((t) => {
    const s = window.__bar.getState();
    return s.extraction >= t || s.stage === 'served';
  }, m, { timeout: 9000 }).catch(() => {});
  await page.screenshot({ path: `.shots/pour-${name}-${String(m).replace('.', '')}.png`, clip: { x: 880, y: 300, width: 420, height: 430 } });
}
await page.waitForTimeout(900);
await page.screenshot({ path: `.shots/pour-${name}-end.png`, clip: { x: 880, y: 300, width: 420, height: 430 } });
console.log('captured', name);
await browser.close();
