// Holds the bar in a steaming pose so the pitcher/wand alignment can be judged.
import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
await page.waitForTimeout(6000);

// No order() means no timers, so this pose holds indefinitely
await page.evaluate(() => window.__bar.setState({ stage: 'extracting', activeDrink: 'work', extraction: 0.65 }));
await page.waitForTimeout(2500);

const probe = await page.evaluate(() => {
  const out = { stage: window.__bar.getState().stage };
  window.__stage.scene.traverse((o) => {
    if (!o.isMesh || !o.geometry?.parameters) return;
    const p = o.geometry.parameters;
    const tag = p.radiusTop === 0.055 && p.radiusBottom === 0.034 ? 'wandTip'
      : p.radiusTop === 0.21 && p.radiusBottom === 0.17 ? 'pitcher' : null;
    if (!tag) return;
    o.updateWorldMatrix(true, false);
    const e = o.matrixWorld.elements;
    out[tag] = [+e[12].toFixed(2), +e[13].toFixed(2), +e[14].toFixed(2)];
  });
  // Froth planes: are they visible and at what opacity?
  const puffs = [];
  window.__stage.scene.traverse((o) => {
    if (o.isMesh && o.geometry?.type === 'PlaneGeometry' && o.material?.map && o.material.depthWrite === false) {
      let vis = o.visible, a = o.parent;
      while (a) { vis = vis && a.visible; a = a.parent; }
      o.updateWorldMatrix(true, false);
      const e = o.matrixWorld.elements;
      puffs.push({ vis, op: +o.material.opacity.toFixed(2), y: +e[13].toFixed(2), x: +e[12].toFixed(2) });
    }
  });
  out.puffs = puffs.filter((p) => p.x < -1.5).slice(0, 6);
  out.puffCount = puffs.length;
  return out;
});
console.log(JSON.stringify(probe));
await page.screenshot({ path: '.shots/milk-steam.png', clip: { x: 240, y: 230, width: 760, height: 620 } });
await page.screenshot({ path: '.shots/milk-full.png' });
await browser.close();
