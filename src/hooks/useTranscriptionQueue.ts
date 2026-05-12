import { useState, useCallback, useRef } from 'react'
import type { TranscriptionResult } from '../providers/transcription/types'
import { getTranscriptionProvider } from '../providers/transcription/registry'
import type { HistoryEntry } from '../services/history'

export type QueueEntryStatus = 'pending' | 'running' | 'done' | 'failed' | 'paused'

export interface TranscriptionQueueEntry {
  id: string
  file: File
  status: QueueEntryStatus
  result?: TranscriptionResult | null
  error?: string | null
  retryCount: number
}

interface UseTranscriptionQueueOptions {
  addToHistory?: (data: Omit<HistoryEntry, 'id' | 'timestamp'>) => string
  onEntryComplete?: (entry: TranscriptionQueueEntry, result: TranscriptionResult) => void
  onEntryFail?: (entry: TranscriptionQueueEntry, error: string) => void
  onQueueComplete?: () => void
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function jitter(baseMs: number) {
  const factor = 0.5 + Math.random() * 0.5
  return Math.round(baseMs * factor)
}

function isRateLimitError(error: Error): boolean {
  return /429|rate.?limit|too many requests/i.test(error.message)
}

export function useTranscriptionQueue(options?: UseTranscriptionQueueOptions) {
  const [entries, setEntries] = useState<TranscriptionQueueEntry[]>([])
  const processingRef = useRef(false)
  const pausedRef = useRef(false)
  const optionsRef = useRef(options)
  optionsRef.current = options

  const enqueue = useCallback((files: File[]) => {
    const newEntries: TranscriptionQueueEntry[] = files.map(file => ({
      id: crypto.randomUUID(),
      file,
      status: 'pending',
      retryCount: 0,
    }))
    setEntries(prev => [...prev, ...newEntries])
  }, [])

  const removeEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id))
  }, [])

  const reorderEntries = useCallback((from: number, to: number) => {
    setEntries(prev => {
      if (from < 0 || to < 0 || from >= prev.length || to >= prev.length) return prev
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }, [])

  const pauseQueue = useCallback(() => {
    pausedRef.current = true
    setEntries(prev =>
      prev.map(e => (e.status === 'pending' ? { ...e, status: 'paused' as const } : e))
    )
  }, [])

  const resumeQueue = useCallback(() => {
    pausedRef.current = false
    setEntries(prev =>
      prev.map(e => (e.status === 'paused' ? { ...e, status: 'pending' as const } : e))
    )
  }, [])

  const transcribeSingle = useCallback(async (
    file: File,
    providerId: string,
    language: string,
  ): Promise<TranscriptionResult> => {
    const provider = getTranscriptionProvider(providerId)
    if (!provider) {
      throw new Error(`Provider "${providerId}" not found`)
    }
    return provider.transcribe(file, { language })
  }, [])

  const runEntry = useCallback(async (
    entry: TranscriptionQueueEntry,
    providerId: string,
    language: string,
  ) => {
    const maxRetries = 3

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      if (attempt > 0) {
        await sleep(200)
        if (pausedRef.current) return
      }

      // Notify running state
      setEntries(prev =>
        prev.map(e => (e.id === entry.id ? { ...e, status: 'running' as const } : e))
      )

      try {
        const result = await transcribeSingle(entry.file, providerId, language)
        setEntries(prev =>
          prev.map(e =>
            e.id === entry.id
              ? { ...e, status: 'done' as const, result: result ?? null }
              : e
          )
        )

        if (optionsRef.current?.addToHistory) {
          optionsRef.current.addToHistory({
            rawText: result.text,
            language: result.language,
            duration: result.duration,
            cleanedText: null,
            promptText: null,
          })
        }
        optionsRef.current?.onEntryComplete?.(entry, result)
        return
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))

        if (isRateLimitError(error)) {
          if (attempt < maxRetries) {
            const backoffMs = attempt === 0
              ? 2000
              : Math.min(2000 * Math.pow(2, attempt - 1), 16000)
            const waitMs = jitter(backoffMs)
            console.log(`[WP:queue] Rate limit — retry ${attempt + 1}/${maxRetries} after ${waitMs}ms`)
            await sleep(waitMs)
            continue
          }
          // Exhausted retries
          setEntries(prev =>
            prev.map(e =>
              e.id === entry.id
                ? { ...e, status: 'failed' as const, error: error.message, retryCount: attempt + 1 }
                : e
            )
          )
          optionsRef.current?.onEntryFail?.(entry, error.message)
          return
        }

        // Non-rate-limit errors: single attempt
        setEntries(prev =>
          prev.map(e =>
            e.id === entry.id
              ? { ...e, status: 'failed' as const, error: error.message }
              : e
          )
        )
        optionsRef.current?.onEntryFail?.(entry, error.message)
        return
      }
    }
  }, [transcribeSingle])

  const dequeue = useCallback(async (providerId: string, language: string) => {
    if (processingRef.current) return
    processingRef.current = true

    while (true) {
      // Wait for pause
      while (pausedRef.current) {
        await sleep(200)
      }

      const pendingIndex = entries.findIndex(e => e.status === 'pending')
      if (pendingIndex === -1) break

      const entry = entries[pendingIndex]
      await runEntry(entry, providerId, language)
    }

    processingRef.current = false
    pausedRef.current = false
    optionsRef.current?.onQueueComplete?.()
  }, [entries, runEntry])

  return {
    entries,
    isProcessing: processingRef.current,
    isPaused: pausedRef.current,
    enqueue,
    removeEntry,
    reorderEntries,
    pauseQueue,
    resumeQueue,
    dequeue,
  }
}
