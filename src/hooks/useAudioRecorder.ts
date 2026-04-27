import { useState, useRef, useCallback, useEffect } from 'react'
import { createAudioRecorder, type RecordingState, type AudioRecorderService } from '../services/audio'

interface UseAudioRecorderOptions {
  maxDurationMs?: number
}

export function useAudioRecorder(options?: UseAudioRecorderOptions) {
  const [state, setState] = useState<RecordingState>('idle')
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [maxDurationReached, setMaxDurationReached] = useState(false)
  const recorderRef = useRef<AudioRecorderService | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const stopRecording = useCallback(async () => {
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null }
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    if (!recorderRef.current) return
    try {
      const blob = await recorderRef.current.stop()
      setAudioBlob(blob)
      setDuration(0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Stop failed')
    }
  }, [])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      setAudioBlob(null)
      setMaxDurationReached(false)
      const recorder = createAudioRecorder()
      recorderRef.current = recorder
      recorder.onStateChange(setState)
      await recorder.start()
      intervalRef.current = setInterval(() => {
        setDuration(recorder.getDuration())
      }, 100)
      if (options?.maxDurationMs) {
        timeoutRef.current = setTimeout(() => {
          setMaxDurationReached(true)
          stopRecording()
        }, options.maxDurationMs)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Recording failed')
      setState('error')
    }
  }, [options?.maxDurationMs, stopRecording])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return { state, duration, audioBlob, error, maxDurationReached, startRecording, stopRecording }
}
