import { renderHook, act } from '@testing-library/react'
import { useAudioRecorder } from './useAudioRecorder'

const mockStart = vi.fn()
const mockStop = vi.fn().mockResolvedValue(new Blob(['audio']))
const mockGetDuration = vi.fn().mockReturnValue(0)
const mockOnStateChange = vi.fn().mockImplementation((_cb: (s: string) => void) => {
  return () => {}
})
const mockCreateAudioRecorder = vi.fn()

let mockUsedFallback = false

vi.mock('../services/audio', () => ({
  createAudioRecorder: (...args: any[]) => {
    mockCreateAudioRecorder(...args)
    return {
      start: mockStart.mockImplementation(async () => {}),
      stop: mockStop,
      getState: vi.fn().mockReturnValue('idle'),
      getDuration: mockGetDuration,
      onStateChange: mockOnStateChange,
      get usedFallback() { return mockUsedFallback },
    }
  },
}))

describe('useAudioRecorder', () => {
  beforeEach(() => {
    mockUsedFallback = false
    vi.clearAllMocks()
    mockStop.mockResolvedValue(new Blob(['audio']))
  })

  it('starts in idle state', () => {
    const { result } = renderHook(() => useAudioRecorder())
    expect(result.current.state).toBe('idle')
  })

  it('provides startRecording and stopRecording functions', () => {
    const { result } = renderHook(() => useAudioRecorder())
    expect(typeof result.current.startRecording).toBe('function')
    expect(typeof result.current.stopRecording).toBe('function')
  })

  it('passes deviceId to createAudioRecorder', async () => {
    const { result } = renderHook(() => useAudioRecorder('mic-1'))
    await act(() => result.current.startRecording())
    expect(mockCreateAudioRecorder).toHaveBeenCalledWith({ deviceId: 'mic-1' })
  })

  it('passes undefined deviceId when no arg given', async () => {
    const { result } = renderHook(() => useAudioRecorder())
    await act(() => result.current.startRecording())
    expect(mockCreateAudioRecorder).toHaveBeenCalledWith({ deviceId: undefined })
  })

  it('sets warning when recorder used fallback', async () => {
    mockUsedFallback = true
    const { result } = renderHook(() => useAudioRecorder('missing-mic'))
    await act(() => result.current.startRecording())
    expect(result.current.warning).toBeTruthy()
    expect(result.current.warning).toMatch(/not available/i)
  })

  it('warning is null when no fallback used', async () => {
    mockUsedFallback = false
    const { result } = renderHook(() => useAudioRecorder('mic-1'))
    await act(() => result.current.startRecording())
    expect(result.current.warning).toBeNull()
  })
})
