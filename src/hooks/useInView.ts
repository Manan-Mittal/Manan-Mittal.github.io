import { useEffect, useRef } from 'react';

/**
 * Reports when an element owns the middle of the viewport. Used to point the
 * 3D camera at whatever the reader is actually looking at — it follows normal
 * scrolling, it never hijacks it.
 */
export function useInView(onEnter: () => void, options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement>(null);
  const cb = useRef(onEnter);
  cb.current = onEnter;

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) cb.current();
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0, ...options },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [options]);

  return ref;
}

/** Adds a class once an element first scrolls into view, for entrance motion. */
export function useReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.dataset.shown = 'true';
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.shown = 'true';
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return ref;
}
