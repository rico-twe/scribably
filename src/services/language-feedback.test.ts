import { recordCorrection, getTopCorrection, reset } from './language-feedback'

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

describe('language-feedback', () => {
  beforeEach(() => localStorageMock.clear())

  it('recordCorrection increments counter', () => {
    recordCorrection('de')
    recordCorrection('de')
    const data = JSON.parse(localStorageMock.getItem('scribably-language-feedback') ?? '{}')
    expect(data['de']).toBe(2)
  })

  it('getTopCorrection returns null when below threshold', () => {
    recordCorrection('de')
    recordCorrection('de')
    expect(getTopCorrection(3)).toBeNull()
  })

  it('getTopCorrection returns code when at threshold', () => {
    recordCorrection('de')
    recordCorrection('de')
    recordCorrection('de')
    expect(getTopCorrection(3)).toBe('de')
  })

  it('getTopCorrection returns top language when multiple', () => {
    recordCorrection('de')
    recordCorrection('de')
    recordCorrection('de')
    recordCorrection('fr')
    recordCorrection('fr')
    expect(getTopCorrection(3)).toBe('de')
  })

  it('reset removes the key', () => {
    recordCorrection('de')
    reset()
    expect(localStorageMock.getItem('scribably-language-feedback')).toBeNull()
  })
})
