import { useState } from 'react';
import {
  Sparkles,
  ArrowUpRight,
  Code2,
  Database,
  Layout,
  Terminal,
  Layers,
  ShieldCheck,
  Mail,
  FileText,
} from 'lucide-react';
import {
  profile,
  coreStack,
  engineeringFocus,
  highlights,
  codeSnippets,
  type SnippetKey,
} from '../data/profileData';

const card =
  'rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/90 dark:bg-zinc-900/60 p-6 backdrop-blur transition-all duration-300 hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-500/10 dark:hover:shadow-cyan-500/10';

const focusIcons = [ShieldCheck, Layout, Layers];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export function HeroBento() {
  const [tab, setTab] = useState<SnippetKey>('backend.py');
  const tabs = Object.keys(codeSnippets) as SnippetKey[];

  return (
    <section id="about" className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6">
      <div className="mb-12 max-w-3xl">
        {profile.available && (
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {profile.availability}
          </span>
        )}
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
          Hi, I'm {profile.name}
          <Sparkles className="ml-2 inline h-8 w-8 text-emerald-500" aria-hidden />
          <span className="mt-2 block bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
            {profile.role}
          </span>
        </h1>
        <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">{profile.tagline}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => scrollTo('projects')}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-medium text-white transition hover:bg-emerald-600"
          >
            View Projects <ArrowUpRight className="h-4 w-4" aria-hidden />
          </button>
          <button
            onClick={() => scrollTo('resume')}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 px-5 py-3 font-medium text-zinc-800 transition hover:border-emerald-500 dark:border-white/15 dark:text-zinc-100"
          >
            <FileText className="h-4 w-4" aria-hidden /> Resume
          </button>
          <button
            onClick={() => scrollTo('contact')}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 px-5 py-3 font-medium text-zinc-800 transition hover:border-cyan-500 dark:border-white/15 dark:text-zinc-100"
          >
            <Mail className="h-4 w-4" aria-hidden /> Contact
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
        <div className={`${card} md:col-span-2`}>
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-zinc-900 dark:text-white">
            <Database className="h-5 w-5 text-emerald-500" aria-hidden /> Core Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {coreStack.map((s) => (
              <span
                key={s}
                className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className={`${card} min-w-0 overflow-hidden md:col-span-4`}>
          <div className="mb-4 flex items-center gap-2" role="tablist">
            <Terminal className="h-5 w-5 text-cyan-500" aria-hidden />
            {tabs.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`flex items-center gap-1 rounded-lg px-3 py-1 font-mono text-sm transition ${
                  tab === t
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Code2 className="h-3.5 w-3.5" aria-hidden /> {t}
              </button>
            ))}
          </div>
          <pre className="w-full max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-zinc-950 p-3 font-mono text-xs leading-relaxed text-zinc-200 sm:p-4 sm:text-sm">
            <code className="block">{codeSnippets[tab]}</code>
          </pre>
        </div>

        <div className={`${card} md:col-span-4`}>
          <h2 className="mb-4 font-semibold text-zinc-900 dark:text-white">Engineering Focus</h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {engineeringFocus.map((f, i) => {
              const Icon = focusIcons[i % focusIcons.length];
              return (
                <li key={f.title}>
                  <Icon className="mb-2 h-5 w-5 text-cyan-500" aria-hidden />
                  <p className="font-medium text-zinc-900 dark:text-white">{f.title}</p>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{f.description}</p>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={`${card} md:col-span-2`}>
          <h2 className="mb-4 font-semibold text-zinc-900 dark:text-white">Quick Highlights</h2>
          <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            {highlights.map((h) => (
              <li key={h} className="flex gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default HeroBento;
