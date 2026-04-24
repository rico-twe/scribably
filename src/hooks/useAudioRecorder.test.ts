import { renderHook, act } from '@testing-library/react'
import { useAudioRecorder } from './useAudioRecorder'

const mockGetByteTimeDomainData = vi.fn().mockImplementation((buf: Uint8Array) => {
  buf.fill(128)
})
const mockAnalyser = { getByteTimeDomainData: mockGetByteTimeDomainData }
let mockAnalyserEnabled = false

vi.mock('../services/audio', () => ({
  createAudioRecorder: () => ({
    start: vi.fn().mockResolvedValue(undefined),
    stop: vi.fn().mockResolvedValue(new Blob(['audio'])),
    getState: vi.fn().mockReturnValue('idle'),
    getDuration: vi.fn().mockReturnValue(0),
    onStateChange: vi.fn().mockReturnValue(() => {}),
    getAnalyser: vi.fn().mockImplementation(() => mockAnalyserEnabled ? mockAnalyser : null),
  }),
}))

beforeEach(() => {
  mockAnalyserEnabled = false
  mockGetByteTimeDomainData.mockImplementation((buf: Uint8Array) => buf.fill(128))
  vi.clearAllMocks()
})

describe('useAudioRecorder', () => {
  it('starts in idle state', () => {
    const { result } = renderHook(() => useAudioRecorder())
    expect(result.current.state).toBe('idle')
  })

  it('provides startRecording and stopRecording functions', () => {
    const { result } = renderHook(() => useAudioRecorder())
    expect(typeof result.current.startRecording).toBe('function')
    expect(typeof result.current.stopRecording).toBe('function')
  })

  it('exposes level, peak, isClipping, isSilent', () => {
    const { result } = renderHook(() => useAudioRecorder())
    expect(typeof result.current.level).toBe('number')
    expect(typeof result.current.peak).toBe('number')
    expect(typeof result.current.isClipping).toBe('boolean')
    expect(typeof result.current.isSilent).toBe('boolean')
  })

  it('level is 0 before recording starts', () => {
    const { result } = renderHook(() => useAudioRecorder())
    expect(result.current.level).toBe(0)
    expect(result.current.isClipping).toBe(false)
    expect(result.current.isSilent).toBe(false)
  })

  it('detects clipping when peak reaches threshold', async () => {
    mockAnalyserEnabled = true
    mockGetByteTimeDomainData.mockImplementation((buf: Uint8Array) => buf.fill(255))

    const { result } = renderHook(() => useAudioRecorder())
    await act(() => result.current.startRecording())

    await act(async () => {
      await new Promise(r => setTimeout(r, 50))
    })

    expect(result.current.isClipping).toBe(true)
  })
})
