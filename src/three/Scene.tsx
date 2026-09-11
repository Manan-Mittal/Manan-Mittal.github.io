import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  Lightformer,
  PerformanceMonitor,
  AdaptiveDpr,
  Preload,
} from '@react-three/drei';
import * as THREE from 'three';
import EspressoMachine from './EspressoMachine';
import Room from './Room';
import Cup from './Cup';
import { M, primeMaterials } from './materials';
import { useBar, sequenceLength } from '@/state/bar';
import { DRINKS, type SectionId } from '@/content/site';

/**
 * On wide screens the reading column owns the left third, so the camera is
 * yawed a few degrees left after aiming. That slides the bar into the right of
 * the frame without moving it in the world (which would just re-centre it).
 */
const FRAME_YAW = 0.2;

/**
 * Where the camera stands for each part of the page. `pos` is the eye,
 * `look` is what it's pointed at. Everything is damped, never cut.
 */
const SHOTS: Record<SectionId | 'bar' | 'brewing', { pos: THREE.Vector3; look: THREE.Vector3; fov: number }> = {
  bar:      { pos: new THREE.Vector3(0.4, 2.6, 10.6),  look: new THREE.Vector3(0, 1.62, 0),     fov: 32 },
  brewing:  { pos: new THREE.Vector3(0.85, 2.05, 4.3), look: new THREE.Vector3(0.05, 0.82, 0.42), fov: 34 },
  about:    { pos: new THREE.Vector3(-1.4, 2.2, 11.4), look: new THREE.Vector3(-0.2, 1.5, 0),   fov: 30 },
  work:     { pos: new THREE.Vector3(2.6, 2.6, 11.8),  look: new THREE.Vector3(0.4, 1.6, 0),    fov: 30 },
  projects: { pos: new THREE.Vector3(0.3, 3.6, 13.6),  look: new THREE.Vector3(0, 2.5, -1.8),   fov: 32 },
  popup:    { pos: new THREE.Vector3(-3.2, 2.4, 11.0), look: new THREE.Vector3(-1.6, 1.6, 0),   fov: 30 },
  contact:  { pos: new THREE.Vector3(0.6, 1.7, 9.4),   look: new THREE.Vector3(0.1, 1.1, 0.4),  fov: 30 },
};

/** Advances `extraction` while a shot is running; everything else reads it. */
function BrewDriver() {
  useFrame((_, dt) => {
    const { stage, activeDrink, extraction, setExtraction } = useBar.getState();
    if (stage === 'idle') {
      if (extraction !== 0) setExtraction(0);
      return;
    }
    if (stage === 'served') {
      if (extraction < 1) setExtraction(1);
      return;
    }
    const span = sequenceLength(activeDrink);
    setExtraction(Math.min(1, extraction + dt / span));
  });
  return null;
}

/**
 * Camera rig. The pointer nudges the view a few degrees so the machine feels
 * like an object in a room rather than a picture of one — it never takes over
 * and it stops completely under prefers-reduced-motion.
 */
function Rig() {
  const { camera, size } = useThree();
  const look = useRef(SHOTS.bar.look.clone());
  const pointer = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((_, dt) => {
    const { focus, stage, reducedMotion } = useBar.getState();
    const shot = stage === 'idle' ? SHOTS[focus] ?? SHOTS.bar : SHOTS.brewing;

    // Narrow viewports get pushed back so the machine still fits the frame;
    // wide ones yaw the camera so the bar sits clear of the text column.
    const portrait = size.width < 900;
    const aspect = size.width / Math.max(1, size.height);
    // A short, wide canvas (the phone band) needs the most distance of all
    const pullBack = portrait ? (aspect < 1.1 ? 2.3 : aspect < 1.7 ? 2.6 : 1.4) : 0;

    if (!reducedMotion) {
      pointer.current.x = THREE.MathUtils.damp(pointer.current.x, target.current.x, 3, dt);
      pointer.current.y = THREE.MathUtils.damp(pointer.current.y, target.current.y, 3, dt);
    }

    const px = pointer.current.x * 0.7;
    const py = pointer.current.y * 0.35;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, shot.pos.x + px, 2.6, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, shot.pos.y - py, 2.6, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, shot.pos.z + pullBack, 2.6, dt);

    look.current.x = THREE.MathUtils.damp(look.current.x, shot.look.x + px * 0.25, 2.6, dt);
    look.current.y = THREE.MathUtils.damp(look.current.y, shot.look.y, 2.6, dt);
    look.current.z = THREE.MathUtils.damp(look.current.z, shot.look.z, 2.6, dt);
    camera.lookAt(look.current);
    if (!portrait) camera.rotateY(FRAME_YAW);

    const cam = camera as THREE.PerspectiveCamera;
    const fov = shot.fov + (portrait ? 6 : 0);
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = THREE.MathUtils.damp(cam.fov, fov, 2.6, dt);
      cam.updateProjectionMatrix();
    }
  });

  return null;
}

