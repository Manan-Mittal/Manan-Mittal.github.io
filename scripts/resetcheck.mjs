// Order a drink, ride the scroll to the section, come back up, confirm reset.
import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
await page.waitForTimeout(4500);
const st = () => page.evaluate(() => { const s = window.__bar.getState(); return `${s.stage}/${s.activeDrink}/x=${s.extraction.toFixed(2)}/focus=${s.focus}/scrollY=${Math.round(window.scrollY)}`; });
await page.locator('#top ul li button').nth(2).click();
await page.waitForTimeout(8000);
console.log('after serve   ', await st());
await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, 0); });
await page.waitForTimeout(2200);
console.log('back at top   ', await st());
await page.screenshot({ path: '.shots/reset-top.png', clip: { x: 880, y: 380, width: 420, height: 380 } });
await browser.close();
