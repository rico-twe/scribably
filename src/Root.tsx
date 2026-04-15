import { useState, useEffect } from 'react'
import App from './App'
import { LandingPage } from './pages/LandingPage'
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

  return route === 'app'
    ? <App theme={theme} onThemeToggle={toggleTheme} />
    : <LandingPage theme={theme} onThemeToggle={toggleTheme} />
}
