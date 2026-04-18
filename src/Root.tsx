import { useState, useEffect } from 'react'
import App from './App'
import { LandingPage } from './pages/LandingPage'
import { ImpressumPage } from './pages/ImpressumPage'
import { DatenschutzPage } from './pages/DatenschutzPage'
import { useHashRoute } from './hooks/useHashRoute'

export function Root() {
  const route = useHashRoute()
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
