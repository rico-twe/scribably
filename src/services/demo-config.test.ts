import { getDemoConfig, isDemoConfig, DEMO_MAX_RECORDING_MS } from './demo-config'
import { DEFAULT_CONFIG } from './config-types'

describe('demo-config', () => {
  afterEach(() => vi.unstubAllEnvs())

  it('returns null when VITE_DEMO_GROQ_API_KEY is not set', () => {
    vi.stubEnv('VITE_DEMO_GROQ_API_KEY', '')
    expect(getDemoConfig()).toBeNull()
  })

  it('returns a valid AppConfig when VITE_DEMO_GROQ_API_KEY is set', () => {
    vi.stubEnv('VITE_DEMO_GROQ_API_KEY', 'gsk_demo_test')
    const config = getDemoConfig()
    expect(config).not.toBeNull()
    expect(config!.sttProvider?.providerId).toBe('groq')
    expect(config!.sttProvider?.isDemo).toBe(true)
    expect(config!.llmProvider?.providerId).toBe('openai-compatible')
    expect(config!.llmProvider?.isDemo).toBe(true)
    expect(config!.enableCleaning).toBe(true)
  })

  it('isDemoConfig returns true for demo config', () => {
    vi.stubEnv('VITE_DEMO_GROQ_API_KEY', 'gsk_demo_test')
    expect(isDemoConfig(getDemoConfig()!)).toBe(true)
  })

  it('isDemoConfig returns false for DEFAULT_CONFIG', () => {
    expect(isDemoConfig(DEFAULT_CONFIG)).toBe(false)
  })

  it('DEMO_MAX_RECORDING_MS is 30000', () => {
    expect(DEMO_MAX_RECORDING_MS).toBe(30_000)
  })
})
