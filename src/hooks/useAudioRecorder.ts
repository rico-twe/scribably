import { useState, useRef, useCallback, useEffect } from 'react'
import { createAudioRecorder, type RecordingState, type AudioRecorderService } from '../services/audio'

export function useAudioRecorder() {
  const [state, setState] = useState<RecordingState>('idle')
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)
  const recorderRef = useRef<AudioRecorderService | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      setAudioBlob(null)
      const recorder = createAudioRecorder()
      recorderRef.current = recorder
      recorder.onStateChange(setState)
      await recorder.start()
      intervalRef.current = setInterval(() => {
        setDuration(recorder.getDuration())
      }, 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Recording failed')
      setState('error')
    }
  }, [])

  const stopRecording = useCallback(async () => {
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

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return { state, duration, audioBlob, error, startRecording, stopRecording }
}
