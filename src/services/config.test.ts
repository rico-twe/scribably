import { loadConfig, saveConfig, clearConfig, exportConfigToBase64, importConfigFromBase64, isConfigured } from './config'
import { DEFAULT_CONFIG, type AppConfig } from './config-types'

// Provide a real localStorage mock since jsdom's localStorage is not functional in this environment
const store: Record<string, string> = {}
const localStorageMock = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value },
  removeItem: (key: string) => { delete store[key] },
  clear: () => { Object.keys(store).forEach(k => delete store[k]) },
}

beforeAll(() => {
  vi.stubGlobal('localStorage', localStorageMock)
})

afterAll(() => {
  vi.unstubAllGlobals()
})

describe('Config Service', () => {
  beforeEach(() => localStorageMock.clear())

  it('returns default config when localStorage is empty', () => {
    vi.stubEnv('VITE_DEMO_GROQ_API_KEY', '')
    expect(loadConfig()).toEqual(DEFAULT_CONFIG)
    vi.unstubAllEnvs()
  })

  it('saves and loads config roundtrip', () => {
    const config: AppConfig = {
      sttProvider: { providerId: 'groq', apiKey: 'gsk_test' },
      llmProvider: null,
      language: 'en',
    }
    saveConfig(config)
    expect(loadConfig()).toEqual(config)
  })

  it('clears config', () => {
    saveConfig({ ...DEFAULT_CONFIG, language: 'en' })
    clearConfig()
    expect(loadConfig()).toEqual(DEFAULT_CONFIG)
  })

  it('export/import Base64 roundtrip', () => {
    const config: AppConfig = {
      sttProvider: { providerId: 'groq', apiKey: 'gsk_secret' },
      llmProvider: { providerId: 'anthropic', apiKey: 'sk-ant-secret' },
      language: 'de',
    }
    const encoded = exportConfigToBase64(config)
    const decoded = importConfigFromBase64(encoded)
    expect(decoded).toEqual(config)
  })

  it('importConfigFromBase64 throws on invalid data', () => {
    expect(() => importConfigFromBase64('not-valid-base64!!!')).toThrow()
  })

  it('isConfigured returns false when no STT provider', () => {
    expect(isConfigured(DEFAULT_CONFIG)).toBe(false)
  })

  it('isConfigured returns true when STT provider has API key', () => {
    const config: AppConfig = {
      ...DEFAULT_CONFIG,
      sttProvider: { providerId: 'groq', apiKey: 'gsk_test' },
    }
    expect(isConfigured(config)).toBe(true)
  })

  it('returns demo config when localStorage is empty and env var is set', () => {
    vi.stubEnv('VITE_DEMO_GROQ_API_KEY', 'gsk_test_demo')
    const config = loadConfig()
    expect(config.sttProvider?.providerId).toBe('groq')
    expect(config.sttProvider?.isDemo).toBe(true)
    vi.unstubAllEnvs()
  })

  it('saveConfig does not persist isDemo flag', () => {
    const config: AppConfig = {
      sttProvider: { providerId: 'groq', apiKey: 'gsk_test', isDemo: true },
      llmProvider: null,
      language: 'en',
    }
    saveConfig(config)
    const loaded = loadConfig()
    expect(loaded.sttProvider?.isDemo).toBeUndefined()
  })
})
