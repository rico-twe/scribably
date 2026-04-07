import { getSystemPrompt } from './prompts'

describe('System Prompts', () => {
  it('returns a clean prompt for German', () => {
    const prompt = getSystemPrompt('clean', 'de')
    expect(prompt).toContain('filler')
    expect(prompt).toContain('German')
    expect(prompt.length).toBeGreaterThan(50)
  })

  it('returns a prompt-mode prompt for German', () => {
    const prompt = getSystemPrompt('prompt', 'de')
    expect(prompt).toContain('prompt')
    expect(prompt).toContain('German')
    expect(prompt.length).toBeGreaterThan(50)
  })

  it('returns different prompts for clean and prompt modes', () => {
    const clean = getSystemPrompt('clean', 'de')
    const prompt = getSystemPrompt('prompt', 'de')
    expect(clean).not.toBe(prompt)
  })

  it('adapts language for English', () => {
    const prompt = getSystemPrompt('clean', 'en')
    expect(prompt).toContain('English')
  })
})
