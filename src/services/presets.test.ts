import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  applyPreset,
  applyCustomPreset,
  saveCustomPreset,
  deleteCustomPreset,
  listCustomPresets,
  getPresetConfig,
  getPresetDescription,
  BUILTIN_PRESET_ORDER,
  PRESET_LABELS,
} from './presets'
import { DEFAULT_CONFIG } from './config-types'

// Provide a real localStorage mock since jsdom's localStorage is not functional in this environment
const store: Record<string, string> = {}
const localStorageMock = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value },
  removeItem: (key: string) => { delete store[key] },
  clear: () => { Object.keys(store).forEach(k => delete store[k]) },
}

beforeAll(() => {
  vi.stubGlobal('localStorage', localStorageMock)
})

afterAll(() => {
  vi.unstubAllGlobals()
})

describe('presets', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  describe('PRESET_LABELS', () => {
    it('has labels for all preset types', () => {
      expect(Object.keys(PRESET_LABELS)).toHaveLength(BUILTIN_PRESET_ORDER.length)
      expect(PRESET_LABELS['journal-entry']).toBe('Journal Entry')
      expect(PRESET_LABELS['raw']).toBe('Raw')
    })
  })

  describe('applyPreset', () => {
    it('sets cleaning only for journal-entry', () => {
      const result = applyPreset('journal-entry', DEFAULT_CONFIG)
      expect(result.enableCleaning).toBe(true)
      expect(result.enablePrompt).toBe(false)
      expect(result.activePreset).toBe('journal-entry')
    })

    it('sets prompt only for claude-prompt', () => {
      const result = applyPreset('claude-prompt', DEFAULT_CONFIG)
      expect(result.enableCleaning).toBe(false)
      expect(result.enablePrompt).toBe(true)
      expect(result.activePreset).toBe('claude-prompt')
    })

    it('sets both for email-draft', () => {
      const result = applyPreset('email-draft', DEFAULT_CONFIG)
      expect(result.enableCleaning).toBe(true)
      expect(result.enablePrompt).toBe(true)
      expect(result.customPrompt).toBeDefined()
    })

    it('leaves both off for raw', () => {
      const result = applyPreset('raw', DEFAULT_CONFIG)
      expect(result.enableCleaning).toBe(false)
      expect(result.enablePrompt).toBe(false)
    })

    it('preserves unrelated config fields', () => {
      const base = { ...DEFAULT_CONFIG, language: 'de', audioDeviceId: 'mic-1' }
      const result = applyPreset('raw', base)
      expect(result.language).toBe('de')
      expect(result.audioDeviceId).toBe('mic-1')
    })

    it('does not mutate base config', () => {
      applyPreset('journal-entry', DEFAULT_CONFIG)
      expect(DEFAULT_CONFIG.enableCleaning).toBe(undefined)
    })
  })

  describe('applyCustomPreset', () => {
    it('applies custom preset values', () => {
      const preset = { name: 'test', enableCleaning: true, enablePrompt: false }
      const result = applyCustomPreset(preset, DEFAULT_CONFIG)
      expect(result.enableCleaning).toBe(true)
      expect(result.enablePrompt).toBe(false)
      expect(result.activePreset).toBe(undefined)
    })
  })

  describe('getPresetConfig', () => {
    it('returns config for built-in presets', () => {
      const config = getPresetConfig('raw')
      expect(config).toBeDefined()
      expect(config!.enableCleaning).toBe(false)
      expect(config!.enablePrompt).toBe(false)
    })

    it('returns undefined for unknown type', () => {
      // @ts-expect-error testing invalid input
      expect(getPresetConfig('unknown')).toBeUndefined()
    })
  })

  describe('getPresetDescription', () => {
    it('returns non-empty description', () => {
      expect(getPresetDescription('journal-entry').length).toBeGreaterThan(0)
    })
  })

  describe('saveCustomPreset / listCustomPresets / deleteCustomPreset', () => {
    it('saves and retrieves a custom preset', () => {
      saveCustomPreset('My Preset', {
        ...DEFAULT_CONFIG,
        enableCleaning: true,
        enablePrompt: true,
      })
      const list = listCustomPresets()
      expect(list).toHaveLength(1)
      expect(list[0].name).toBe('My Preset')
      expect(list[0].enableCleaning).toBe(true)
    })

    it('updates preset with same name', () => {
      saveCustomPreset('My Preset', {
        ...DEFAULT_CONFIG,
        enableCleaning: true,
      })
      saveCustomPreset('My Preset', {
        ...DEFAULT_CONFIG,
        enableCleaning: false,
        enablePrompt: true,
      })
      const list = listCustomPresets()
      expect(list).toHaveLength(1)
      expect(list[0].enableCleaning).toBe(false)
      expect(list[0].enablePrompt).toBe(true)
    })

    it('deletes a custom preset', () => {
      saveCustomPreset('Delete Me', DEFAULT_CONFIG)
      deleteCustomPreset('Delete Me')
      expect(listCustomPresets()).toHaveLength(0)
    })

    it('does not crash on delete of non-existent preset', () => {
      deleteCustomPreset('Does Not Exist')
      expect(listCustomPresets()).toHaveLength(0)
    })
  })

  describe('BUILTIN_PRESET_ORDER', () => {
    it('includes all six presets', () => {
      expect(BUILTIN_PRESET_ORDER).toEqual([
        'journal-entry',
        'claude-prompt',
        'email-draft',
        'meeting-memo',
        'commit-message',
        'raw',
      ])
    })
  })
})
