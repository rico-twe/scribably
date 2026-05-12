import { isFirstRun, markWizardSkipped, markWizardCompleted, shouldShowWizard } from './first-run'
import { DEFAULT_CONFIG, type AppConfig } from './config-types'

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

describe('first-run service', () => {
  beforeEach(() => localStorageMock.clear())

  describe('isFirstRun', () => {
    it('returns true when no config in localStorage', () => {
      expect(isFirstRun()).toBe(true)
    })

    it('returns true when config has sttProvider null', () => {
      localStorageMock.setItem('scribably-config', JSON.stringify(DEFAULT_CONFIG))
      expect(isFirstRun()).toBe(true)
    })

    it('returns false when config has sttProvider set', () => {
      const config: AppConfig = {
        sttProvider: { providerId: 'groq', apiKey: 'gsk_test' },
        llmProvider: null,
        language: 'en',
      }
      localStorageMock.setItem('scribably-config', JSON.stringify(config))
      expect(isFirstRun()).toBe(false)
    })

    it('returns false when wizard was skipped', () => {
      markWizardSkipped()
      expect(isFirstRun()).toBe(false)
    })

    it('returns false when config exists and wizard was skipped', () => {
      localStorageMock.setItem('scribably-config', JSON.stringify(DEFAULT_CONFIG))
      markWizardSkipped()
      expect(isFirstRun()).toBe(false)
    })

    it('returns true for malformed localStorage config', () => {
      localStorageMock.setItem('scribably-config', 'not-json')
      expect(isFirstRun()).toBe(true)
    })
  })

  describe('shouldShowWizard', () => {
    it('returns true when sttProvider is null and not skipped', () => {
      expect(shouldShowWizard(DEFAULT_CONFIG)).toBe(true)
    })

    it('returns false when sttProvider is set', () => {
      const config: AppConfig = {
        sttProvider: { providerId: 'groq', apiKey: 'gsk_test' },
        llmProvider: null,
        language: 'en',
      }
      expect(shouldShowWizard(config)).toBe(false)
    })

    it('returns false when wizard was skipped', () => {
      markWizardSkipped()
      expect(shouldShowWizard(DEFAULT_CONFIG)).toBe(false)
    })
  })

  describe('markWizardSkipped / markWizardCompleted', () => {
    it('marks wizard as skipped', () => {
      markWizardSkipped()
      expect(localStorageMock.getItem('scribably-wizard-skipped')).toBe('true')
      expect(isFirstRun()).toBe(false)
    })

    it('marks wizard as completed', () => {
      markWizardCompleted()
      expect(localStorageMock.getItem('scribably-wizard-skipped')).toBe('true')
      expect(isFirstRun()).toBe(false)
    })
  })
})
