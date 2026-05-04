import { createGroqProvider } from './groq'

describe('Groq Transcription Provider', () => {
  beforeEach(() => { globalThis.fetch = vi.fn() })
  afterEach(() => { vi.restoreAllMocks() })

  it('has correct id and name', () => {
    const provider = createGroqProvider('gsk_test')
    expect(provider.id).toBe('groq')
    expect(provider.name).toContain('Groq')
  })

  it('sends correct request to Groq API', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ text: 'Hallo Welt', language: 'de', duration: 3.5 }),
    })

    const provider = createGroqProvider('gsk_test')
    const result = await provider.transcribe(new Blob(['audio']), { language: 'de' })

    expect(result.text).toBe('Hallo Welt')
    expect(result.duration).toBe(3.5)
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.groq.com/openai/v1/audio/transcriptions',
      expect.objectContaining({ method: 'POST' })
    )
    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[1].headers.Authorization).toBe('Bearer gsk_test')
  })

  it('maps segments from verbose_json response', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        text: 'Hallo Welt',
        language: 'de',
        duration: 3.5,
        segments: [
          { start: 0, end: 1.5, text: 'Hallo', extra: 'ignored' },
          { start: 1.5, end: 3.5, text: 'Welt', extra: 'ignored' },
        ],
      }),
    })

    const provider = createGroqProvider('gsk_test')
    const result = await provider.transcribe(new Blob(['audio']), { language: 'de' })

    expect(result.segments).toEqual([
      { start: 0, end: 1.5, text: 'Hallo' },
      { start: 1.5, end: 3.5, text: 'Welt' },
    ])
  })

  it('returns undefined segments when not present in response', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ text: 'Hallo Welt', language: 'de', duration: 3.5 }),
    })

    const provider = createGroqProvider('gsk_test')
    const result = await provider.transcribe(new Blob(['audio']), { language: 'de' })

    expect(result.segments).toBeUndefined()
  })

  it('uses whisper-large-v3 model by default', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ text: 'test', language: 'de', duration: 1 }),
    })

    const provider = createGroqProvider('gsk_test')
    await provider.transcribe(new Blob(['audio']), { language: 'de' })

    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    const formData = call[1].body as FormData
    expect(formData.get('model')).toBe('whisper-large-v3')
  })

  it('throws on API error', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized',
    })

    const provider = createGroqProvider('bad_key')
    await expect(provider.transcribe(new Blob(), { language: 'de' }))
      .rejects.toThrow('Groq API error (401)')
  })
})
