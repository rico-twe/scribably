import { useState, useCallback } from 'react'
import type { TranscriptionResult, Segment } from '../providers/transcription/types'
import { getTranscriptionProvider } from '../providers/transcription/registry'
import { chunkAudio, type AudioChunk } from '../services/audio-chunking'
import type { TranscriptionProvider } from '../providers/transcription/types'

export type TranscriptionState = 'idle' | 'transcribing' | 'done' | 'error'

interface UseTranscriptionResult extends TranscriptionResult {
  _chunks?: number
}

export function useTranscription() {
  const [state, setState] = useState<TranscriptionState>('idle')
  const [result, setResult] = useState<UseTranscriptionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [chunksUsed, setChunksUsed] = useState(0)

  const transcribe = useCallback(async (audio: Blob, providerId: string, language: string) => {
    const provider = getTranscriptionProvider(providerId)
    if (!provider) {
      console.error('[WP:transcribe] Provider not found:', providerId)
      setError(`Provider "${providerId}" not found`)
      setState('error')
      return
    }

    const isLarge = audio.size > 20 * 1024 * 1024
    if (isLarge) {
      console.log('[WP:transcribe] Large audio detected', audio.size, 'bytes — chunking')
      setState('transcribing')
      setError(null)
      try {
        const { chunks, wasChunked } = await chunkAudio(audio)
        let merged: TranscriptionResult
        if (wasChunked) {
          merged = await transcribeChunks(chunks, provider, language)
        } else {
          const single = await provider.transcribe(chunks[0].blob, { language })
          merged = {
            ...single,
            segments: single.segments?.map(seg => ({
              ...seg,
              start: seg.start + chunks[0].startTime,
              end: seg.end + chunks[0].startTime,
            })),
          }
          setChunksUsed(1)
          setResult({ ...merged, _chunks: 1 })
          setState('done')
          return
        }
        setChunksUsed(chunks.length)
        console.log('[WP:transcribe] Done | merged via', chunks.length, 'chunks | text:', merged.text.substring(0, 100))
        setResult({ ...merged, _chunks: chunks.length })
        setState('done')
      } catch (err) {
        console.error('[WP:transcribe] Chunking failed:', err)
        setError(err instanceof Error ? err.message : 'Chunked transcription failed')
        setState('error')
      }
      return
    }

    console.log('[WP:transcribe] Starting transcription via', providerId, '| language:', language, '| size:', audio.size)
    setState('transcribing')
    setError(null)
    setChunksUsed(0)
    try {
      const r = await provider.transcribe(audio, { language })
      console.log('[WP:transcribe] Done | text:', r.text.substring(0, 100))
      setResult({ ...r, _chunks: 1 })
      setState('done')
    } catch (err) {
      console.error('[WP:transcribe] Error:', err)
      setError(err instanceof Error ? err.message : 'Transcription failed')
      setState('error')
    }
  }, [])

  return { state, result, error, chunksUsed, transcribe }
}

async function transcribeChunks(
  chunks: AudioChunk[],
  provider: TranscriptionProvider,
  language: string,
): Promise<TranscriptionResult> {
  const texts: string[] = []
  const durations: number[] = []
  const segments: Segment[] = []
  let offset = 0

  for (const chunk of chunks) {
    const r = await provider.transcribe(chunk.blob, { language })
    texts.push(r.text)
    durations.push(r.duration)

    if (r.segments) {
      for (const seg of r.segments) {
        segments.push({
          ...seg,
          start: seg.start + offset,
          end: seg.end + offset,
        })
      }
    }
    offset += r.duration
  }

  return {
    text: texts.join(' '),
    language,
    duration: durations.reduce((a, b) => a + b, 0),
    segments,
  }
}
