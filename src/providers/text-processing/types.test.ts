import type { TextProcessingProvider, ProcessingOptions, ProcessingResult } from './types'

describe('TextProcessingProvider types', () => {
  it('allows creating a valid provider implementation', () => {
    const provider: TextProcessingProvider = {
      id: 'test-llm',
      name: 'Test LLM',
      process: async (_text: string, _options: ProcessingOptions): Promise<ProcessingResult> => ({
        text: 'cleaned text',
        tokensUsed: 100,
      }),
    }
    expect(provider.id).toBe('test-llm')
  })

  it('supports clean and prompt modes', async () => {
    const provider: TextProcessingProvider = {
      id: 'test',
      name: 'Test',
      process: async (_text, options) => ({
        text: options.mode === 'clean' ? 'cleaned' : 'prompted',
      }),
    }
    const clean = await provider.process('raw', { mode: 'clean', language: 'de' })
    const prompt = await provider.process('raw', { mode: 'prompt', language: 'de' })
    expect(clean.text).toBe('cleaned')
    expect(prompt.text).toBe('prompted')
  })
})
