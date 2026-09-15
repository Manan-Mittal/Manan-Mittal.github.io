import { GraduationCap } from 'lucide-react';
import Section from './Section';
import { PROFILE, SKILLS } from '@/content/site';

export default function About() {
  return (
    <Section id="about" kicker="01 · Espresso" title={<>Nothing<br />watered down.</>}>
      <div className="grid gap-10 md:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5 text-pretty text-cream-dim">
          {PROFILE.bio.map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}

          <div className="panel mt-8 p-5">
            <p className="rule-label mb-4">
              <span>Education</span>
            </p>
            <div className="flex gap-3">
              <GraduationCap size={18} className="mt-1 shrink-0 text-crema" aria-hidden="true" />
              <div>
                <p className="font-display text-lg text-cream">{PROFILE.education.school}</p>
                <p className="text-sm text-cream-dim">{PROFILE.education.degrees}</p>
                <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-cream-mute">
                  {PROFILE.education.years} · {PROFILE.education.where} ·{' '}
                  <span className="whitespace-nowrap text-crema">{PROFILE.education.gpa} GPA</span>
                </p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {PROFILE.education.honors.map((h) => (
                    <li
                      key={h}
                      className="rounded-full border border-roast-600 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-cream-dim"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* The photo, framed like something taped above the espresso machine */}
          <figure className="panel overflow-hidden p-3">
            <div className="grain relative overflow-hidden rounded">
              <img
                src={PROFILE.photo}
                alt="Manan Mittal at a microroasterie in Quebec"
                width={800}
                height={1000}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out-expo hover:scale-[1.03]"
              />
            </div>
            <figcaption className="flex items-center justify-between gap-3 px-1 pt-3">
              <span className="font-display text-sm italic text-cream-dim">
                {PROFILE.photoCaption}
              </span>
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-cream-mute">
                QC
              </span>
            </figcaption>
          </figure>

          <div className="panel p-5">
            <p className="rule-label mb-4">
              <span>Grind settings</span>
            </p>
            <dl className="space-y-3">
              {SKILLS.map((group) => (
                <div key={group.group} className="grid grid-cols-[5.5rem_1fr] items-baseline gap-3">
                  <dt className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-cream-mute">
                    {group.group}
                  </dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded border border-roast-600/70 bg-roast-800/50 px-2 py-0.5 font-mono text-[0.65rem] text-cream-dim transition-colors duration-200 hover:border-crema/50 hover:text-crema"
                      >
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </Section>
  );
}
