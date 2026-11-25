import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  Mail,
  Copy,
  Check,
  Send,
  FileText,
  ExternalLink,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { ResumeModal } from './ResumeModal';

const EMAIL = 'bringoxin@gmail.com';

const card =
  'rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/90 dark:bg-zinc-900/60 backdrop-blur p-6 transition hover:border-emerald-500/40 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.4)]';
const label = 'block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2';
const input =
  'w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20';

const stack = ['React', 'TypeScript', 'Tailwind CSS', 'Python', 'Django', 'SQLite/PostgreSQL', 'AWS S3', 'Git'];
const capabilities = [
  'Responsive, mobile-first interfaces',
  'Django backends with role-based security',
  'Cart, checkout and billing flows',
  'KPI dashboards and reporting',
];
const posHighlights = [
  'Cashier / Manager / Admin roles',
  'Cash, Card & Mobile-Money checkout',
  'Low-stock, restock & procurement',
  'S3 storage with local fallback',
];

const scopes = ['Full-Stack Web App', 'Frontend & UI', 'Django / Backend', 'General Inquiry'];

export function ContactResume() {
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [scope, setScope] = useState(scopes[0]);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = EMAIL;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Enter a valid email address.';
    if (message.trim().length < 10) e.message = 'Message should be at least 10 characters.';
    return e;
  };

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) setSubmitted(true);
  };

  const reset = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setMessage('');
    setScope(scopes[0]);
    setErrors({});
  };

  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(`[${scope}] Inquiry from ${name.trim()}`)}&body=${encodeURIComponent(
    `${message.trim()}\n\n— ${name.trim()} (${email.trim()})`,
  )}`;

  return (
    <>
      <section id="resume" className="mx-auto max-w-6xl px-4 sm:px-6 py-20 scroll-mt-20">
        <div className="mb-10">
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-4 w-4" /> Resume
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">Skills at a glance</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className={`${card} md:col-span-2`}>
            <h3 className={label}>Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-700 dark:text-emerald-300"
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className={label}>Full-Stack Capabilities</h3>
                <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                  {capabilities.map((c) => (
                    <li key={c} className="flex gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className={label}>POS Platform Highlights</h3>
                <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                  {posHighlights.map((c) => (
                    <li key={c} className="flex gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-cyan-500" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className={`${card} flex flex-col justify-between gap-4`}>
            <div>
              <FileText className="h-8 w-8 text-emerald-500" />
              <h3 className="mt-3 text-lg font-semibold">Reggie — Resume</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Full-Stack Software Developer. Preview it here or open a print-ready version.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 transition"
              >
                <Sparkles className="h-4 w-4" /> Preview Interactive Resume
              </button>
              <a
                href="/Reggie-Resume.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 dark:border-white/15 px-4 py-2.5 text-sm font-semibold hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
              >
                <ExternalLink className="h-4 w-4" /> Open Printable Resume
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-4 sm:px-6 py-20 scroll-mt-20">
        <div className="mb-10">
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            <Mail className="h-4 w-4" /> Contact
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">Let's build something</h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-5">
          <div className={`${card} lg:col-span-2 flex flex-col gap-4 self-start`}>
            <Mail className="h-8 w-8 text-emerald-500" />
            <div>
              <h3 className={label}>Email</h3>
              <a href={`mailto:${EMAIL}`} className="font-mono text-sm sm:text-base break-all hover:text-emerald-500">
                {EMAIL}
              </a>
            </div>
            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 dark:border-white/15 px-4 py-2.5 text-sm font-semibold hover:border-emerald-500 transition"
              aria-live="polite"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-500" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy Email
                </>
              )}
            </button>
          </div>

          <div className={`${card} lg:col-span-3`}>
            {submitted ? (
              <div className="flex flex-col items-center text-center gap-4 py-8">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                <h3 className="text-xl font-semibold">Message ready, {name.trim().split(' ')[0]}!</h3>
                <p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
                  This site has no server, so finish by sending it through your email app. It's prefilled
                  for you.
                </p>
                <a
                  href={mailto}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 transition"
                >
                  <Send className="h-4 w-4" /> Send via Email App
                </a>
                <button type="button" onClick={reset} className="text-sm text-zinc-500 hover:text-emerald-500 underline">
                  Write another message
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="cr-name" className={label}>Name</label>
                    <input id="cr-name" className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="cr-email" className={label}>Email</label>
                    <input id="cr-email" type="email" className={input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <span className={label}>Project Scope</span>
                  <div className="flex flex-wrap gap-2">
                    {scopes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        aria-pressed={scope === s}
                        onClick={() => setScope(s)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                          scope === s
                            ? 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                            : 'border-zinc-300 dark:border-white/15 text-zinc-600 dark:text-zinc-400 hover:border-emerald-500/60'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="cr-message" className={label}>Message</label>
                  <textarea id="cr-message" rows={5} className={`${input} resize-y`} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell me about your project..." />
                  {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 transition"
                >
                  <Send className="h-4 w-4" /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <ResumeModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

export default ContactResume;
