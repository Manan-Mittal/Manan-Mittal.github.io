import * as THREE from 'three';

/**
 * Everything here is generated at runtime — no texture downloads, so the bar
 * renders instantly on GitHub Pages and works offline.
 *
 * Material instances are module-level singletons: every steel bolt on the
 * machine points at the SAME MeshStandardMaterial, which keeps the GPU to a
 * handful of programs instead of one per mesh.
 */

const canvasTexture = (
  size: number,
  draw: (ctx: CanvasRenderingContext2D, s: number) => void,
): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

/** Soft additive glow, used for lamp halos and light pools. */
export const glowTexture = (() => {
  let cached: THREE.CanvasTexture | null = null;
  return () => {
    if (cached) return cached;
    cached = canvasTexture(128, (ctx, s) => {
      const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      g.addColorStop(0, 'rgba(255,206,140,0.95)');
      g.addColorStop(0.3, 'rgba(255,184,112,0.38)');
      g.addColorStop(0.65, 'rgba(233,166,74,0.12)');
      g.addColorStop(1, 'rgba(233,166,74,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, s, s);
    });
    return cached;
  };
})();

/** Soft round puff, used for every steam wisp. */
export const steamTexture = (() => {
  let cached: THREE.CanvasTexture | null = null;
  return () => {
    if (cached) return cached;
    cached = canvasTexture(128, (ctx, s) => {
      const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      g.addColorStop(0, 'rgba(255,255,255,0.9)');
      g.addColorStop(0.45, 'rgba(255,255,255,0.28)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, s, s);
    });
    return cached;
  };
})();

/** Brushed-metal roughness map: fine horizontal grain so highlights streak. */
export const brushedRoughness = (() => {
  let cached: THREE.CanvasTexture | null = null;
  return () => {
    if (cached) return cached;
    cached = canvasTexture(512, (ctx, s) => {
      ctx.fillStyle = '#6a6a6a';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 5000; i++) {
        const y = Math.random() * s;
        const w = 20 + Math.random() * 120;
        const v = 90 + Math.random() * 90;
        ctx.strokeStyle = `rgba(${v},${v},${v},0.09)`;
        ctx.lineWidth = Math.random() * 1.4;
        ctx.beginPath();
        ctx.moveTo(Math.random() * s, y);
        ctx.lineTo(Math.random() * s + w, y);
        ctx.stroke();
      }
    });
    cached.wrapS = cached.wrapT = THREE.RepeatWrapping;
    cached.repeat.set(2, 2);
    return cached;
  };
})();

/** Walnut: banded grain with a few darker rings. */
export const woodTexture = (() => {
  let cached: THREE.CanvasTexture | null = null;
  return () => {
    if (cached) return cached;
    cached = canvasTexture(512, (ctx, s) => {
      ctx.fillStyle = '#4a2f1e';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 190; i++) {
        const y = (i / 190) * s + Math.sin(i * 0.7) * 3;
        const dark = Math.random() > 0.82;
        ctx.strokeStyle = dark ? 'rgba(28,16,9,0.55)' : `rgba(${96 + Math.random() * 40},${60 + Math.random() * 26},${34 + Math.random() * 18},0.35)`;
        ctx.lineWidth = dark ? 2.4 : 1 + Math.random() * 2;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= s; x += 16) {
          ctx.lineTo(x, y + Math.sin((x + i * 30) * 0.012) * 5 + Math.sin(x * 0.05) * 1.5);
        }
        ctx.stroke();
      }
    });
    cached.wrapS = cached.wrapT = THREE.RepeatWrapping;
    return cached;
  };
})();

