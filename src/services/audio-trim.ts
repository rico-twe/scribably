function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels
  const sampleRate = buffer.sampleRate
  const numFrames = buffer.length
  const numSamples = numFrames * numChannels
  const byteCount = 44 + numSamples * 2

  const arrayBuffer = new ArrayBuffer(byteCount)
  const view = new DataView(arrayBuffer)

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i))
    }
  }

  // RIFF chunk
  writeString(0, 'RIFF')
  view.setUint32(4, byteCount - 8, true)
  writeString(8, 'WAVE')

  // fmt sub-chunk
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)         // chunk size
  view.setUint16(20, 1, true)          // PCM format
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * numChannels * 2, true) // byte rate
  view.setUint16(32, numChannels * 2, true)              // block align
  view.setUint16(34, 16, true)                           // bits per sample

  // data sub-chunk
  writeString(36, 'data')
  view.setUint32(40, numSamples * 2, true)

  // Cache channel data to avoid repeated getChannelData calls inside the loop
  const channels: Float32Array[] = []
  for (let ch = 0; ch < numChannels; ch++) {
    channels.push(buffer.getChannelData(ch))
  }

  // Interleaved PCM samples (Float32 → Int16)
  let offset = 44
  for (let i = 0; i < numFrames; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = channels[ch][i]
      const clamped = Math.max(-1, Math.min(1, sample))
      view.setInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true)
      offset += 2
    }
  }

  return new Blob([view.buffer], { type: 'audio/wav' })
}

export async function trimAudioToMaxDuration(file: File, maxSeconds: number): Promise<Blob> {
  const audioCtx = new AudioContext()

  const arrayBuffer = await file.arrayBuffer()
  const audioBuffer = await new Promise<AudioBuffer>((resolve, reject) =>
    audioCtx.decodeAudioData(arrayBuffer, resolve, reject),
  )

  if (audioBuffer.duration <= maxSeconds) {
    await audioCtx.close()
    return file
  }

  const framesToKeep = Math.floor(maxSeconds * audioBuffer.sampleRate)
  const offlineCtx = new OfflineAudioContext({
    numberOfChannels: audioBuffer.numberOfChannels,
    length: framesToKeep,
    sampleRate: audioBuffer.sampleRate,
  })

  const source = offlineCtx.createBufferSource()
  source.buffer = audioBuffer
  source.connect(offlineCtx.destination)
  source.start(0)

  const trimmedBuffer = await offlineCtx.startRendering()

  await audioCtx.close()

  return audioBufferToWav(trimmedBuffer)
}
