import type { TranscriptionProvider } from './types'

const providers = new Map<string, TranscriptionProvider>()

export function registerTranscriptionProvider(provider: TranscriptionProvider): void {
  providers.set(provider.id, provider)
}

export function getTranscriptionProvider(id: string): TranscriptionProvider | undefined {
  return providers.get(id)
}

export function listTranscriptionProviders(): TranscriptionProvider[] {
  return Array.from(providers.values())
}

export function clearTranscriptionProviders(): void {
  providers.clear()
}
