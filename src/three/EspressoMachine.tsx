import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { M, gaugeTexture } from './materials';
import { useBar } from '@/state/bar';
import { Part } from './Interactive';
import { DRINKS } from '@/content/site';
import { PORTAFILTER_IDLE, PORTAFILTER_LOCKED } from './layout';

const opens = (id: 'about' | 'work' | 'projects' | 'popup' | 'contact') =>
  `Opens: ${DRINKS.find((d) => d.id === id)?.leadsTo ?? ''}`;

/**
 * A two-group prosumer machine, modeled entirely from primitives.
 *
 * Layout, in local units (1 unit ≈ 10cm), origin at the counter surface:
 *   columns   x ±1.25, y 0.12 → 2.12
 *   bridge    spans the top, y 1.55 → 2.12
 *   alcove    the gap between them — group head, portafilter, cup, tray
 */

/** Four screws in a rectangle — the cheapest way to make a panel look bolted on. */
function Screws({ w, h, z }: { w: number; h: number; z: number }) {
  return (
    <>
      {[
        [-w, h],
        [w, h],
        [-w, -h],
        [w, -h],
      ].map(([x, y]) => (
        <mesh key={`${x}${y}`} position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]} material={M.chrome}>
          <cylinderGeometry args={[0.032, 0.032, 0.02, 10]} />
        </mesh>
      ))}
    </>
  );
}

