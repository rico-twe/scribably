import { renderHook } from '@testing-library/react'
import { useAudioRecorder } from './useAudioRecorder'

// Mock the audio service
vi.mock('../services/audio', () => {
  const listeners = new Set<(s: string) => void>()
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
  it('starts in idle state', () => {
    const { result } = renderHook(() => useAudioRecorder())
    expect(result.current.state).toBe('idle')
  })

  it('provides startRecording and stopRecording functions', () => {
    const { result } = renderHook(() => useAudioRecorder())
    expect(typeof result.current.startRecording).toBe('function')
    expect(typeof result.current.stopRecording).toBe('function')
  })
})
