import { normalizeLanguage, getLanguageName } from './languages'

it('normalizes ISO code', () => expect(normalizeLanguage('de')).toBe('de'))
it('normalizes English name', () => expect(normalizeLanguage('german')).toBe('de'))
it('returns null for unknown', () => expect(normalizeLanguage('klingon')).toBeNull())
it('gets name from code', () => expect(getLanguageName('en')).toBe('English'))
