import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { getSystemPrompt } from '../providers/text-processing/prompts'
import { ProviderConfig } from './ProviderConfig'
import { ConnectionTestButton } from './ConnectionTestButton'
import { QRCodeTransfer } from './QRCodeTransfer'
import { exportConfigToBase64, importConfigFromBase64, clearConfig } from '../services/config'
import { isDemoConfig } from '../services/demo-config'
import { testSTTConnection, testLLMConnection } from '../services/connection-test'
import { listAudioInputDevices } from '../services/audio'
import type { AppConfig, PresetType } from '../services/config-types'
import {
  BUILTIN_PRESET_ORDER,
  PRESET_LABELS,
  applyPreset,
  applyCustomPreset,
  saveCustomPreset,
  deleteCustomPreset,
  listCustomPresets,
  getPresetDescription,
  type CustomPreset,
} from '../services/presets'
import { SUPPORTED_LANGUAGES } from '../services/languages'

const STT_PROVIDERS = [
  { id: 'groq', name: 'Groq (Whisper Large v3)' },
  { id: 'openai-whisper', name: 'OpenAI (Whisper)' },
]

const LLM_PROVIDERS = [
  { id: 'openai-compatible', name: 'OpenAI-Compatible (OpenAI, Groq, OpenRouter, ...)' },
  { id: 'anthropic', name: 'Anthropic (Claude)' },
]

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onConfigChange: (updates: Partial<AppConfig>) => void;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block label-uppercase text-text-tertiary mb-2">{children}</label>
  )
}

interface PresetSelectorProps {
  config: AppConfig;
  onConfigChange: (updates: Partial<AppConfig>) => void;
}

function PresetSelector({ config, onConfigChange }: PresetSelectorProps) {
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customPresets, _setCustomPresets] = useState<CustomPreset[]>(() => listCustomPresets())
  const [showError, setShowError] = useState(false)

  const setCustomPresets = (updater: CustomPreset[] | ((prev: CustomPreset[]) => CustomPreset[])) => {
    const next = typeof updater === 'function' ? updater(listCustomPresets()) : updater
    _setCustomPresets(next)
  }

  const handlePresetClick = (type: PresetType) => {
    onConfigChange(applyPreset(type, config))
  }

  const handleCustomClick = (preset: CustomPreset) => {
    onConfigChange(applyCustomPreset(preset, config))
  }

  const handleDelete = (name: string) => {
    deleteCustomPreset(name)
    setCustomPresets(prev => prev.filter(p => p.name !== name))
    if (config.activePreset === undefined && customPresets.some(p => p.name === name)) {
      onConfigChange({ activePreset: undefined })
    }
  }

  const handleSave = () => {
    if (!customName.trim()) {
      setShowError(true)
      return
    }
    saveCustomPreset(customName.trim(), config)
    setCustomPresets(listCustomPresets())
    setCustomName('')
    setShowSaveModal(false)
    setShowError(false)
  }

  const isInheritedPreset = config.activePreset != null && BUILTIN_PRESET_ORDER.includes(config.activePreset)

  return (
    <section>
      <SectionLabel>Quick presets</SectionLabel>
      <div className="flex flex-wrap gap-1.5">
        {BUILTIN_PRESET_ORDER.map(type => {
          const isActive = config.activePreset === type
          return (
            <button
              key={type}
              type="button"
              title={getPresetDescription(type)}
              className={`
                px-2.5 py-1 text-xs rounded-[6px] transition-colors font-clay-ui
                ${isActive
                  ? 'border border-lemon-400/60 bg-lemon-400/15 text-lemon-500'
                  : 'border border-border-oat text-text-tertiary hover:text-text-secondary hover:border-border-oat-light'
                }
              `}
              onClick={() => handlePresetClick(type)}
            >
              {PRESET_LABELS[type]}
            </button>
          )
        })}
      </div>

      {customPresets.length > 0 && (
        <>
          <p className="text-[11px] text-text-tertiary mt-2 mb-1">Custom</p>
          <div className="flex flex-wrap gap-1.5">
            {customPresets.map(preset => {
              const isActive = !isInheritedPreset &&
                config.enableCleaning === preset.enableCleaning &&
                config.enablePrompt === preset.enablePrompt &&
                config.customPrompt === preset.customPrompt
              return (
                <div key={preset.name} className="flex items-center gap-0.5">
                  <button
                    type="button"
                    className={`
                      px-2.5 py-1 text-xs rounded-[6px] transition-colors font-clay-ui truncate max-w-[120px]
                      ${isActive
                        ? 'border border-lemon-400/60 bg-lemon-400/15 text-lemon-500'
                        : 'border border-border-oat text-text-tertiary hover:text-text-secondary hover:border-border-oat-light'
                      }
                    `}
                    onClick={() => handleCustomClick(preset)}
                    title={preset.name}
                  >
                    {preset.name}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(preset.name)}
                    className="text-text-tertiary hover:text-red-400 text-[10px] px-1 transition-colors"
                    title="Delete preset"
                    aria-label={`Delete preset ${preset.name}`}
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        </>
      )}

      <button
        type="button"
        onClick={() => setShowSaveModal(true)}
        className="mt-2 text-xs text-text-tertiary hover:text-text-secondary underline underline-offset-2 transition-colors font-clay-ui"
      >
        + Save current setup as custom preset
      </button>

      {/* Save modal */}
      {showSaveModal && createPortal(
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60] transition-opacity duration-200"
            onClick={() => { setShowSaveModal(false); setShowError(false) }}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] bg-bg-card border border-border-oat rounded-[12px] p-5 w-[300px] shadow-xl">
            <h3 className="text-sm font-clay-heading text-text-primary mb-3">Save custom preset</h3>
            <input
              type="text"
              value={customName}
              onChange={e => { setCustomName(e.target.value); setShowError(false) }}
              onKeyDown={e => { if (e.key === 'Enter') handleSave() }}
              placeholder="Preset name"
              autoFocus
              className={`w-full bg-bg-page rounded-[4px] px-3 py-2 text-sm text-text-primary border focus:outline focus:outline-2 focus:outline-[rgb(20,110,245)] transition-colors ${showError ? 'border-red-400' : 'border-border-input'}`}
            />
            {showError && (
              <p className="text-xs text-red-400 mt-1">Name is required.</p>
            )}
            <div className="flex justify-end gap-2 mt-3">
              <button
                type="button"
                onClick={() => { setShowSaveModal(false); setShowError(false) }}
                className="px-3 py-1.5 text-xs font-clay-ui text-text-tertiary hover:text-text-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-3 py-1.5 text-xs font-clay-ui text-bg-page bg-lemon-400 hover:bg-lemon-500 rounded-[4px] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </>,
        document.body,
      )}
    </section>
  )
}

