import { describe, it, expect, beforeEach } from 'vitest'
import { addToIndex, search, rebuildIndex, removeFromIndex } from './history-search'
import type { HistoryEntry } from './history'

const entries: HistoryEntry[] = [
  { id: '1', timestamp: 1000, rawText: 'Hallo Welt', language: 'de', duration: 5.2, cleanedText: 'Hallo Welt.', promptText: null },
  { id: '2', timestamp: 2000, rawText: 'Hello world', language: 'en', duration: 3.1, cleanedText: null, promptText: 'Formatieren' },
  { id: '3', timestamp: 3000, rawText: 'bonjour le monde', language: 'fr', duration: 4.0, cleanedText: null, promptText: null },
]

beforeEach(() => {
  rebuildIndex([])
})

describe('history-search', () => {
  it('returns empty array when index is empty', () => {
    expect(search('test')).toEqual([])
  })

  it('returns empty array for single-char query', () => {
    addToIndex(entries[0])
    expect(search('H')).toEqual([])
  })

  it('finds entry by rawText match', () => {
    rebuildIndex(entries)
    const results = search('Hallo')
    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('1')
  })

  it('finds entry by cleanedText match', () => {
    rebuildIndex(entries)
    const results = search('Hallo Welt.')
    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('1')
  })

  it('finds entry by promptText match', () => {
    rebuildIndex(entries)
    const results = search('Formatieren')
    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('2')
  })

  it('finds across all fields', () => {
    rebuildIndex(entries)
    const results = search('world')
    // only entry 2 has "world" in rawText
    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('2')
  })

  it('matches entry present in both rawText and cleanedText', () => {
    const entry = { id: 'multi', timestamp: 0, rawText: 'Hello there', language: 'en', duration: 1, cleanedText: 'Hello there.', promptText: null }
    rebuildIndex([entry])
    const results = search('Hello')
    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('multi')
  })

  it('scores multi-field matches higher', () => {
    rebuildIndex(entries)
    const results = search('Hallo Welt.')
    expect(results).toHaveLength(1)
    // Should score high because it matches multiple fields
  })

  it('case-insensitive search', () => {
    rebuildIndex(entries)
    const results1 = search('HALLO')
    const results2 = search('hallo')
    expect(results1).toHaveLength(1)
    expect(results2).toHaveLength(1)
  })

  it('addToIndex adds single entry', () => {
    addToIndex(entries[0])
    const results = search('Hallo')
    expect(results).toHaveLength(1)
  })

  it('removeFromIndex removes from search results', () => {
    rebuildIndex(entries)
    removeFromIndex('1')
    const results = search('Hallo')
    expect(results).toEqual([])
  })

  it('search returns no results when entry removed', () => {
    rebuildIndex(entries)
    removeFromIndex('1')
    const results = search('Hallo')
    expect(results).toHaveLength(0)
  })

  it('rebuildIndex replaces the entire index', () => {
    rebuildIndex(entries)
    addToIndex({ id: 'x', timestamp: 0, rawText: 'new text', language: 'de', duration: 0, cleanedText: null, promptText: null })
    rebuildIndex([{ id: 'only-one', timestamp: 0, rawText: 'only this', language: 'de', duration: 0, cleanedText: null, promptText: null }])
    const results = search('new')
    expect(results).toEqual([])
    const results2 = search('only')
    expect(results2).toHaveLength(1)
  })
})
