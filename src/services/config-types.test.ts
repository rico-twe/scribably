import { DEFAULT_CONFIG, type AppConfig } from './config-types'

describe('AppConfig', () => {
  it('has sensible defaults', () => {
    expect(DEFAULT_CONFIG.language).toBe('en')
    expect(DEFAULT_CONFIG.sttProvider).toBeNull()
    expect(DEFAULT_CONFIG.llmProvider).toBeNull()
  })

  it('allows full config', () => {
    const config: AppConfig = {
      sttProvider: { providerId: 'groq', apiKey: 'gsk_test', model: 'whisper-large-v3' },
      llmProvider: { providerId: 'openai-compatible', apiKey: 'sk-test', baseUrl: 'https://api.openai.com/v1' },
      language: 'en',
    }
    expect(config.sttProvider?.providerId).toBe('groq')
    expect(config.llmProvider?.baseUrl).toBe('https://api.openai.com/v1')
  })

  it('allows config with custom prompt', () => {
    const config: AppConfig = {
      ...DEFAULT_CONFIG,
      customPrompt: 'Bereinige den Text und formatiere als Markdown.',
    }
    expect(config.customPrompt).toBe('Bereinige den Text und formatiere als Markdown.')
  })
})
