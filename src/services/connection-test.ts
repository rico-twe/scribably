import type { ProviderConfig } from './config-types'

export interface ConnectionTestResult {
  success: boolean;
  error?: string;
}

const STT_ENDPOINTS: Record<string, string> = {
  'groq': 'https://api.groq.com/openai/v1/models',
  'openai-whisper': 'https://api.openai.com/v1/models',
}

export async function testSTTConnection(config: ProviderConfig): Promise<ConnectionTestResult> {
  const endpoint = STT_ENDPOINTS[config.providerId]
  if (!endpoint) return { success: false, error: `Unknown provider: ${config.providerId}` }

  try {
    const response = await fetch(endpoint, {
      headers: { 'Authorization': `Bearer ${config.apiKey}` },
    })
    if (!response.ok) {
      const body = await response.text()
      return { success: false, error: `API error (${response.status}): ${body}` }
    }
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Connection failed' }
  }
}

export async function testLLMConnection(config: ProviderConfig): Promise<ConnectionTestResult> {
  try {
    if (config.providerId === 'anthropic') {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config.model ?? 'claude-sonnet-4-20250514',
          max_tokens: 1,
          messages: [{ role: 'user', content: 'Hi' }],
        }),
      })
      if (!response.ok) {
        const body = await response.text()
        return { success: false, error: `API error (${response.status}): ${body}` }
      }
      return { success: true }
    }

    const baseUrl = config.baseUrl ?? 'https://api.openai.com/v1'
    const response = await fetch(`${baseUrl}/models`, {
      headers: { 'Authorization': `Bearer ${config.apiKey}` },
    })
    if (!response.ok) {
      const body = await response.text()
      return { success: false, error: `API error (${response.status}): ${body}` }
    }
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Connection failed' }
  }
}
