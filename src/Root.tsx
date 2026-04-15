import App from './App'
import { LandingPage } from './pages/LandingPage'
import { useHashRoute } from './hooks/useHashRoute'

export function Root() {
  const route = useHashRoute()
  return route === 'app' ? <App /> : <LandingPage />
}
