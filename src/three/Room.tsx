import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { M, woodTexture } from './materials';
import { useBar } from '@/state/bar';
import { Part } from './Interactive';
import Shelf from './Shelf';
import { DRINKS } from '@/content/site';
import { Glow, LightPool } from './Glow';

const opens = (id: 'about' | 'work' | 'projects' | 'popup' | 'contact') =>
  `Opens: ${DRINKS.find((d) => d.id === id)?.leadsTo ?? ''}`;

/** Hand-lettered shop sign, drawn to a canvas so no font file has to load. */
const signTexture = (() => {
  let cached: THREE.CanvasTexture | null = null;
  return () => {
    if (cached) return cached;
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 512;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#14100C';
    ctx.fillRect(0, 0, 1024, 512);

    ctx.strokeStyle = 'rgba(244,231,214,0.35)';
    ctx.lineWidth = 4;
    ctx.strokeRect(34, 34, 1024 - 68, 512 - 68);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#F4E7D6';
    ctx.font = 'italic 700 132px Georgia, serif';
    ctx.fillText('To Be', 512, 210);
    ctx.fillText('Continued', 512, 340);

    ctx.fillStyle = '#E9A64A';
    ctx.font = '500 34px ui-monospace, monospace';
    ctx.letterSpacing = '10px';
    ctx.fillText('COFFEE  ·  POP-UP', 512, 424);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    cached = tex;
    return tex;
  };
})();

/**
 * Burr grinder — hopper, collar, dosing chute, portafilter fork and a brass
 * maker's plate. Spins up whenever an order starts.
 */
function Grinder() {
  const order = useBar((s) => s.order);
  const onSelect = () => order('projects');
  const collar = useRef<THREE.Mesh>(null);
  const beans = useRef<THREE.InstancedMesh>(null);
  const lamp = useRef<THREE.MeshStandardMaterial>(null);

  const beanSeeds = useMemo(
    () =>
      Array.from({ length: 76 }, () => {
        // Heap, not a cloud: pick a radius across the hopper floor, then fill
        // up to a domed surface that falls away toward the walls.
        const r = 0.31 * Math.sqrt(Math.random());
        const surface = 0.05 + 0.3 * (1 - (r / 0.33) ** 1.7);
        return {
          r,
          a: Math.random() * Math.PI * 2,
          y: surface * Math.random() ** 0.65,
          rot: [Math.random() * 3, Math.random() * 3, Math.random() * 3] as [number, number, number],
        };
      }),
    [],
  );

  useFrame((state, dt) => {
    const { stage, reducedMotion } = useBar.getState();
    const running = stage === 'grinding' && !reducedMotion;
    if (collar.current) collar.current.rotation.y += running ? dt * 9 : dt * 0.05;
    if (lamp.current) {
      lamp.current.emissiveIntensity = THREE.MathUtils.damp(
        lamp.current.emissiveIntensity,
        running ? 2.4 : 0.25,
        8,
        dt,
      );
    }

    if (beans.current) {
      const m = new THREE.Matrix4();
      const q = new THREE.Quaternion();
      const t = state.clock.elapsedTime;
      beanSeeds.forEach((b, i) => {
        // Beans settle constantly; while grinding they chatter and sink
        const sink = running ? Math.sin(t * 14 + i) * 0.012 : 0;
        q.setFromEuler(new THREE.Euler(b.rot[0] + sink * 8, b.rot[1], b.rot[2]));
        m.compose(
          new THREE.Vector3(Math.cos(b.a) * b.r, b.y + sink, Math.sin(b.a) * b.r),
          q,
          new THREE.Vector3(0.82, 0.52, 0.66),
        );
        beans.current!.setMatrixAt(i, m);
      });
      beans.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group position={[-2.3, 0, -0.25]}>
      <Part
        label="Run the grinder"
        sub={opens('projects')}
        radius={0.75}
        lift={0}
        labelOffset={1.1}
        onSelect={onSelect}
      >
        {/* Base, with rubber feet and a drip lip */}
        <RoundedBox args={[1.0, 0.26, 1.0]} radius={0.05} smoothness={3} position={[0, 0.13, 0]} material={M.charcoal} castShadow />
        {[
          [-0.36, 0.36],
          [0.36, 0.36],
          [-0.36, -0.36],
          [0.36, -0.36],
        ].map(([x, z]) => (
          <mesh key={`${x}${z}`} position={[x, 0.02, z]} material={M.charcoal}>
            <cylinderGeometry args={[0.07, 0.08, 0.04, 12]} />
          </mesh>
        ))}

        {/* Column */}
        <mesh position={[0, 0.82, 0]} material={M.steel} castShadow>
          <cylinderGeometry args={[0.36, 0.44, 1.14, 24]} />
        </mesh>
        {/* Seam rings — small changes in radius read as machined parts */}
        {[0.36, 1.24].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.chrome}>
            <torusGeometry args={[0.4, 0.018, 8, 24]} />
          </mesh>
        ))}

        {/* Maker's plate + power lamp */}
        <mesh position={[0, 0.98, 0.37]} rotation={[0, 0, 0]} material={M.copper}>
          <boxGeometry args={[0.34, 0.1, 0.02]} />
        </mesh>
        <mesh position={[0.2, 0.66, 0.35]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial
            ref={lamp}
            color="#3a2a18"
            emissive="#E9A64A"
            emissiveIntensity={0.25}
            roughness={0.4}
            toneMapped={false}
          />
        </mesh>
        {/* Start button */}
        <mesh position={[-0.2, 0.66, 0.35]} rotation={[Math.PI / 2, 0, 0]} material={M.charcoal}>
          <cylinderGeometry args={[0.06, 0.06, 0.05, 16]} />
        </mesh>

        {/* Adjustment collar with grip teeth */}
        <mesh ref={collar} position={[0, 1.42, 0]} material={M.chrome}>
          <cylinderGeometry args={[0.42, 0.42, 0.16, 24]} />
        </mesh>

        {/* Hopper + lid */}
        <mesh position={[0, 1.74, 0]} material={M.glass}>
          <cylinderGeometry args={[0.44, 0.32, 0.56, 32, 1, true]} />
        </mesh>
        <mesh position={[0, 2.03, 0]} material={M.charcoal}>
          <cylinderGeometry args={[0.46, 0.45, 0.05, 24]} />
        </mesh>
        <mesh position={[0, 2.09, 0]} material={M.walnut}>
          <sphereGeometry args={[0.07, 16, 12]} />
        </mesh>
        <instancedMesh ref={beans} args={[undefined, undefined, beanSeeds.length]} position={[0, 1.47, 0]}>
          <sphereGeometry args={[0.05, 8, 6]} />
          <primitive object={M.bean} attach="material" />
        </instancedMesh>

        {/* Dosing chute and the fork a portafilter rests in */}
        <mesh position={[0, 0.56, 0.4]} rotation={[0.42, 0, 0]} material={M.steel}>
          <cylinderGeometry args={[0.13, 0.15, 0.4, 20]} />
        </mesh>
        <mesh position={[0, 0.33, 0.54]} material={M.chrome}>
          <cylinderGeometry args={[0.21, 0.18, 0.26, 24, 1, true]} />
        </mesh>
        {[-0.19, 0.19].map((x) => (
          <mesh key={x} position={[x, 0.34, 0.72]} material={M.chrome}>
            <boxGeometry args={[0.05, 0.04, 0.3]} />
          </mesh>
        ))}
      </Part>
    </group>
  );
}

