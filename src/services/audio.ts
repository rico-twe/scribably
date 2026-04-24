export type RecordingState = 'idle' | 'recording' | 'error'

export interface AudioRecorderService {
  start(): Promise<void>;
  stop(): Promise<Blob>;
  getState(): RecordingState;
  getDuration(): number;
  onStateChange(callback: (state: RecordingState) => void): () => void;
  usedFallback: boolean;
}

const MAX_DURATION_MS = 5 * 60 * 1000

function getSupportedMimeType(): string {
  if (typeof MediaRecorder === 'undefined') {
    throw new Error('Audio recording is not supported in this browser.')
  }
  const types = ['audio/mp4', 'audio/aac', 'audio/webm;codecs=opus', 'audio/webm', 'audio/wav']
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type
  }
  throw new Error('No supported audio format found in this browser.')
}

function getMediaStream(deviceId?: string): Promise<MediaStream> {
  const constraints: MediaStreamConstraints = {
    audio: deviceId ? { deviceId: { exact: deviceId } } : true,
  }
  if (navigator.mediaDevices?.getUserMedia) {
    return navigator.mediaDevices.getUserMedia(constraints)
  }
  const legacyGetUserMedia =
    (navigator as any).getUserMedia ||
    (navigator as any).webkitGetUserMedia ||
    (navigator as any).mozGetUserMedia
  if (legacyGetUserMedia) {
    return new Promise((resolve, reject) => {
      legacyGetUserMedia.call(navigator, constraints, resolve, reject)
    })
  }
  throw new Error('Microphone access is not available in this browser.')
}

export async function listAudioInputDevices(): Promise<{ deviceId: string; label: string }[]> {
  const devices = await navigator.mediaDevices.enumerateDevices()
  return devices
    .filter(d => d.kind === 'audioinput')
    .map(d => ({ deviceId: d.deviceId, label: d.label || d.deviceId }))
}

export function createAudioRecorder(opts?: { deviceId?: string }): AudioRecorderService {
  let state: RecordingState = 'idle'
  let mediaRecorder: MediaRecorder | null = null
  let chunks: Blob[] = []
  let startTime = 0
  let timeout: ReturnType<typeof setTimeout> | null = null
  const listeners = new Set<(state: RecordingState) => void>()

  function setState(newState: RecordingState) {
    state = newState
    listeners.forEach(cb => cb(newState))
  }

  const service: AudioRecorderService = {
    usedFallback: false,

    async start() {
      const mimeType = getSupportedMimeType()
      let stream: MediaStream
      const deviceId = opts?.deviceId
      if (deviceId) {
        try {
          stream = await getMediaStream(deviceId)
        } catch (err) {
          const name = err instanceof Error ? err.name : ''
          if (name === 'OverconstrainedError' || name === 'NotFoundError') {
            service.usedFallback = true
            stream = await getMediaStream()
          } else {
            throw err
          }
        }
      } else {
        stream = await getMediaStream()
      }
      chunks = []
      mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }
      mediaRecorder.onerror = () => setState('error')
      mediaRecorder.start()
      startTime = Date.now()
      setState('recording')
      timeout = setTimeout(() => { service.stop() }, MAX_DURATION_MS)
    },

    async stop(): Promise<Blob> {
      return new Promise((resolve, reject) => {
        if (!mediaRecorder || mediaRecorder.state === 'inactive') {
          reject(new Error('No active recording'))
          return
        }
        if (timeout) { clearTimeout(timeout); timeout = null }
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: mediaRecorder!.mimeType })
          mediaRecorder!.stream.getTracks().forEach(t => t.stop())
          setState('idle')
          resolve(blob)
        }
        mediaRecorder.stop()
      })
    },

    getState() { return state },
    getDuration() { return state === 'recording' ? (Date.now() - startTime) / 1000 : 0 },
    onStateChange(callback) {
      listeners.add(callback)
      return () => listeners.delete(callback)
    },
  }

  return service
}
