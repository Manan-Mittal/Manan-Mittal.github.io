import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';
import { M } from './materials';
import { useBar } from '@/state/bar';
import type { SectionId } from '@/content/site';

/**
 * The shelf behind the bar. The five titled books are real navigation — each
 * one orders the matching drink, so the machine runs and the page follows.
 */

interface Spine {
  id: SectionId;
  title: string;
  author: string;
  cloth: string;
  foil: string;
  height: number;
  thickness: number;
  lean: number;
}

const BOOKS: Spine[] = [
  { id: 'about',    title: 'A Short Biography', author: 'M. MITTAL', cloth: '#7A3B2E', foil: '#E9A64A', height: 0.78, thickness: 0.15, lean: 0 },
  { id: 'work',     title: 'Service Record',    author: 'VOL. II',   cloth: '#2F4A46', foil: '#D8C9A8', height: 0.86, thickness: 0.19, lean: 0 },
  { id: 'projects', title: 'Things I Built',    author: 'ASSORTED',  cloth: '#4A3B6B', foil: '#E9A64A', height: 0.72, thickness: 0.13, lean: 0.09 },
  { id: 'popup',    title: 'To Be Continued',   author: 'A MENU',    cloth: '#8A5A1F', foil: '#FFE2AE', height: 0.9,  thickness: 0.17, lean: 0 },
  { id: 'contact',  title: 'How to Reach Me',   author: 'ONE PAGE',  cloth: '#20343F', foil: '#D8C9A8', height: 0.76, thickness: 0.14, lean: 0.07 },
];

