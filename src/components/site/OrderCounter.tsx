import { useEffect, useRef } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { DRINKS, type SectionId } from '@/content/site';
import { useBar } from '@/state/bar';

const STAGE_COPY = {
  idle: 'Ready',
  grinding: 'Grinding',
  extracting: 'Extracting',
  served: 'Served',
} as const;

/**
 * Live pressure readout. Reads the store inside a rAF loop and writes to the
 * DOM directly — the extraction value changes every frame and is not worth a
 * React render sixty times a second.
 */
function Readout() {
  const bar = useRef<HTMLDivElement>(null);
  const value = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const { extraction, stage } = useBar.getState();
      if (bar.current) bar.current.style.transform = `scaleX(${extraction})`;
      if (value.current) {
        const pressure = stage === 'extracting' ? 6 + extraction * 3.2 : stage === 'grinding' ? 0.4 : 0;
        value.current.textContent = `${pressure.toFixed(1)} bar`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const stage = useBar((s) => s.stage);
  const drink = useBar((s) => s.activeDrink);
  const name = DRINKS.find((d) => d.id === drink)?.name;

  return (
    <div className="panel-inset mt-8 px-4 py-3">
      <div className="flex items-center justify-between gap-4 font-mono text-[0.66rem] uppercase tracking-[0.18em]">
        <span className="flex items-center gap-2 text-cream">
          {stage !== 'idle' && stage !== 'served' && (
            <Loader2 size={12} className="animate-spin text-crema" aria-hidden="true" />
          )}
          <span className={stage === 'idle' ? 'text-cream-mute' : 'text-crema'}>
            {STAGE_COPY[stage]}
          </span>
          {name && stage !== 'idle' && <span className="text-cream-dim">· {name}</span>}
        </span>
        <span ref={value} className="tabular-nums text-cream-dim">
          0.0 bar
        </span>
      </div>
      <div className="mt-2.5 h-[3px] w-full overflow-hidden rounded-full bg-roast-700">
        <div
          ref={bar}
          className="h-full w-full origin-left scale-x-0 rounded-full bg-crema"
          style={{ willChange: 'transform' }}
        />
      </div>
      <p className="sr-only" aria-live="polite">
        {stage === 'served' && name ? `${name} is ready. Opening the section below.` : STAGE_COPY[stage]}
      </p>
    </div>
  );
}

export default function OrderCounter() {
  const order = useBar((s) => s.order);
  const stage = useBar((s) => s.stage);
  const activeDrink = useBar((s) => s.activeDrink);
  const busy = stage === 'grinding' || stage === 'extracting';

  // When the shot lands, take the reader to what they ordered.
  useEffect(() => {
    if (stage !== 'served' || !activeDrink) return;
    const el = document.getElementById(activeDrink);
    const id = window.setTimeout(
      () => el?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      450,
    );
    return () => window.clearTimeout(id);
  }, [stage, activeDrink]);

  const handle = (id: SectionId) => {
    if (busy) return;
    order(id);
  };

  return (
    <div className="mt-10">
      <p className="rule-label mb-4">
        <span>The Menu — every drink opens a section</span>
      </p>

      <ul className="divide-y divide-roast-700/80 border-y border-roast-700/80">
        {DRINKS.map((drink, i) => {
          const isActive = activeDrink === drink.id;
          return (
            <li key={drink.id}>
              <button
                onClick={() => handle(drink.id)}
                disabled={busy && !isActive}
                aria-label={`${drink.leadsTo} — served as a ${drink.name}. ${drink.note}`}
                className="group/row flex w-full cursor-pointer items-center gap-4 py-4 text-left transition-colors duration-200 hover:bg-roast-800/40 disabled:cursor-wait disabled:opacity-40 sm:gap-6 sm:px-2"
              >
                <span
                  className={`font-mono text-[0.66rem] tabular-nums transition-colors ${
                    isActive ? 'text-crema' : 'text-cream-mute group-hover/row:text-crema'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span className="min-w-0 flex-1">
                  {/* Section first, drink second — the drink is the flavour,
                      the section is what the reader is actually choosing. */}
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                    <span
                      className={`font-display text-xl leading-tight transition-colors sm:text-2xl ${
                        isActive ? 'text-crema' : 'text-cream group-hover/row:text-crema'
                      }`}
                    >
                      {drink.leadsTo}
                    </span>
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-cream-mute">
                      served as {drink.name}
                    </span>
                  </span>
                  <span className="mt-1 block text-[0.93rem] leading-snug text-cream-dim">
                    {drink.note}
                  </span>
                </span>

                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="shrink-0 -translate-x-1 text-cream-mute opacity-0 transition-all duration-200 ease-out-expo group-hover/row:translate-x-0 group-hover/row:text-crema group-hover/row:opacity-100"
                />
              </button>
            </li>
          );
        })}
      </ul>

      <Readout />

      <p className="mt-3 font-mono text-[0.62rem] uppercase leading-relaxed tracking-[0.16em] text-cream-mute">
        Pick one and the machine makes it, then the page follows. The machine
        itself works too — so do the books on the shelf.
      </p>
    </div>
  );
}
