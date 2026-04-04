import type { TranscriptionProvider, TranscriptionOptions, TranscriptionResult } from './types'

export function createOpenAIWhisperProvider(apiKey: string): TranscriptionProvider {
  return {
    id: 'openai-whisper',
    name: 'OpenAI (Whisper)',
    async transcribe(audio: Blob, options: TranscriptionOptions): Promise<TranscriptionResult> {
      const formData = new FormData()
      formData.append('file', audio, 'recording.webm')
      formData.append('model', options.model ?? 'whisper-1')
      formData.append('language', options.language)
      formData.append('response_format', 'verbose_json')

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}` },
        body: formData,
      })

      if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(`OpenAI API error (${response.status}): ${errorBody}`)
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
