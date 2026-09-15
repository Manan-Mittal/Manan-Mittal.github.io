import { useRef, useState } from 'react';
import { Dot } from 'lucide-react';
import Section from './Section';
import { JOBS } from '@/content/site';

/** Experience, served as order tickets on the rail above the pass. */
export default function Work() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const delta = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (active + delta + JOBS.length) % JOBS.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  const job = JOBS[active];

  return (
    <Section id="work" kicker="02 · Cortado" title={<>Tickets on<br />the rail.</>} wide>
      <div className="grid gap-8 lg:grid-cols-12">
        <div
          role="tablist"
          aria-label="Work experience"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="flex gap-2 overflow-x-auto pb-2 no-scrollbar lg:col-span-4 lg:flex-col lg:overflow-visible lg:pb-0"
        >
          {JOBS.map((j, i) => {
            const selected = i === active;
            return (
              <button
                key={j.ticket}
                ref={(el) => (tabs.current[i] = el)}
                role="tab"
                id={`job-tab-${i}`}
                aria-selected={selected}
                aria-controls={`job-panel-${i}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                className={`group relative w-64 shrink-0 cursor-pointer rounded-md border p-4 text-left transition-all duration-200 ease-out-expo lg:w-full ${
                  selected
                    ? 'border-crema/60 bg-roast-800 shadow-glow'
                    : 'border-roast-600/70 bg-roast-900/60 hover:border-roast-500 hover:bg-roast-800/70'
                }`}
              >
                <span className="flex items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.16em]">
                  <span className={selected ? 'text-crema' : 'text-cream-mute'}>{j.ticket}</span>
                  {j.active && (
                    <span className="flex items-center text-crema">
                      <Dot size={18} className="-mr-1.5" aria-hidden="true" />
                      Open
                    </span>
                  )}
                </span>
                <span className="mt-2 block font-display text-lg leading-tight text-cream">
                  {j.company}
                </span>
                <span className="mt-0.5 block text-sm text-cream-dim">{j.title}</span>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-8">
          {/* The metaphor taken literally: the selected job is a docket printed
              on paper and clipped to the rail, not another dark panel. Bright
              stock against the dark room is what the menu card and the receipt
              already do, and it is the best-looking thing on the page. */}
          <div
            role="tabpanel"
            id={`job-panel-${active}`}
            aria-labelledby={`job-tab-${active}`}
            tabIndex={0}
            className="relative h-full rounded-sm bg-cream px-6 py-7 text-roast-950 shadow-lift md:px-9 md:py-9"
          >
            {/* Torn top edge */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 -top-1.5 h-2"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 5px 100%, transparent 5px, #F4E7D6 5.5px)',
                backgroundSize: '10px 10px',
              }}
            />

            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-roast-950/65">
              <span>Ticket {job.ticket}</span>
              <span>{job.period}</span>
            </div>

            <h3 className="mt-4 font-display text-[clamp(1.5rem,2.6vw,2.15rem)] leading-[1.1]">
              {job.title}
              <span className="block text-copper-dim">{job.company}</span>
            </h3>
            <p className="mt-3 max-w-xl text-[0.98rem] leading-relaxed text-roast-950/70">
              {job.summary}
            </p>

            <div className="my-6 border-t border-dashed border-roast-950/25" />

            <ul className="space-y-3.5">
              {job.lines.map((line, i) => (
                <li key={line} className="flex gap-3.5 text-[0.95rem] leading-relaxed text-roast-950/80">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 font-mono text-[0.62rem] tabular-nums text-copper-dim"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {line}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex items-center justify-between border-t border-dashed border-roast-950/25 pt-4 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-roast-950/65">
              <span>{job.active ? 'Still on the pass' : 'Closed'}</span>
              <span aria-hidden="true">· · ·</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
