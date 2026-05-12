export interface ProviderConfig {
  providerId: string;
  apiKey: string;
  baseUrl?: string;
  model?: string;
  isDemo?: boolean;
}

export type PresetType =
  | 'journal-entry'
  | 'claude-prompt'
  | 'email-draft'
  | 'meeting-memo'
  | 'commit-message'
  | 'raw'

export interface AppConfig {
  sttProvider: ProviderConfig | null;
  llmProvider: ProviderConfig | null;
  language: string;
  customPrompt?: string;
  enableCleaning?: boolean;
  enablePrompt?: boolean;
  audioDeviceId?: string;
  activePreset?: PresetType;
}

export const DEFAULT_CONFIG: AppConfig = {
  sttProvider: null,
  llmProvider: null,
  language: 'en',
}