/** The pressure gauge face — drawn once, mapped onto a disc. */
export const gaugeTexture = (() => {
  let cached: THREE.CanvasTexture | null = null;
  return () => {
    if (cached) return cached;
    cached = canvasTexture(256, (ctx, s) => {
      const c = s / 2;
      ctx.fillStyle = '#F4E7D6';
      ctx.beginPath();
      ctx.arc(c, c, c, 0, Math.PI * 2);
      ctx.fill();

      // Tick marks around the bottom 270°, espresso range picked out in amber
      for (let i = 0; i <= 30; i++) {
        const a = Math.PI * 0.75 + (i / 30) * Math.PI * 1.5;
        const major = i % 5 === 0;
        const inEspresso = i >= 17 && i <= 23;
        ctx.strokeStyle = inEspresso ? '#C97B2B' : '#2C211A';
        ctx.lineWidth = major ? 4 : 2;
        ctx.beginPath();
        ctx.moveTo(c + Math.cos(a) * (c - 14), c + Math.sin(a) * (c - 14));
        ctx.lineTo(c + Math.cos(a) * (c - (major ? 34 : 26)), c + Math.sin(a) * (c - (major ? 34 : 26)));
        ctx.stroke();
      }

      ctx.fillStyle = '#2C211A';
      ctx.font = `600 ${s * 0.085}px ui-monospace, monospace`;
      ctx.textAlign = 'center';
      ctx.fillText('BAR', c, c + s * 0.2);
      ctx.font = `500 ${s * 0.05}px ui-monospace, monospace`;
      ctx.fillStyle = '#8C7A68';
      ctx.fillText('0 — 15', c, c + s * 0.3);
    });
    return cached;
  };
})();

/* ── Material library ────────────────────────────────────────────────────── */

export const M = {
  /** Machine shell — brushed stainless with a warm tint so it sits in the room */
  steel: new THREE.MeshStandardMaterial({
    color: '#d9d6d0',
    metalness: 0.88,
    roughness: 0.38,
    envMapIntensity: 1.15,
  }),
  /** Polished chrome for the group head, wand and rails */
  chrome: new THREE.MeshStandardMaterial({
    color: '#e8e8ea',
    metalness: 1,
    roughness: 0.17,
    envMapIntensity: 1.35,
  }),
  /** Matte powder-coat black for the alcove, tray and panels */
  charcoal: new THREE.MeshStandardMaterial({
    color: '#241d17',
    metalness: 0.4,
    roughness: 0.66,
  }),
  copper: new THREE.MeshStandardMaterial({
    color: '#b87333',
    metalness: 0.94,
    roughness: 0.42,
  }),
  walnut: new THREE.MeshStandardMaterial({
    color: '#6b4426',
    metalness: 0,
    roughness: 0.55,
  }),
  counter: new THREE.MeshStandardMaterial({
    color: '#3d2718',
    metalness: 0.05,
    roughness: 0.42,
  }),
  ceramic: new THREE.MeshStandardMaterial({
    color: '#f6efe4',
    metalness: 0,
    roughness: 0.36,
  }),
  /** The shot itself — nearly black, with crema handled by a separate disc */
  coffee: new THREE.MeshStandardMaterial({
    color: '#2a1408',
    metalness: 0.25,
    roughness: 0.22,
  }),
  crema: new THREE.MeshStandardMaterial({
    color: '#c98b3f',
    metalness: 0.1,
    roughness: 0.5,
  }),
  bean: new THREE.MeshStandardMaterial({
    color: '#42210e',
    metalness: 0.1,
    roughness: 0.6,
  }),
  wall: new THREE.MeshStandardMaterial({
    color: '#1b1410',
    metalness: 0,
    roughness: 0.95,
  }),
  /**
   * Deliberately NOT MeshPhysicalMaterial: `transmission` makes three render
   * the whole scene a second time every frame into a backdrop buffer. At this
   * size a plain transparent standard material is indistinguishable and free.
   */
  glass: new THREE.MeshStandardMaterial({
    color: '#DCE8E6',
    metalness: 0,
    roughness: 0.06,
    transparent: true,
    opacity: 0.28,
    side: THREE.DoubleSide,
    depthWrite: false,
  }),
  /** Backlit machine buttons — emissive is animated per-instance via clones */
  lamp: new THREE.MeshStandardMaterial({
    color: '#2a2018',
    emissive: '#E9A64A',
    emissiveIntensity: 0.2,
    roughness: 0.5,
  }),
};

/** Applies the brushed grain to the shell once textures are available. */
export const primeMaterials = () => {
  if (!M.steel.roughnessMap) {
    M.steel.roughnessMap = brushedRoughness();
    M.steel.needsUpdate = true;
  }
  if (!M.counter.map) {
    const wood = woodTexture();
    wood.repeat.set(3, 1);
    M.counter.map = wood;
    M.counter.needsUpdate = true;
  }
  if (!M.walnut.map) {
    M.walnut.map = woodTexture();
    M.walnut.needsUpdate = true;
  }
};
