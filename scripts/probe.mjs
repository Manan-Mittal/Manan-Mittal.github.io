import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
const errs = [];
page.on('pageerror', (e) => errs.push(e.message));
await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
await page.waitForTimeout(4000);
const before = await page.evaluate(() => document.querySelector('[aria-live="polite"]')?.textContent);
await page.locator('#top ul li button').nth(2).click();
await page.waitForTimeout(1000);
const mid = await page.evaluate(() => ({
  ...window.__bar.getState(),
  order: undefined, setStage: undefined, setExtraction: undefined, setFocus: undefined,
  setReducedMotion: undefined, setQuality: undefined, clear: undefined,
}));
await page.waitForTimeout(4200);
const after = await page.evaluate(() => ({
  stage: window.__bar.getState().stage,
  activeDrink: window.__bar.getState().activeDrink,
  extraction: +window.__bar.getState().extraction.toFixed(2),
  focus: window.__bar.getState().focus,
  scroll: Math.round(window.scrollY),
}));
console.log(JSON.stringify({ before, mid, after, errs }));
await browser.close();