/** Brass pendant with a hot filament. */
function Pendant({ x }: { x: number }) {
  return (
    <group position={[x, 6.0, 0.2]}>
      <mesh position={[0, 0.9, 0]} material={M.copper}>
        <cylinderGeometry args={[0.012, 0.012, 1.8, 8]} />
      </mesh>
      <mesh material={M.copper} castShadow>
        <coneGeometry args={[0.46, 0.5, 28, 1, true]} />
      </mesh>
      <mesh position={[0, -0.18, 0]}>
        <sphereGeometry args={[0.13, 12, 10]} />
        <meshStandardMaterial color="#FFD9A0" emissive="#FFC46B" emissiveIntensity={2.2} toneMapped={false} />
      </mesh>
      <Glow position={[0, -0.22, 0]} scale={2.6} opacity={0.5} />
    </group>
  );
}

/**
 * Table lamp with a linen drum shade. Does most of the atmospheric work:
 * the shade glows, a point light inside throws a pool up the back wall, and a
 * second dim light spills onto the counter.
 */
function TableLamp({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const shade = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#E8C9A0',
        emissive: '#FFC46B',
        emissiveIntensity: 0.85,
        roughness: 0.9,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.96,
      }),
    [],
  );

  return (
    <group position={position} scale={scale}>
      {/* Weighted brass base */}
      <mesh position={[0, 0.06, 0]} material={M.copper} castShadow>
        <cylinderGeometry args={[0.42, 0.48, 0.12, 24]} />
      </mesh>
      <mesh position={[0, 0.2, 0]} material={M.copper}>
        <sphereGeometry args={[0.2, 16, 12]} />
      </mesh>
      <mesh position={[0, 0.78, 0]} material={M.copper}>
        <cylinderGeometry args={[0.045, 0.055, 1.1, 16]} />
      </mesh>
      {/* Drum shade */}
      <mesh position={[0, 1.46, 0]} material={shade} castShadow>
        <cylinderGeometry args={[0.5, 0.62, 0.66, 36, 1, true]} />
      </mesh>
      <mesh position={[0, 1.46, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#FFE7C2" emissive="#FFC46B" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.13, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.copper}>
        <torusGeometry args={[0.61, 0.014, 8, 24]} />
      </mesh>

      <pointLight position={[0, 1.5, 0]} color="#FFB870" intensity={30} distance={10} decay={2} />
      <Glow position={[0, 1.5, 0]} scale={3.4} opacity={0.42} />
      <LightPool position={[0, 0.02, 0.1]} scale={3.6} opacity={0.3} />
    </group>
  );
}

/** Knock box — the drawer of spent pucks every bar has. */
function KnockBox({ x }: { x: number }) {
  return (
    <group position={[x, 0, 1.0]} rotation={[0, -0.3, 0]}>
      <RoundedBox args={[0.66, 0.42, 0.6]} radius={0.05} smoothness={3} position={[0, 0.21, 0]} material={M.charcoal} castShadow />
      <mesh position={[0, 0.42, 0]} material={M.chrome}>
        <boxGeometry args={[0.68, 0.04, 0.62]} />
      </mesh>
      <mesh position={[0, 0.53, 0]} rotation={[0, 0, Math.PI / 2]} material={M.walnut}>
        <cylinderGeometry args={[0.035, 0.035, 0.5, 14]} />
      </mesh>
      {[-0.22, 0.22].map((x2) => (
        <mesh key={x2} position={[x2, 0.48, 0]} material={M.chrome}>
          <boxGeometry args={[0.04, 0.14, 0.04]} />
        </mesh>
      ))}
    </group>
  );
}


/** A shallow dish of beans by the grinder — the tidy version of spillage. */
function BeanBowl({ position }: { position: [number, number, number] }) {
  const beans = useRef<THREE.InstancedMesh>(null);

  const seeds = useMemo(
    () =>
      Array.from({ length: 38 }, (_, i) => {
        // Golden-angle spiral, domed toward the middle: reads as a heap, not a scatter
        const a = i * 2.399;
        const r = 0.29 * Math.sqrt(i / 38);
        return {
          x: Math.cos(a) * r,
          z: Math.sin(a) * r,
          y: 0.045 + (1 - r / 0.29) * 0.045,
          rot: [a, i * 0.7, a * 0.5] as [number, number, number],
        };
      }),
    [],
  );

  useEffect(() => {
    if (!beans.current) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    seeds.forEach((b, i) => {
      q.setFromEuler(new THREE.Euler(...b.rot));
      m.compose(new THREE.Vector3(b.x, b.y, b.z), q, new THREE.Vector3(1, 0.62, 0.78));
      beans.current!.setMatrixAt(i, m);
    });
    beans.current.instanceMatrix.needsUpdate = true;
  }, [seeds]);

  return (
    <Part label="House blend" sub="Roasted last Tuesday" position={position} radius={0.4} lift={0.02} labelOffset={0.24}>
      <mesh material={M.ceramic} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.3, 0.14, 28]} />
      </mesh>
      <mesh position={[0, 0.075, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.ceramic}>
        <torusGeometry args={[0.4, 0.022, 8, 24]} />
      </mesh>
      <instancedMesh ref={beans} args={[undefined, undefined, seeds.length]}>
        <sphereGeometry args={[0.055, 8, 6]} />
        <primitive object={M.bean} attach="material" />
      </instancedMesh>
    </Part>
  );
}

