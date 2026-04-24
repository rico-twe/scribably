export interface TranscriptionOptions {
  language: string;
  model?: string;
}

export interface Segment {
  start: number;
  end: number;
  text: string;
}

export interface TranscriptionResult {
  text: string;
  language: string;
  duration: number;
  segments?: Segment[];
}

export interface TranscriptionProvider {
  id: string;
  name: string;
  transcribe(audio: Blob, options: TranscriptionOptions): Promise<TranscriptionResult>;
}
