import { useEffect } from 'react'

export function usePageMeta(title: string, description: string): void {
  useEffect(() => {
    document.title = title
    const descEl = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (descEl) descEl.content = description
  }, [title, description])
}