/** Spine artwork: cloth ground, foil rules, title set vertically. */
const spineTexture = (title: string, author: string, cloth: string, foil: string) => {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 512;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = cloth;
  ctx.fillRect(0, 0, 128, 512);

  // Cloth tooth
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.045})`;
    ctx.fillRect(Math.random() * 128, Math.random() * 512, 1.5, 1.5);
  }

  ctx.strokeStyle = foil;
  ctx.lineWidth = 3;
  [58, 74, 438, 454].forEach((y) => {
    ctx.beginPath();
    ctx.moveTo(16, y);
    ctx.lineTo(112, y);
    ctx.stroke();
  });

  ctx.save();
  ctx.translate(64, 256);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = foil;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'italic 700 30px Georgia, serif';
  ctx.fillText(title, 0, -8, 300);
  ctx.font = '500 15px ui-monospace, monospace';
  ctx.fillText(author, 0, 20, 300);
  ctx.restore();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

function Book({ spine, x }: { spine: Spine; x: number }) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const order = useBar((s) => s.order);

  const tex = useMemo(
    () => spineTexture(spine.title, spine.author, spine.cloth, spine.foil),
    [spine.title, spine.author, spine.cloth, spine.foil],
  );
  const cloth = useMemo(
    () => new THREE.MeshStandardMaterial({ color: spine.cloth, roughness: 0.86, metalness: 0 }),
    [spine.cloth],
  );
  const pages = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#E8DBC2', roughness: 0.95 }),
    [],
  );

  useFrame((_, dt) => {
    if (!group.current) return;
    // A hovered book eases out of the row, the way you'd thumb one loose
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, hovered ? 0.26 : 0, 9, dt);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, hovered ? -0.12 : 0, 9, dt);
  });

  return (
    <group position={[x, spine.height / 2 + 0.06, 0]} rotation={[0, 0, spine.lean]}>
      <group
        ref={group}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = '';
        }}
        onClick={(e) => {
          e.stopPropagation();
          order(spine.id);
        }}
      >
        <mesh castShadow material={cloth}>
          <boxGeometry args={[spine.thickness, spine.height, 0.5]} />
        </mesh>
        {/* Page block, inset so the cloth reads as a cover wrapping it */}
        <mesh position={[0, 0, -0.03]} material={pages}>
          <boxGeometry args={[spine.thickness * 0.74, spine.height * 0.93, 0.47]} />
        </mesh>
        {/* Spine artwork */}
        <mesh position={[0, 0, 0.2505]}>
          <planeGeometry args={[spine.thickness * 0.96, spine.height * 0.97]} />
          <meshStandardMaterial
            map={tex}
            roughness={0.8}
            metalness={0.05}
            emissive={spine.foil}
            emissiveMap={tex}
            emissiveIntensity={hovered ? 0.35 : 0.04}
          />
        </mesh>
      </group>

      {hovered && (
        <Html center distanceFactor={9} position={[0, spine.height / 2 + 0.34, 0.3]} zIndexRange={[30, 0]}>
          <span className="pointer-events-none whitespace-nowrap rounded border border-crema/50 bg-roast-950 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-crema">
            Pull “{spine.title}”
          </span>
        </Html>
      )}
    </group>
  );
}

/** Filler volumes so the row doesn't look like exactly five props. */
function Filler({ x, h, w, color, lean = 0 }: { x: number; h: number; w: number; color: string; lean?: number }) {
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0 }),
    [color],
  );
  return (
    <mesh position={[x, h / 2 + 0.06, 0]} rotation={[0, 0, lean]} material={mat} castShadow>
      <boxGeometry args={[w, h, 0.46]} />
    </mesh>
  );
}

/** A leaning stack of three, for the far end of the shelf. */
function Stack({ x }: { x: number }) {
  const colors = ['#3E2A1E', '#5A4632', '#2C3A33'];
  return (
    <group position={[x, 0.06, -0.02]} rotation={[0, 0.32, 0]}>
      {colors.map((c, i) => (
        <mesh key={c} position={[0, 0.075 + i * 0.15, 0]} castShadow>
          <boxGeometry args={[0.52, 0.14, 0.42]} />
          <meshStandardMaterial color={c} roughness={0.88} />
        </mesh>
      ))}
    </group>
  );
}

/** Bag of beans with a folded top and a paper label. */
function BeanBag({ x, color }: { x: number; color: string }) {
  const label = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#EFE3CE', roughness: 0.9 }),
    [],
  );
  const bag = useMemo(
    () => new THREE.MeshStandardMaterial({ color, roughness: 0.82, metalness: 0.02 }),
    [color],
  );
  return (
    <group position={[x, 0.06, 0]} rotation={[0, -0.2, 0]}>
      <RoundedBox args={[0.44, 0.6, 0.26]} radius={0.035} smoothness={3} position={[0, 0.3, 0]} material={bag} castShadow />
      {/* Folded-over top, pinched by a tie */}
      <mesh position={[0, 0.61, 0]} rotation={[0.18, 0, 0]} material={bag}>
        <boxGeometry args={[0.44, 0.09, 0.2]} />
      </mesh>
      <mesh position={[0, 0.655, 0]} material={M.copper}>
        <boxGeometry args={[0.46, 0.025, 0.06]} />
      </mesh>
      <mesh position={[0, 0.3, 0.132]} material={label}>
        <planeGeometry args={[0.26, 0.3]} />
      </mesh>
    </group>
  );
}

export default function Shelf() {
  return (
    <group position={[-0.6, 3.0, -4.4]}>
      {/* Two boards with brackets, so the wall has some carpentry on it */}
      <mesh position={[0, 0, 0]} material={M.walnut} receiveShadow castShadow>
        <boxGeometry args={[9.0, 0.12, 0.72]} />
      </mesh>
      <mesh position={[0, -1.35, 0]} material={M.walnut} receiveShadow castShadow>
        <boxGeometry args={[9.0, 0.1, 0.62]} />
      </mesh>
      {[-3.6, 0, 3.6].map((x) => (
        <mesh key={x} position={[x, -0.68, -0.24]} material={M.charcoal}>
          <boxGeometry args={[0.07, 1.5, 0.14]} />
        </mesh>
      ))}

      {/* Titled books — the clickable ones */}
      {BOOKS.map((b, i) => (
        <Book key={b.id} spine={b} x={-2.0 + i * 0.42} />
      ))}

      <Filler x={-2.42} h={0.82} w={0.16} color="#3E2A1E" />
      <Filler x={-2.26} h={0.68} w={0.11} color="#55452F" lean={0.06} />
      <Filler x={0.24} h={0.8} w={0.14} color="#33454A" />
      <Filler x={0.42} h={0.66} w={0.1} color="#6B4426" lean={-0.05} />
      <Stack x={1.1} />

      <BeanBag x={2.3} color="#C97B2B" />
      <BeanBag x={2.9} color="#6E8B80" />
      <BeanBag x={3.5} color="#B4432B" />

      {/* Lower board: cups and a stack of saucers */}
      <group position={[0, -1.29, 0]}>
        {[-3.0, -2.62, -2.24].map((x) => (
          <mesh key={x} position={[x, 0.11, 0]} material={M.ceramic} castShadow>
            <cylinderGeometry args={[0.16, 0.12, 0.2, 20]} />
          </mesh>
        ))}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[-1.5, 0.035 + i * 0.045, 0]} material={M.ceramic}>
            <cylinderGeometry args={[0.26, 0.25, 0.04, 24]} />
          </mesh>
        ))}
        <mesh position={[2.6, 0.28, 0]} material={M.walnut} castShadow>
          <boxGeometry args={[0.7, 0.5, 0.34]} />
        </mesh>
      </group>
    </group>
  );
}
