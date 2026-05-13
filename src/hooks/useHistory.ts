import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { loadHistory, saveHistory, clearHistory as delAll, deleteEntry } from '../services/history'
import { removeFromIndex, rebuildIndex } from '../services/history-search'
import { migrateFromLocalStorage } from '../services/history-indexeddb'
import type { HistoryEntry } from '../services/history'

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const loadedRef = useRef(false)

  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true

    let cancelled = false
    ;(async () => {
      try {
        const migrated = await migrateFromLocalStorage()
        if (migrated > 0) {
          console.log(`[WP:history] Migrated ${migrated} entries from localStorage`)
        }

        const history = await loadHistory()
        if (!cancelled) {
          setEntries(history)
          rebuildIndex(history)
        }
      } catch (err) {
        console.error('[WP:history] Failed to load history:', err)
      }
    })()

    return () => { cancelled = true }
  }, [])

  const persist = useCallback(async (next: HistoryEntry[]) => {
    try {
      await saveHistory(next)
      rebuildIndex(next)
    } catch (err) {
      console.error('[WP:history] Failed to persist:', err)
    }
  }, [])

  const addEntry = useCallback((data: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    const entry: HistoryEntry = { ...data, id: crypto.randomUUID(), timestamp: Date.now() }
    setEntries(prev => {
      const next = [entry, ...prev]
      persist(next)
      return next
    })
    return entry.id
  }, [persist])

  const updateLatest = useCallback((updates: Partial<Pick<HistoryEntry, 'cleanedText' | 'promptText'>>) => {
    setEntries(prev => {
      if (prev.length === 0) return prev
      const next = [{ ...prev[0], ...updates }, ...prev.slice(1)]
      persist(next)
      return next
    })
  }, [persist])

  const selectEntry = useCallback((id: string | null) => {
    setSelectedId(id)
  }, [])

  const clearHistoryCb = useCallback(async () => {
    setEntries([])
    setSelectedId(null)
    await delAll()
  }, [])

  const removeEntry = useCallback(async (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id))
    removeFromIndex(id)
    await deleteEntry(id)
  }, [])

  const selectedEntry = useMemo(
    () => entries.find(e => e.id === selectedId) ?? null,
    [entries, selectedId]
  )

  return { entries, addEntry, updateLatest, selectedEntry, selectEntry, clearHistory: clearHistoryCb, removeEntry, historyCount: entries.length, hasHistory: entries.length > 0 }
}
