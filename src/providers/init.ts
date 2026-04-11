import { clearTranscriptionProviders, registerTranscriptionProvider } from './transcription/registry'
import { clearTextProcessingProviders, registerTextProcessingProvider } from './text-processing/registry'
import { createGroqProvider } from './transcription/groq'
import { createOpenAIWhisperProvider } from './transcription/openai-whisper'
import { createOpenAICompatibleProvider } from './text-processing/openai-compatible'
import { createAnthropicProvider } from './text-processing/anthropic'
import type { AppConfig } from '../services/config-types'

export function initializeProviders(config: AppConfig): void {
  clearTranscriptionProviders()
  clearTextProcessingProviders()

  if (config.sttProvider?.apiKey) {
    console.log('[WP:init] Registering STT provider:', config.sttProvider.providerId)
    switch (config.sttProvider.providerId) {
      case 'groq':
        registerTranscriptionProvider(createGroqProvider(config.sttProvider.apiKey))
        break
      case 'openai-whisper':
        registerTranscriptionProvider(createOpenAIWhisperProvider(config.sttProvider.apiKey))
        break
    }
  } else {
    console.log('[WP:init] No STT provider configured (missing apiKey)')
  }

  if (config.llmProvider?.apiKey) {
    const { providerId, baseUrl, model } = config.llmProvider
    console.log('[WP:init] Registering LLM provider:', providerId, {
      baseUrl: baseUrl ?? '(default)',
      model: model ?? '(default)',
      apiKeyLength: config.llmProvider.apiKey.length,
    })
    switch (providerId) {
      case 'openai-compatible':
        registerTextProcessingProvider(createOpenAICompatibleProvider({
          apiKey: config.llmProvider.apiKey,
          baseUrl: baseUrl ?? 'https://api.openai.com/v1',
          model: model ?? 'gpt-4o',
        }))
        break
      case 'anthropic':
        registerTextProcessingProvider(createAnthropicProvider(
          config.llmProvider.apiKey,
          model,
        ))
        break
      default:
        console.warn('[WP:init] Unknown LLM provider:', providerId)
    }
  } else {
    console.log('[WP:init] No LLM provider configured (missing apiKey)')
  }
}
