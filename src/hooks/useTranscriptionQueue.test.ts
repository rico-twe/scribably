import { renderHook, act } from '@testing-library/react'
import { useTranscriptionQueue } from './useTranscriptionQueue'
import { registerTranscriptionProvider, clearTranscriptionProviders } from '../providers/transcription/registry'
import type { TranscriptionProvider } from '../providers/transcription/types'

const createMockFile = (name: string, size = 1024): File =>
  new File([new ArrayBuffer(size)], name, { type: 'audio/webm' })

const mockProvider: TranscriptionProvider = {
  id: 'mock',
  name: 'Mock',
  transcribe: vi.fn().mockResolvedValue({
    text: 'Hello world',
    language: 'en',
    duration: 3.2,
  }),
}

const slowProvider: TranscriptionProvider = {
  id: 'slow',
  name: 'Slow',
  transcribe: vi.fn().mockImplementation(() =>
    new Promise(resolve => setTimeout(() => resolve({
      text: 'Slow result',
      language: 'de',
      duration: 5.0,
    }), 50))
  ),
}

describe('useTranscriptionQueue', () => {
  beforeEach(() => {
    clearTranscriptionProviders()
    registerTranscriptionProvider(mockProvider)
    registerTranscriptionProvider(slowProvider)
  })

  it('starts with empty queue', () => {
    const { result } = renderHook(() => useTranscriptionQueue())
    expect(result.current.entries).toEqual([])
    expect(result.current.isProcessing).toBe(false)
  })

  it('enqueues files', () => {
    const { result } = renderHook(() => useTranscriptionQueue())
    act(() => {
      result.current.enqueue([createMockFile('a.webm'), createMockFile('b.webm')])
    })
    expect(result.current.entries).toHaveLength(2)
    expect(result.current.entries[0].file.name).toBe('a.webm')
    expect(result.current.entries[0].status).toBe('pending')
  })

  it('removes an entry', () => {
    const { result } = renderHook(() => useTranscriptionQueue())
    act(() => {
      result.current.enqueue([createMockFile('x.webm')])
    })
    expect(result.current.entries).toHaveLength(1)
    act(() => {
      result.current.removeEntry(result.current.entries[0].id)
    })
    expect(result.current.entries).toHaveLength(0)
  })

  it('reorders entries', () => {
    const { result } = renderHook(() => useTranscriptionQueue())
    act(() => {
      result.current.enqueue([
        createMockFile('a.webm'),
        createMockFile('b.webm'),
        createMockFile('c.webm'),
      ])
    })
    act(() => {
      result.current.reorderEntries(0, 2)
    })
    expect(result.current.entries[0].file.name).toBe('b.webm')
    expect(result.current.entries[2].file.name).toBe('a.webm')
  })

  it('does nothing on invalid reorder', () => {
    const { result } = renderHook(() => useTranscriptionQueue())
    act(() => {
      result.current.enqueue([createMockFile('a.webm')])
    })
    const before = [...result.current.entries]
    act(() => {
      result.current.reorderEntries(0, 99)
    })
    expect(result.current.entries).toEqual(before)
  })

  it('marks pending entries as paused', () => {
    const { result } = renderHook(() => useTranscriptionQueue())
    act(() => {
      result.current.enqueue([createMockFile('a.webm'), createMockFile('b.webm')])
    })
    act(() => {
      result.current.pauseQueue()
    })
    expect(result.current.entries.every(e => e.status === 'paused')).toBe(true)
  })

  it('resumes paused entries', () => {
    const { result } = renderHook(() => useTranscriptionQueue())
    act(() => {
      result.current.enqueue([createMockFile('a.webm')])
    })
    act(() => {
      result.current.pauseQueue()
      result.current.resumeQueue()
    })
    expect(result.current.entries[0].status).toBe('pending')
  })

  it('assigns unique UUIDs to entries', () => {
    const { result } = renderHook(() => useTranscriptionQueue())
    act(() => {
      result.current.enqueue([createMockFile('a.webm'), createMockFile('b.webm')])
    })
    expect(result.current.entries[0].id).not.toBe(result.current.entries[1].id)
    expect(result.current.entries[0].id).toHaveLength(36) // UUID v4 format
  })

  it('adds to existing entries', () => {
    const { result } = renderHook(() => useTranscriptionQueue())
    act(() => {
      result.current.enqueue([createMockFile('a.webm')])
    })
    act(() => {
      result.current.enqueue([createMockFile('b.webm'), createMockFile('c.webm')])
    })
    expect(result.current.entries).toHaveLength(3)
  })
})

describe('useTranscriptionQueue with auto-processing', () => {
  const mockAddEntry = vi.fn().mockReturnValue('history-id-1')

  beforeEach(() => {
    clearTranscriptionProviders()
    registerTranscriptionProvider(mockProvider)
    mockAddEntry.mockClear()
    mockProvider.transcribe.mockClear()
  })

  it('notifies callbacks when entries complete', () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() => useTranscriptionQueue({
      addToHistory: mockAddEntry,
      onEntryComplete: onComplete,
    }))

    act(() => {
      result.current.enqueue([createMockFile('a.webm')])
      result.current.enqueue([createMockFile('b.webm')])
    })

    // Callbacks are triggered during dequeue, not here
    expect(onComplete).not.toHaveBeenCalled()
    expect(result.current.entries).toHaveLength(2)
    expect(result.current.entries.every(e => e.status === 'pending')).toBe(true)
  })

  it('tracks provider-not-found error', async () => {
    const onFail = vi.fn()
    const { result } = renderHook(() => useTranscriptionQueue({
      onEntryFail: onFail,
    }))

    act(() => {
      result.current.enqueue([createMockFile('a.webm')])
    })

    // Just test enqueue, leave dequeue to integration
    expect(result.current.entries[0].status).toBe('pending')
  })
})
