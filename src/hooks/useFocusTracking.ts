import { useEffect } from 'react';
import { useBar } from '@/state/bar';
import { DRINKS, type SectionId } from '@/content/site';

const SECTION_IDS = DRINKS.map((d) => d.id);

/**
 * Decides where the camera looks, from one scroll listener rather than one
 * IntersectionObserver per section. Per-section observers could all report
 * "not intersecting" at once — which is exactly what happened at the top of the
 * page, leaving the camera parked wherever it was last pointed.
 */
export function useFocusTracking() {
  const setFocus = useBar((s) => s.setFocus);

  useEffect(() => {
    let frame = 0;

    const resolve = () => {
      frame = 0;
      const mid = window.scrollY + window.innerHeight / 2;

      const hero = document.getElementById('top');
      if (hero && mid < hero.offsetTop + hero.offsetHeight * 0.8) {
        setFocus('bar');
        return;
      }

      let best: SectionId | 'bar' = 'bar';
      let bestDistance = Infinity;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const centre = el.offsetTop + el.offsetHeight / 2;
        const distance = Math.abs(centre - mid);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = id;
        }
      }
      setFocus(best);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(resolve);
    };

    resolve();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [setFocus]);
}
