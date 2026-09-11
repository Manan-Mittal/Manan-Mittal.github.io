// Captures each drink at the moment it's being served — the brewing camera.
import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
await page.waitForTimeout(4500);

const menu = [['espresso', 2.9], ['cortado', 3.5], ['coldbrew', 3.9], ['house', 3.7], ['check', 2.3]];
for (const [idx, [label, secs]] of menu.entries()) {
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    window.__bar.getState().clear();
  });
  await page.waitForTimeout(1200);
  await page.locator('#top ul li button').nth(idx).click();
  await page.waitForTimeout(secs * 1000);
  await page.screenshot({ path: `.shots/brew-${label}.png`, clip: { x: 760, y: 180, width: 620, height: 560 } });
  const st = await page.evaluate(() => { const s = window.__bar.getState(); return `${s.stage} ${s.extraction.toFixed(2)}`; });
  console.log(label, st);
}
await browser.close();
