import { create } from 'zustand';
import type { SectionId } from '@/content/site';
import { DRINKS } from '@/content/site';

export type BrewStage = 'idle' | 'grinding' | 'extracting' | 'served';

interface BarState {
  /** Where the machine is in the shot */
  stage: BrewStage;
  /** Which drink is on the bar right now */
  activeDrink: SectionId | null;
  /** 0→1 across the whole grind+extract sequence, written by the render loop */
  extraction: number;
  /** Section currently filling the viewport — drives the camera framing */
  focus: SectionId | 'bar';
  /** Ticket number, purely for flavor on the order rail and the receipt */
  ticket: number;
  /** Set once on mount; every animation path checks it */
  reducedMotion: boolean;
  /** Dropped to 'low' on weak GPUs by the PerformanceMonitor */
  quality: 'high' | 'low';

  order: (id: SectionId) => void;
  setStage: (stage: BrewStage) => void;
  setExtraction: (v: number) => void;
  setFocus: (focus: SectionId | 'bar') => void;
  setReducedMotion: (v: boolean) => void;
  setQuality: (q: 'high' | 'low') => void;
  clear: () => void;
}

/** Timers are owned by the store so a second order cleanly cancels the first. */
let timers: ReturnType<typeof setTimeout>[] = [];
const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers = [];
};

export const useBar = create<BarState>((set, get) => ({
  stage: 'idle',
  activeDrink: null,
  extraction: 0,
  focus: 'bar',
  ticket: 41,
  reducedMotion: false,
  quality: 'high',

  order: (id) => {
    clearTimers();
    const drink = DRINKS.find((d) => d.id === id);
    const { reducedMotion, ticket } = get();

    // Reduced motion: skip the theater, serve the content immediately.
    if (reducedMotion) {
      set({ activeDrink: id, stage: 'served', extraction: 1, ticket: ticket + 1 });
      return;
    }

    set({ activeDrink: id, stage: 'grinding', extraction: 0, ticket: ticket + 1 });

    const grind = 900;
    const extract = (drink?.brewTime ?? 2.4) * 1000;

    timers.push(setTimeout(() => set({ stage: 'extracting' }), grind));
    timers.push(setTimeout(() => set({ stage: 'served' }), grind + extract));
  },

  setStage: (stage) => set({ stage }),
  setExtraction: (extraction) => set({ extraction }),
  setFocus: (focus) => set({ focus }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setQuality: (quality) => set({ quality }),

  clear: () => {
    clearTimers();
    set({ stage: 'idle', activeDrink: null, extraction: 0 });
  },
}));

// Dev-only handle so the Playwright scripts can read real state instead of
// inferring it from the DOM.
if (import.meta.env.DEV) {
  (globalThis as unknown as Record<string, unknown>).__bar = useBar;
}

/** Total sequence length for a drink, in seconds — shared by the HUD and the scene. */
export const sequenceLength = (id: SectionId | null) => {
  const drink = DRINKS.find((d) => d.id === id);
  return 0.9 + (drink?.brewTime ?? 2.4);
};
