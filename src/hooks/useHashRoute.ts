import { useEffect, useState } from 'react'

export type Route = 'landing' | 'app' | 'impressum' | 'datenschutz'

const ROUTE_TITLES: Record<Route, string> = {
  landing: 'Scribably',
  app: 'Scribably · App',
  impressum: 'Scribably · Impressum',
  datenschutz: 'Scribably · Datenschutz',
}

const ROUTE_URLS: Record<Route, string> = {
  landing: '/',
  app: '/#/app',
  impressum: '/#/impressum',
  datenschutz: '/#/datenschutz',
}

function parseHash(hash: string): Route {
  if (hash === '#/app') return 'app'
  if (hash === '#/impressum') return 'impressum'
  if (hash === '#/datenschutz') return 'datenschutz'
  return 'landing'
}

function trackRoute(route: Route): void {
  window.umami?.track(props => ({
    ...props,
    url: ROUTE_URLS[route],
    title: ROUTE_TITLES[route],
  }))
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() =>
    typeof window === 'undefined' ? 'landing' : parseHash(window.location.hash)
  )

  useEffect(() => {
    const onChange = () => {
      const next = parseHash(window.location.hash)
      setRoute(next)
      trackRoute(next)
    }
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
