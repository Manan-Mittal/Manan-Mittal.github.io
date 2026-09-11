import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
await page.waitForTimeout(4500);
await page.locator('#top ul li button').nth(0).click();
for (const t of [0.25, 0.5]) {
  await page.waitForFunction((v) => window.__bar.getState().extraction >= v, t, { timeout: 9000 }).catch(() => {});
  await page.screenshot({ path: `.shots/stream-${String(t).replace('.', '')}.png`, clip: { x: 960, y: 250, width: 340, height: 320 } });
}
await browser.close();
