/**
 * Client-side audio chunking for large recordings.
 *
 * Splits audio blobs above a size threshold into chunks bounded by
 * VAD-detected silences so that no words are cut mid-way.
 *
 * > **Last edited:** 2026-05-11 14:19
 */

const MAX_CHUNK_BYTES = 20 * 1024 * 1024 // 20 MB
const MIN_SILENCE_FRAMES = 15 // minimum consecutive silent frames (~0.3 s at 50 Hz)
const SILENCE_AMPLITUDE_THRESHOLD = 0.015 // RMS below this is silence

/** A single audio chunk with its time boundaries. */
export interface AudioChunk {
  blob: Blob
  startTime: number // start in original audio (seconds)
  endTime: number // end in original audio (seconds)
}

/** Result of splitting a large audio blob. */
export interface ChunkResult {
  chunks: AudioChunk[]
  wasChunked: boolean
}

/**
 * Decode a Blob into an AudioBuffer via AudioContext.
 */
async function decodeAudio(blob: Blob): Promise<AudioBuffer> {
  const ctx = new AudioContext()
  try {
    const arrayBuffer = await blob.arrayBuffer()
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
    return audioBuffer
  } finally {
    await ctx.close()
  }
}

/**
 * Find indices (in sample frames) where silence begins.
 * Uses RMS amplitude over overlapping windows.
 */
function findSilenceRegions(audioBuffer: AudioBuffer, sampleRate: number): number[] {
  const channelData = audioBuffer.getChannelData(0)
  const windowSize = Math.floor(sampleRate * 0.2) // 200 ms windows
  const stepSize = Math.floor(sampleRate * 0.1) // 100 ms overlap
  const silenceThreshold = SILENCE_AMPLITUDE_THRESHOLD
  const minSilenceSamples = Math.floor(sampleRate * 0.3) // ~300 ms minimum silence
  const silenceFrames = MIN_SILENCE_FRAMES

  const rmsValues: number[] = []
  for (let i = 0; i + windowSize <= channelData.length; i += stepSize) {
    let sumSq = 0
    for (let j = 0; j < windowSize; j++) {
      const s = channelData[i + j]
      sumSq += s * s
    }
    rmsValues.push(Math.sqrt(sumSq / windowSize))
  }

  // Find silence regions: consecutive low-RMS samples
  const regions: { start: number; end: number }[] = []
  let inSilence = false
  let silenceStart = 0
  let consecutiveSilent = 0

  for (let i = 0; i < rmsValues.length; i++) {
    const isSilent = rmsValues[i] < silenceThreshold
    if (isSilent) {
      if (!inSilence) {
        inSilence = true
        silenceStart = i
        consecutiveSilent = 1
      } else {
        consecutiveSilent++
      }
    } else {
      if (inSilence && consecutiveSilent >= silenceFrames) {
        regions.push({
          start: silenceStart * stepSize,
          end: i * stepSize,
        })
      }
      inSilence = false
      consecutiveSilent = 0
    }
  }

  // Handle trailing silence
  if (inSilence && consecutiveSilent >= silenceFrames) {
    regions.push({
      start: silenceStart * stepSize,
      end: rmsValues.length * stepSize,
    })
  }

  // Convert region start indices to sample-frame positions
  const result: number[] = []
  for (const region of regions) {
    const midPoint = Math.floor((region.start + region.end) / 2)
    if (midPoint > 0 && midPoint < channelData.length) {
      result.push(midPoint)
    }
  }

  return result
}

/**
 * Split a Float32Array channel at a given sample position.
 */
function splitChannel(channel: Float32Array, splitAt: number): [Float32Array, Float32Array] {
  return [channel.slice(0, splitAt), channel.slice(splitAt)]
}

/**
 * Merge multiple AudioBuffers (concatenate) into one.
 */
function mergeBuffers(buffers: AudioBuffer[]): AudioBuffer {
  const totalLength = buffers.reduce((sum, b) => sum + b.length, 0)
  const context = new OfflineAudioContext({
    numberOfChannels: buffers[0].numberOfChannels,
    length: totalLength,
    sampleRate: buffers[0].sampleRate,
  })

  let offset = 0
  for (const buffer of buffers) {
    const source = context.createBufferSource()
    source.buffer = buffer
    for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
      source.connect(context.destination)
    }
    // Copy channel data directly
    for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
      const src = buffer.getChannelData(ch)
      const dst = context.createBuffer(1, buffer.length, buffer.sampleRate)
      dst.copyToChannel(src, ch)
      const srcSource = context.createBufferSource()
      srcSource.buffer = dst
      srcSource.connect(context.destination)
      srcSource.start(offset / buffer.sampleRate)
    }
    offset += buffer.length
  }

  return context.startRendering() as unknown as AudioBuffer
}

/**
 * Re-encode an AudioBuffer back to a WebM Blob.
 * Uses MediaRecorder with the AudioContext's destination.
 */
function bufferToWebm(buffer: AudioBuffer): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const ctx = new AudioContext({ sampleRate: buffer.sampleRate })
    const dest = ctx.createMediaStreamDestination()
    const recorder = new MediaRecorder(dest.stream, { mimeType: 'audio/webm' })
    const chunks: Blob[] = []

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data)
    }
    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: 'audio/webm' }))
      ctx.close()
    }
    recorder.onerror = () => {
      reject(new Error('MediaRecorder error during encoding'))
      ctx.close()
    }

    recorder.start()
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.connect(dest)
    source.start(0)
    source.onended = () => {
      // Give recorder a tiny bit of time to flush
      setTimeout(() => recorder.stop(), 50)
    }
  })
}

