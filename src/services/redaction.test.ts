import { findPII, redactPII, getRedactionHighlights } from './redaction'

describe('findPII', () => {
  it('detects email addresses', () => {
    const result = findPII('Contact us at info@example.com')
    expect(result).toHaveLength(1)
    expect(result[0].type).toBe('email')
    expect(result[0].original).toBe('info@example.com')
  })

  it('detects multiple emails', () => {
    const result = findPII('a@b.com and c@d.org')
    expect(result).toHaveLength(2)
    expect(result[0].type).toBe('email')
    expect(result[1].type).toBe('email')
  })

  it('detects phone numbers', () => {
    const result = findPII('Call +49 123 456 7890')
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result.some(r => r.type === 'phone')).toBe(true)
  })

  it('detects IBANs', () => {
    const result = findPII('IBAN: DE89370400440532013000')
    expect(result).toHaveLength(1)
    expect(result[0].type).toBe('iban')
    expect(result[0].original).toBe('DE89370400440532013000')
  })

  it('detects credit card numbers with separators', () => {
    const result = findPII('Card: 4111-1111-1111-1111')
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result.some(r => r.type === 'credit_card')).toBe(true)
  })

  it('detects credit card numbers without separators', () => {
    const result = findPII('Card: 4111111111111111')
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result.some(r => r.type === 'credit_card')).toBe(true)
  })

  it('detects IP addresses', () => {
    const result = findPII('Server: 192.168.1.1')
    expect(result).toHaveLength(1)
    expect(result[0].type).toBe('ip')
    expect(result[0].original).toBe('192.168.1.1')
  })

  it('detects mixed PII', () => {
    const result = findPII('Email: user@test.de, IBAN: DE89370400440532013000, IP: 10.0.0.1')
    const types = result.map(r => r.type)
    expect(types).toContain('email')
    expect(types).toContain('iban')
    expect(types).toContain('ip')
  })

  it('returns no PII for clean text', () => {
    const result = findPII('Hello World, this is a clean text.')
    expect(result).toHaveLength(0)
  })

  it('returns sorted results by position', () => {
    const result = findPII('IP: 10.0.0.1 and email: a@b.com')
    expect(result[0].start).toBeLessThanOrEqual(result[1].start)
  })

  it('handles overlapping matches by keeping earliest longest', () => {
    // A match that could overlap with another should be deduplicated
    const result = findPII('a@b.com')
    expect(result).toHaveLength(1)
    expect(result[0].type).toBe('email')
  })
})

describe('findPII – redaction levels', () => {
  it('minimal excludes phones and IPs', () => {
    const text = 'email@x.de and 192.168.0.1 and +49 123 456 7890'
    const strict = findPII(text, 'strict')
    const minimal = findPII(text, 'minimal')
    expect(strict.length).toBeGreaterThan(minimal.length)
    expect(strict.some(r => r.type === 'ip')).toBe(true)
    expect(strict.some(r => r.type === 'phone')).toBe(true)
    expect(minimal.some(r => r.type === 'ip')).toBe(false)
    expect(minimal.some(r => r.type === 'phone')).toBe(false)
    expect(minimal.some(r => r.type === 'email')).toBe(true)
  })

  it('moderate excludes IPs only', () => {
    const text = 'email@x.de and 192.168.0.1 and +49 123 456 7890'
    const strict = findPII(text, 'strict')
    const moderate = findPII(text, 'moderate')
    expect(strict.length).toBeGreaterThan(moderate.length)
    expect(moderate.some(r => r.type === 'ip')).toBe(false)
    expect(moderate.some(r => r.type === 'phone')).toBe(true)
    expect(moderate.some(r => r.type === 'email')).toBe(true)
  })
})

describe('redactPII', () => {
  it('replaces emails with [EMAIL]', () => {
    const { redacted, replacements } = redactPII('Contact info@example.com')
    expect(redacted).toBe('Contact [EMAIL]')
    expect(replacements).toHaveLength(1)
    expect(replacements[0].masked).toBe('[EMAIL]')
  })

  it('replaces IBAN with [IBAN]', () => {
    const { redacted } = redactPII('Account: DE89370400440532013000')
    expect(redacted).toBe('Account: [IBAN]')
  })

  it('replaces IP with [IP]', () => {
    const { redacted } = redactPII('Server at 192.168.1.1')
    expect(redacted).toBe('Server at [IP]')
  })

  it('handles multiple PII in one text', () => {
    const { redacted, replacements } = redactPII('Email: a@b.com, IP: 10.0.0.1')
    expect(redacted).toContain('[EMAIL]')
    expect(redacted).toContain('[IP]')
    expect(replacements).toHaveLength(2)
  })

  it('returns unchanged text when no PII found', () => {
    const { redacted, replacements } = redactPII('Clean text only')
    expect(redacted).toBe('Clean text only')
    expect(replacements).toHaveLength(0)
  })

  it('respects redaction level', () => {
    const text = 'email@x.de and 192.168.0.1'
    const { redacted: strict } = redactPII(text, 'strict')
    const { redacted: minimal } = redactPII(text, 'minimal')
    expect(strict).toBe('[EMAIL] and [IP]')
    expect(minimal).toBe('[EMAIL] and 192.168.0.1')
  })
})

describe('getRedactionHighlights', () => {
  it('returns highlight ranges for masked text', () => {
    const redacted = '[EMAIL] is here [IP]'
    const replacements = [
      { original: 'a@b.com', masked: '[EMAIL]', type: 'email', start: 0, end: 9 },
      { original: '10.0.0.1', masked: '[IP]', type: 'ip', start: 16, end: 24 },
    ]
    const highlights = getRedactionHighlights(redacted, replacements)
    expect(highlights).toHaveLength(2)
    expect(highlights[0].type).toBe('email')
    expect(highlights[1].type).toBe('ip')
  })

  it('returns empty array for empty replacements', () => {
    const highlights = getRedactionHighlights('no changes', [])
    expect(highlights).toHaveLength(0)
  })
})
