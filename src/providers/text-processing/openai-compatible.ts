import type { TextProcessingProvider, ProcessingOptions, ProcessingResult } from './types'
import { getSystemPrompt } from './prompts'

export interface OpenAICompatibleConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

export function createOpenAICompatibleProvider(config: OpenAICompatibleConfig): TextProcessingProvider {
  return {
    id: 'openai-compatible',
    name: `OpenAI-Compatible (${config.model})`,
    async process(text: string, options: ProcessingOptions): Promise<ProcessingResult> {
      const systemPrompt = options.customSystemPrompt ?? getSystemPrompt(options.mode, options.language)
      const url = `${config.baseUrl}/chat/completions`
      console.log(`[WP:openai:${options.mode}] Request |`, {
        url,
        model: config.model,
        systemPromptLength: systemPrompt.length,
        inputTextLength: text.length,
        language: options.language,
      })

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: text },
          ],
          temperature: 0.3,
        }),
      })

      if (!response.ok) {
        const errorBody = await response.text()
        console.error(`[WP:openai:${options.mode}] HTTP ${response.status} |`, errorBody)
        throw new Error(`API error (${response.status}): ${errorBody}`)
      }

      const data = await response.json()
      console.log(`[WP:openai:${options.mode}] Response OK |`, {
        outputLength: data.choices[0].message.content.length,
        totalTokens: data.usage?.total_tokens,
        finishReason: data.choices[0].finish_reason,
      })
      return {
        text: data.choices[0].message.content,
        tokensUsed: data.usage?.total_tokens,
      }
    },
  }
}
