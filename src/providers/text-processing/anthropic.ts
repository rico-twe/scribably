import type { TextProcessingProvider, ProcessingOptions, ProcessingResult } from './types'
import { getSystemPrompt } from './prompts'

export function createAnthropicProvider(apiKey: string, model?: string): TextProcessingProvider {
  return {
    id: 'anthropic',
    name: `Anthropic (${model ?? 'claude-sonnet-4-20250514'})`,
    async process(text: string, options: ProcessingOptions): Promise<ProcessingResult> {
      const usedModel = model ?? 'claude-sonnet-4-20250514'
      const systemPrompt = options.customSystemPrompt ?? getSystemPrompt(options.mode, options.language)
      console.log(`[WP:anthropic:${options.mode}] Request |`, {
        model: usedModel,
        systemPromptLength: systemPrompt.length,
        inputTextLength: text.length,
        language: options.language,
      })

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: usedModel,
          max_tokens: 4096,
          system: systemPrompt,
          messages: [{ role: 'user', content: text }],
        }),
      })

      if (!response.ok) {
        const errorBody = await response.text()
        console.error(`[WP:anthropic:${options.mode}] HTTP ${response.status} |`, errorBody)
        throw new Error(`Anthropic API error (${response.status}): ${errorBody}`)
      }

      const data = await response.json()
      console.log(`[WP:anthropic:${options.mode}] Response OK |`, {
        outputLength: data.content[0].text.length,
        inputTokens: data.usage?.input_tokens,
        outputTokens: data.usage?.output_tokens,
        stopReason: data.stop_reason,
      })
      return {
        text: data.content[0].text,
        tokensUsed: (data.usage?.input_tokens ?? 0) + (data.usage?.output_tokens ?? 0),
      }
    },
  }
}
