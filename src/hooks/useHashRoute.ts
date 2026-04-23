import { useEffect, useState } from 'react'

export type Route = 'landing' | 'app' | 'impressum' | 'datenschutz'

const ROUTE_TITLES: Record<Route, string> = {
  landing: 'Scribably — Speech to AI Prompts in Your Browser',
  app: 'Scribably · App',
  impressum: 'Scribably · Impressum',
  datenschutz: 'Scribably · Datenschutz',
}

const ROUTE_PATHS: Record<Route, string> = {
  landing: '/',
  app: '/app',
  impressum: '/impressum',
  datenschutz: '/datenschutz',
}

function parsePath(pathname: string): Route {
  if (pathname === '/app') return 'app'
  if (pathname === '/impressum') return 'impressum'
  if (pathname === '/datenschutz') return 'datenschutz'
  return 'landing'
}

function trackRoute(route: Route): void {
  window.umami?.track(props => ({
    ...props,
    url: ROUTE_PATHS[route],
    title: ROUTE_TITLES[route],
  }))
}

export function useHashRoute(ssrPathname?: string): Route {
  const [route, setRoute] = useState<Route>(() => {
    if (ssrPathname !== undefined) return parsePath(ssrPathname)
    if (typeof window === 'undefined') return 'landing'
    return parsePath(window.location.pathname)
  })

  useEffect(() => {
    const onPopState = () => {
      const next = parsePath(window.location.pathname)
      setRoute(next)
      trackRoute(next)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  return route
}

export function navigate(route: Route): void {
  const path = ROUTE_PATHS[route]
  history.pushState(null, '', path)
  window.dispatchEvent(new PopStateEvent('popstate', { state: null }))
}
