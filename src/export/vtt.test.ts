import { segmentsToVtt } from './vtt'
import { EXAMPLE_SEGMENTS } from './__fixtures__/example-transcript'

const EXPECTED_VTT =
`WEBVTT

00:00:00.000 --> 00:00:02.500
Hallo und willkommen.

00:00:02.500 --> 00:00:05.800
Das ist ein Testsatz.

00:00:05.800 --> 00:00:09.420
Noch ein dritter.
`

describe('segmentsToVtt', () => {
  it('renders segments as VTT with WEBVTT header', () => {
    expect(segmentsToVtt(EXAMPLE_SEGMENTS)).toBe(EXPECTED_VTT)
  })

  it('uses dot as millisecond separator (not comma)', () => {
    const result = segmentsToVtt([{ start: 1.5, end: 2.0, text: 'Test' }])
    expect(result).toContain('00:00:01.500')
    expect(result).not.toContain('00:00:01,500')
  })

  it('returns only header for empty segments', () => {
    expect(segmentsToVtt([])).toBe('WEBVTT\n\n')
  })
})
