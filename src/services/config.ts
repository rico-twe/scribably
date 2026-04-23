import { type AppConfig, DEFAULT_CONFIG } from './config-types'

const STORAGE_KEY = 'scribably-config'

export function loadConfig(): AppConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_CONFIG
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_CONFIG
  }
}

export function saveConfig(config: AppConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

export function clearConfig(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function exportConfigToBase64(config: AppConfig): string {
  return btoa(JSON.stringify(config))
}

export function importConfigFromBase64(encoded: string): AppConfig {
  try {
    const parsed = JSON.parse(atob(encoded))
    return { ...DEFAULT_CONFIG, ...parsed }
  } catch {
    throw new Error('Invalid config data')
  }
}

export function isConfigured(config: AppConfig): boolean {
  return config.sttProvider !== null && config.sttProvider.apiKey.length > 0
}
