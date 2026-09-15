import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useBar } from '@/state/bar';

/**
 * The air in the room: light falling out of the pendants, and dust turning over
 * inside it.
 *
 * Both are deliberately fake. A real volumetric pass would cost a second render
 * of the scene; a cone with a gradient down its length and one additive Points
 * cloud cost three draw calls and no lights at all, and at this scale they are
 * indistinguishable.
 */

/** Round, soft dust speck. */
const moteTexture = (() => {
  let cached: THREE.CanvasTexture | null = null;
  return () => {
    if (cached) return cached;
    const c = document.createElement('canvas');
    c.width = c.height = 32;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, 'rgba(255,224,180,1)');
    g.addColorStop(0.4, 'rgba(255,205,145,0.5)');
    g.addColorStop(1, 'rgba(255,196,130,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 32, 32);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    cached = tex;
    return tex;
  };
})();

const SHAFT_VERT = /* glsl */ `
  varying vec2 vUvs;
  varying vec3 vNormalW;
  varying vec3 vViewW;
  void main() {
    vUvs = uv;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 world = modelMatrix * vec4(position, 1.0);
    vViewW = normalize(cameraPosition - world.xyz);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

/**
 * Density is highest where you look through the most air — the middle of the
 * cone, where the surface normal is perpendicular to the view. Fading on that
 * dot product turns a hard-edged cone into something that reads as light.
 */
const SHAFT_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUvs;
  varying vec3 vNormalW;
  varying vec3 vViewW;
  void main() {
    float drop = pow(clamp(vUvs.y, 0.0, 1.0), 1.7);
    float grazing = 1.0 - abs(dot(normalize(vNormalW), normalize(vViewW)));
    float body = pow(clamp(grazing, 0.0, 1.0), 1.6);
    gl_FragColor = vec4(uColor, drop * body * uOpacity);
  }
`;

function Shaft({
  position,
  height = 6,
  top = 0.4,
  bottom = 2.1,
  opacity = 1,
  tilt = 0,
  color = '#FFC98A',
}: {
  position: [number, number, number];
  height?: number;
  top?: number;
  bottom?: number;
  opacity?: number;
  tilt?: number;
  color?: string;
}) {
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color(color) }, uOpacity: { value: opacity } }),
    [color, opacity],
  );

  return (
    <mesh position={position} rotation={[0, 0, tilt]} renderOrder={3}>
      <cylinderGeometry args={[top, bottom, height, 24, 1, true]} />
      <shaderMaterial
        vertexShader={SHAFT_VERT}
        fragmentShader={SHAFT_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Motes({ count = 110 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  const tex = useMemo(() => moteTexture(), []);

  const { positions, drift } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const drift = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spread through the volume the camera actually sees
      positions[i * 3] = (Math.random() - 0.5) * 13;
      positions[i * 3 + 1] = Math.random() * 4.4 + 0.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5 - 0.5;
      drift[i * 3] = Math.random() * Math.PI * 2;
      drift[i * 3 + 1] = 0.035 + Math.random() * 0.055;
      drift[i * 3 + 2] = 0.3 + Math.random() * 0.8;
    }
    return { positions, drift };
  }, [count]);

  useFrame((state, dt) => {
    const mesh = points.current;
    if (!mesh) return;
    if (useBar.getState().reducedMotion) return;

    const attr = mesh.geometry.getAttribute('position') as THREE.BufferAttribute;
    const array = attr.array as Float32Array;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const y = i * 3 + 1;
      array[y] += drift[y] * dt;
      // Dust does not fall in this room; it circulates
      if (array[y] > 4.8) array[y] = 0.2;
      array[i * 3] += Math.sin(t * drift[i * 3 + 2] + drift[i * 3]) * dt * 0.06;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points} renderOrder={4}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={tex}
        size={0.055}
        sizeAttenuation
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

export default function Atmosphere() {
  return (
    <group>
      {/* Only on the machine side: a beam over the reading column would sit
          behind the headline and cost it contrast. */}
      <Shaft position={[5.8, 2.9, 0.2]} height={6.2} top={0.45} bottom={2.4} opacity={1.0} />
      <Shaft position={[2.3, 3.4, 1.7]} height={7.4} top={0.45} bottom={2.6} opacity={0.6} tilt={0.22} />
      <Motes />
    </group>
  );
}
