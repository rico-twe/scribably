import { renderHook, act } from '@testing-library/react'
import { useTranscription } from './useTranscription'
import { registerTranscriptionProvider, clearTranscriptionProviders } from '../providers/transcription/registry'
import type { TranscriptionProvider } from '../providers/transcription/types'

const mockProvider: TranscriptionProvider = {
  id: 'mock',
  name: 'Mock',
  transcribe: vi.fn().mockResolvedValue({ text: 'Hallo', language: 'de', duration: 1.5 }),
}

describe('useTranscription', () => {
  beforeEach(() => {
    clearTranscriptionProviders()
    registerTranscriptionProvider(mockProvider)
  })

  it('starts in idle state', () => {
    const { result } = renderHook(() => useTranscription())
    expect(result.current.state).toBe('idle')
    expect(result.current.result).toBeNull()
  })

  it('transitions through states on transcribe', async () => {
    const { result } = renderHook(() => useTranscription())
    await act(async () => {
      await result.current.transcribe(new Blob(), 'mock', 'de')
    })
    expect(result.current.state).toBe('done')
    expect(result.current.result?.text).toBe('Hallo')
  })

  it('sets error for unknown provider', async () => {
    const { result } = renderHook(() => useTranscription())
    await act(async () => {
      await result.current.transcribe(new Blob(), 'nonexistent', 'de')
    })
    expect(result.current.state).toBe('error')
    expect(result.current.error).toContain('not found')
  })
})
