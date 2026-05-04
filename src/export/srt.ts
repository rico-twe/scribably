import type { Segment } from '../providers/transcription/types'

function pad(n: number, digits: number): string {
  return String(n).padStart(digits, '0')
}

function formatSrtTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  const ms = Math.round((seconds % 1) * 1000)
  return `${pad(h, 2)}:${pad(m, 2)}:${pad(s, 2)},${pad(ms, 3)}`
}

export function segmentsToSrt(segments: Segment[]): string {
  return segments
    .map((seg, i) =>
      `${i + 1}\n${formatSrtTime(seg.start)} --> ${formatSrtTime(seg.end)}\n${seg.text.trim()}\n`
    )
    .join('\n')
}
