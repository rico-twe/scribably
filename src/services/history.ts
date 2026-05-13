import { getAll, batchPut, clear, del, count } from './indexeddb'

export interface HistoryEntry {
  id: string
  timestamp: number
  rawText: string
  language: string
  duration: number
  cleanedText: string | null
  promptText: string | null
}

export async function loadHistory(): Promise<HistoryEntry[]> {
  try {
    return (await getAll<HistoryEntry>()).sort((a, b) => b.timestamp - a.timestamp)
  } catch {
    return []
  }
}

export async function saveHistory(entries: HistoryEntry[]): Promise<void> {
  await batchPut(entries)
}

export async function clearHistory(): Promise<void> {
  await clear()
}

export async function deleteEntry(id: string): Promise<void> {
  await del(id)
}

export async function count(): Promise<number> {
  return count()
}
