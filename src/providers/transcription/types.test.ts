import type { TranscriptionProvider, TranscriptionOptions, TranscriptionResult } from './types'

describe('TranscriptionProvider types', () => {
  it('allows creating a valid provider implementation', () => {
    const provider: TranscriptionProvider = {
      id: 'test',
      name: 'Test Provider',
      transcribe: async (_audio: Blob, _options: TranscriptionOptions): Promise<TranscriptionResult> => ({
        text: 'hello',
        language: 'de',
        duration: 1.5,
      }),
    }
    expect(provider.id).toBe('test')
    expect(provider.name).toBe('Test Provider')
  })

  it('transcribe returns a valid result', async () => {
    const provider: TranscriptionProvider = {
      id: 'test',
      name: 'Test',
      transcribe: async () => ({ text: 'Hallo Welt', language: 'de', duration: 2.3 }),
    }
    const result = await provider.transcribe(new Blob(), { language: 'de' })
    expect(result.text).toBe('Hallo Welt')
    expect(result.language).toBe('de')
    expect(result.duration).toBe(2.3)
  })
})
