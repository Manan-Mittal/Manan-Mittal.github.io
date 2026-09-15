import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * The environment map that makes the stainless read as metal instead of grey
 * plastic — a few soft area lights baked once into a PMREM cubemap.
 *
 * This replaces drei's <Environment>, which drags in RGBELoader, EXRLoader and
 * the gainmap decoder to support HDR files we never load. Building the same
 * handful of glowing rectangles by hand costs about forty lines and drops all
 * three from the bundle.
 *
 * Cost is a single render at mount; nothing here runs per frame.
 */

interface Former {
  kind: 'rect' | 'ring';
  color: string;
  intensity: number;
  scale: [number, number];
  position: [number, number, number];
  rotation?: [number, number, number];
}

/** Soft box above, cool fill from the window side, warm bounce opposite. */
const FORMERS: Former[] = [
  { kind: 'rect', color: '#fff0dd', intensity: 6, scale: [12, 5], position: [0, 7, 4], rotation: [-Math.PI / 2.6, 0, 0] },
  { kind: 'rect', color: '#cfe3ef', intensity: 3.2, scale: [7, 7], position: [-9, 2.5, 3], rotation: [0, Math.PI / 2, 0] },
  { kind: 'rect', color: '#ffd9a8', intensity: 2.8, scale: [7, 7], position: [9, 2.5, 3], rotation: [0, -Math.PI / 2, 0] },
  { kind: 'ring', color: '#E9A64A', intensity: 4, scale: [3.4, 3.4], position: [2, 3, -7] },
];

export default function BuiltEnvironment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);

  useEffect(() => {
    const envScene = new THREE.Scene();
    // The room the reflections come from: near-black, so only the formers show
    envScene.background = new THREE.Color('#0b0806');

    const disposables: (THREE.BufferGeometry | THREE.Material)[] = [];

    for (const former of FORMERS) {
      const geometry =
        former.kind === 'ring'
          ? new THREE.CircleGeometry(0.5, 24)
          : new THREE.PlaneGeometry(1, 1);
      // Emissive area lights: colour beyond 1 is what gives the map its range
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(former.color).multiplyScalar(former.intensity),
        side: THREE.DoubleSide,
        toneMapped: false,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...former.position);
      if (former.rotation) mesh.rotation.set(...former.rotation);
      mesh.scale.set(former.scale[0], former.scale[1], 1);
      envScene.add(mesh);
      disposables.push(geometry, material);
    }

    const pmrem = new THREE.PMREMGenerator(gl);
    const target = pmrem.fromScene(envScene, 0.04);
    scene.environment = target.texture;

    return () => {
      scene.environment = null;
      target.dispose();
      pmrem.dispose();
      disposables.forEach((d) => d.dispose());
    };
  }, [gl, scene]);

  return null;
}
