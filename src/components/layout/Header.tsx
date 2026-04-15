import type { ReactNode } from 'react'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { navigate } from '../../hooks/useHashRoute'

const GITHUB_URL = 'https://github.com/ricotwesten/whisperprompt'

interface HeaderProps {
  context: 'landing' | 'app'
  theme: 'cream' | 'dark'
  onThemeToggle: () => void
  headerActions?: ReactNode
}

export function Header({ context, theme, onThemeToggle, headerActions }: HeaderProps) {
  return (
    <header className="relative z-10 sticky top-0 backdrop-blur-md bg-bg-page/70 border-b border-border-oat">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-16 flex justify-between items-center">
        {/* Logo */}
        <Logo
          size="sm"
          showWordmark
          showBadge
          onClick={() => navigate('landing')}
        />

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-[14px] font-clay-ui text-text-secondary">
          {context === 'app' ? (
            <button onClick={() => navigate('landing')} className="hover:text-text-primary transition-colors flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
              </svg>
              Startseite
            </button>
          ) : (
            <>
              <a href="#pipeline" className="hover:text-text-primary transition-colors">Pipeline</a>
              <a href="#providers" className="hover:text-text-primary transition-colors">Provider</a>
              <a href="#privacy" className="hover:text-text-primary transition-colors">Privacy</a>
            </>
          )}
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors">GitHub</a>
        </nav>

        {/* Right side: Theme toggle + context-specific actions */}
        <div className="flex items-center gap-1.5">
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
          {headerActions}
        </div>
      </div>
    </header>
  )
}
