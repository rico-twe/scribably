import { registerTranscriptionProvider, getTranscriptionProvider, listTranscriptionProviders, clearTranscriptionProviders } from './registry'
import type { TranscriptionProvider } from './types'

const mockProvider: TranscriptionProvider = {
  id: 'mock',
  name: 'Mock',
  transcribe: async () => ({ text: 'test', language: 'de', duration: 1 }),
}

describe('Transcription Registry', () => {
  beforeEach(() => clearTranscriptionProviders())

  it('registers and retrieves a provider', () => {
    registerTranscriptionProvider(mockProvider)
    expect(getTranscriptionProvider('mock')).toBe(mockProvider)
  })

  it('returns undefined for unknown provider', () => {
    expect(getTranscriptionProvider('unknown')).toBeUndefined()
  })

  it('lists all registered providers', () => {
    registerTranscriptionProvider(mockProvider)
    expect(listTranscriptionProviders()).toEqual([mockProvider])
  })

  it('clears all providers', () => {
    registerTranscriptionProvider(mockProvider)
    clearTranscriptionProviders()
    expect(listTranscriptionProviders()).toEqual([])
  })
})
