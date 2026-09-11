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
    <Section id="work" kicker="02 · Cortado" title={<>Tickets on<br />the rail.</>} side="right" wide>
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
                      <Dot size={18} className="-mr-1.5 animate-pulse" aria-hidden="true" />
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
          <div
            role="tabpanel"
            id={`job-panel-${active}`}
            aria-labelledby={`job-tab-${active}`}
            tabIndex={0}
            className="panel h-full p-6 md:p-8"
          >
            {/* Perforated top edge, like a docket torn off the printer */}
            <div
              aria-hidden="true"
              className="mb-6 h-2 w-full rounded-full opacity-60"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 4px 50%, hsl(24 24% 4%) 3px, transparent 3.5px)',
                backgroundSize: '12px 100%',
              }}
            />
            <p className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-cream-mute">
              {job.period}
            </p>
            <h3 className="mt-3 font-display text-2xl leading-tight text-cream md:text-3xl">
              {job.title}
              <span className="text-crema"> @ {job.company}</span>
            </h3>
            <p className="mt-3 text-cream-dim">{job.summary}</p>

            <ul className="mt-6 space-y-3 border-t border-dashed border-roast-600 pt-6">
              {job.lines.map((line) => (
                <li key={line} className="flex gap-3 text-[0.97rem] leading-relaxed text-cream-dim">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-crema" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
