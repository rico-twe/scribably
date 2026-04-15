import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

interface LayoutProps {
  children: ReactNode
  context: 'landing' | 'app'
  theme: 'cream' | 'dark'
  onThemeToggle: () => void
  headerActions?: ReactNode
}

export function Layout({ children, context, theme, onThemeToggle, headerActions }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-page text-text-primary relative overflow-x-hidden">
      {/* Paper grain overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] mix-blend-multiply dark:mix-blend-screen dark:opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Decorative atmosphere blobs */}
      <div aria-hidden className="pointer-events-none fixed -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-matcha-300/20 dark:bg-matcha-600/10 blur-3xl z-0" />
      <div aria-hidden className="pointer-events-none fixed top-[40%] -right-40 w-[420px] h-[420px] rounded-full bg-ube-300/25 dark:bg-ube-800/15 blur-3xl z-0" />

      <Header
        context={context}
        theme={theme}
        onThemeToggle={onThemeToggle}
        headerActions={headerActions}
      />

      <main className="relative z-10 flex-1">
        {children}
      </main>

      <Footer variant={context === 'app' ? 'compact' : 'full'} />
    </div>
  )
}
