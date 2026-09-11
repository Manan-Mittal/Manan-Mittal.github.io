// Measures sustained frame rate of the bar scene at a given viewport.
import { chromium } from 'playwright';
const [, , w = '1440', h = '900'] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h }, reducedMotion: 'no-preference' });
await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
await page.waitForTimeout(4000);

const fps = await page.evaluate(() => new Promise((resolve) => {
  let n = 0;
  const t0 = performance.now();
  const tick = () => { n++; if (performance.now() - t0 < 3000) requestAnimationFrame(tick); else resolve(+(n / ((performance.now() - t0) / 1000)).toFixed(1)); };
  requestAnimationFrame(tick);
}));

const stats = await page.evaluate(() => {
  const s = window.__stage;
  return { calls: s?.gl.info.render.calls, tris: s?.gl.info.render.triangles, progs: s?.gl.info.programs?.length, tex: s?.gl.info.memory.textures };
});
console.log(JSON.stringify({ viewport: `${w}x${h}`, fps, ...stats }));
await browser.close();
