import { createAudioRecorder, listAudioInputDevices } from './audio'

class MockMediaRecorder {
  state = 'inactive' as 'inactive' | 'recording'
  ondataavailable: ((e: { data: Blob }) => void) | null = null
  onstop: (() => void) | null = null
  onerror: (() => void) | null = null
  mimeType = 'audio/webm'
  stream: { getTracks: () => { stop: () => void }[] }

  constructor(stream: { getTracks: () => { stop: () => void }[] }) {
    this.stream = stream
  }
  start() { this.state = 'recording' }
  stop() {
    this.state = 'inactive'
    this.ondataavailable?.({ data: new Blob(['audio-data']) })
    this.onstop?.()
  }
  static isTypeSupported(type: string) { return type === 'audio/webm' }
}

const mockGetUserMedia = vi.fn().mockResolvedValue({
  getTracks: () => [{ stop: vi.fn() }],
})

const mockClose = vi.fn().mockResolvedValue(undefined)
const mockConnectAnalyser = vi.fn()
const mockGetByteTimeDomainData = vi.fn()
const mockAnalyser = {
  fftSize: 0 as number,
  smoothingTimeConstant: 0 as number,
  getByteTimeDomainData: mockGetByteTimeDomainData,
}

class MockAudioContext {
  createAnalyser() { return mockAnalyser }
  createMediaStreamSource() { return { connect: mockConnectAnalyser } }
  close = mockClose
}

beforeAll(() => {
  Object.assign(globalThis, {
    MediaRecorder: MockMediaRecorder,
    AudioContext: MockAudioContext,
  })
  Object.defineProperty(globalThis.navigator, 'mediaDevices', {
    value: {
      getUserMedia: mockGetUserMedia,
      enumerateDevices: vi.fn().mockResolvedValue([
        { kind: 'audioinput', deviceId: 'mic-1', label: 'Built-in Mic' },
        { kind: 'audioinput', deviceId: 'mic-2', label: 'USB Mic' },
        { kind: 'videoinput', deviceId: 'cam-1', label: 'Webcam' },
        { kind: 'audiooutput', deviceId: 'spk-1', label: 'Speaker' },
      ]),
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

describe('AnalyserNode integration', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('getAnalyser returns null before start', () => {
    const recorder = createAudioRecorder()
    expect(recorder.getAnalyser()).toBeNull()
  })

  it('creates AudioContext and AnalyserNode on start', async () => {
    const recorder = createAudioRecorder()
    await recorder.start()
    expect(recorder.getAnalyser()).toBe(mockAnalyser)
    await recorder.stop()
  })

  it('closes AudioContext on stop', async () => {
    const recorder = createAudioRecorder()
    await recorder.start()
    await recorder.stop()
    expect(mockClose).toHaveBeenCalledOnce()
  })

  it('getAnalyser returns null after stop', async () => {
    const recorder = createAudioRecorder()
    await recorder.start()
    await recorder.stop()
    expect(recorder.getAnalyser()).toBeNull()
  })
})

describe('deviceId support', () => {
  beforeEach(() => { mockGetUserMedia.mockClear() })

  it('passes exact deviceId constraint to getUserMedia', async () => {
    const recorder = createAudioRecorder({ deviceId: 'mic-1' })
    await recorder.start()
    expect(mockGetUserMedia).toHaveBeenCalledWith({
      audio: { deviceId: { exact: 'mic-1' } },
    })
    await recorder.stop()
  })

  it('falls back to default mic on OverconstrainedError', async () => {
    const err = Object.assign(new Error('Overconstrained'), { name: 'OverconstrainedError' })
    mockGetUserMedia
      .mockRejectedValueOnce(err)
      .mockResolvedValueOnce({ getTracks: () => [{ stop: vi.fn() }] })
    const recorder = createAudioRecorder({ deviceId: 'missing-mic' })
    await recorder.start()
    expect(recorder.usedFallback).toBe(true)
    expect(mockGetUserMedia).toHaveBeenCalledTimes(2)
    expect(mockGetUserMedia).toHaveBeenLastCalledWith({ audio: true })
    await recorder.stop()
  })
})

describe('listAudioInputDevices', () => {
  it('returns only audioinput devices', async () => {
    const devices = await listAudioInputDevices()
    expect(devices).toHaveLength(2)
    expect(devices.every(d => d.deviceId && d.label)).toBe(true)
    expect(devices.map(d => d.deviceId)).toEqual(['mic-1', 'mic-2'])
  })
})
