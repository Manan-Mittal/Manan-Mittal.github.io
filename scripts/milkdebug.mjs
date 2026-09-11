import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
await page.waitForTimeout(5000);
await page.locator('#top ul li button').nth(1).click();
for (let i = 0; i < 4; i++) {
  await page.waitForTimeout(700);
  console.log(JSON.stringify(await page.evaluate(() => window.__milk)));
}
await browser.close();
