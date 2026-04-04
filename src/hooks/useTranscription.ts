import { useState, useCallback } from 'react'
import type { TranscriptionResult } from '../providers/transcription/types'
import { getTranscriptionProvider } from '../providers/transcription/registry'

export type TranscriptionState = 'idle' | 'transcribing' | 'done' | 'error'

export function useTranscription() {
  const [state, setState] = useState<TranscriptionState>('idle')
  const [result, setResult] = useState<TranscriptionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const transcribe = useCallback(async (audio: Blob, providerId: string, language: string) => {
    const provider = getTranscriptionProvider(providerId)
    if (!provider) {
      console.error('[WP:transcribe] Provider not found:', providerId)
      setError(`Provider "${providerId}" not found`)
      setState('error')
      return
    }
    console.log('[WP:transcribe] Starting transcription via', providerId, '| language:', language, '| size:', audio.size)
    setState('transcribing')
    setError(null)
    try {
      const r = await provider.transcribe(audio, { language })
      console.log('[WP:transcribe] Done | text length:', r.text.length, '| duration:', r.duration)
      setResult(r)
      setState('done')
    } catch (err) {
      console.error('[WP:transcribe] Error:', err)
      setError(err instanceof Error ? err.message : 'Transcription failed')
      setState('error')
    }
  }, [])

  return { state, result, error, transcribe }
}
