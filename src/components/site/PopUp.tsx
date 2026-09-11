import Section from './Section';
import { POPUP } from '@/content/site';

export default function PopUp() {
  return (
    <Section id="popup" kicker="04 · House Special" title={<>To Be<br />Continued.</>} side="right">
      <p className="-mt-3 mb-8 font-display text-xl italic text-crema">{POPUP.standfirst}</p>

      <div className="space-y-5 text-pretty text-cream-dim">
        {POPUP.body.map((para) => (
          <p key={para.slice(0, 20)}>{para}</p>
        ))}
      </div>

      {/* The menu card itself — cream paper against the dark room */}
      <div className="mt-10 rounded-lg border border-cream/15 bg-cream p-6 text-roast-950 shadow-lift md:p-8">
        <p className="flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-copper-dim">
          <span>The Menu</span>
          <span className="h-px flex-1 bg-roast-950/15" />
          <span>No. 04</span>
        </p>

        <ul className="mt-5 divide-y divide-roast-950/10">
          {POPUP.menu.map((item) => (
            <li key={item.name} className="py-3.5">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <span className="font-display text-lg text-roast-950">{item.name}</span>
                {'flag' in item && item.flag && (
                  <span className="rounded-full bg-copper/15 px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-copper-dim">
                    {item.flag}
                  </span>
                )}
                <span
                  aria-hidden="true"
                  className="h-px min-w-6 flex-1 border-b border-dotted border-roast-950/30"
                />
                <span className="font-mono text-[0.72rem] tabular-nums text-roast-950/70">
                  {item.price}
                </span>
              </div>
              <p className="mt-1 text-sm text-roast-950/65">{item.note}</p>
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-roast-950/15 pt-4">
          {POPUP.also.map((row) => (
            <div key={row.name} className="flex flex-wrap items-baseline gap-x-3 py-1.5">
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-roast-950/80">
                {row.name}
              </span>
              <span className="text-sm text-roast-950/60">{row.note}</span>
              <span
                aria-hidden="true"
                className="h-px min-w-4 flex-1 border-b border-dotted border-roast-950/20"
              />
              <span className="font-mono text-[0.72rem] tabular-nums text-roast-950/70">
                {row.price}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-roast-950/50">
          Rotating · Pop-up dates announced on Instagram
        </p>
      </div>
    </Section>
  );
}
