// Captures each drink at the same point in its extraction, deterministically.
import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
await page.waitForTimeout(4500);

const menu = ['espresso', 'cortado', 'coldbrew', 'house', 'check'];
for (const [idx, label] of menu.entries()) {
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    window.__bar.getState().clear();
  });
  await page.waitForTimeout(1400);
  await page.locator('#top ul li button').nth(idx).click();
  // Hold the shot at 80% extraction — cup filled, camera still in close
  await page.waitForFunction(() => {
    const s = window.__bar.getState();
    return s.stage === 'extracting' && s.extraction > 0.8;
  }, null, { timeout: 8000 }).catch(() => console.log('  (missed window for ' + label + ')'));
  const st = await page.evaluate(() => { const s = window.__bar.getState(); return `${s.stage} x=${s.extraction.toFixed(2)} scroll=${Math.round(window.scrollY)}`; });
  await page.screenshot({ path: `.shots/brew-${label}.png`, clip: { x: 790, y: 190, width: 600, height: 540 } });
  console.log(label, st);
}
await browser.close();
