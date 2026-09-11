import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
await page.waitForTimeout(4000);
await page.locator('#top ul li button').nth(0).click();
await page.waitForTimeout(4200);
const out = await page.evaluate(() => {
  const scene = window.__stage.scene;
  const found = [];
  scene.traverse((o) => {
    if (!o.isMesh || !o.geometry?.parameters) return;
    const p = o.geometry.parameters;
    const r = p.radiusTop ?? p.radius ?? -1;
    if (Math.abs(r - 0.255) > 0.012) return;
    o.updateWorldMatrix(true, false);
    const e = o.matrixWorld.elements;
    const w = { x: e[12], y: e[13], z: e[14] };
    found.push({
      geo: o.geometry.type,
      visible: o.visible,
      parentVis: o.parent?.visible,
      parentScale: +(o.parent?.scale.x ?? -1).toFixed(3),
      scale: o.scale.toArray().map((n) => +n.toFixed(3)),
      worldY: +w.y.toFixed(3),
      color: '#' + o.material.color.getHexString(),
      renderOrder: o.renderOrder,
    });
  });
  return { found, state: { ...window.__bar.getState(), order: undefined, setStage: undefined, setExtraction: undefined, setFocus: undefined, setReducedMotion: undefined, setQuality: undefined, clear: undefined } };
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
