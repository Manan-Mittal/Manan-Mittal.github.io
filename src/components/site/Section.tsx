import { type ReactNode } from 'react';
import { useInView, useReveal } from '@/hooks/useInView';
import { useBar } from '@/state/bar';
import type { SectionId } from '@/content/site';

interface SectionProps {
  id: SectionId;
  kicker: string;
  title: ReactNode;
  /** Which side of the frame the reading column sits on — alternate these so
      the machine isn't permanently hidden behind the same block of text. */
  side?: 'left' | 'right';
  children: ReactNode;
  wide?: boolean;
}

export default function Section({ id, kicker, title, side = 'left', children, wide }: SectionProps) {
  const setFocus = useBar((s) => s.setFocus);
  const ref = useInView(() => setFocus(id));
  const reveal = useReveal<HTMLDivElement>();

  return (
    <section
      id={id}
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-[var(--space-section)]"
      aria-labelledby={`${id}-title`}
    >
      <div className="container">
        <div className={`grid gap-10 lg:grid-cols-12 ${side === 'right' ? '' : ''}`}>
          <div
            ref={reveal}
            data-shown="false"
            className={[
              'group/section transition-all duration-700 ease-out-expo',
              'data-[shown=false]:translate-y-6 data-[shown=false]:opacity-0',
              'data-[shown=true]:translate-y-0 data-[shown=true]:opacity-100',
              wide ? 'lg:col-span-12' : 'lg:col-span-7',
              !wide && side === 'right' ? 'lg:col-start-6' : '',
            ].join(' ')}
          >
            <p className="rule-label mb-5">
              <span>{kicker}</span>
            </p>
            <h2 id={`${id}-title`} className="section-title mb-8">
              {title}
            </h2>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
