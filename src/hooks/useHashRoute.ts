import { useEffect, useState } from 'react'

export type Route = 'landing' | 'app'

function parseHash(hash: string): Route {
  return hash === '#/app' ? 'app' : 'landing'
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
  window.location.hash = route === 'app' ? '#/app' : ''
}
