// Verifies the production bundle, not just the dev server.
import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
const errors = [];
page.on('pageerror', (e) => errors.push('[pageerror] ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('[console] ' + m.text().slice(0, 220)); });
page.on('requestfailed', (r) => errors.push('[404] ' + r.url()));

await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });
await page.waitForTimeout(6000);

const probe = await page.evaluate(() => ({
  canvas: !!document.querySelector('canvas'),
  title: document.title,
  h1: document.querySelector('h1')?.innerText.replace(/\n/g, ' '),
  sections: ['about', 'work', 'projects', 'popup', 'contact'].filter((id) => !!document.getElementById(id)),
  menuRows: document.querySelectorAll('#top ul li button').length,
  photo: !!document.querySelector('img[alt*="Manan"]'),
  hScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
}));
await page.screenshot({ path: '.shots/prod-hero.png' });

// Ordering still works in the built bundle
await page.locator('#top ul li button').nth(1).click();
await page.waitForTimeout(1200);
const midLive = await page.evaluate(() => [...document.querySelectorAll('[aria-live="polite"]')].map((n) => n.textContent).join(' | '));
await page.waitForTimeout(4500);
const scrolled = await page.evaluate(() => Math.round(window.scrollY));
console.log('mid-brew readout:', midLive);
await page.screenshot({ path: '.shots/prod-served.png' });

console.log(JSON.stringify({ ...probe, scrolledAfterOrder: scrolled }));
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'ERRORS: none');
await browser.close();
