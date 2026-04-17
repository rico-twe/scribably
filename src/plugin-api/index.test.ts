import {
  registerTranscriptionProvider,
  getTranscriptionProvider,
  listTranscriptionProviders,
  registerTextProcessingProvider,
  getTextProcessingProvider,
  isFeatureEnabled,
  enableFeature,
  disableFeature,
} from './index'
import { clearTranscriptionProviders } from '../providers/transcription/registry'
import { clearTextProcessingProviders } from '../providers/text-processing/registry'

beforeEach(() => {
  clearTranscriptionProviders()
  clearTextProcessingProviders()
})

describe('plugin-api re-exports', () => {
  it('registers and retrieves a transcription provider', () => {
    const stub = { id: 'test-stt', name: 'Test STT', transcribe: vi.fn() }
    registerTranscriptionProvider(stub)
    expect(getTranscriptionProvider('test-stt')).toBe(stub)
    expect(listTranscriptionProviders()).toContain(stub)
  })

  it('registers and retrieves a text processing provider', () => {
    const stub = { id: 'test-llm', name: 'Test LLM', process: vi.fn() }
    registerTextProcessingProvider(stub)
    expect(getTextProcessingProvider('test-llm')).toBe(stub)
  })
})

describe('feature flags', () => {
  it('core features are enabled by default', () => {
    expect(isFeatureEnabled('transcription')).toBe(true)
    expect(isFeatureEnabled('textProcessing')).toBe(true)
    expect(isFeatureEnabled('history')).toBe(true)
    expect(isFeatureEnabled('qrTransfer')).toBe(true)
  })

  it('unknown features are disabled by default', () => {
    expect(isFeatureEnabled('pro.batchProcessing')).toBe(false)
  })

  it('enableFeature activates a feature', () => {
    enableFeature('pro.batchProcessing')
    expect(isFeatureEnabled('pro.batchProcessing')).toBe(true)
    disableFeature('pro.batchProcessing')
  })

  it('disableFeature deactivates a feature', () => {
    enableFeature('pro.test')
    disableFeature('pro.test')
    expect(isFeatureEnabled('pro.test')).toBe(false)
  })
})
