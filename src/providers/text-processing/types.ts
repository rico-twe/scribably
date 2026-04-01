export type ProcessingMode = 'clean' | 'prompt' | 'execute'

export interface ProcessingOptions {
  mode: ProcessingMode;
  language: string;
  customSystemPrompt?: string;
}

export interface ProcessingResult {
  text: string;
  tokensUsed?: number;
}

export interface TextProcessingProvider {
  id: string;
  name: string;
  process(text: string, options: ProcessingOptions): Promise<ProcessingResult>;
}
