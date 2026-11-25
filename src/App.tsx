import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { HeroBento } from './components/HeroBento'
import { ProjectsShowcase } from './components/ProjectsShowcase'
import { ContactResume } from './components/ContactResume'

export default function App() {
  return (
    <div
      id="top"
      className="relative min-h-screen overflow-x-hidden bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[32rem] w-[32rem] rounded-full bg-emerald-500/20 blur-[120px] dark:bg-emerald-500/15" />
        <div className="absolute top-1/3 right-0 h-[28rem] w-[28rem] rounded-full bg-cyan-500/20 blur-[120px] dark:bg-cyan-500/15" />
        <div className="absolute bottom-0 left-0 h-[26rem] w-[26rem] rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>
      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroBento />
          <ProjectsShowcase />
          <ContactResume />
        </main>
        <Footer />
      </div>
    </div>
  )
}