export function SettingsPanel({ isOpen, onClose, config, onConfigChange }: SettingsPanelProps) {
  const [audioDevices, setAudioDevices] = useState<{ deviceId: string; label: string }[]>([])

  useEffect(() => {
    let cancelled = false
    listAudioInputDevices().then(devices => { if (!cancelled) setAudioDevices(devices) }).catch(() => {})
    return () => { cancelled = true }
  }, [])

  const handleImport = (encoded: string) => {
    try {
      const imported = importConfigFromBase64(encoded)
      onConfigChange(imported)
    } catch {
      // ignore invalid input
    }
  }

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full z-50 bg-bg-card border-l border-border-oat
          w-full md:w-[420px] overflow-y-auto
          ${isOpen ? 'animate-slide-in' : 'translate-x-full'}
        `}
      >
        <div className="p-6 space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-clay-heading text-text-primary tracking-[-0.2px]">Settings</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-7 h-7 rounded-[8px] flex items-center justify-center text-text-tertiary hover:text-text-secondary hover:bg-border-oat-light/50 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" />
              </svg>
            </button>
          </div>

          {isDemoConfig(config) && (
            <div className="rounded-[12px] bg-lemon-400/10 border border-lemon-400/30 p-4 space-y-2">
              <p className="text-[11px] font-clay-ui label-uppercase text-lemon-500">Demo mode active</p>
              <p className="text-xs text-text-secondary leading-relaxed">
                Using a shared demo key — recordings are capped at 30 s. Enter your own API key below to unlock full access.
              </p>
              <button
                onClick={() => { clearConfig(); window.location.reload() }}
                className="text-[11px] font-clay-ui text-text-tertiary hover:text-text-secondary underline underline-offset-2 transition-colors"
              >
                Reset to demo mode
              </button>
            </div>
          )}

          {/* Speech-to-Text */}
          <section className="space-y-3">
            <ProviderConfig
              label="Speech-to-Text"
              providers={STT_PROVIDERS}
              selectedId={config.sttProvider?.providerId ?? null}
              apiKey={config.sttProvider?.apiKey ?? ''}
              onProviderChange={id => onConfigChange({
                sttProvider: { providerId: id, apiKey: config.sttProvider?.apiKey ?? '' },
              })}
              onApiKeyChange={key => onConfigChange({
                sttProvider: { ...config.sttProvider!, apiKey: key },
              })}
            />
            {config.sttProvider?.apiKey && (
              <ConnectionTestButton onTest={() => testSTTConnection(config.sttProvider!)} />
            )}
          </section>

          {/* Divider */}
          <div className="border-t border-border-oat" />

          {/* Post-processing */}
          <section className="space-y-3">
            <SectionLabel>Post-processing</SectionLabel>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={!!config.enableCleaning}
                onChange={e => onConfigChange({ enableCleaning: e.target.checked })}
              />
              <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">Clean text</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={!!config.enablePrompt}
                onChange={e => onConfigChange({ enablePrompt: e.target.checked })}
              />
              <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">Generate prompt</span>
            </label>
          </section>

          {/* Divider */}
          <div className="border-t border-border-oat" />

          {/* Preset Selector */}
          <PresetSelector config={config} onConfigChange={onConfigChange} />

          {/* Divider */}
          <div className="border-t border-border-oat" />

          {/* LLM Provider */}
          <section className="space-y-3">
            <ProviderConfig
              label="Text Processing (LLM)"
              providers={LLM_PROVIDERS}
              selectedId={config.llmProvider?.providerId ?? null}
              apiKey={config.llmProvider?.apiKey ?? ''}
              baseUrl={config.llmProvider?.baseUrl}
              model={config.llmProvider?.model}
              showBaseUrl={config.llmProvider?.providerId === 'openai-compatible'}
              showModel={config.llmProvider?.providerId != null}
              onProviderChange={id => onConfigChange({
                llmProvider: { providerId: id, apiKey: config.llmProvider?.apiKey ?? '' },
              })}
              onApiKeyChange={key => onConfigChange({
                llmProvider: { ...config.llmProvider!, apiKey: key },
              })}
              onBaseUrlChange={url => onConfigChange({
                llmProvider: { ...config.llmProvider!, baseUrl: url },
              })}
              onModelChange={model => onConfigChange({
                llmProvider: { ...config.llmProvider!, model },
              })}
            />
            {config.llmProvider?.apiKey && (
              <ConnectionTestButton onTest={() => testLLMConnection(config.llmProvider!)} />
            )}
          </section>

          {/* Divider */}
          <div className="border-t border-border-oat" />

          {/* Language */}
          <section>
            <SectionLabel>Language</SectionLabel>
            <select
              value={config.language}
              onChange={e => onConfigChange({ language: e.target.value })}
              className="w-full appearance-none bg-bg-card rounded-[4px] px-3 py-2 text-sm text-text-primary border border-border-input focus:outline focus:outline-2 focus:outline-[rgb(20,110,245)] transition-colors"
            >
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </section>

          {/* Divider */}
          <div className="border-t border-border-oat" />

          {/* Microphone */}
          <section>
            <SectionLabel>Microphone</SectionLabel>
            {audioDevices.length === 0 ? (
              <p className="text-xs text-text-tertiary">Grant microphone permission to see device names.</p>
            ) : (
              <select
                value={config.audioDeviceId ?? ''}
                onChange={e => onConfigChange({ audioDeviceId: e.target.value || undefined })}
                className="w-full appearance-none bg-bg-card rounded-[4px] px-3 py-2 text-sm text-text-primary border border-border-input focus:outline focus:outline-2 focus:outline-[rgb(20,110,245)] transition-colors"
              >
                <option value="">Default</option>
                {audioDevices.map(d => (
                  <option key={d.deviceId} value={d.deviceId}>{d.label}</option>
                ))}
              </select>
            )}
          </section>

          {/* Divider */}
          <div className="border-t border-border-oat" />

          {/* Custom prompt */}
          <section>
            <SectionLabel>Custom prompt (cleanup)</SectionLabel>
            <textarea
              value={config.customPrompt ?? ''}
              onChange={e => onConfigChange({ customPrompt: e.target.value || undefined })}
              placeholder="Custom instructions. Leave empty for the default."
              rows={3}
              className="w-full bg-bg-card rounded-[4px] px-3 py-2 text-sm text-text-secondary border border-border-input focus:outline focus:outline-2 focus:outline-[rgb(20,110,245)] resize-y transition-colors placeholder:text-text-tertiary"
            />
          </section>

          {/* Default prompts */}
          <section className="space-y-2">
            <SectionLabel>Default prompts</SectionLabel>
            <details>
              <summary className="text-xs text-text-secondary cursor-pointer hover:text-text-primary transition-colors font-clay-ui py-1">
                Cleanup
              </summary>
              <pre className="mt-1.5 p-3 bg-bg-page border border-border-oat-light rounded-[8px] text-[11px] text-text-tertiary font-mono whitespace-pre-wrap leading-relaxed">{getSystemPrompt('clean', config.language)}</pre>
            </details>
            <details>
              <summary className="text-xs text-text-secondary cursor-pointer hover:text-text-primary transition-colors font-clay-ui py-1">
                Prompt generation
              </summary>
              <pre className="mt-1.5 p-3 bg-bg-page border border-border-oat-light rounded-[8px] text-[11px] text-text-tertiary font-mono whitespace-pre-wrap leading-relaxed">{getSystemPrompt('prompt', config.language)}</pre>
            </details>
          </section>

          {/* Divider */}
          <div className="border-t border-border-oat" />

          {/* QR Transfer */}
          <QRCodeTransfer
            configBase64={exportConfigToBase64(config)}
            onImport={handleImport}
          />

          {/* Bottom spacer */}
          <div className="h-4" />
        </div>
      </div>
    </>,
    document.body,
  )
}
