import { renderHook, act } from '@testing-library/react'
import { useTextProcessing } from './useTextProcessing'
import { registerTextProcessingProvider, clearTextProcessingProviders } from '../providers/text-processing/registry'
import type { TextProcessingProvider } from '../providers/text-processing/types'

const mockProvider: TextProcessingProvider = {
  id: 'mock-llm',
  name: 'Mock LLM',
  process: vi.fn().mockImplementation(async (_text, options) => ({
    text: options.mode === 'clean' ? 'cleaned text' : 'prompt text',
  })),
}

describe('useTextProcessing', () => {
  beforeEach(() => {
    clearTextProcessingProviders()
    registerTextProcessingProvider(mockProvider)
    vi.clearAllMocks()
  })

  it('starts in idle state', () => {
    const { result } = renderHook(() => useTextProcessing())
    expect(result.current.state).toBe('idle')
  })

  it('processes text in clean mode', async () => {
    const { result } = renderHook(() => useTextProcessing())
    await act(async () => {
      await result.current.process('raw', 'mock-llm', 'clean', 'de')
    })
    expect(result.current.state).toBe('done')
    expect(result.current.cleanedText).toBe('cleaned text')
  })

  it('processes text in prompt mode', async () => {
    const { result } = renderHook(() => useTextProcessing())
    await act(async () => {
      await result.current.process('raw', 'mock-llm', 'prompt', 'de')
    })
    expect(result.current.state).toBe('done')
    expect(result.current.promptText).toBe('prompt text')
  })

  it('passes custom system prompt to provider', async () => {
    const { result } = renderHook(() => useTextProcessing())
    await act(async () => {
      await result.current.process('raw', 'mock-llm', 'clean', 'de', 'Custom instructions')
    })
    expect(mockProvider.process).toHaveBeenCalledWith('raw', {
      mode: 'clean',
      language: 'de',
      customSystemPrompt: 'Custom instructions',
    })
  })

  it('sets error for unknown provider', async () => {
    const { result } = renderHook(() => useTextProcessing())
    await act(async () => {
      await result.current.process('raw', 'nonexistent', 'clean', 'de')
    })
    expect(result.current.state).toBe('error')
  })
})
