import type { HistoryEntry } from './history'
import { Index } from 'flexsearch'

// Single combined search index: id -> combined text
const searchIndex = new Index({ tokenize: 'full', cache: true })
// Reverse index: id -> HistoryEntry
const entriesMap = new Map<string, HistoryEntry>()

function indexEntry(entry: HistoryEntry): void {
  const parts = [entry.rawText, entry.cleanedText, entry.promptText].filter(Boolean)
  const text = parts.join(' ')
  if (text) {
    searchIndex.add(entry.id, text)
  }
  entriesMap.set(entry.id, entry)
}

function unindexEntry(id: string): void {
  searchIndex.remove(id)
  entriesMap.delete(id)
}

/**
 * Search across all stored entries. Returns entries matching the query,
 * ordered by how many fields matched (most relevant first).
 */
export function search(query: string): HistoryEntry[] {
  if (!query || query.trim().length < 2) return []
  const trimmed = query.trim()
  const ids = searchIndex.search(trimmed) as string[]
  if (ids.length === 0) return []

  // Score: count how many fields contain the query
  const scored = ids.map(id => {
    const entry = entriesMap.get(id)
    if (!entry) return null
    const text = entry.rawText.toLowerCase()
    const cleaned = (entry.cleanedText ?? '').toLowerCase()
    const prompt = (entry.promptText ?? '').toLowerCase()
    let score = 0
    if (text.includes(trimmed.toLowerCase())) score++
    if (cleaned.includes(trimmed.toLowerCase())) score++
    if (prompt.includes(trimmed.toLowerCase())) score++
    return { entry, score }
  }).filter((s): s is { entry: HistoryEntry; score: number } => s !== null && s.score > 0)

  scored.sort((a, b) => b.score - a.score)
  return scored.map(s => s.entry)
}

/** Add an entry to the search index. */
export function addToIndex(entry: HistoryEntry): void {
  indexEntry(entry)
}

/** Remove an entry from the search index. */
export function removeFromIndex(id: string): void {
  unindexEntry(id)
}

/** Build the index from an array of entries (e.g. after migration). */
export function rebuildIndex(entries: HistoryEntry[]): void {
  searchIndex.clear()
  entriesMap.clear()
  for (const entry of entries) {
    indexEntry(entry)
  }
}
