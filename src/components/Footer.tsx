export function Footer() {
  return (
    <footer className="border-t border-zinc-200 py-8 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-sm text-zinc-500 sm:flex-row sm:px-6">
        <p>© {new Date().getFullYear()} Reggie. All rights reserved.</p>
        <p className="font-mono">
          Built with <span className="text-emerald-500">React</span> &amp;{' '}
          <span className="text-cyan-500">Tailwind</span>
        </p>
      </div>
    </footer>
  )
}
