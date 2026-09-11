// Verifies the deployed site, not localhost.
import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
const errors = [];
page.on('pageerror', (e) => errors.push('[pageerror] ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('[console] ' + m.text().slice(0, 200)); });
page.on('requestfailed', (r) => errors.push('[failed] ' + r.url()));

await page.goto('https://manan-mittal.github.io/', { waitUntil: 'networkidle' });
await page.waitForTimeout(7000);

const probe = await page.evaluate(() => ({
  title: document.title,
  h1: document.querySelector('h1')?.innerText.replace(/\n/g, ' '),
  canvas: !!document.querySelector('canvas'),
  sections: ['about', 'work', 'projects', 'popup', 'contact'].filter((id) => !!document.getElementById(id)),
  menuRows: document.querySelectorAll('#top ul li button').length,
  photoLoaded: (() => { const i = document.querySelector('img[alt*="Manan"]'); return !!i && i.naturalWidth > 0; })(),
  mango: document.body.innerText.includes('Mango Sticky Rice'),
  role: document.body.innerText.includes('Software Engineer II'),
  city: document.body.innerText.includes('Jersey City'),
  hScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
}));
await page.screenshot({ path: '.shots/live-desk.png' });

const readout = () => page.evaluate(() => [...document.querySelectorAll('[aria-live="polite"]')].map((n) => n.textContent.trim()).filter(Boolean).join(' | '));
await page.locator('#top ul li button').nth(2).click();
await page.waitForTimeout(1500);
console.log('t=1.5s readout:', await readout());
await page.waitForTimeout(3200);
console.log('t=4.7s readout:', await readout());
await page.waitForTimeout(2500);
console.log('t=7.2s readout:', await readout());
const after = await page.evaluate(() => Math.round(window.scrollY));
await page.screenshot({ path: '.shots/live-served.png' });

console.log(JSON.stringify({ ...probe, scrollAfterOrder: after }, null, 1));
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'ERRORS: none');
await browser.close();
