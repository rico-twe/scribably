import { useState, useEffect } from 'react'
import App from './App'
import { LandingPage } from './pages/LandingPage'
import { ImpressumPage } from './pages/ImpressumPage'
import { DatenschutzPage } from './pages/DatenschutzPage'
import { useHashRoute } from './hooks/useHashRoute'
import { usePageMeta } from './hooks/usePageMeta'

const PAGE_META: Record<string, { title: string; description: string }> = {
  landing: {
    title: 'Scribably — Speech to AI Prompts in Your Browser',
    description: 'Scribably turns speech into polished AI prompts — entirely in your browser. Bring your own Groq or OpenAI key, keep data local. Free and open source.',
  },
  app: {
    title: 'Scribably · App',
    description: 'Record audio or upload a file and convert speech to clean AI prompts. Client-side only, bring your own key.',
  },
  impressum: {
    title: 'Impressum · Scribably',
    description: 'Impressum und Anbieterkennzeichnung gemäß § 5 TMG für Scribably.',
  },
  datenschutz: {
    title: 'Datenschutz · Scribably',
    description: 'Datenschutzerklärung für Scribably — eine reine Client-Anwendung ohne eigenen Server.',
  },
}

interface RootProps {
  ssrPathname?: string
}

export function Root({ ssrPathname }: RootProps = {}) {
  const route = useHashRoute(ssrPathname)
  const meta = PAGE_META[route]
  usePageMeta(meta.title, meta.description)

  const [theme, setTheme] = useState<'cream' | 'dark'>(() => {
    try { return localStorage.getItem('wp-theme') === 'dark' ? 'dark' : 'cream' }
    catch { return 'cream' }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try { localStorage.setItem('wp-theme', theme) } catch { /* noop */ }
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'cream' : 'dark')

  if (route === 'app') return <App theme={theme} onThemeToggle={toggleTheme} />
  if (route === 'impressum') return <ImpressumPage theme={theme} onThemeToggle={toggleTheme} />
  if (route === 'datenschutz') return <DatenschutzPage theme={theme} onThemeToggle={toggleTheme} />
  return <LandingPage theme={theme} onThemeToggle={toggleTheme} />
}