/**
 * Find the best chunk boundaries for audio that exceeds the size limit.
 * Uses silence detection to avoid mid-word cuts.
 */
function computeChunkBoundaries(
  audioBuffer: AudioBuffer,
  silentPoints: number[],
  totalDuration: number,
  maxChunkSeconds: number,
): number[] {
  const boundaries: number[] = []
  const totalSamples = audioBuffer.length

  // Start from sample positions that roughly fit within maxChunkSeconds
  // We want to place split points approximately every maxChunkSeconds worth of samples
  let nextSplit = Math.floor(maxChunkSeconds * audioBuffer.sampleRate)

  while (nextSplit < totalSamples - Math.floor(audioBuffer.sampleRate * 1)) {
    // Find the closest silence point after nextSplit
    let bestPoint = silentPoints.find(sp => sp >= nextSplit - Math.floor(audioBuffer.sampleRate * 0.5))
    if (bestPoint === undefined) {
      // No silence nearby — use a hard split anyway (will be mid-speech)
      bestPoint = nextSplit
    }
    // Clamp to valid range
    bestPoint = Math.max(0, Math.min(bestPoint, totalSamples - 1))
    boundaries.push(bestPoint)
    nextSplit = bestPoint + Math.floor(maxChunkSeconds * audioBuffer.sampleRate)
  }

  return boundaries
}

/**
 * Convert sample-frame boundaries to time offsets and create AudioBuffers per chunk.
 */
function createChunksFromSamples(
  originalBuffer: AudioBuffer,
  boundaries: number[],
): AudioBuffer[] {
  const channels: Float32Array[][] = []
  for (let ch = 0; ch < originalBuffer.numberOfChannels; ch++) {
    channels.push(originalBuffer.getChannelData(ch))
  }

  const chunks: AudioBuffer[] = []
  let prevBoundary = 0

  for (const boundary of boundaries) {
    const length = boundary - prevBoundary
    if (length <= 0) continue

    const offline = new OfflineAudioContext({
      numberOfChannels: originalBuffer.numberOfChannels,
      length,
      sampleRate: originalBuffer.sampleRate,
    })

    for (let ch = 0; ch < originalBuffer.numberOfChannels; ch++) {
      const src = channels[ch].slice(prevBoundary, boundary)
      const buffer = offline.createBuffer(1, length, originalBuffer.sampleRate)
      buffer.copyToChannel(src, ch)
      const source = offline.createBufferSource()
      source.buffer = buffer
      source.connect(offline.destination)
      source.start(0)
    }

    chunks.push(offline.startRendering() as unknown as AudioBuffer)
    prevBoundary = boundary
  }

  // Last chunk from last boundary to end
  if (prevBoundary < originalBuffer.length) {
    const length = originalBuffer.length - prevBoundary
    const offline = new OfflineAudioContext({
      numberOfChannels: originalBuffer.numberOfChannels,
      length,
      sampleRate: originalBuffer.sampleRate,
    })

    for (let ch = 0; ch < originalBuffer.numberOfChannels; ch++) {
      const src = channels[ch].slice(prevBoundary)
      const buffer = offline.createBuffer(1, length, originalBuffer.sampleRate)
      buffer.copyToChannel(src, ch)
      const source = offline.createBufferSource()
      source.buffer = buffer
      source.connect(offline.destination)
      source.start(0)
    }

    chunks.push(offline.startRendering() as unknown as AudioBuffer)
  }

  return chunks
}

/**
 * Split a large audio blob into smaller chunks bounded by detected silences.
 *
 * If the blob is <= `maxChunkBytes`, returns the blob as a single chunk (wasChunked = false).
 */
export async function chunkAudio(audioBlob: Blob, maxChunkBytes: number = MAX_CHUNK_BYTES): Promise<ChunkResult> {
  if (audioBlob.size <= maxChunkBytes) {
    return {
      chunks: [{ blob: audioBlob, startTime: 0, endTime: 0 }],
      wasChunked: false,
    }
  }

  const audioBuffer = await decodeAudio(audioBlob)
  const sampleRate = audioBuffer.sampleRate
  const totalDuration = audioBuffer.duration

  // Estimate seconds per chunk by linear scaling from blob size
  const ratio = audioBlob.size / maxChunkBytes
  const estimatedChunks = Math.ceil(ratio)
  const maxChunkSeconds = totalDuration / estimatedChunks

  // Find silence points
  const silentPoints = findSilenceRegions(audioBuffer, sampleRate)

  // Compute boundaries
  const boundaries = computeChunkBoundaries(audioBuffer, silentPoints, totalDuration, maxChunkSeconds)

  // Split into AudioBuffers
  const buffers = createChunksFromSamples(audioBuffer, boundaries)

  // Convert to WebM Blobs and assign time boundaries
  const chunks: AudioChunk[] = []
  let offset = 0

  for (const buffer of buffers) {
    const blob = await bufferToWebm(buffer)
    const start = offset / sampleRate
    const end = (offset + buffer.length) / sampleRate
    chunks.push({ blob, startTime: start, endTime: end })
    offset += buffer.length
  }

  // Update the first chunk to start at 0
  chunks[0].startTime = 0

  return { chunks, wasChunked: true }
}
