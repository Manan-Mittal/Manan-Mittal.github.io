import { Github, ExternalLink } from 'lucide-react';
import Section from './Section';
import { PROJECTS, type Project } from '@/content/site';

const ROAST_LEVEL: Record<Project['roast'], number> = { Light: 1, Medium: 2, Dark: 3 };

/** Three beans filled to the roast level — a legend-free but labelled meter. */
function RoastMeter({ roast }: { roast: Project['roast'] }) {
  const level = ROAST_LEVEL[roast];
  return (
    <span className="flex items-center gap-2">
      <span className="flex gap-1" aria-hidden="true">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-1.5 w-4 rounded-full transition-colors ${
              i <= level ? 'bg-crema' : 'bg-roast-600'
            }`}
          />
        ))}
      </span>
      <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-cream-mute">
        {roast} roast
      </span>
    </span>
  );
}

export default function Projects() {
  return (
    <Section id="projects" kicker="03 · Cold Brew" title={<>Steeped on<br />my own time.</>} wide>
      <p className="-mt-3 mb-10 max-w-xl text-cream-dim">
        Things I built because I wanted them to exist. Some ship to customers, some only ever run
        in my apartment.
      </p>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PROJECTS.map((project) => (
          <li key={project.title}>
            <article className="panel group flex h-full flex-col p-5 transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:border-crema/40">
              <RoastMeter roast={project.roast} />

              <h3 className="mt-4 font-display text-xl leading-tight text-cream transition-colors group-hover:text-crema">
                {project.title}
              </h3>
              <p className="mt-3 flex-1 text-[0.93rem] leading-relaxed text-cream-dim">
                {project.blurb}
              </p>

              <ul className="mt-5 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded border border-roast-600/70 px-2 py-0.5 font-mono text-[0.6rem] text-cream-mute"
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              {(project.repo || project.demo) && (
                <div className="mt-5 flex gap-2 border-t border-roast-700 pt-4">
                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-cream-dim transition-colors hover:text-crema"
                    >
                      <Github size={14} aria-hidden="true" />
                      Source
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-cream-dim transition-colors hover:text-crema"
                    >
                      <ExternalLink size={14} aria-hidden="true" />
                      Live
                    </a>
                  )}
                </div>
              )}
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}
