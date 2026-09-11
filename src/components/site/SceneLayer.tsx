import { Suspense, lazy, useEffect, useState } from 'react';
import { useBar } from '@/state/bar';

const Scene = lazy(() => import('@/three/Scene'));

/** Cheap one-off check: no WebGL means we never mount the canvas at all. */
const supportsWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    );
  } catch {
    return false;
  }
};

/**
 * Still life for browsers without WebGL, and the first paint for everyone else:
 * a warm pool of light where the machine will be.
 */
function BarFallback() {
  return (
    <div aria-hidden="true" className="absolute inset-0 room-light">
      <div className="absolute left-1/2 top-[42%] h-[46vmin] w-[46vmin] -translate-x-1/2 rounded-full bg-crema/10 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-[38vh] bg-gradient-to-t from-roast-900 to-transparent" />
    </div>
  );
}

export default function SceneLayer() {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [active, setActive] = useState(true);
  const setReducedMotion = useBar((s) => s.setReducedMotion);
  const onBar = useBar((s) => s.focus === 'bar');

  useEffect(() => {
    setWebgl(supportsWebGL());

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [setReducedMotion]);

  // On phones the machine is a hero moment, not a permanent backdrop — stop
  // rendering once it's scrolled away so we're not cooking anyone's battery.
  useEffect(() => {
    const onScroll = () => {
      const small = window.innerWidth < 768;
      setActive(!small || window.scrollY < window.innerHeight * 0.75);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    /* Phones get the bar as a fixed band across the top of the page with the
       content below it; from md up it becomes the full-bleed backdrop. */
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[52svh] md:fixed md:inset-0 md:h-auto"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-roast-950" />

      <div
        className={`pointer-events-auto absolute inset-0 transition-opacity duration-700 ${
          active ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {webgl === false && <BarFallback />}
        {webgl && (
          <Suspense fallback={<BarFallback />}>
            <Scene active={active} />
          </Suspense>
        )}
      </div>

      {/* Legibility scrims. On desktop a column of shade on the reading side;
          on phones a vertical fade that hands off to the page below. */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(13 9 7 / 0.96) 0%, rgb(13 9 7 / 0.82) 24%, rgb(13 9 7 / 0.34) 42%, rgb(13 9 7 / 0) 58%)',
        }}
      />
      {/* Past the hero the room steps back behind the reading, so long-form
          text never has a lit espresso machine directly under it. */}
      <div
        className="absolute inset-0 bg-roast-950 transition-opacity duration-700 ease-out"
        style={{ opacity: onBar ? 0 : 0.55 }}
      />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-roast-950 via-roast-950/85 to-transparent md:h-32 md:via-transparent" />
    </div>
  );
}
