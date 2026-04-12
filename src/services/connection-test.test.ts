import { testSTTConnection, testLLMConnection } from './connection-test'

describe('Connection Test Service', () => {
  beforeEach(() => { globalThis.fetch = vi.fn() })
  afterEach(() => { vi.restoreAllMocks() })

  describe('testSTTConnection', () => {
    it('returns success for Groq with valid key', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ data: [{ id: 'whisper-large-v3' }] }),
      })

      const result = await testSTTConnection({ providerId: 'groq', apiKey: 'gsk_test' })
      expect(result.success).toBe(true)
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.groq.com/openai/v1/models',
        expect.objectContaining({
          headers: expect.objectContaining({ 'Authorization': 'Bearer gsk_test' }),
        })
      )
    })

    it('returns success for OpenAI Whisper with valid key', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ data: [{ id: 'whisper-1' }] }),
      })

      const result = await testSTTConnection({ providerId: 'openai-whisper', apiKey: 'sk-test' })
      expect(result.success).toBe(true)
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/models',
        expect.objectContaining({
          headers: expect.objectContaining({ 'Authorization': 'Bearer sk-test' }),
        })
      )
    })

    it('returns failure on API error', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 401,
        text: async () => 'Unauthorized',
      })

      const result = await testSTTConnection({ providerId: 'groq', apiKey: 'bad_key' })
      expect(result.success).toBe(false)
      expect(result.error).toContain('401')
    })

    it('returns failure on network error', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'))

      const result = await testSTTConnection({ providerId: 'groq', apiKey: 'gsk_test' })
      expect(result.success).toBe(false)
      expect(result.error).toContain('Network error')
    })
  })

  describe('testLLMConnection', () => {
    it('returns success for OpenAI-compatible with valid key', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ data: [{ id: 'gpt-4o' }] }),
      })

      const result = await testLLMConnection({
        providerId: 'openai-compatible',
        apiKey: 'sk-test',
        baseUrl: 'https://api.openai.com/v1',
      })
      expect(result.success).toBe(true)
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/models',
        expect.objectContaining({
          headers: expect.objectContaining({ 'Authorization': 'Bearer sk-test' }),
        })
      )
    })

    it('returns success for Anthropic with valid key', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({
          content: [{ text: 'Hi' }],
          usage: { input_tokens: 5, output_tokens: 1 },
        }),
      })

      const result = await testLLMConnection({
        providerId: 'anthropic',
        apiKey: 'sk-ant-test',
      })
      expect(result.success).toBe(true)
      const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
      expect(call[0]).toBe('https://api.anthropic.com/v1/messages')
      const body = JSON.parse(call[1].body)
      expect(body.max_tokens).toBe(1)
    })

    it('returns failure on API error', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 403,
        text: async () => 'Forbidden',
      })

      const result = await testLLMConnection({
        providerId: 'anthropic',
        apiKey: 'bad_key',
      })
      expect(result.success).toBe(false)
      expect(result.error).toContain('403')
    })
  })
})
