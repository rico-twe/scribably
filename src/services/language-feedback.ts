const KEY = 'scribably-language-feedback'

function load(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '{}') } catch { return {} }
}

export function recordCorrection(code: string): void {
  const data = load()
  data[code] = (data[code] ?? 0) + 1
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function getTopCorrection(threshold = 3): string | null {
  const data = load()
  const [top] = Object.entries(data).sort(([, a], [, b]) => b - a)
  if (!top || top[1] < threshold) return null
  return top[0]
}

export function reset(): void {
  localStorage.removeItem(KEY)
}
