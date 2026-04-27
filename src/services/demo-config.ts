import { type AppConfig } from './config-types'

export const DEMO_MAX_RECORDING_MS = 30_000

export function getDemoConfig(): AppConfig | null {
  const key = import.meta.env.VITE_DEMO_GROQ_API_KEY
  if (!key || key === 'undefined') return null
  return {
    sttProvider: { providerId: 'groq', apiKey: key, isDemo: true },
    llmProvider: {
      providerId: 'openai-compatible',
      apiKey: key,
      baseUrl: 'https://api.groq.com/openai/v1',
      model: 'llama-3.3-70b-versatile',
      isDemo: true,
    },
    language: 'en',
    enableCleaning: true,
  }
}

export function isDemoConfig(config: AppConfig): boolean {
  return config.sttProvider?.isDemo === true
}
