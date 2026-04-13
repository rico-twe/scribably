export interface HistoryEntry {
  id: string
  timestamp: number
  rawText: string
  language: string
  duration: number
  cleanedText: string | null
  promptText: string | null
}

const STORAGE_KEY = 'whisperprompt-history'
const MAX_ENTRIES = 10

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.slice(0, MAX_ENTRIES) : []
  } catch {
    return []
  }
}

export function saveHistory(entries: HistoryEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)))
}
