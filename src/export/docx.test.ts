import { textToDocx } from './docx'
import { EXAMPLE_SEGMENTS } from './__fixtures__/example-transcript'

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

describe('textToDocx', () => {
  it('produces a docx blob with correct MIME type', async () => {
    const blob = await textToDocx('Hallo Welt.', EXAMPLE_SEGMENTS)
    expect(blob.type).toBe(DOCX_MIME)
    expect(blob.size).toBeGreaterThan(1000)
  })

  it('works without segments using flat text', async () => {
    const blob = await textToDocx('Absatz eins.\n\nAbsatz zwei.')
    expect(blob.type).toBe(DOCX_MIME)
    expect(blob.size).toBeGreaterThan(1000)
  })
})
