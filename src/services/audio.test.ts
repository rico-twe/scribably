import { createAudioRecorder } from './audio'

class MockMediaRecorder {
  state = 'inactive' as 'inactive' | 'recording'
  ondataavailable: ((e: { data: Blob }) => void) | null = null
  onstop: (() => void) | null = null
  onerror: (() => void) | null = null
  mimeType = 'audio/webm'
  stream: { getTracks: () => { stop: () => void }[] }

  constructor(stream: MediaStream) {
    this.stream = stream as any
  }
  start() { this.state = 'recording' }
  stop() {
    this.state = 'inactive'
    this.ondataavailable?.({ data: new Blob(['audio-data']) })
    this.onstop?.()
  }
  static isTypeSupported(type: string) { return type === 'audio/webm' }
}

beforeAll(() => {
  (globalThis as any).MediaRecorder = MockMediaRecorder
  Object.defineProperty(globalThis.navigator, 'mediaDevices', {
    value: {
      getUserMedia: vi.fn().mockResolvedValue({
        getTracks: () => [{ stop: vi.fn() }],
      }),
    },
    writable: true,
  })
})

describe('AudioRecorderService', () => {
  it('starts in idle state', () => {
    const recorder = createAudioRecorder()
    expect(recorder.getState()).toBe('idle')
  })

  it('transitions to recording on start', async () => {
    const recorder = createAudioRecorder()
    await recorder.start()
    expect(recorder.getState()).toBe('recording')
  })

  it('returns blob on stop', async () => {
    const recorder = createAudioRecorder()
    await recorder.start()
    const blob = await recorder.stop()
    expect(blob).toBeInstanceOf(Blob)
  })

  it('transitions back to idle on stop', async () => {
    const recorder = createAudioRecorder()
    await recorder.start()
    await recorder.stop()
    expect(recorder.getState()).toBe('idle')
  })

  it('calls state change listeners', async () => {
    const recorder = createAudioRecorder()
    const states: string[] = []
    recorder.onStateChange((s) => states.push(s))
    await recorder.start()
    await recorder.stop()
    expect(states).toEqual(['recording', 'idle'])
  })

  it('rejects stop when not recording', async () => {
    const recorder = createAudioRecorder()
    await expect(recorder.stop()).rejects.toThrow('No active recording')
  })
})
