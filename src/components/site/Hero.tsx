import { useEffect, useState } from 'react';
import { PROFILE } from '@/content/site';
import { useBar } from '@/state/bar';
import OrderCounter from './OrderCounter';

/** Opening hours line — real clock, because a bar should know what time it is. */
function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <time dateTime={now.toISOString()} className="tabular-nums">
      {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </time>
  );
}

export default function Hero() {
  const setFocus = useBar((s) => s.setFocus);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY < window.innerHeight * 0.4) setFocus('bar');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [setFocus]);

  return (
    <section
      id="top"
      className="relative flex items-end pb-16 pt-[calc(52svh+1.5rem)] md:min-h-[100svh] md:pt-28 lg:items-center lg:pb-24"
    >
      <div className="container">
        <div className="grid lg:grid-cols-12">
          <div className="animate-rise lg:col-span-6 xl:col-span-5">
            <p className="kicker flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-crema">Open</span>
              <span aria-hidden="true" className="text-cream-mute">/</span>
              <Clock />
              <span aria-hidden="true" className="text-cream-mute">/</span>
              <span>{PROFILE.location}</span>
            </p>

            <h1 className="mt-5 font-display text-[clamp(3rem,8.5vw,6.2rem)] font-semibold leading-[0.92] tracking-[-0.02em] text-cream">
              Manan
              <br />
              <span className="italic text-crema">Mittal</span>
            </h1>

            <p className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-cream-dim">
              {PROFILE.role} at {PROFILE.company}. Co-founder of{' '}
              <span className="text-cream">{PROFILE.sideProject}</span>, an Asian American coffee
              pop-up. {PROFILE.tagline}
            </p>

            <OrderCounter />
          </div>
        </div>
      </div>

      {/* Scroll affordance — the page works perfectly well without ordering anything */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 hidden justify-center lg:flex">
        <span className="flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-cream-mute">
          <span className="h-8 w-px bg-gradient-to-b from-transparent to-crema/70" />
          Or just scroll
        </span>
      </div>
    </section>
  );
}
