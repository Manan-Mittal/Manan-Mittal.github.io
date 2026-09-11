import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
await page.waitForTimeout(4500);
await page.locator('#top ul li button').nth(2).click();
for (const t of [1500, 2500, 1500, 1500]) {
  await page.waitForTimeout(t);
  console.log(JSON.stringify(await page.evaluate(() => ({
    eff: window.__serveEffect, fired: !!window.__serveFired, cancelled: window.__serveCancelled || 0,
    stage: window.__bar.getState().stage, y: Math.round(window.scrollY),
  }))));
}
await browser.close();
