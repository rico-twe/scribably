import { renderHook, act } from '@testing-library/react'
import { useAudioRecorder } from './useAudioRecorder'

// Hoisted so the variable is accessible both inside vi.mock and in beforeEach
const listeners = vi.hoisted(() => new Set<(s: string) => void>())

// Mock the audio service
vi.mock('../services/audio', () => {
  return {
    createAudioRecorder: () => ({
      start: vi.fn().mockImplementation(async () => {
        listeners.forEach(cb => cb('recording'))
      }),
      stop: vi.fn().mockImplementation(async () => {
        listeners.forEach(cb => cb('idle'))
        return new Blob(['audio'])
      }),
      getState: vi.fn().mockReturnValue('idle'),
      getDuration: vi.fn().mockReturnValue(0),
      onStateChange: vi.fn().mockImplementation((cb: (s: string) => void) => {
        listeners.add(cb)
        return () => listeners.delete(cb)
      }),
    }),
  }
})

describe('useAudioRecorder', () => {
  beforeEach(() => {
    listeners.clear()
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

  it('maxDurationReached is false initially', () => {
    const { result } = renderHook(() => useAudioRecorder())
    expect(result.current.maxDurationReached).toBe(false)
  })

  describe('without maxDurationMs', () => {
    it('does not auto-stop after 1000 ms', async () => {
      vi.useFakeTimers()
      const { result } = renderHook(() => useAudioRecorder())

      await act(async () => {
        await result.current.startRecording()
      })

      expect(result.current.state).toBe('recording')

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current.state).toBe('recording')
      expect(result.current.maxDurationReached).toBe(false)

      vi.useRealTimers()
    })
  })

  describe('with maxDurationMs', () => {
    it('auto-stops after maxDurationMs and sets maxDurationReached', async () => {
      vi.useFakeTimers()
      const { result } = renderHook(() => useAudioRecorder({ maxDurationMs: 1000 }))

      await act(async () => {
        await result.current.startRecording()
      })

      expect(result.current.state).toBe('recording')
      expect(result.current.maxDurationReached).toBe(false)

      await act(async () => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current.maxDurationReached).toBe(true)
      expect(result.current.state).toBe('idle')

      vi.useRealTimers()
    })

    it('resets maxDurationReached on next startRecording', async () => {
      vi.useFakeTimers()
      const { result } = renderHook(() => useAudioRecorder({ maxDurationMs: 500 }))

      await act(async () => {
        await result.current.startRecording()
      })

      await act(async () => {
        vi.advanceTimersByTime(500)
      })

      expect(result.current.maxDurationReached).toBe(true)

      await act(async () => {
        await result.current.startRecording()
      })

      expect(result.current.maxDurationReached).toBe(false)

      vi.useRealTimers()
    })
  })
})
