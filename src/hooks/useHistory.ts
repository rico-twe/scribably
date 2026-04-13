import { useState, useCallback, useMemo } from 'react'
import { loadHistory, saveHistory } from '../services/history'
import type { HistoryEntry } from '../services/history'

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>(loadHistory)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const addEntry = useCallback((data: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    const entry: HistoryEntry = { ...data, id: crypto.randomUUID(), timestamp: Date.now() }
    setEntries(prev => {
      const next = [entry, ...prev].slice(0, 10)
      saveHistory(next)
      return next
    })
    return entry.id
  }, [])

  const updateLatest = useCallback((updates: Partial<Pick<HistoryEntry, 'cleanedText' | 'promptText'>>) => {
    setEntries(prev => {
      if (prev.length === 0) return prev
      const next = [{ ...prev[0], ...updates }, ...prev.slice(1)]
      saveHistory(next)
      return next
    })
  }, [])

  const selectEntry = useCallback((id: string | null) => {
    setSelectedId(id)
  }, [])

  const selectedEntry = useMemo(
    () => entries.find(e => e.id === selectedId) ?? null,
    [entries, selectedId]
  )

  return { entries, addEntry, updateLatest, selectedEntry, selectEntry }
}
