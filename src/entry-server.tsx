import { renderToString } from 'react-dom/server'
import { Root } from './Root'

export function render(pathname: string): string {
  return renderToString(<Root ssrPathname={pathname} />)
}
