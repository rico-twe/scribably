import { loadHistory, saveHistory, type HistoryEntry } from './history'

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

function makeEntry(overrides: Partial<HistoryEntry> = {}): HistoryEntry {
  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    rawText: 'Test text',
    language: 'de',
    duration: 5.2,
    cleanedText: null,
    promptText: null,
    ...overrides,
  }
}

describe('history service', () => {
  beforeEach(() => localStorageMock.clear())

  it('returns empty array when nothing stored', () => {
    expect(loadHistory()).toEqual([])
  })

  it('round-trips entries through localStorage', () => {
    const entries = [makeEntry(), makeEntry()]
    saveHistory(entries)
    expect(loadHistory()).toEqual(entries)
  })

  it('limits to 10 entries on save', () => {
    const entries = Array.from({ length: 15 }, () => makeEntry())
    saveHistory(entries)
    expect(loadHistory()).toHaveLength(10)
  })

  it('limits to 10 entries on load', () => {
    const entries = Array.from({ length: 15 }, () => makeEntry())
    localStorage.setItem('scribably-history', JSON.stringify(entries))
    expect(loadHistory()).toHaveLength(10)
  })

  it('returns empty array on corrupt JSON', () => {
    localStorage.setItem('scribably-history', 'not json')
    expect(loadHistory()).toEqual([])
  })
})
