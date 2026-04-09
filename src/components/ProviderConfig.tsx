import { useState } from 'react'

interface ProviderOption {
  id: string;
  name: string;
}

interface ProviderConfigProps {
  label: string;
  providers: ProviderOption[];
  selectedId: string | null;
  apiKey: string;
  baseUrl?: string;
  model?: string;
  onProviderChange: (id: string) => void;
  onApiKeyChange: (key: string) => void;
  onBaseUrlChange?: (url: string) => void;
  onModelChange?: (model: string) => void;
  showBaseUrl?: boolean;
  showModel?: boolean;
}

const inputClass = 'w-full bg-bg-card rounded-[4px] px-3 py-2 text-sm text-text-primary border border-border-input focus:outline focus:outline-2 focus:outline-[rgb(20,110,245)] transition-colors placeholder:text-text-tertiary'

export function ProviderConfig({
  label, providers, selectedId, apiKey,
  baseUrl, model,
  onProviderChange, onApiKeyChange, onBaseUrlChange, onModelChange,
  showBaseUrl, showModel,
}: ProviderConfigProps) {
  const [showKey, setShowKey] = useState(false)

  return (
    <div className="space-y-2">
      <label className="block label-uppercase text-text-tertiary">{label}</label>
      <select
        value={selectedId ?? ''}
        onChange={e => onProviderChange(e.target.value)}
        className={`${inputClass} appearance-none`}
      >
        <option value="">Provider wählen...</option>
        {providers.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      {selectedId && (
        <div className="space-y-2">
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={e => onApiKeyChange(e.target.value)}
              placeholder="API Key"
              className={`${inputClass} pr-14`}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-[4px] text-[10px] font-clay-ui text-text-tertiary hover:text-text-secondary hover:bg-border-oat-light/50 transition-colors"
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>
          {showBaseUrl && (
            <input
              type="text"
              value={baseUrl ?? ''}
              onChange={e => onBaseUrlChange?.(e.target.value)}
              placeholder="Base URL (z.B. https://api.openai.com/v1)"
              className={inputClass}
            />
          )}
          {showModel && (
            <input
              type="text"
              value={model ?? ''}
              onChange={e => onModelChange?.(e.target.value)}
              placeholder="Model (z.B. gpt-4o)"
              className={inputClass}
            />
          )}
        </div>
      )}
    </div>
  )
}
