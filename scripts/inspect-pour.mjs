import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
await page.waitForTimeout(4500);
await page.locator('#top ul li button').nth(0).click();
await page.waitForFunction(() => window.__bar.getState().extraction > 0.25, null, { timeout: 9000 });

const out = await page.evaluate(() => {
  const s = window.__stage;
  const cam = s.camera;
  const rows = [];
  s.scene.traverse((o) => {
    if (!o.isMesh) return;
    const p = o.geometry?.parameters;
    if (!p) return;
    const isStream = p.radiusTop === 0.022 && p.radiusBottom === 0.034;
    const isLiquid = p.radiusTop === 0.255 && p.height === 0.31;
    const isCrema = p.radius === 0.255 && o.geometry.type === 'CircleGeometry';
    if (!isStream && !isLiquid && !isCrema) return;
    o.updateWorldMatrix(true, false);
    const e = o.matrixWorld.elements;
    // visible only counts if every ancestor is visible too
    let vis = o.visible, a = o.parent;
    while (a) { vis = vis && a.visible; a = a.parent; }
    rows.push({
      kind: isStream ? 'stream' : isLiquid ? 'liquid' : 'crema',
      visible: o.visible,
      chainVisible: vis,
      scale: o.scale.toArray().map((n) => +n.toFixed(3)),
      worldY: +e[13].toFixed(3),
      worldZ: +e[14].toFixed(3),
    });
  });
  return { rows, ext: +window.__bar.getState().extraction.toFixed(2), stage: window.__bar.getState().stage, cam: cam.position.toArray().map((n) => +n.toFixed(2)) };
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
