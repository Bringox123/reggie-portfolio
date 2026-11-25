import { useEffect } from 'react';
import { X, Printer, Mail } from 'lucide-react';

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
}

const stack = [
  'React',
  'TypeScript',
  'JavaScript',
  'Tailwind CSS',
  'Python',
  'Django',
  'SQLite / PostgreSQL',
  'AWS S3',
  'Git',
];

const capabilities = [
  'Responsive, mobile-first UI engineering',
  'Django backend architecture and role-based access control',
  'Relational data modelling and query optimisation',
  'Session-based cart and multi-method checkout flows',
  'Reporting dashboards with real-time KPIs',
];

const posHighlights = [
  'Django apps: POS, cart, billing, restock, audit, sms_reminder',
  'Cashier / Manager / Admin roles with scoped permissions',
  'Cash, Card and Mobile-Money checkout with change calculation',
  'Low-stock alerts, restock and procurement workflows',
  'Sales and KPI reports; S3 storage with local fallback',
  'Floating mobile navigation designed for touch ergonomics',
];

export function ResumeModal({ open, onClose }: ResumeModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Interactive resume"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-6 py-3 border-b border-zinc-200 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur">
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            resume.preview
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 transition"
            >
              <Printer className="h-4 w-4" /> Print
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close resume"
              className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/10 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-10 space-y-8">
          <header className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Reggie</h2>
            <p className="text-lg text-emerald-600 dark:text-emerald-400 font-medium">
              Full-Stack Software Developer
            </p>
            <a
              href="mailto:bringoxin@gmail.com"
              className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-emerald-500"
            >
              <Mail className="h-4 w-4" /> bringoxin@gmail.com
            </a>
          </header>

          <section>
            <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-zinc-500">Summary</h3>
            <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              Full-stack developer building responsive, secure web applications with Python/Django on the
              backend and React/TypeScript on the front. Creator of a Django retail POS platform covering
              sales, inventory, procurement and reporting.
            </p>
          </section>

          <section>
            <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-zinc-500">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 px-3 py-1 text-xs font-mono"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>

          <div className="grid gap-8 sm:grid-cols-2">
            <section>
              <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-zinc-500">
                Full-Stack Capabilities
              </h3>
              <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300 list-disc pl-5 marker:text-emerald-500">
                {capabilities.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-zinc-500">
                POS Platform Engineering
              </h3>
              <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300 list-disc pl-5 marker:text-cyan-500">
                {posHighlights.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeModal;
