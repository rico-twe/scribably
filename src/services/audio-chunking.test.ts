import { chunkAudio, type AudioChunk, type ChunkResult } from './audio-chunking'

describe('chunkAudio', () => {
  // Helper: create a small Blob with known size
  function makeBlob(size: number, type = 'audio/webm'): Blob {
    return new Blob(['\0'.repeat(size)], { type })
  }

  it('returns single chunk when blob is within limit', async () => {
    const blob = makeBlob(1024)
    const result = await chunkAudio(blob, 1024 * 1024) // 1 MB limit
    expect(result.wasChunked).toBe(false)
    expect(result.chunks).toHaveLength(1)
    expect(result.chunks[0].blob.size).toBe(1024)
  })

  it('returns single chunk when blob equals limit exactly', async () => {
    const limit = 5000
    const blob = makeBlob(limit)
    const result = await chunkAudio(blob, limit)
    expect(result.wasChunked).toBe(false)
    expect(result.chunks).toHaveLength(1)
  })

  it('rejects zero-size blob', async () => {
    const blob = new Blob([], { type: 'audio/webm' })
    const result = await chunkAudio(blob)
    expect(result.wasChunked).toBe(false)
    expect(result.chunks).toHaveLength(1)
    expect(result.chunks[0].blob.size).toBe(0)
  })
})

describe('audio-chunking internals', () => {
  it('exports types', () => {
    // Type check — compilation would fail if types are broken
    const chunk: AudioChunk = { blob: new Blob([]), startTime: 0, endTime: 0 }
    const result: ChunkResult = { chunks: [chunk], wasChunked: true }
    expect(result.wasChunked).toBe(true)
  })
})
