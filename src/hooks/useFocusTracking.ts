import { useEffect } from 'react';
import { useBar } from '@/state/bar';
import { DRINKS, type SectionId } from '@/content/site';

const SECTION_IDS = DRINKS.map((d) => d.id);

/**
 * Decides where the camera looks, from one scroll listener rather than one
 * IntersectionObserver per section. Per-section observers could all report
 * "not intersecting" at once — which is what left the camera parked at the top
 * of the page.
 *
 * Section offsets are measured once and re-measured on resize, so the scroll
 * handler itself only compares numbers: no layout reads, and no requestAnimation
 * Frame hop that could report a position the reader has already left.
 */
export function useFocusTracking() {
  const setFocus = useBar((s) => s.setFocus);

  useEffect(() => {
    let bands: { id: SectionId; centre: number }[] = [];
    let heroEnd = 0;
    let previous: SectionId | 'bar' = 'bar';

    const measure = () => {
      const hero = document.getElementById('top');
      heroEnd = hero ? hero.offsetTop + hero.offsetHeight * 0.75 : 0;
      bands = SECTION_IDS.flatMap((id) => {
        const el = document.getElementById(id);
        return el ? [{ id, centre: el.offsetTop + el.offsetHeight / 2 }] : [];
      });
    };

    const resolve = () => {
      const mid = window.scrollY + window.innerHeight / 2;

      let next: SectionId | 'bar' = 'bar';
      if (mid >= heroEnd && bands.length) {
        let bestDistance = Infinity;
        for (const band of bands) {
          const distance = Math.abs(band.centre - mid);
          if (distance < bestDistance) {
            bestDistance = distance;
            next = band.id;
          }
        }
      }

      if (next === previous) return;

      // Coming back up to the bar clears the last drink, so the machine is
      // ready to run again instead of sitting there with a used cup.
      if (next === 'bar' && useBar.getState().stage === 'served') {
        useBar.getState().clear();
      }

      previous = next;
      setFocus(next);
    };

    const onResize = () => {
      measure();
      resolve();
    };

    measure();
    resolve();

    window.addEventListener('scroll', resolve, { passive: true });
    window.addEventListener('resize', onResize);
    // Fonts and images settle after first paint and move every offset with them
    const settle = window.setTimeout(onResize, 1200);

    return () => {
      window.clearTimeout(settle);
      window.removeEventListener('scroll', resolve);
      window.removeEventListener('resize', onResize);
    };
  }, [setFocus]);
}
