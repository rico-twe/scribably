import { trimAudioToMaxDuration } from './audio-trim'

// Niedrige Samplerate (100 Hz) für schnelle Tests — kein echtes Audio
function makeAudioBuffer(duration: number, sampleRate = 100): AudioBuffer {
  const length = Math.floor(duration * sampleRate)
  return {
    duration,
    sampleRate,
    numberOfChannels: 1,
    length,
    getChannelData: () => new Float32Array(length),
  } as unknown as AudioBuffer
}

describe('trimAudioToMaxDuration', () => {
  const mockDecodeAudioData = vi.fn()
  const mockClose = vi.fn().mockResolvedValue(undefined)

  const MockAudioContext = vi.fn(function (this: unknown) {
    ;(this as Record<string, unknown>).decodeAudioData = mockDecodeAudioData
    ;(this as Record<string, unknown>).close = mockClose
  })
  vi.stubGlobal('AudioContext', MockAudioContext)

  const mockStartRendering = vi.fn()
  const MockOfflineAudioContext = vi.fn(function (this: unknown, _opts: unknown) {
    ;(this as Record<string, unknown>).destination = {}
    ;(this as Record<string, unknown>).startRendering = mockStartRendering
    ;(this as Record<string, unknown>).createBufferSource = vi.fn(() => ({
      buffer: null,
      connect: vi.fn(),
      start: vi.fn(),
    }))
  })
  vi.stubGlobal('OfflineAudioContext', MockOfflineAudioContext)

  beforeEach(() => {
    mockDecodeAudioData.mockReset()
    mockStartRendering.mockReset()
    MockOfflineAudioContext.mockClear()
  })

  it('gibt das Original-File zurück, wenn die Audiodauer ≤ maxSeconds ist', async () => {
    mockDecodeAudioData.mockImplementation((_buf: ArrayBuffer, resolve: (b: AudioBuffer) => void) =>
      resolve(makeAudioBuffer(5)),
    )

    const file = new File([new Uint8Array(100)], 'short.mp3', { type: 'audio/mpeg' })
    const result = await trimAudioToMaxDuration(file, 30)

    expect(result).toBe(file)
    expect(MockOfflineAudioContext).not.toHaveBeenCalled()
  })

  it('gibt einen WAV-Blob zurück, wenn die Audiodauer > maxSeconds ist', async () => {
    mockDecodeAudioData.mockImplementation((_buf: ArrayBuffer, resolve: (b: AudioBuffer) => void) =>
      resolve(makeAudioBuffer(60)),
    )
    mockStartRendering.mockResolvedValue(makeAudioBuffer(30))

    const file = new File([new Uint8Array(100)], 'long.mp3', { type: 'audio/mpeg' })
    const result = await trimAudioToMaxDuration(file, 30)

    expect(result).toBeInstanceOf(Blob)
    expect((result as Blob).type).toBe('audio/wav')
  })

  it('der zurückgegebene WAV-Blob ist größer als der 44-Byte-Header', async () => {
    mockDecodeAudioData.mockImplementation((_buf: ArrayBuffer, resolve: (b: AudioBuffer) => void) =>
      resolve(makeAudioBuffer(60)),
    )
    mockStartRendering.mockResolvedValue(makeAudioBuffer(30))

    const file = new File([new Uint8Array(100)], 'long.mp3', { type: 'audio/mpeg' })
    const result = await trimAudioToMaxDuration(file, 30)

    expect((result as Blob).size).toBeGreaterThan(44)
  })
})
