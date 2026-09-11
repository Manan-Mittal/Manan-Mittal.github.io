import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { M, steamTexture } from './materials';
import { useBar } from '@/state/bar';
import { DRINKS, type Drink } from '@/content/site';

/**
 * What's actually on the tray. Each drink on the menu is built differently:
 * an espresso is a dark inch in a demitasse, a cortado fills it with milk, and
 * the cold drinks arrive in a tall glass over ice. The check gets no vessel at
 * all — it prints instead.
 */

/** Half-profile of a ceramic demitasse, revolved into the cup body. */
const CUP_PROFILE = [
  [0.0, 0.0],
  [0.16, 0.0],
  [0.175, 0.015],
  [0.2, 0.06],
  [0.26, 0.24],
  [0.288, 0.36],
  [0.3, 0.378],
  [0.276, 0.362],
  [0.242, 0.24],
  [0.178, 0.06],
  [0.158, 0.042],
  [0.0, 0.042],
].map(([x, y]) => new THREE.Vector2(x, y));

/**
 * `rim` is the liquid radius at a full pour, `taperRatio` how much narrower the
 * vessel is at its floor. A tapered cup cannot be filled by scaling a cylinder
 * on Y alone — the surface would stay rim-width at every level and cut straight
 * through the cup wall — so the liquid is scaled on all three axes at once.
 */
const DEMITASSE = { rim: 0.255, taperRatio: 0.6, floor: 0.05, depth: 0.31 };
const GLASS = { rim: 0.26, taperRatio: 0.9, floor: 0.06, depth: 0.72 };

const restingBuild: Drink['build'] = {
  vessel: 'demitasse',
  fill: 0,
  liquid: '#33180A',
};

const buildFor = (id: string | null) =>
  DRINKS.find((d) => d.id === id)?.build ?? restingBuild;

