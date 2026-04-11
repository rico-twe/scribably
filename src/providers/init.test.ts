import { initializeProviders } from './init'
import { getTranscriptionProvider, clearTranscriptionProviders } from './transcription/registry'
import { getTextProcessingProvider, clearTextProcessingProviders } from './text-processing/registry'
import type { AppConfig } from '../services/config-types'

describe('initializeProviders', () => {
  beforeEach(() => {
    clearTranscriptionProviders()
    clearTextProcessingProviders()
  })

  it('registers Groq provider when configured', () => {
    const config: AppConfig = {
      sttProvider: { providerId: 'groq', apiKey: 'gsk_test' },
      llmProvider: null,
      language: 'de',
    }
    initializeProviders(config)
    expect(getTranscriptionProvider('groq')).toBeDefined()
  })

  it('registers OpenAI Whisper provider when configured', () => {
    const config: AppConfig = {
      sttProvider: { providerId: 'openai-whisper', apiKey: 'sk-test' },
      llmProvider: null,
      language: 'de',
    }
    initializeProviders(config)
    expect(getTranscriptionProvider('openai-whisper')).toBeDefined()
  })

  it('registers Anthropic provider when configured', () => {
    const config: AppConfig = {
      sttProvider: null,
      llmProvider: { providerId: 'anthropic', apiKey: 'sk-ant-test' },
      language: 'de',
    }
    initializeProviders(config)
    expect(getTextProcessingProvider('anthropic')).toBeDefined()
  })

  it('registers OpenAI-compatible provider when configured', () => {
    const config: AppConfig = {
      sttProvider: null,
      llmProvider: {
        providerId: 'openai-compatible',
        apiKey: 'sk-test',
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4o',
      },
      language: 'de',
    }
    initializeProviders(config)
    expect(getTextProcessingProvider('openai-compatible')).toBeDefined()
  })

  it('skips registration when no provider configured', () => {
    const config: AppConfig = { sttProvider: null, llmProvider: null, language: 'de' }
    initializeProviders(config)
    expect(getTranscriptionProvider('groq')).toBeUndefined()
  })
})
