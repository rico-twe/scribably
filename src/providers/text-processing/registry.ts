import type { TextProcessingProvider } from './types'

const providers = new Map<string, TextProcessingProvider>()

export function registerTextProcessingProvider(provider: TextProcessingProvider): void {
  providers.set(provider.id, provider)
}

export function getTextProcessingProvider(id: string): TextProcessingProvider | undefined {
  return providers.get(id)
}

export function listTextProcessingProviders(): TextProcessingProvider[] {
  return Array.from(providers.values())
}

export function clearTextProcessingProviders(): void {
  providers.clear()
}
