import { useState } from 'react'
import type { ConnectionTestResult } from '../services/connection-test'

type TestState = 'idle' | 'testing' | 'success' | 'error'

interface ConnectionTestButtonProps {
  onTest: () => Promise<ConnectionTestResult>;
}

export function ConnectionTestButton({ onTest }: ConnectionTestButtonProps) {
  const [state, setState] = useState<TestState>('idle')
  const [error, setError] = useState<string | null>(null)

  const handleTest = async () => {
    setState('testing')
    setError(null)
    const result = await onTest()
    if (result.success) {
      setState('success')
    } else {
      setState('error')
      setError(result.error ?? 'Unbekannter Fehler')
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleTest}
        disabled={state === 'testing'}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-clay-ui transition-all
          ${state === 'success'
            ? 'bg-matcha-300/20 text-matcha-600 border border-matcha-300/40'
            : state === 'error'
              ? 'bg-pomegranate-400/10 text-pomegranate-400 border border-pomegranate-400/30'
              : 'bg-bg-card text-text-secondary hover:text-text-primary hover:shadow-clay-hover border border-border-oat shadow-clay'
          }
          disabled:opacity-40 disabled:cursor-not-allowed
        `}
      >
        {state === 'testing' && (
          <div className="w-3 h-3 border-[1.5px] border-slushie-500/50 border-t-transparent rounded-full animate-spin-smooth" />
        )}
        {state === 'success' && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-matcha-600">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {state === 'error' && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-pomegranate-400">
            <line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" />
          </svg>
        )}
        {state === 'testing' && 'Teste...'}
        {state === 'success' && 'Verbunden'}
        {state === 'error' && 'Fehlgeschlagen'}
        {state === 'idle' && 'Verbindung testen'}
      </button>
      {state === 'error' && error && (
        <span className="text-[11px] text-pomegranate-400/70 truncate max-w-[200px]" title={error}>{error}</span>
      )}
    </div>
  )
}
