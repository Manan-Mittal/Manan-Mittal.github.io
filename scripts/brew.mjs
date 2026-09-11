// Drives an order end-to-end and captures the machine mid-shot.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
mkdirSync('.shots', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
const errors = [];
page.on('pageerror', (e) => errors.push('[pageerror] ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('[error] ' + m.text().slice(0, 300)); });

await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
await page.waitForTimeout(4000);

const state = () => page.evaluate(() => {
  const s = window.__stage;
  return { url: location.hash, scroll: Math.round(window.scrollY) };
});

await page.getByRole('button', { name: /Order the Cortado/i }).click();
await page.waitForTimeout(1100);
await page.screenshot({ path: '.shots/brew-grinding.png' });
const a = await page.evaluate(() => document.querySelector('[aria-live="polite"]')?.textContent);

await page.waitForTimeout(1400);
await page.screenshot({ path: '.shots/brew-extracting.png' });
const b = await page.evaluate(() => document.querySelector('[aria-live="polite"]')?.textContent);

await page.waitForTimeout(3200);
const c = await page.evaluate(() => document.querySelector('[aria-live="polite"]')?.textContent);
await page.screenshot({ path: '.shots/brew-served.png' });

console.log(JSON.stringify({ atGrind: a, atExtract: b, atServed: c, ...(await state()) }));
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'ERRORS: none');
await browser.close();
