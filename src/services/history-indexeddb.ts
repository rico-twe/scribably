import { batchPut } from './indexeddb'
import type { HistoryEntry } from './history'

export async function migrateFromLocalStorage(): Promise<number> {
  try {
    const raw = localStorage.getItem('scribably-history')
    if (!raw) return 0
    const parsed: unknown[] = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return 0
    const entries = parsed.map(item => {
      const m = item as Record<string, unknown>
      return {
        id: (m.id as string) ?? crypto.randomUUID(),
        timestamp: typeof m.timestamp === 'number' ? m.timestamp : Date.now(),
        rawText: (m.rawText as string) ?? '',
        language: (m.language as string) ?? 'de',
        duration: (m.duration as number) ?? 0,
        cleanedText: (m.cleanedText as string | null) ?? null,
        promptText: (m.promptText as string | null) ?? null,
      }
    }) as HistoryEntry[]
    await batchPut(entries)
    localStorage.removeItem('scribably-history')
    return entries.length
  } catch {
    return 0
  }
}
