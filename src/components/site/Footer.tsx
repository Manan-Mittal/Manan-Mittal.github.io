import { ArrowUp } from 'lucide-react';
import { PROFILE } from '@/content/site';

export default function Footer() {
  return (
    <footer className="relative border-t border-roast-700 bg-roast-950 py-10">
      <div className="container flex flex-col items-center justify-between gap-6 md:flex-row">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-cream-mute">
          © {new Date().getFullYear()} {PROFILE.name} · React and Three.js · Every object on
          this bar is drawn in code, no models
        </p>

        <div className="flex items-center gap-6">
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-cream-dim transition-colors hover:text-crema"
          >
            GitHub
          </a>
          <a
            href={PROFILE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-cream-dim transition-colors hover:text-crema"
          >
            LinkedIn
          </a>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex cursor-pointer items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-cream-dim transition-colors hover:text-crema"
          >
            Back to the bar
            <ArrowUp size={13} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
