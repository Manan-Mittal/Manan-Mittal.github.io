// Confirms the camera returns to the bar when the reader scrolls back to the top.
import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
await page.waitForTimeout(4500);
const read = () => page.evaluate(() => {
  const c = window.__stage.camera;
  return { focus: window.__bar.getState().focus, cam: c.position.toArray().map((n) => +n.toFixed(2)) };
});
console.log('top      ', JSON.stringify(await read()));
for (const y of [1600, 3200, 4800]) {
  await page.evaluate((v) => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, v); }, y);
  await page.waitForTimeout(1800);
  console.log('y=' + String(y).padEnd(6), JSON.stringify(await read()));
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(2500);
console.log('back top ', JSON.stringify(await read()));
await browser.close();