/** Two thin streams from the portafilter spouts. */
function Pour() {
  const streams = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const { stage, extraction, activeDrink } = useBar.getState();
    const build = buildFor(activeDrink);
    const pouring = stage === 'extracting' && build.vessel !== 'none';
    // Streams taper in at the start of the shot and thin out as pressure drops
    const ramp = pouring ? THREE.MathUtils.smoothstep(extraction, 0, 0.12) * (1 - extraction * 0.35) : 0;
    const jitter = pouring ? 1 + Math.sin(state.clock.elapsedTime * 30) * 0.06 : 1;

    streams.current.forEach((mesh) => {
      if (!mesh) return;
      mesh.visible = ramp > 0.01;
      mesh.scale.set(ramp * jitter, 1, ramp * jitter);
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.color.set(build.liquid);
      mat.opacity = 0.6 + ramp * 0.4;
    });
  });

  return (
    <group position={[0, 0.78, 0.4]}>
      {[-0.1, 0.1].map((x, i) => (
        <mesh
          key={x}
          ref={(m) => {
            if (m) streams.current[i] = m;
          }}
          position={[x, 0, 0]}
          visible={false}
        >
          <cylinderGeometry args={[0.016, 0.026, 0.26, 8, 1, true]} />
          <meshStandardMaterial
            color="#6b3b18"
            roughness={0.25}
            metalness={0.1}
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Billboarded puffs, only over drinks that are actually hot. */
function Steam({ count = 8 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);
  const tex = useMemo(() => steamTexture(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        offset: i / count,
        drift: (Math.random() - 0.5) * 0.6,
        speed: 0.22 + Math.random() * 0.16,
        scale: 0.18 + Math.random() * 0.22,
      })),
    [count],
  );

  useFrame((state) => {
    if (!group.current) return;
    const { stage, extraction, reducedMotion, activeDrink } = useBar.getState();
    const build = buildFor(activeDrink);
    const heat = !build.hot ? 0 : stage === 'extracting' ? extraction : stage === 'served' ? 1 : 0;
    group.current.visible = heat > 0.05 && !reducedMotion;
    if (!group.current.visible) return;

    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const s = seeds[i];
      const life = (t * s.speed + s.offset) % 1;
      child.position.set(
        Math.sin(life * 5 + i) * 0.07 + s.drift * life,
        life * 1.1,
        Math.cos(life * 3 + i) * 0.05,
      );
      child.scale.setScalar(s.scale * (0.4 + life * 1.9));
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      // Fade in fast, out slow — steam never pops out of existence
      mat.opacity = Math.sin(life * Math.PI) * 0.32 * heat;
      child.quaternion.copy(state.camera.quaternion);
    });
  });

  return (
    <group ref={group} position={[0, 0.46, 0]} visible={false}>
      {seeds.map((s, i) => (
        <mesh key={i}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={tex} transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Ice, for the two cold drinks. Rises with the liquid so it always floats. */
function Ice() {
  const group = useRef<THREE.Group>(null);
  const cubes = useMemo(
    () =>
      [
        { p: [0.07, 0.0, -0.05], r: [0.5, 0.8, 0.2], s: 0.13 },
        { p: [-0.08, 0.11, 0.04], r: [1.1, 0.3, 0.9], s: 0.115 },
        { p: [0.02, 0.22, 0.07], r: [0.2, 1.2, 0.5], s: 0.12 },
        { p: [-0.05, 0.33, -0.06], r: [0.9, 0.6, 1.3], s: 0.105 },
        { p: [0.09, 0.42, 0.02], r: [0.4, 0.2, 0.7], s: 0.115 },
      ] as const,
    [],
  );

  useFrame((_, dt) => {
    if (!group.current) return;
    const { activeDrink, extraction, stage } = useBar.getState();
    const build = buildFor(activeDrink);
    const wanted = !!build.ice && stage !== 'idle';
    const target = wanted ? (stage === 'served' ? 1 : THREE.MathUtils.smoothstep(extraction, 0.1, 0.5)) : 0;
    const s = THREE.MathUtils.damp(group.current.scale.x || 0.0001, Math.max(target, 0.0001), 8, dt);
    group.current.scale.setScalar(s);
    group.current.visible = s > 0.02;
    // Ride the liquid so the top cubes always break the surface
    const fill = build.fill * (stage === 'served' ? 1 : extraction);
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      GLASS.floor + Math.max(0, fill * GLASS.depth - 0.3),
      7,
      dt,
    );
  });

  return (
    <group ref={group} position={[0, GLASS.floor, 0]} visible={false} scale={0.0001}>
      {cubes.map((c, i) => (
        <mesh key={i} position={c.p as unknown as [number, number, number]} rotation={c.r as unknown as [number, number, number]}>
          <boxGeometry args={[c.s, c.s, c.s]} />
          <meshStandardMaterial
            color="#E8F4FA"
            roughness={0.12}
            metalness={0}
            transparent
            opacity={0.62}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Liquid column, foam cap and the denser base layer some drinks get. */
function Liquid({ vessel }: { vessel: 'demitasse' | 'glass' }) {
  const body = useRef<THREE.Mesh>(null);
  const cap = useRef<THREE.Mesh>(null);
  const base = useRef<THREE.Mesh>(null);
  const dims = vessel === 'glass' ? GLASS : DEMITASSE;

  useFrame((_, dt) => {
    const { stage, extraction, activeDrink } = useBar.getState();
    const build = buildFor(activeDrink);
    const mine = build.vessel === vessel;
    const target = !mine || stage === 'idle' ? 0 : build.fill * (stage === 'served' ? 1 : extraction);

    if (!body.current) return;
    const h = THREE.MathUtils.damp(body.current.scale.y, Math.max(target, 0.0001), 8, dt);
    // Width tracks the vessel's own taper at the current liquid level
    const width = THREE.MathUtils.lerp(dims.taperRatio, 1, h);
    body.current.scale.set(width, h, width);
    body.current.position.y = dims.floor + (h * dims.depth) / 2;
    body.current.visible = h > 0.01;
    (body.current.material as THREE.MeshStandardMaterial).color.set(build.liquid);

    const surface = dims.floor + h * dims.depth;
    const surfaceRadius = dims.rim * width;

    if (cap.current) {
      cap.current.visible = h > 0.08 && !!build.cap && mine;
      cap.current.position.y = surface + 0.004;
      cap.current.scale.setScalar(surfaceRadius / dims.rim);
      if (build.cap) (cap.current.material as THREE.MeshStandardMaterial).color.set(build.cap);
    }
    if (base.current) {
      // The denser layer settles in the bottom third
      const bh = Math.min(h, h * 0.34 + 0.02);
      base.current.visible = h > 0.12 && !!build.base && mine;
      base.current.scale.set(dims.taperRatio * 1.02, bh / 0.34, dims.taperRatio * 1.02);
      base.current.position.y = dims.floor + (bh * dims.depth) / 2;
      if (build.base) (base.current.material as THREE.MeshStandardMaterial).color.set(build.base);
    }
  });

  return (
    <>
      <mesh ref={body} position={[0, dims.floor, 0]} scale={[dims.taperRatio, 0.0001, dims.taperRatio]}>
        <cylinderGeometry args={[dims.rim, dims.rim * dims.taperRatio, dims.depth, 24]} />
        <meshStandardMaterial color="#33180A" roughness={0.22} metalness={0.2} />
      </mesh>
      <mesh ref={base} position={[0, dims.floor, 0]} visible={false}>
        <cylinderGeometry args={[dims.rim, dims.rim * dims.taperRatio, dims.depth * 0.34, 24]} />
        <meshStandardMaterial color="#7BA05B" roughness={0.5} />
      </mesh>
      <mesh ref={cap} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <circleGeometry args={[dims.rim, 28]} />
        <meshStandardMaterial color="#C98B3F" roughness={0.62} />
      </mesh>
    </>
  );
}

/** Scales a vessel in and out as drinks change on the bar. */
function Vessel({
  kind,
  children,
}: {
  kind: 'demitasse' | 'glass';
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (!group.current) return;
    const { activeDrink, stage } = useBar.getState();
    const build = buildFor(activeDrink);
    // The demitasse is the bar's resting state; the glass only appears when ordered
    const wanted =
      build.vessel === kind || (kind === 'demitasse' && (stage === 'idle' || build.vessel === 'none'));
    const s = THREE.MathUtils.damp(group.current.scale.x, wanted ? 1 : 0.0001, 10, dt);
    group.current.scale.setScalar(s);
    group.current.visible = s > 0.03;
  });

  return <group ref={group}>{children}</group>;
}

export default function Cup() {
  const cupGeometry = useMemo(() => new THREE.LatheGeometry(CUP_PROFILE, 36), []);
  const glassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#DCE8E6',
        roughness: 0.06,
        metalness: 0,
        transparent: true,
        opacity: 0.26,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [],
  );

  return (
    <group position={[0, 0.28, 0.4]}>
      {/* Saucer stays put whatever is on it */}
      <mesh position={[0, -0.01, 0]} material={M.ceramic} castShadow receiveShadow>
        <cylinderGeometry args={[0.44, 0.4, 0.035, 24]} />
      </mesh>
      <mesh position={[0, 0.012, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.ceramic}>
        <torusGeometry args={[0.42, 0.012, 8, 32]} />
      </mesh>

      <Vessel kind="demitasse">
        <mesh geometry={cupGeometry} position={[0, 0.02, 0]} castShadow>
          <meshStandardMaterial color="#f6efe4" roughness={0.34} metalness={0} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0.3, 0.24, 0]} rotation={[0, 0, -0.2]} material={M.ceramic}>
          <torusGeometry args={[0.1, 0.026, 8, 20, Math.PI * 1.35]} />
        </mesh>
        <Liquid vessel="demitasse" />
      </Vessel>

      <Vessel kind="glass">
        {/* Tumbler: walls, floor and a thicker rim */}
        <mesh position={[0, 0.42, 0]} material={glassMat}>
          <cylinderGeometry args={[0.29, 0.255, 0.8, 28, 1, true]} />
        </mesh>
        <mesh position={[0, 0.04, 0]} material={glassMat}>
          <cylinderGeometry args={[0.255, 0.255, 0.06, 28]} />
        </mesh>
        <mesh position={[0, 0.82, 0]} rotation={[Math.PI / 2, 0, 0]} material={glassMat}>
          <torusGeometry args={[0.288, 0.014, 8, 28]} />
        </mesh>
        <Liquid vessel="glass" />
        <Ice />
      </Vessel>

      <Pour />
      <Steam />
    </group>
  );
}
