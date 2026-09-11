import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { glowTexture } from './materials';

/**
 * A billboarded halo. Real point lights are the expensive way to say "this
 * lamp is on" — every one of them runs for every lit fragment in the scene.
 * These cost one transparent quad each and carry most of the atmosphere.
 */
export function Glow({
  position,
  scale = 3,
  opacity = 0.5,
  color = '#FFC98A',
  billboard = true,
}: {
  position: [number, number, number];
  scale?: number;
  opacity?: number;
  color?: string;
  billboard?: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const tex = useMemo(() => glowTexture(), []);

  useFrame((state) => {
    if (billboard && mesh.current) mesh.current.quaternion.copy(state.camera.quaternion);
  });

  return (
    <mesh ref={mesh} position={position} scale={scale} renderOrder={2}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={tex}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

/** Flat pool of light lying on a surface — counter tops, shelf boards. */
export function LightPool({
  position,
  scale = 4,
  opacity = 0.35,
  color = '#FFB870',
}: {
  position: [number, number, number];
  scale?: number;
  opacity?: number;
  color?: string;
}) {
  const tex = useMemo(() => glowTexture(), []);
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} scale={scale} renderOrder={1}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={tex}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}
