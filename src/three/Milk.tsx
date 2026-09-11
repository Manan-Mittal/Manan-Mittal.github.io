import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { M, steamTexture } from './materials';
import { useBar } from '@/state/bar';
import { DRINKS } from '@/content/site';
import { PITCHER_PARK, PITCHER_STEAM } from './layout';

/**
 * Milk pitcher. For drinks that take steamed milk it lifts up under the wand,
 * tips into the steam, froths, and then goes back to the counter empty —
 * because by then the milk is in the cup.
 */

const wantsMilk = (id: string | null) => !!DRINKS.find((d) => d.id === id)?.build.steamMilk;

/** Billowing steam off the pitcher — fatter and faster than the cup's wisps. */
function Froth({ active }: { active: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const tex = useMemo(() => steamTexture(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        offset: i / 12,
        drift: (Math.random() - 0.5) * 0.9,
        speed: 0.4 + Math.random() * 0.25,
        scale: 0.3 + Math.random() * 0.34,
      })),
    [],
  );

  useFrame((state) => {
    if (!group.current) return;
    const heat = active.current;
    group.current.visible = heat > 0.04;
    if (!group.current.visible) return;

    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const s = seeds[i];
      const life = (t * s.speed + s.offset) % 1;
      child.position.set(
        Math.sin(life * 4 + i) * 0.1 + s.drift * life,
        life * 1.25,
        Math.cos(life * 3 + i) * 0.08,
      );
      child.scale.setScalar(s.scale * (0.35 + life * 2.1));
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = Math.sin(life * Math.PI) * 0.72 * heat;
      child.quaternion.copy(state.camera.quaternion);
    });
  });

  return (
    <group ref={group} position={[0, 0.5, 0]} visible={false}>
      {seeds.map((_, i) => (
        <mesh key={i}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={tex} transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

export default function MilkPitcher() {
  const rig = useRef<THREE.Group>(null);
  const milk = useRef<THREE.Mesh>(null);
  const heat = useRef(0);

  const milkMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#FBF6EC', roughness: 0.55, metalness: 0 }),
    [],
  );
  // A mirror-finish pitcher just reflects the dark room and reads as a black
  // cup. Brushed steel keeps its own value.
  const steel = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#CFD3D6',
        metalness: 0.72,
        roughness: 0.34,
        envMapIntensity: 1.1,
      }),
    [],
  );

  useFrame((state, dt) => {
    const { stage, activeDrink, reducedMotion } = useBar.getState();
    const steaming = wantsMilk(activeDrink) && (stage === 'grinding' || stage === 'extracting');

    heat.current = THREE.MathUtils.damp(heat.current, steaming && !reducedMotion ? 1 : 0, 5, dt);

    if (rig.current) {
      const to = steaming ? PITCHER_STEAM : PITCHER_PARK;
      rig.current.position.x = THREE.MathUtils.damp(rig.current.position.x, to[0], 4, dt);
      rig.current.position.y = THREE.MathUtils.damp(rig.current.position.y, to[1], 4, dt);
      rig.current.position.z = THREE.MathUtils.damp(rig.current.position.z, to[2], 4, dt);

      // Tipped toward the wand while steaming, plus the shudder of a real wand
      const shudder = steaming && !reducedMotion ? Math.sin(state.clock.elapsedTime * 26) * 0.012 : 0;
      rig.current.rotation.z = THREE.MathUtils.damp(
        rig.current.rotation.z,
        steaming ? -0.2 : 0,
        4,
        dt,
      ) + shudder;
    }

    if (milk.current) {
      // Fills as it's steamed, then empties into the cup once the drink lands
      const target = !wantsMilk(activeDrink)
        ? 0.0001
        : stage === 'grinding'
        ? 0.62
        : stage === 'extracting'
        ? 0.62 + heat.current * 0.22
        : 0.0001;
      const h = THREE.MathUtils.damp(milk.current.scale.y, target, 5, dt);
      milk.current.scale.y = h;
      milk.current.position.y = 0.07 + (h * 0.36) / 2;
      milk.current.visible = h > 0.02;
    }
  });

  return (
    <group ref={rig} position={PITCHER_PARK}>
      {/* Body, base and a rolled rim */}
      <mesh position={[0, 0.29, 0]} material={steel} castShadow>
        <cylinderGeometry args={[0.21, 0.17, 0.5, 24, 1, true]} />
      </mesh>
      <mesh position={[0, 0.05, 0]} material={steel}>
        <cylinderGeometry args={[0.17, 0.18, 0.06, 24]} />
      </mesh>
      <mesh position={[0, 0.54, 0]} rotation={[Math.PI / 2, 0, 0]} material={steel}>
        <torusGeometry args={[0.21, 0.015, 8, 24]} />
      </mesh>

      {/* Pouring spout, pinched out of the rim */}
      <mesh position={[0.2, 0.5, 0]} rotation={[0, 0, -0.7]} material={steel}>
        <coneGeometry args={[0.075, 0.17, 10, 1, true]} />
      </mesh>

      {/* Handle */}
      <mesh position={[-0.24, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]} material={steel}>
        <torusGeometry args={[0.11, 0.022, 8, 18, Math.PI * 1.1]} />
      </mesh>

      <mesh ref={milk} position={[0, 0.07, 0]} scale={[1, 0.0001, 1]} material={milkMat}>
        <cylinderGeometry args={[0.195, 0.165, 0.36, 20]} />
      </mesh>

      <Froth active={heat} />
    </group>
  );
}
