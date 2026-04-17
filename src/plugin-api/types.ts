import type { TranscriptionProvider } from '../providers/transcription/types'
import type { TextProcessingProvider } from '../providers/text-processing/types'

export interface AppContext {
  registerTranscriptionProvider(provider: TranscriptionProvider): void
  registerTextProcessingProvider(provider: TextProcessingProvider): void
  enableFeature(id: string): void
}

export interface FeaturePlugin {
  id: string
  name: string
  activate(context: AppContext): void | Promise<void>
}
