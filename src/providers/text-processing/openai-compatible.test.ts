import { createOpenAICompatibleProvider } from './openai-compatible'

describe('OpenAI-Compatible Text Processing Provider', () => {
  beforeEach(() => { globalThis.fetch = vi.fn() })
  afterEach(() => { vi.restoreAllMocks() })

  it('has correct id', () => {
    const provider = createOpenAICompatibleProvider({
      apiKey: 'sk-test', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o',
    })
    expect(provider.id).toBe('openai-compatible')
  })

  it('sends correct request', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Cleaned text' } }],
        usage: { total_tokens: 150 },
      }),
    })

    const provider = createOpenAICompatibleProvider({
      apiKey: 'sk-test', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o',
    })
    const result = await provider.process('raw text', { mode: 'clean', language: 'de' })

    expect(result.text).toBe('Cleaned text')
    expect(result.tokensUsed).toBe(150)
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('throws on API error', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error',
    })

    const provider = createOpenAICompatibleProvider({
      apiKey: 'sk-test', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o',
    })
    await expect(provider.process('text', { mode: 'clean', language: 'de' }))
      .rejects.toThrow('API error (500)')
  })
})
