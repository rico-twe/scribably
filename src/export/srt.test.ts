import { segmentsToSrt } from './srt'
import { EXAMPLE_SEGMENTS } from './__fixtures__/example-transcript'

const EXPECTED_SRT =
`1
00:00:00,000 --> 00:00:02,500
Hallo und willkommen.

2
00:00:02,500 --> 00:00:05,800
Das ist ein Testsatz.

3
00:00:05,800 --> 00:00:09,420
Noch ein dritter.
`

describe('segmentsToSrt', () => {
  it('renders segments as SRT', () => {
    expect(segmentsToSrt(EXAMPLE_SEGMENTS)).toBe(EXPECTED_SRT)
  })

  it('returns empty string for empty segments', () => {
    expect(segmentsToSrt([])).toBe('')
  })

  it('trims whitespace from segment text', () => {
    const result = segmentsToSrt([{ start: 0, end: 1, text: '  Hallo  ' }])
    expect(result).toContain('Hallo\n')
    expect(result).not.toContain('  Hallo  ')
  })
})
