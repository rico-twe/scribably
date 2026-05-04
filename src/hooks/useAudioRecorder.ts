import { useState, useRef, useCallback, useEffect } from 'react'
import { createAudioRecorder, type RecordingState, type AudioRecorderService } from '../services/audio'

const SILENCE_THRESHOLD = 0.02
const SILENCE_DURATION_MS = 5000
const CLIPPING_THRESHOLD = 0.98
const CLIPPING_FRAMES = 2

interface UseAudioRecorderOptions {
  deviceId?: string
  maxDurationMs?: number
}

export function useAudioRecorder(options?: UseAudioRecorderOptions) {
  const deviceId = options?.deviceId
  const maxDurationMs = options?.maxDurationMs
  const [state, setState] = useState<RecordingState>('idle')
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [level, setLevel] = useState(0)
  const [peak, setPeak] = useState(0)
  const [isClipping, setIsClipping] = useState(false)
  const [isSilent, setIsSilent] = useState(false)
  const [maxDurationReached, setMaxDurationReached] = useState(false)
  const recorderRef = useRef<AudioRecorderService | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const rafRef = useRef<number | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const clippingFramesRef = useRef(0)
  const silentSinceRef = useRef<number | null>(null)

  const stopRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const startLevelLoop = useCallback((recorder: AudioRecorderService) => {
    const buffer = new Uint8Array(2048)

    function tick() {
      const analyser = recorder.getAnalyser()
      if (!analyser) return

      analyser.getByteTimeDomainData(buffer)

      let sumSq = 0
      let maxAbs = 0
      for (let i = 0; i < buffer.length; i++) {
        const v = (buffer[i] - 128) / 128
        sumSq += v * v
        if (Math.abs(v) > maxAbs) maxAbs = Math.abs(v)
      }
      const rms = Math.sqrt(sumSq / buffer.length)

      setLevel(rms)
      setPeak(maxAbs)

      if (maxAbs >= CLIPPING_THRESHOLD) {
        clippingFramesRef.current += 1
        if (clippingFramesRef.current >= CLIPPING_FRAMES) setIsClipping(true)
      } else {
        clippingFramesRef.current = 0
        setIsClipping(false)
      }

      const now = Date.now()
      if (rms >= SILENCE_THRESHOLD) {
        silentSinceRef.current = null
        setIsSilent(false)
      } else {
        if (silentSinceRef.current === null) silentSinceRef.current = now
        if (now - silentSinceRef.current > SILENCE_DURATION_MS) setIsSilent(true)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const stopRecording = useCallback(async () => {
    stopRaf()
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null }
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    if (!recorderRef.current) return
    try {
      const blob = await recorderRef.current.stop()
      setAudioBlob(blob)
      setDuration(0)
      setLevel(0)
      setPeak(0)
      setIsClipping(false)
      setIsSilent(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Stop failed')
    }
  }, [stopRaf])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      setWarning(null)
      setAudioBlob(null)
      setMaxDurationReached(false)
      setLevel(0)
      setPeak(0)
      setIsClipping(false)
      setIsSilent(false)
      clippingFramesRef.current = 0
      silentSinceRef.current = null
      const recorder = createAudioRecorder({ deviceId })
      recorderRef.current = recorder
      recorder.onStateChange(setState)
      await recorder.start()
      if (recorder.usedFallback) {
        setWarning('Selected microphone not available. Using default.')
      }
      startLevelLoop(recorder)
      intervalRef.current = setInterval(() => {
        setDuration(recorder.getDuration())
      }, 100)
      if (maxDurationMs) {
        timeoutRef.current = setTimeout(() => {
          setMaxDurationReached(true)
          stopRecording()
        }, maxDurationMs)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Recording failed')
      setState('error')
    }
  }, [deviceId, maxDurationMs, startLevelLoop, stopRecording])

  useEffect(() => {
    return () => {
      stopRaf()
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [stopRaf])

  return { state, duration, audioBlob, error, warning, level, peak, isClipping, isSilent, maxDurationReached, startRecording, stopRecording }
}
