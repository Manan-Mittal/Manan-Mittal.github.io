import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PROFILE, DRINKS } from '@/content/site';

const NAV = DRINKS.map((d) => ({ id: d.id, label: d.leadsTo }));

export default function TopBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-crema focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:text-roast-950"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? 'border-b border-roast-600/70 bg-roast-950/95 py-3' : 'py-5'
        }`}
      >
        <div className="container flex items-center justify-between gap-6">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center gap-3"
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crema opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-crema" />
            </span>
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-cream transition-colors group-hover:text-crema">
              {PROFILE.name}
            </span>
          </a>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Sections">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className="relative cursor-pointer px-3 py-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-cream-dim transition-colors duration-200 hover:text-crema"
              >
                {item.label}
                <span className="absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-crema transition-transform duration-300 ease-out-expo hover:scale-x-100" />
              </button>
            ))}
            <a
              href={`mailto:${PROFILE.email}`}
              className="ml-3 rounded border border-roast-600 px-3 py-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-cream transition-colors duration-200 hover:border-crema/60 hover:text-crema"
            >
              Email
            </a>
          </nav>

          <button
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded border border-roast-600 text-cream md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <div
        id="mobile-nav"
        className={`fixed inset-0 z-40 bg-roast-950 transition-opacity duration-300 md:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="container flex h-full flex-col justify-center gap-2 pb-16">
          {NAV.map((item, i) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className="flex items-baseline justify-between border-b border-roast-700 py-5 text-left"
            >
              <span className="font-display text-3xl text-cream">{item.label}</span>
              <span className="font-mono text-[0.7rem] text-cream-mute">
                {String(i + 1).padStart(2, '0')}
              </span>
            </button>
          ))}
          <a
            href={`mailto:${PROFILE.email}`}
            className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-crema"
          >
            {PROFILE.email}
          </a>
        </div>
      </div>
    </>
  );
}
