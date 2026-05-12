import { type HistoryEntry } from './history'
import { rebuildIndex, addToIndex, removeFromIndex, search } from './history-search'

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

describe('history integration', () => {
  beforeEach(() => {
    rebuildIndex([])
  })

  it('rebuildIndex + search: finds entries by rawText', () => {
    const entries = [makeEntry({ rawText: 'Hallo Welt', timestamp: 1000 }), makeEntry({ rawText: 'Ciao mondo', timestamp: 2000 })]
    rebuildIndex(entries)
    const results = search('Hallo')
    expect(results).toHaveLength(1)
    expect(results[0].rawText).toBe('Hallo Welt')
  })

  it('rebuildIndex + search: finds entries by cleanedText', () => {
    const entry = makeEntry({ rawText: 'Test', cleanedText: 'Test.', timestamp: 0 })
    rebuildIndex([entry])
    const results = search('Test.')
    expect(results).toHaveLength(1)
  })

  it('rebuildIndex + search: finds entries by promptText', () => {
    const entry = makeEntry({ rawText: 'Text', promptText: 'Formatieren', timestamp: 0 })
    rebuildIndex([entry])
    const results = search('Formatieren')
    expect(results).toHaveLength(1)
  })

  it('addToIndex / removeFromIndex: update search results', () => {
    const entry = makeEntry({ id: 'a', rawText: 'Eindeutig', timestamp: 0 })
    addToIndex(entry)
    expect(search('Eindeutig')).toHaveLength(1)
    removeFromIndex('a')
    expect(search('Eindeutig')).toHaveLength(0)
  })

  it('score multi-field matches higher', () => {
    const entry1 = makeEntry({ id: 'x', rawText: 'Hello world', cleanedText: 'Hello world.', timestamp: 0 })
    const entry2 = makeEntry({ id: 'y', rawText: 'Hello world', cleanedText: null, timestamp: 0 })
    rebuildIndex([entry1, entry2])
    const results = search('Hello world')
    expect(results).toHaveLength(2)
    // entry1 matches in rawText + cleanedText = score 2
    // entry2 matches only in rawText = score 1
    expect(results[0].id).toBe('x')
  })

  it('case-insensitive search', () => {
    rebuildIndex([makeEntry({ rawText: 'HALLO WELT' })])
    expect(search('hallo')).toHaveLength(1)
    expect(search('HALLO')).toHaveLength(1)
    expect(search('HaLlO')).toHaveLength(1)
  })
})