/** Slotted drip tray with a brass water-level float. */
function DripTray() {
  const bars = useMemo(() => Array.from({ length: 11 }, (_, i) => -0.7 + i * 0.14), []);
  return (
    <group position={[0, 0.19, 0.35]}>
      <RoundedBox args={[1.75, 0.16, 1.25]} radius={0.03} smoothness={3} material={M.charcoal} />
      {bars.map((x) => (
        <mesh key={x} position={[x, 0.1, 0]} material={M.chrome}>
          <boxGeometry args={[0.055, 0.035, 1.1]} />
        </mesh>
      ))}
      {/* Level indicator poking through the grate */}
      <mesh position={[0.62, 0.14, 0.5]} material={M.copper}>
        <cylinderGeometry args={[0.035, 0.035, 0.1, 12]} />
      </mesh>
      <mesh position={[0.62, 0.2, 0.5]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#B4432B" roughness={0.4} />
      </mesh>
    </group>
  );
}

/** Pressure gauge: printed dial + a needle that tracks the shot. */
function Gauge() {
  const needle = useRef<THREE.Group>(null);
  const face = useMemo(() => gaugeTexture(), []);

  useFrame((_, dt) => {
    if (!needle.current) return;
    const { stage, extraction } = useBar.getState();
    // 0 bar at rest, ramps to ~9 while extracting, drops off as the shot ends
    const target =
      stage === 'extracting'
        ? Math.PI * 0.75 + Math.min(1, extraction * 2.2) * Math.PI * 1.5 * 0.62
        : stage === 'grinding'
        ? Math.PI * 0.78
        : Math.PI * 0.75;
    needle.current.rotation.z = THREE.MathUtils.damp(needle.current.rotation.z, -target, 6, dt);
  });

  return (
    <Part label="Brew pressure" sub="0 – 15 bar" position={[-1.25, 1.52, 1.1]} radius={0.34} lift={0} labelOffset={0.22}>
      <mesh rotation={[Math.PI / 2, 0, 0]} material={M.chrome}>
        <cylinderGeometry args={[0.29, 0.29, 0.09, 24]} />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <circleGeometry args={[0.245, 32]} />
        <meshStandardMaterial map={face} roughness={0.45} metalness={0} />
      </mesh>
      <group ref={needle} position={[0, 0, 0.062]}>
        <mesh position={[0.075, 0, 0]}>
          <boxGeometry args={[0.19, 0.016, 0.004]} />
          <meshStandardMaterial color="#B4432B" roughness={0.4} />
        </mesh>
      </group>
      <mesh position={[0, 0, 0.07]} material={M.chrome}>
        <sphereGeometry args={[0.024, 12, 12]} />
      </mesh>
    </Part>
  );
}

/** Three backlit controls. The middle one pulls a shot for real. */
function Controls() {
  const lamps = useRef<THREE.MeshStandardMaterial[]>([]);
  const order = useBar((s) => s.order);

  useFrame((state) => {
    const { stage } = useBar.getState();
    const t = state.clock.elapsedTime;
    lamps.current.forEach((mat, i) => {
      if (!mat) return;
      const isShot = i === 1;
      const base = stage === 'idle' ? 0.35 : 0.6;
      const pulse = isShot && stage !== 'idle' ? 1.1 + Math.sin(t * 9) * 0.5 : 0;
      const idlePulse = isShot && stage === 'idle' ? (Math.sin(t * 1.6) * 0.5 + 0.5) * 0.8 : 0;
      mat.emissiveIntensity = base + pulse + idlePulse;
    });
  });

  return (
    <Part
      label="Pull an espresso"
      sub={opens('about')}
      position={[0, 1.74, 1.07]}
      radius={0.42}
      lift={0}
      labelOffset={0.2}
      onSelect={() => order('about')}
    >
      {[-0.5, 0, 0.5].map((x, i) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={M.charcoal}>
            <cylinderGeometry args={[0.14, 0.14, 0.06, 28]} />
          </mesh>
          <mesh position={[0, 0, 0.04]} material={M.chrome}>
            <torusGeometry args={[0.115, 0.014, 8, 24]} />
          </mesh>
          <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.035, 28]} />
            <meshStandardMaterial
              ref={(m) => {
                if (m) lamps.current[i] = m as THREE.MeshStandardMaterial;
              }}
              color="#2a2018"
              emissive="#E9A64A"
              emissiveIntensity={0.35}
              roughness={0.4}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </Part>
  );
}

/** Group head + portafilter. The basket twists into lock when an order starts. */
function BrewGroup() {
  const handle = useRef<THREE.Group>(null);
  const order = useBar((s) => s.order);
  const onOrderAbout = () => order('about');

  useFrame((_, dt) => {
    if (!handle.current) return;
    const { stage } = useBar.getState();
    // Locked (rotated into the group) from the moment the grinder runs
    const target = stage === 'idle' ? PORTAFILTER_IDLE : PORTAFILTER_LOCKED;
    handle.current.rotation.y = THREE.MathUtils.damp(handle.current.rotation.y, target, 5, dt);
  });

  return (
    <group position={[0, 0, 0.4]}>
      <Part
        label="Group head"
        sub={opens('about')}
        position={[0, 1.36, 0]}
        radius={0.42}
        lift={0}
        labelOffset={0.24}
        onSelect={onOrderAbout}
      >
        <mesh material={M.chrome}>
          <cylinderGeometry args={[0.3, 0.34, 0.42, 24]} />
        </mesh>
        <mesh position={[0, 0.21, 0]} material={M.chrome}>
          <cylinderGeometry args={[0.38, 0.38, 0.08, 24]} />
        </mesh>
        {/* Machined rings */}
        {[-0.06, 0.04].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.charcoal}>
            <torusGeometry args={[0.315, 0.012, 8, 24]} />
          </mesh>
        ))}
        <mesh position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.chrome}>
          <torusGeometry args={[0.32, 0.04, 8, 24]} />
        </mesh>
      </Part>

      {/* Portafilter — basket, twin spouts, long walnut handle */}
      <group ref={handle} position={[0, 1.06, 0]} rotation={[0, PORTAFILTER_IDLE, 0]}>
        <mesh material={M.chrome}>
          <cylinderGeometry args={[0.33, 0.29, 0.17, 24]} />
        </mesh>
        <mesh position={[0, -0.09, 0]} material={M.chrome}>
          <cylinderGeometry args={[0.3, 0.24, 0.09, 24]} />
        </mesh>
        {[-0.1, 0.1].map((x) => (
          <mesh key={x} position={[x, -0.17, 0]} material={M.chrome}>
            <cylinderGeometry args={[0.045, 0.026, 0.14, 12]} />
          </mesh>
        ))}
        <group position={[0, 0.01, 0.36]} rotation={[0.2, 0, 0]}>
          <mesh position={[0, 0, 0.05]} material={M.chrome}>
            <cylinderGeometry args={[0.09, 0.085, 0.16, 20]} />
          </mesh>
          <mesh position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]} material={M.copper}>
            <torusGeometry args={[0.082, 0.016, 8, 16]} />
          </mesh>
          <mesh position={[0, -0.012, 0.54]} rotation={[Math.PI / 2, 0, 0]} material={M.walnut}>
            <cylinderGeometry args={[0.088, 0.072, 0.78, 24]} />
          </mesh>
          <mesh position={[0, -0.014, 0.95]} material={M.walnut}>
            <sphereGeometry args={[0.082, 14, 12]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/** Steam wand on the outside of the right cheek, where it can actually be seen. */
function SteamWand() {
  const order = useBar((s) => s.order);
  return (
    <Part
      label="Steam the milk"
      sub={opens('work')}
      position={[-1.98, 1.42, 0.62]}
      radius={0.3}
      lift={0}
      labelOffset={0.3}
      onSelect={() => order('work')}
    >
      {/* Collar bolted to the cheek, then the ball joint it pivots on */}
      <mesh position={[0.22, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={M.steel}>
        <cylinderGeometry args={[0.1, 0.11, 0.2, 20]} />
      </mesh>
      <mesh position={[0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={M.chrome}>
        <cylinderGeometry args={[0.055, 0.055, 0.14, 16]} />
      </mesh>
      <mesh material={M.chrome}>
        <sphereGeometry args={[0.092, 14, 12]} />
      </mesh>
      {/* One continuous tube down and forward, tip last */}
      <group rotation={[-0.14, 0, -0.36]}>
        <mesh position={[0, -0.5, 0]} material={M.chrome}>
          <cylinderGeometry args={[0.042, 0.04, 1.0, 14]} />
        </mesh>
        <mesh position={[0, -1.0, 0]} material={M.chrome}>
          <cylinderGeometry args={[0.055, 0.034, 0.1, 14]} />
        </mesh>
      </group>
    </Part>
  );
}

/** Twin valve knobs with walnut caps. */
function Knobs() {
  return (
    <group position={[1.25, 0.95, 1.06]}>
      {[0, 0.44].map((y) => (
        <group key={y} position={[0, y, 0]}>
          {/* Escutcheon, shaft, knurled walnut cap, brass pip */}
          <mesh rotation={[Math.PI / 2, 0, 0]} material={M.steel}>
            <cylinderGeometry args={[0.11, 0.12, 0.05, 20]} />
          </mesh>
          <mesh position={[0, 0, 0.05]} material={M.chrome}>
            <torusGeometry args={[0.105, 0.016, 8, 20]} />
          </mesh>
          <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]} material={M.chrome}>
            <cylinderGeometry args={[0.05, 0.05, 0.1, 14]} />
          </mesh>
          <mesh position={[0, 0, 0.14]} rotation={[Math.PI / 2, 0, 0]} material={M.walnut}>
            <cylinderGeometry args={[0.13, 0.105, 0.1, 20]} />
          </mesh>
          <mesh position={[0, 0, 0.19]} material={M.copper}>
            <sphereGeometry args={[0.032, 12, 10]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Warming cups on the top deck rail. */
function WarmerCups() {
  return (
    <group position={[0, 2.33, -0.32]}>
      {[-1.0, -0.34, 0.34, 1.0].map((x, i) => (
        <group key={x} position={[x, 0, i % 2 ? 0.22 : 0]} rotation={[0, i * 0.5, 0]}>
          <mesh material={M.ceramic} castShadow>
            <cylinderGeometry args={[0.15, 0.11, 0.17, 24]} />
          </mesh>
          <mesh position={[0, 0.085, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.ceramic}>
            <torusGeometry args={[0.146, 0.012, 8, 20]} />
          </mesh>
          <mesh position={[0.16, 0.0, 0]} rotation={[0, 0, -0.2]} material={M.ceramic}>
            <torusGeometry args={[0.05, 0.015, 8, 20, Math.PI * 1.3]} />
          </mesh>
        </group>
      ))}
      {[-0.32, 0.32].map((z) => (
        <mesh key={z} position={[0, -0.085, z]} rotation={[0, 0, Math.PI / 2]} material={M.chrome}>
          <cylinderGeometry args={[0.02, 0.02, 2.8, 12]} />
        </mesh>
      ))}
    </group>
  );
}

export default function EspressoMachine() {
  const shell = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    if (!shell.current) return;
    const { stage, reducedMotion } = useBar.getState();
    // The grinder shakes the whole chassis a little. Nothing during extraction —
    // a machine that rattles while pouring is a machine that's about to break.
    const shake =
      stage === 'grinding' && !reducedMotion ? Math.sin(state.clock.elapsedTime * 42) * 0.004 : 0;
    shell.current.position.x = THREE.MathUtils.damp(shell.current.position.x, shake, 20, dt);
  });

  return (
    <group ref={shell}>
      {/* Feet */}
      {[
        [-1.35, 0.7],
        [1.35, 0.7],
        [-1.35, -0.7],
        [1.35, -0.7],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.06, z]} material={M.chrome}>
          <cylinderGeometry args={[0.11, 0.13, 0.12, 16]} />
        </mesh>
      ))}

      {/* Side columns, each with a bolted-on front plate */}
      {[-1.25, 1.25].map((x) => (
        <group key={x}>
          <RoundedBox
            args={[0.9, 2.0, 2.0]}
            radius={0.15}
            smoothness={4}
            position={[x, 1.12, 0]}
            material={M.steel}
            castShadow
          />
          <RoundedBox
            args={[0.74, 1.72, 0.04]}
            radius={0.05}
            smoothness={3}
            position={[x, 1.12, 1.035]}
            material={M.steel}
          />
          <group position={[x, 1.12, 0]}>
            <Screws w={0.28} h={0.78} z={1.07} />
          </group>
        </group>
      ))}

      {/* Back slab closes the alcove */}
      <mesh position={[0, 1.12, -0.75]} material={M.charcoal} castShadow>
        <boxGeometry args={[1.7, 2.0, 0.5]} />
      </mesh>

      {/* Bridge across the top */}
      <RoundedBox
        args={[3.4, 0.58, 2.0]}
        radius={0.13}
        smoothness={4}
        position={[0, 1.84, 0]}
        material={M.steel}
        castShadow
      />
      <RoundedBox
        args={[1.66, 0.42, 0.04]}
        radius={0.05}
        smoothness={3}
        position={[0, 1.84, 1.035]}
        material={M.steel}
      />

      {/* Overhanging cap + warming deck */}
      <RoundedBox
        args={[3.62, 0.2, 2.14]}
        radius={0.09}
        smoothness={4}
        position={[0, 2.22, 0]}
        material={M.charcoal}
      />
      <mesh position={[0, 2.13, 1.13]} material={M.copper}>
        <boxGeometry args={[3.5, 0.035, 0.05]} />
      </mesh>

      {/* Alcove back wall, in shadow behind the group */}
      <mesh position={[0, 0.9, -0.48]} material={M.charcoal}>
        <boxGeometry args={[1.68, 1.5, 0.06]} />
      </mesh>

      {[-1.25, 1.25].map((x) => (
        <mesh key={x} position={[x, 0.4, 1.075]} material={M.copper}>
          <boxGeometry args={[0.46, 0.05, 0.02]} />
        </mesh>
      ))}

      <DripTray />
      <BrewGroup />
      <Gauge />
      <Controls />
      <SteamWand />
      <Knobs />
      <WarmerCups />
    </group>
  );
}
