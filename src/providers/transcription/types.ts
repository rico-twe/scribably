export interface TranscriptionOptions {
  language: string;
  model?: string;
}

export interface TranscriptionResult {
  text: string;
  language: string;
  duration: number;
}

export interface TranscriptionProvider {
  id: string;
  name: string;
  transcribe(audio: Blob, options: TranscriptionOptions): Promise<TranscriptionResult>;
}
