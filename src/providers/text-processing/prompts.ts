const LANGUAGE_NAMES: Record<string, string> = {
  de: 'German',
  en: 'English',
  fr: 'French',
  es: 'Spanish',
}

function getLanguageName(code: string): string {
  return LANGUAGE_NAMES[code] ?? code
}

export function getSystemPrompt(mode: 'clean' | 'prompt' | 'execute', language: string): string {
  const lang = getLanguageName(language)

  if (mode === 'clean') {
    return `You are a text cleaning assistant. Take the following transcribed speech and:
- Remove filler words (um, uh, äh, also, halt, quasi, sozusagen, etc.)
- Fix grammar and punctuation
- Convert spoken language patterns to clean written language
- Do NOT change the meaning or content
- Respond in ${lang}
- Return ONLY the cleaned text, no explanations`
  }

  if (mode === 'prompt') {
    return `You are a prompt engineering assistant. Take the following text and transform it into a well-structured prompt suitable for AI assistants. The prompt should:
- Have clear context and goal
- Be specific and actionable
- Include expectations for the response format
- Use Markdown formatting where appropriate
- Respond in ${lang}
- Return ONLY the prompt, no explanations or meta-commentary`
  }

  return `Follow the instructions in the user's message precisely. Respond in ${lang}.`
}