/** Thermal printer. Feeds a paper tape whenever the check is ordered. */
function ReceiptPrinter({
  position,
  onSelect,
}: {
  position: [number, number, number];
  onSelect: () => void;
}) {
  const slip = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    if (!slip.current) return;
    const { activeDrink, stage, extraction } = useBar.getState();
    const printing = activeDrink === 'contact' && stage !== 'idle';
    const target = printing ? (stage === 'served' ? 1 : extraction) : 0;
    const l = THREE.MathUtils.damp(slip.current.scale.y, Math.max(target, 0.0001), 7, dt);
    slip.current.scale.y = l;
    // Paper feeds downward out of the slot
    slip.current.position.y = 0.42 - (l * 0.62) / 2;
    slip.current.visible = l > 0.02;
  });

  return (
    <Part
      label="Print the check"
      sub={opens('contact')}
      position={position}
      radius={0.42}
      lift={0}
      labelOffset={0.3}
      onSelect={onSelect}
    >
      <group rotation={[0, -0.42, 0]}>
        <RoundedBox args={[0.6, 0.44, 0.52]} radius={0.05} smoothness={3} position={[0, 0.22, 0]} material={M.charcoal} castShadow />
        <mesh position={[0, 0.45, -0.06]} rotation={[0.3, 0, 0]} material={M.steel}>
          <boxGeometry args={[0.56, 0.06, 0.3]} />
        </mesh>
        {/* Paper slot */}
        <mesh position={[0, 0.43, 0.245]} material={M.copper}>
          <boxGeometry args={[0.46, 0.03, 0.04]} />
        </mesh>
        <mesh position={[0.22, 0.3, 0.27]}>
          <sphereGeometry args={[0.03, 10, 10]} />
          <meshStandardMaterial color="#2a2018" emissive="#9FB9AE" emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
        <mesh ref={slip} position={[0, 0.42, 0.27]} scale={[1, 0.0001, 1]} visible={false}>
          <boxGeometry args={[0.42, 0.62, 0.006]} />
          <meshStandardMaterial color="#F4E7D6" roughness={0.95} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </Part>
  );
}

