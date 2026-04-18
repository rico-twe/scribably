import { useEffect, useState } from 'react'

export type Route = 'landing' | 'app' | 'impressum' | 'datenschutz'

function parseHash(hash: string): Route {
  if (hash === '#/app') return 'app'
  if (hash === '#/impressum') return 'impressum'
  if (hash === '#/datenschutz') return 'datenschutz'
  return 'landing'
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() =>
    typeof window === 'undefined' ? 'landing' : parseHash(window.location.hash)
  )

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}

export function navigate(route: Route): void {
  if (route === 'app') { window.location.hash = '#/app'; return }
  if (route === 'impressum') { window.location.hash = '#/impressum'; return }
  if (route === 'datenschutz') { window.location.hash = '#/datenschutz'; return }
  window.location.hash = ''
}
