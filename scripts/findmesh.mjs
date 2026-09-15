// Projects every mesh to screen space and reports what lands in a given box.
import { chromium } from 'playwright';
const [, , x0 = '930', y0 = '385', x1 = '1180', y1 = '415'] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
await page.waitForTimeout(6000);
const hits = await page.evaluate(({ x0, y0, x1, y1 }) => {
  const { scene, camera, size } = window.__stage;
  const out = [];
  scene.updateMatrixWorld(true);
  scene.traverse((o) => {
    if (!o.isMesh || !o.visible) return;
    const e = o.matrixWorld.elements;
    const p = { x: e[12], y: e[13], z: e[14] };
    // project
    const v = new o.matrixWorld.constructor();
    const pos = [p.x, p.y, p.z];
    const proj = camera.projectionMatrix.clone().multiply(camera.matrixWorldInverse);
    const m = proj.elements;
    const w = m[3] * pos[0] + m[7] * pos[1] + m[11] * pos[2] + m[15];
    const sx = ((m[0] * pos[0] + m[4] * pos[1] + m[8] * pos[2] + m[12]) / w * 0.5 + 0.5) * size.width;
    const sy = (-(m[1] * pos[0] + m[5] * pos[1] + m[9] * pos[2] + m[13]) / w * 0.5 + 0.5) * size.height;
    if (sx < x0 || sx > x1 || sy < y0 || sy > y1) return;
    const mat = o.material;
    out.push({
      geo: o.geometry.type,
      args: JSON.stringify(o.geometry.parameters).slice(0, 90),
      color: mat?.color ? '#' + mat.color.getHexString() : null,
      emissive: mat?.emissive ? '#' + mat.emissive.getHexString() : null,
      emissiveIntensity: mat?.emissiveIntensity,
      screen: [Math.round(sx), Math.round(sy)],
      world: pos.map((n) => +n.toFixed(2)),
    });
  });
  return out;
}, { x0: +x0, y0: +y0, x1: +x1, y1: +y1 });
console.log(JSON.stringify(hits, null, 1));
await browser.close();
