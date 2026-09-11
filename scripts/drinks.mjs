// Orders each drink in turn and crops the tray, to confirm they differ.
import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
await page.waitForTimeout(4500);

const menu = [['About me', 3.6], ['Work experience', 4.2], ['Projects', 4.6], ['The pop-up', 4.4], ['Contact', 3.0]];
for (const [idx, [label, secs]] of menu.entries()) {
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
  await page.locator('#top ul li button').nth(idx).click();
  await page.waitForTimeout(secs * 1000);
  // The served handler smooth-scrolls to the section; wait it out, then jump back
  await page.waitForTimeout(1400);
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `.shots/drink-${label.toLowerCase().replace(/[^a-z]+/g, '-')}.png`, clip: { x: 880, y: 430, width: 400, height: 330 } });
  const st = await page.evaluate(() => { const s = window.__bar.getState(); return s.stage + '/' + s.activeDrink; });
  console.log('shot', label, st);
}
await browser.close();
