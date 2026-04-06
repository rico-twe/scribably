import { registerTextProcessingProvider, getTextProcessingProvider, listTextProcessingProviders, clearTextProcessingProviders } from './registry'
import type { TextProcessingProvider } from './types'

const mockProvider: TextProcessingProvider = {
  id: 'mock-llm',
  name: 'Mock LLM',
  process: async () => ({ text: 'processed' }),
}

describe('Text Processing Registry', () => {
  beforeEach(() => clearTextProcessingProviders())

  it('registers and retrieves a provider', () => {
    registerTextProcessingProvider(mockProvider)
    expect(getTextProcessingProvider('mock-llm')).toBe(mockProvider)
  })

  it('returns undefined for unknown provider', () => {
    expect(getTextProcessingProvider('unknown')).toBeUndefined()
  })

  it('lists all registered providers', () => {
    registerTextProcessingProvider(mockProvider)
    expect(listTextProcessingProviders()).toEqual([mockProvider])
  })
})
