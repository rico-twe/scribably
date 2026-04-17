export interface ProviderConfig {
  providerId: string;
  apiKey: string;
  baseUrl?: string;
  model?: string;
}

export interface AppConfig {
  sttProvider: ProviderConfig | null;
  llmProvider: ProviderConfig | null;
  language: string;
  customPrompt?: string;
  enableCleaning?: boolean;
  enablePrompt?: boolean;
}

export const DEFAULT_CONFIG: AppConfig = {
  sttProvider: null,
  llmProvider: null,
  language: 'en',
}