/** Studio lighting: one warm key, a cool fill, and a rim to find the edges. */
function Lights() {
  const key = useRef<THREE.SpotLight>(null);

  useFrame((_, dt) => {
    if (!key.current) return;
    const { stage, focus } = useBar.getState();
    // The room leans in while a shot is pulling and settles back once the
    // reader has moved on to a section — the text is the subject down there.
    const base = focus === 'bar' ? 120 : 78;
    const target = stage === 'idle' ? base : base * 1.35;
    key.current.intensity = THREE.MathUtils.damp(key.current.intensity, target, 2, dt);
  });

  return (
    <>
      <ambientLight intensity={1.15} color="#9a836c" />
      <spotLight
        ref={key}
        position={[5, 8, 7.5]}
        angle={0.6}
        penumbra={1}
        intensity={120}
        distance={34}
        decay={1.5}
        color="#FFD2A0"
        castShadow
        shadow-mapSize={[768, 768]}
        shadow-bias={-0.0006}
        shadow-camera-near={2}
        shadow-camera-far={24}
      />
      {/* Cool fill from the window side and a soft warm bounce off the front of
          the bar. Everything else that reads as a light source in this room is
          emissive geometry plus a halo — see Glow.tsx. */}
      <pointLight position={[-6.5, 3.6, 5]} intensity={46} distance={26} decay={2} color="#8FB3C9" />
      <pointLight position={[0.5, 2.6, 6.5]} intensity={54} distance={22} decay={2} color="#FFD2A0" />
    </>
  );
}

function Stage() {
  const three = useThree();
  useEffect(() => {
    if (import.meta.env.DEV) (window as unknown as Record<string, unknown>).__stage = three;
    primeMaterials();
  }, [three]);

  return (
    <>
      <Lights />

      {/* A built environment map — soft boxes above and to the sides. This is
          what makes the stainless read as metal instead of grey plastic. */}
      <Environment resolution={512} frames={1}>
        <Lightformer form="rect" intensity={6} color="#fff0dd" scale={[12, 5, 1]} position={[0, 7, 4]} rotation={[-Math.PI / 2.6, 0, 0]} />
        <Lightformer form="rect" intensity={3.2} color="#cfe3ef" scale={[7, 7, 1]} position={[-9, 2.5, 3]} rotation={[0, Math.PI / 2, 0]} />
        <Lightformer form="rect" intensity={2.8} color="#ffd9a8" scale={[7, 7, 1]} position={[9, 2.5, 3]} rotation={[0, -Math.PI / 2, 0]} />
        <Lightformer form="ring" intensity={4} color="#E9A64A" scale={3.4} position={[2, 3, -7]} />
      </Environment>

      <group>
        <Room />
        <EspressoMachine />
        <Cup />
      </group>

      <ContactShadows
        position={[0, 0.015, 0]}
        opacity={0.65}
        scale={16}
        blur={2.2}
        far={3.6}
        resolution={256}
        color="#0a0603"
      />

      <BrewDriver />
      <Rig />
      <Preload all />
    </>
  );
}

export default function Scene({ active }: { active: boolean }) {
  const [degraded, setDegraded] = useState(false);
  const setQuality = useBar((s) => s.setQuality);

  useEffect(() => {
    if (degraded) setQuality('low');
  }, [degraded, setQuality]);

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, degraded ? 1 : 1.5]}
      shadows={!degraded}
      gl={{
        antialias: !degraded,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.35,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      camera={{ position: [0.6, 2.4, 8.6], fov: 34, near: 1.2, far: 44 }}
      onCreated={({ scene }) => {
        scene.background = new THREE.Color('#0D0907');
        scene.fog = new THREE.Fog('#0D0907', 12, 26);
      }}
    >
      <PerformanceMonitor onDecline={() => setDegraded(true)} />
      <Suspense fallback={null}>
        <Stage />
      </Suspense>
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
