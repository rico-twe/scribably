import { Logo } from './Logo'
import { navigate } from '../../hooks/useHashRoute'

const GITHUB_URL = 'https://github.com/ricotwesten/whisperprompt'

interface FooterProps {
  variant?: 'compact' | 'full'
}

export function Footer({ variant = 'full' }: FooterProps) {
  return (
    <footer className="relative z-10 px-4 md:px-6 pb-10 mt-auto">
      <div className="max-w-[1280px] mx-auto bg-ube-900 text-white rounded-[40px] px-8 md:px-16 py-14">
        {variant === 'full' ? <FullFooter /> : <CompactFooter />}

        <div className="mt-12 pt-6 border-t border-white/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[12px] font-mono uppercase tracking-[0.1em] text-white/60">
          <span>© {new Date().getFullYear()} · WhisperPrompt</span>
          <span>Made with cream, matcha &amp; ube.</span>
        </div>
      </div>
    </footer>
  )
}

function FullFooter() {
  return (
    <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-10">
      <div>
        <div className="mb-4">
          <Logo size="sm" showWordmark iconBgClassName="bg-white/15" />
        </div>
        <p className="text-[14px] leading-[1.6] text-white/70 max-w-[320px]">
          Open-source web app that turns spoken language into usable prompts.
          Runs in your browser, BYOK, MIT license.
        </p>
      </div>

      <div>
        <p className="label-uppercase text-ube-300 mb-3">Project</p>
        <ul className="space-y-2 text-[14px] text-white/85">
          <li><a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
          <li><a href={`${GITHUB_URL}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">License · MIT</a></li>
          <li><a href={`${GITHUB_URL}/issues`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Issues</a></li>
        </ul>
      </div>

      <div>
        <p className="label-uppercase text-ube-300 mb-3">Docs</p>
        <ul className="space-y-2 text-[14px] text-white/85">
          <li><a href={`${GITHUB_URL}/tree/main/docs`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Architecture</a></li>
          <li><a href={`${GITHUB_URL}/blob/main/docs/providers.md`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Provider</a></li>
          <li><a href={`${GITHUB_URL}/blob/main/docs/config.md`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Config</a></li>
        </ul>
      </div>

      <div>
        <p className="label-uppercase text-ube-300 mb-3">App</p>
        <ul className="space-y-2 text-[14px] text-white/85">
          <li><button onClick={() => navigate('app')} className="hover:text-white transition-colors">Open app</button></li>
        </ul>
      </div>
    </div>
  )
}

function CompactFooter() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div className="flex items-center gap-2.5">
        <Logo size="sm" showWordmark iconBgClassName="bg-white/15" />
        <span className="ml-2 text-[12px] font-mono uppercase tracking-[0.1em] text-white/60">Client-only · BYOK · MIT</span>
      </div>

      <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-white/85 font-clay-ui">
        <button onClick={() => navigate('landing')} className="hover:text-white transition-colors">Home</button>
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
        <a href={`${GITHUB_URL}/tree/main/docs`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Docs</a>
        <a href={`${GITHUB_URL}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">License</a>
      </nav>
    </div>
  )
}