export default function Room() {
  const order = useBar((s) => s.order);
  const counterMap = useMemo(() => {
    const t = woodTexture().clone();
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(4, 1.4);
    t.needsUpdate = true;
    return t;
  }, []);

  return (
    <group>
      {/* Counter slab */}
      <mesh position={[0, -0.3, 0]} receiveShadow>
        <boxGeometry args={[18, 0.6, 7]} />
        <meshStandardMaterial map={counterMap} color="#6a482c" roughness={0.42} metalness={0.04} />
      </mesh>
      <mesh position={[0, -0.02, 3.48]} material={M.copper}>
        <boxGeometry args={[18, 0.035, 0.05]} />
      </mesh>

      {/* Back wall + floor */}
      <mesh position={[0, 3.4, -5.6]} material={M.wall} receiveShadow>
        <boxGeometry args={[28, 12, 0.4]} />
      </mesh>
      <mesh position={[0, -3.2, 0]} rotation={[-Math.PI / 2, 0, 0]} material={M.wall}>
        <planeGeometry args={[44, 24]} />
      </mesh>
      {/* Picture rail, to stop the wall reading as an infinite void */}
      <mesh position={[0, 4.9, -5.36]} material={M.walnut}>
        <boxGeometry args={[28, 0.12, 0.1]} />
      </mesh>

      {/* Shop sign */}
      <Part
        label="To Be Continued"
        sub={opens('popup')}
        position={[4.7, 2.5, -5.3]}
        radius={1.1}
        lift={0}
        onSelect={() => order('popup')}
      >
        <mesh material={M.walnut} position={[0, 0, -0.04]}>
          <boxGeometry args={[3.2, 1.7, 0.08]} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[3.0, 1.5]} />
          <meshStandardMaterial map={signTexture()} roughness={0.7} metalness={0} />
        </mesh>
      </Part>

      <Shelf />
      <Grinder />
      <Pendant x={-5.2} />
      <Pendant x={5.8} />
      <TableLamp position={[-4.05, 0.0, -3.15]} scale={0.86} />
      <TableLamp position={[3.05, 0.0, -3.2]} scale={0.86} />

      <KnockBox x={-3.5} />

      {/* Tamper resting on the counter */}
      <Part label="Tamper" sub="58.5mm, walnut" position={[0.95, 0.08, 1.25]} radius={0.3} lift={0.03} labelOffset={0.28}>
        <group rotation={[0, 0.5, 0]} scale={0.82}>
          <mesh material={M.chrome} castShadow>
            <cylinderGeometry args={[0.26, 0.26, 0.06, 24]} />
          </mesh>
          <mesh position={[0, 0.16, 0]} material={M.chrome}>
            <cylinderGeometry args={[0.07, 0.1, 0.26, 16]} />
          </mesh>
          <mesh position={[0, 0.38, 0]} material={M.walnut} castShadow>
            <sphereGeometry args={[0.2, 14, 12]} />
          </mesh>
        </group>
      </Part>

      {/* Folded bar towel */}
      <group position={[-0.7, 0.12, 2.0]} rotation={[0, 0.3, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.13, 0.13, 0.66, 18]} />
          <meshStandardMaterial color="#55685F" roughness={0.98} />
        </mesh>
        {[-0.16, 0.16].map((x) => (
          <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.134, 0.134, 0.07, 18]} />
            <meshStandardMaterial color="#C25E3A" roughness={0.98} />
          </mesh>
        ))}
        <mesh position={[0, 0.03, 0.03]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.112, 0.112, 0.68, 18]} />
          <meshStandardMaterial color="#64786E" roughness={0.98} />
        </mesh>
      </group>

      <BeanBowl position={[-1.62, 0, 1.05]} />
      <ReceiptPrinter position={[1.55, 0, 2.15]} onSelect={() => order('contact')} />
    </group>
  );
}
