import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
await page.waitForTimeout(4500);
await page.locator('#top ul li button').nth(0).click();
for (let i = 0; i < 6; i++) {
  await page.waitForTimeout(500);
  console.log(JSON.stringify(await page.evaluate(() => window.__pour)));
}
await browser.close();
