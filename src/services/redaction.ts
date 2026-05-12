export interface PIIReplacement {
  original: string;
  masked: string;
  type: string;
  start: number;
  end: number;
}

type RedactionLevel = 'strict' | 'moderate' | 'minimal'

const MASKS: Record<string, string> = {
  email: '[EMAIL]',
  phone: '[PHONE]',
  iban: '[IBAN]',
  credit_card: '[CREDIT_CARD]',
  ip: '[IP]',
}

function patternsForLevel(level: RedactionLevel) {
  const all = [
    { type: 'email', pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g },
    { type: 'phone', pattern: /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g },
    { type: 'iban', pattern: /\b[A-Z]{2}\d{2,30}\b/g },
    { type: 'credit_card', pattern: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g },
    { type: 'ip', pattern: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g },
  ]
  if (level === 'moderate') return all.filter(p => p.type !== 'ip')
  if (level === 'minimal') return all.filter(p => p.type !== 'ip' && p.type !== 'phone')
  return all
}

function findMatches(text: string, pattern: RegExp, type: string): PIIReplacement[] {
  const matches: PIIReplacement[] = []
  while (true) {
    pattern.lastIndex = 0
    const match = pattern.exec(text)
    if (!match) break
    matches.push({
      original: match[0],
      masked: MASKS[type],
      type,
      start: match.index,
      end: match.index + match[0].length,
    })
  }
  return matches
}

/**
 * Find all PII in text without modifying it.
 */
export function findPII(text: string, level: RedactionLevel = 'strict'): PIIReplacement[] {
  const patterns = patternsForLevel(level)
  const all: PIIReplacement[] = []
  for (const p of patterns) {
    all.push(...findMatches(text, p.pattern, p.type))
  }
  // Remove overlaps: keep the earliest (longest at same position) match
  all.sort((a, b) => a.start - b.start || b.end - a.end)
  const filtered: PIIReplacement[] = []
  let lastEnd = -1
  for (const m of all) {
    if (m.start >= lastEnd) {
      filtered.push(m)
      lastEnd = m.end
    }
  }
  return filtered
}

/**
 * Redact all PII in text and return both the redacted version and the list of replacements.
 */
export function redactPII(text: string, level: RedactionLevel = 'strict'): { redacted: string; replacements: PIIReplacement[] } {
  const pii = findPII(text, level)
  if (pii.length === 0) return { redacted: text, replacements: [] }

  // Process in reverse order to preserve earlier indices
  let result = text
  for (let i = pii.length - 1; i >= 0; i--) {
    const p = pii[i]
    result = result.slice(0, p.start) + p.masked + result.slice(p.end)
  }

  return { redacted: result, replacements: pii }
}

/**
 * Get highlighted segments for diff rendering — returns ranges in the redacted text
 * that correspond to masked values.
 */
export function getRedactionHighlights(redacted: string, replacements: PIIReplacement[]): Array<{ start: number; end: number; type: string }> {
  const highlights: Array<{ start: number; end: number; type: string }> = []
  let searchPos = 0

  for (const p of replacements) {
    const idx = redacted.indexOf(p.masked, searchPos)
    if (idx !== -1) {
      highlights.push({ start: idx, end: idx + p.masked.length, type: p.type })
      searchPos = idx + p.masked.length
    }
  }
  return highlights
}
