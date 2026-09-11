import { useMemo, useState } from 'react';
import { Github, Linkedin, Mail, MapPin, Phone, Send } from 'lucide-react';
import Section from './Section';
import { PROFILE } from '@/content/site';
import { useBar } from '@/state/bar';

/**
 * The check. There is no backend behind a GitHub Pages site, so rather than
 * fake a "message sent" toast, the form composes a real email and hands it to
 * the reader's mail client — which is the honest version of this interaction.
 */
export default function Contact() {
  const ticket = useBar((s) => s.ticket);
  const [form, setForm] = useState({ name: '', subject: '', message: '' });

  const mailto = useMemo(() => {
    const subject = form.subject || `Hello from ${form.name || 'your site'}`;
    const body = `${form.message}\n\n— ${form.name}`;
    return `mailto:${PROFILE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [form]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const today = new Date().toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' });

  return (
    <Section id="contact" kicker="05 · The Check" title={<>Settle up.</>} wide>
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Receipt */}
        <div className="lg:col-span-5">
          <div className="relative mx-auto max-w-sm bg-cream px-6 py-7 font-mono text-[0.76rem] leading-relaxed text-roast-950 shadow-lift">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 -top-2 h-2"
              style={{
                backgroundImage: 'radial-gradient(circle at 5px 0, transparent 5px, #F4E7D6 5.5px)',
                backgroundSize: '10px 10px',
              }}
            />
            <p className="text-center text-[0.9rem] font-bold uppercase tracking-[0.24em]">
              Bar Manan
            </p>
            <p className="mt-1 text-center text-[0.62rem] uppercase tracking-[0.18em] text-roast-950/55">
              {PROFILE.location} · open all hours
            </p>

            <div className="my-4 border-t border-dashed border-roast-950/30" />

            <dl className="space-y-2">
              {[
                { k: 'Ticket', v: `#${String(ticket).padStart(4, '0')}` },
                { k: 'Date', v: today },
                { k: 'Server', v: 'Manan M.' },
              ].map((row) => (
                <div key={row.k} className="flex justify-between gap-4">
                  <dt className="uppercase tracking-[0.1em] text-roast-950/60">{row.k}</dt>
                  <dd className="tabular-nums">{row.v}</dd>
                </div>
              ))}
            </dl>

            <div className="my-4 border-t border-dashed border-roast-950/30" />

            <ul className="space-y-3">
              <li>
                <a href={`mailto:${PROFILE.email}`} className="flex items-start gap-2 underline-offset-4 hover:underline">
                  <Mail size={13} className="mt-1 shrink-0 text-copper" aria-hidden="true" />
                  <span className="break-all">{PROFILE.email}</span>
                </a>
              </li>
              <li>
                <a href={PROFILE.phoneHref} className="flex items-center gap-2 underline-offset-4 hover:underline">
                  <Phone size={13} className="shrink-0 text-copper" aria-hidden="true" />
                  {PROFILE.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={13} className="shrink-0 text-copper" aria-hidden="true" />
                {PROFILE.location}
              </li>
            </ul>

            <div className="my-4 border-t border-dashed border-roast-950/30" />

            <div className="flex justify-between text-[0.82rem] font-bold uppercase tracking-[0.12em]">
              <span>Total</span>
              <span>$0.00</span>
            </div>
            <p className="mt-4 text-center text-[0.6rem] uppercase tracking-[0.2em] text-roast-950/50">
              Thank you — come back soon
            </p>

            <div className="mt-5 flex justify-center gap-4">
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-roast-950/15 text-roast-950/70 transition-colors hover:border-copper hover:text-copper"
              >
                <Github size={16} aria-hidden="true" />
              </a>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-roast-950/15 text-roast-950/70 transition-colors hover:border-copper hover:text-copper"
              >
                <Linkedin size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Compose */}
        <div className="lg:col-span-7">
          <form
            className="panel h-full p-6 md:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = mailto;
            }}
          >
            <p className="rule-label mb-6">
              <span>Leave a note</span>
            </p>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="c-name" className="mb-2 block font-mono text-[0.62rem] uppercase tracking-[0.16em] text-cream-dim">
                  Your name
                </label>
                <input
                  id="c-name"
                  required
                  value={form.name}
                  onChange={set('name')}
                  className="w-full rounded-md border border-roast-600 bg-roast-950/70 px-4 py-3 text-cream placeholder:text-cream-mute/70 focus:border-crema focus:outline-none"
                  placeholder="Jane Roaster"
                />
              </div>
              <div>
                <label htmlFor="c-subject" className="mb-2 block font-mono text-[0.62rem] uppercase tracking-[0.16em] text-cream-dim">
                  Subject
                </label>
                <input
                  id="c-subject"
                  value={form.subject}
                  onChange={set('subject')}
                  className="w-full rounded-md border border-roast-600 bg-roast-950/70 px-4 py-3 text-cream placeholder:text-cream-mute/70 focus:border-crema focus:outline-none"
                  placeholder="Coffee, work, or both"
                />
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="c-message" className="mb-2 block font-mono text-[0.62rem] uppercase tracking-[0.16em] text-cream-dim">
                Message
              </label>
              <textarea
                id="c-message"
                required
                rows={6}
                value={form.message}
                onChange={set('message')}
                className="w-full resize-y rounded-md border border-roast-600 bg-roast-950/70 px-4 py-3 text-cream placeholder:text-cream-mute/70 focus:border-crema focus:outline-none"
                placeholder="Say hello…"
              />
              <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-cream-mute">
                Opens in your mail app — nothing is sent from this page.
              </p>
            </div>

            <button type="submit" className="btn-crema mt-6 w-full sm:w-auto">
              <Send size={14} aria-hidden="true" />
              Compose email
            </button>
          </form>
        </div>
      </div>
    </Section>
  );
}
