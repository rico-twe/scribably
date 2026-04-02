export type RecordingState = 'idle' | 'recording' | 'error'

export interface AudioRecorderService {
  start(): Promise<void>;
  stop(): Promise<Blob>;
  getState(): RecordingState;
  getDuration(): number;
  onStateChange(callback: (state: RecordingState) => void): () => void;
}

const MAX_DURATION_MS = 5 * 60 * 1000

function getSupportedMimeType(): string {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/wav']
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type
  }
  return 'audio/webm'
}

export function createAudioRecorder(): AudioRecorderService {
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
    async start() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      chunks = []
      const mimeType = getSupportedMimeType()
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
