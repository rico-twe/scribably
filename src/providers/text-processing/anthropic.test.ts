import { createAnthropicProvider } from './anthropic'

describe('Anthropic Text Processing Provider', () => {
  beforeEach(() => { globalThis.fetch = vi.fn() })
  afterEach(() => { vi.restoreAllMocks() })

  it('has correct id', () => {
    const provider = createAnthropicProvider('sk-ant-test')
    expect(provider.id).toBe('anthropic')
  })

  it('sends correct request with required headers', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ text: 'Cleaned text' }],
        usage: { input_tokens: 50, output_tokens: 30 },
      }),
    })

    const provider = createAnthropicProvider('sk-ant-test')
    const result = await provider.process('raw text', { mode: 'clean', language: 'de' })

    expect(result.text).toBe('Cleaned text')
    expect(result.tokensUsed).toBe(80)

    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[0]).toBe('https://api.anthropic.com/v1/messages')
    const headers = call[1].headers
    expect(headers['x-api-key']).toBe('sk-ant-test')
    expect(headers['anthropic-version']).toBe('2023-06-01')
    expect(headers['anthropic-dangerous-direct-browser-access']).toBe('true')
  })

  it('throws on API error', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => 'Invalid API key',
    })

    const provider = createAnthropicProvider('bad-key')
    await expect(provider.process('text', { mode: 'clean', language: 'de' }))
      .rejects.toThrow('Anthropic API error (401)')
  })
})
