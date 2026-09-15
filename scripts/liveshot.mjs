// Screenshot the deployed site, not localhost.
import { chromium } from 'playwright';
const [, , name = 'live', y = '0'] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
await page.goto('https://manan-mittal.github.io/', { waitUntil: 'networkidle' });
await page.waitForTimeout(6500);
if (+y) {
  await page.evaluate((v) => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, v); }, +y);
  await page.waitForTimeout(2000);
}
await page.screenshot({ path: `.shots/${name}.png` });
console.log(name, 'captured from production');
await browser.close();
