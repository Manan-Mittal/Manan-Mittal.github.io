import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useBar } from '@/state/bar';

/**
 * Spends pixels and shadow passes only where they show.
 *
 * Two observations about this scene: it is almost entirely static, and once the
 * reader scrolls past the hero the bar sits behind a 55% veil as a backdrop.
 * So the shadow map is baked rather than redrawn every frame, and resolution
 * drops while the reader is in the text — which cuts the shaded pixel count by
 * more than half for most of the page.
 */
export default function Budget({ degraded }: { degraded: boolean }) {
  const gl = useThree((s) => s.gl);
  const setDpr = useThree((s) => s.setDpr);
  const focus = useBar((s) => s.focus);
  const stage = useBar((s) => s.stage);
  const reduced = useBar((s) => s.reducedMotion);
  const shadowTimer = useRef(0);

  // Bake the shadow map instead of redrawing it every frame
  useEffect(() => {
    gl.shadowMap.autoUpdate = false;
    gl.shadowMap.needsUpdate = true;
    return () => {
      gl.shadowMap.autoUpdate = true;
    };
  }, [gl]);

  // Anything that actually moves geometry gets the map refreshed for a moment
  useEffect(() => {
    gl.shadowMap.needsUpdate = true;
    window.clearTimeout(shadowTimer.current);
    if (stage === 'idle') return;
    // Keep it live while a drink is being made, then settle back
    const id = window.setInterval(() => {
      gl.shadowMap.needsUpdate = true;
    }, 180);
    shadowTimer.current = window.setTimeout(() => window.clearInterval(id), 6000);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(shadowTimer.current);
    };
  }, [gl, stage]);

  useEffect(() => {
    if (degraded) {
      setDpr(1);
      return;
    }
    // Full resolution at the bar, where the machine is the subject; half the
    // pixels once it is only a backdrop behind the reading column.
    const onBar = focus === 'bar' || stage !== 'idle';
    setDpr(onBar ? Math.min(window.devicePixelRatio, 1.5) : 1);
    gl.shadowMap.needsUpdate = true;
  }, [focus, stage, degraded, setDpr, gl, reduced]);

  return null;
}
