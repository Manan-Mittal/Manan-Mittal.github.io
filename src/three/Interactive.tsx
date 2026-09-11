import { useRef, useState, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Hoverable machine part. Lifts slightly, rings itself in amber and names
 * itself in a mono caption. Parts with `onSelect` get a pointer cursor and are
 * real controls; the rest are just labelled, so hover never looks clickable
 * when it isn't.
 */
export function Part({
  label,
  sub,
  position = [0, 0, 0],
  radius = 0.3,
  lift = 0.04,
  labelOffset = 0.4,
  onSelect,
  children,
}: {
  label: string;
  sub?: string;
  position?: [number, number, number];
  /** Size of the invisible hover target */
  radius?: number;
  lift?: number;
  labelOffset?: number;
  onSelect?: () => void;
  children?: ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const base = position[1];

  useFrame((state, dt) => {
    if (group.current) {
      group.current.position.y = THREE.MathUtils.damp(
        group.current.position.y,
        base + (hovered ? lift : 0),
        9,
        dt,
      );
    }
    if (ring.current) {
      const mat = ring.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.damp(mat.opacity, hovered ? 0.9 : 0, 10, dt);
      const pulse = hovered ? 1 + Math.sin(state.clock.elapsedTime * 4) * 0.04 : 0.86;
      ring.current.scale.setScalar(pulse);
      ring.current.quaternion.copy(state.camera.quaternion);
    }
  });

  const enter = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = onSelect ? 'pointer' : 'help';
  };
  const leave = () => {
    setHovered(false);
    document.body.style.cursor = '';
  };

  return (
    <group ref={group} position={position}>
      <group
        onPointerOver={enter}
        onPointerOut={leave}
        onClick={(e) => {
          if (!onSelect) return;
          e.stopPropagation();
          onSelect();
        }}
      >
        {children}
        {/* Invisible, generously sized hover target so small parts are still
            easy to hit — the 3D equivalent of a 44px touch area. */}
        <mesh visible={false}>
          <sphereGeometry args={[radius, 8, 8]} />
        </mesh>
      </group>

      <mesh ref={ring} position={[0, 0, radius * 0.8]}>
        <ringGeometry args={[radius * 0.78, radius * 0.86, 32]} />
        <meshBasicMaterial
          color="#E9A64A"
          transparent
          opacity={0}
          depthWrite={false}
          depthTest={false}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {hovered && (
        <Html center distanceFactor={8} position={[0, radius + labelOffset, 0]} zIndexRange={[30, 0]}>
          <span className="pointer-events-none flex flex-col items-center gap-0.5 whitespace-nowrap rounded border border-crema/50 bg-roast-950 px-2.5 py-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-crema">
              {label}
            </span>
            {sub && (
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-cream-mute">
                {sub}
              </span>
            )}
          </span>
        </Html>
      )}
    </group>
  );
}
