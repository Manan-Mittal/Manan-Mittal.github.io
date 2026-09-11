// Crops a region out of a shot so close-up checks cost few tokens.
import { chromium } from 'playwright';
const [, , name = 'crop', x = '700', y = '250', w = '700', h = '450', scrollY = '0'] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
await page.waitForTimeout(5000);
if (+scrollY) { await page.evaluate((s) => window.scrollTo(0, s), +scrollY); await page.waitForTimeout(1200); }
await page.screenshot({ path: `.shots/${name}.png`, clip: { x: +x, y: +y, width: +w, height: +h } });
console.log('saved .shots/' + name + '.png');
await browser.close();
