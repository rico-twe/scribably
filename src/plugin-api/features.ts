const enabled = new Set<string>([
  'transcription',
  'textProcessing',
  'history',
  'qrTransfer',
])

export function isFeatureEnabled(id: string): boolean {
  return enabled.has(id)
}

export function enableFeature(id: string): void {
  enabled.add(id)
}

export function disableFeature(id: string): void {
  enabled.delete(id)
}
