import type { TranscriptionProvider, TranscriptionOptions, TranscriptionResult } from './types'

export function createGroqProvider(apiKey: string): TranscriptionProvider {
  return {
    id: 'groq',
    name: 'Groq (Whisper Large v3)',
    async transcribe(audio: Blob, options: TranscriptionOptions): Promise<TranscriptionResult> {
      const formData = new FormData()
      formData.append('file', audio, 'recording.webm')
      formData.append('model', options.model ?? 'whisper-large-v3')
      formData.append('language', options.language)
      formData.append('response_format', 'verbose_json')

      const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}` },
        body: formData,
      })

      if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(`Groq API error (${response.status}): ${errorBody}`)
      }

      const data = await response.json()
      return {
        text: data.text,
        language: data.language ?? options.language,
        duration: data.duration ?? 0,
      }
    },
  }
}
