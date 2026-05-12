import type { AppConfig } from './config-types'

export type PresetType =
  | 'journal-entry'
  | 'claude-prompt'
  | 'email-draft'
  | 'meeting-memo'
  | 'commit-message'
  | 'raw'

export const PRESET_LABELS: Record<PresetType, string> = {
  'journal-entry': 'Journal Entry',
  'claude-prompt': 'Claude Prompt',
  'email-draft': 'Email Draft',
  'meeting-memo': 'Meeting Memo',
  'commit-message': 'Commit Message',
  'raw': 'Raw',
}

const PRESET_DESCRIPTIONS: Record<PresetType, string> = {
  'journal-entry': 'Cleaning focus — polished prose from spoken thoughts',
  'claude-prompt': 'Prompt focus — ready to paste into an AI assistant',
  'email-draft': 'Clean + prompt for professional email writing',
  'meeting-memo': 'Clean + prompt for structured meeting summaries',
  'commit-message': 'Prompt focus — Git commit message from a description',
  'raw': 'No processing — verbatim transcript',
}

export interface PresetConfig {
  enableCleaning: boolean
  enablePrompt: boolean
  customPrompt?: string
}

const BUILT_IN: Record<PresetType, PresetConfig> = {
  'journal-entry': {
    enableCleaning: true,
    enablePrompt: false,
  },
  'claude-prompt': {
    enableCleaning: false,
    enablePrompt: true,
  },
  'email-draft': {
    enableCleaning: true,
    enablePrompt: true,
    customPrompt: 'Schreibe eine professionelle, klare E-Mail basierend auf dem Transkript.',
  },
  'meeting-memo': {
    enableCleaning: true,
    enablePrompt: true,
    customPrompt: 'Erstelle eine prägnante Meeting-Zusammenfassung mit den wichtigsten Beschlüssen und Action Items.',
  },
  'commit-message': {
    enableCleaning: false,
    enablePrompt: true,
    customPrompt: 'Erstelle eine prägnante Git-Commit-Nachricht (Subject + Body) auf Englisch.',
  },
  'raw': {
    enableCleaning: false,
    enablePrompt: false,
  },
}

export const BUILTIN_PRESET_ORDER: PresetType[] = [
  'journal-entry',
  'claude-prompt',
  'email-draft',
  'meeting-memo',
  'commit-message',
  'raw',
]

export interface CustomPreset {
  name: string
  enableCleaning?: boolean
  enablePrompt?: boolean
  customPrompt?: string
}

const CUSTOM_PRESETS_KEY = 'scribably-presets'

function getSavedPresets(): CustomPreset[] {
  try {
    const raw = localStorage.getItem(CUSTOM_PRESETS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function applyPreset(type: PresetType, baseConfig: AppConfig): AppConfig {
  const preset = BUILT_IN[type]
  return {
    ...baseConfig,
    enableCleaning: preset.enableCleaning,
    enablePrompt: preset.enablePrompt,
    customPrompt: preset.customPrompt,
    activePreset: type,
  }
}

export function applyCustomPreset(preset: CustomPreset, baseConfig: AppConfig): AppConfig {
  return {
    ...baseConfig,
    enableCleaning: preset.enableCleaning,
    enablePrompt: preset.enablePrompt,
    customPrompt: preset.customPrompt,
    activePreset: undefined,
  }
}

export function saveCustomPreset(name: string, config: AppConfig): void {
  const presets = getSavedPresets()
  const existing = presets.findIndex(p => p.name === name)

  const newPreset: CustomPreset = {
    name,
    enableCleaning: config.enableCleaning,
    enablePrompt: config.enablePrompt,
    customPrompt: config.customPrompt,
  }

  if (existing >= 0) {
    presets[existing] = newPreset
  } else {
    presets.push(newPreset)
  }

  localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(presets))
}

export function deleteCustomPreset(name: string): void {
  const presets = getSavedPresets()
  const filtered = presets.filter(p => p.name !== name)
  localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(filtered))
}

export function listCustomPresets(): CustomPreset[] {
  return getSavedPresets()
}

export function getPresetConfig(type: PresetType): PresetConfig | undefined {
  return BUILT_IN[type]
}

export function getPresetDescription(type: PresetType): string {
  return PRESET_DESCRIPTIONS[type]
}
