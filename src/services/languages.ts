export const SUPPORTED_LANGUAGES = [
  { code: 'de', name: 'German' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
] as const

export function normalizeLanguage(input: string): string | null {
  const lower = input.toLowerCase()
  const byCode = SUPPORTED_LANGUAGES.find(l => l.code === lower)
  if (byCode) return byCode.code
  const byName = SUPPORTED_LANGUAGES.find(l => l.name.toLowerCase() === lower)
  return byName?.code ?? null
}

export function getLanguageName(code: string): string | undefined {
  return SUPPORTED_LANGUAGES.find(l => l.code === code)?.name
}
