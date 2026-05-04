import { Document, Packer, Paragraph, TextRun } from 'docx'
import type { Segment } from '../providers/transcription/types'

export async function textToDocx(text: string, segments?: Segment[]): Promise<Blob> {
  const paragraphs = segments
    ? segments.map((s) => new Paragraph({ children: [new TextRun(s.text.trim())] }))
    : text.split(/\n\n+/).filter(Boolean).map((p) => new Paragraph({ children: [new TextRun(p)] }))

  const doc = new Document({ sections: [{ children: paragraphs }] })
  return Packer.toBlob(doc)
}
