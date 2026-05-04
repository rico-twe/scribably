import { createOpenAIWhisperProvider } from './openai-whisper'

describe('OpenAI Whisper Transcription Provider', () => {
  beforeEach(() => { globalThis.fetch = vi.fn() })
  afterEach(() => { vi.restoreAllMocks() })

  it('has correct id and name', () => {
    const provider = createOpenAIWhisperProvider('sk-test')
    expect(provider.id).toBe('openai-whisper')
    expect(provider.name).toContain('OpenAI')
  })

  it('sends correct request to OpenAI API', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ text: 'Hello World', language: 'en', duration: 2.0 }),
    })

    const provider = createOpenAIWhisperProvider('sk-test')
    const result = await provider.transcribe(new Blob(['audio']), { language: 'de' })

    expect(result.text).toBe('Hello World')
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/audio/transcriptions',
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('maps segments from verbose_json response', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        text: 'Hello World',
        language: 'en',
        duration: 2.0,
        segments: [
          { start: 0, end: 1.0, text: 'Hello', extra: 'ignored' },
          { start: 1.0, end: 2.0, text: 'World', extra: 'ignored' },
        ],
      }),
    })

    const provider = createOpenAIWhisperProvider('sk-test')
    const result = await provider.transcribe(new Blob(['audio']), { language: 'de' })

    expect(result.segments).toEqual([
      { start: 0, end: 1.0, text: 'Hello' },
      { start: 1.0, end: 2.0, text: 'World' },
    ])
  })

  it('returns undefined segments when not present in response', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ text: 'Hello World', language: 'en', duration: 2.0 }),
    })

    const provider = createOpenAIWhisperProvider('sk-test')
    const result = await provider.transcribe(new Blob(['audio']), { language: 'de' })

    expect(result.segments).toBeUndefined()
  })

  it('uses whisper-1 model by default', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ text: 'test', language: 'de', duration: 1 }),
    })

    const provider = createOpenAIWhisperProvider('sk-test')
    await provider.transcribe(new Blob(['audio']), { language: 'de' })

    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    const formData = call[1].body as FormData
    expect(formData.get('model')).toBe('whisper-1')
  })

  it('throws on API error', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 429,
      text: async () => 'Rate limited',
    })

    const provider = createOpenAIWhisperProvider('sk-test')
    await expect(provider.transcribe(new Blob(), { language: 'de' }))
      .rejects.toThrow('OpenAI API error (429)')
  })
})
