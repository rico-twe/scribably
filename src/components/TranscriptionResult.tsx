import { useState, useMemo } from 'react'
import type { Segment } from '../providers/transcription/types'
import { getLanguageName } from '../services/languages'

type Tab = 'raw' | 'clean' | 'prompt'

interface TranscriptionResultProps {
  rawText: string | null;
  cleanedText: string | null;
  promptText: string | null;
  isProcessing: boolean;
  showCleanTab?: boolean;
  showPromptTab?: boolean;
  isCleanProcessing?: boolean;
  isPromptProcessing?: boolean;
  onClean?: () => void;
  onPrompt?: () => void;
  onCleanedTextChange?: (text: string) => void;
  latexText?: string | null;
  showLatex?: boolean;
  segments?: Segment[];
  currentTime?: number;
  onSeek?: (t: number) => void;
  detectedLanguage?: string;
  availableLanguages?: { code: string; name: string }[];
  onLanguageCorrection?: (code: string) => void;
  suggestedDefault?: string | null;
  onAcceptDefault?: (code: string) => void;
}

const ALL_TABS: { id: Tab; label: string }[] = [
  { id: 'raw', label: 'Raw' },
  { id: 'clean', label: 'Cleaned' },
  { id: 'prompt', label: 'Prompt' },
]

export function TranscriptionResult({
  rawText, cleanedText, promptText, isProcessing,
  showCleanTab = false, showPromptTab = false,
  isCleanProcessing = false, isPromptProcessing = false,
  onClean, onPrompt, onCleanedTextChange,
  latexText, showLatex = false,
  segments, currentTime, onSeek,
  detectedLanguage, availableLanguages, onLanguageCorrection,
  suggestedDefault, onAcceptDefault,
}: TranscriptionResultProps) {
  const [activeTab, setActiveTab] = useState<Tab>('raw')

  const visibleTabs = useMemo(() =>
    ALL_TABS.filter(tab =>
      tab.id === 'raw' ||
      (tab.id === 'clean' && showCleanTab) ||
      (tab.id === 'prompt' && showPromptTab)
    ), [showCleanTab, showPromptTab])

  const textForTab: Record<Tab, string | null> = {
    raw: rawText,
    clean: cleanedText,
    prompt: promptText,
  }

  const effectiveTab = visibleTabs.some(t => t.id === activeTab) ? activeTab : 'raw'
  const currentText = textForTab[effectiveTab]
  const showLoading = isProcessing && effectiveTab !== 'raw' && !currentText

  const canProcess = !!rawText
  const showCleanButton = showCleanTab && !!onClean && canProcess
  const showPromptButton = showPromptTab && !!onPrompt && canProcess

  const detectedLanguageName = detectedLanguage ? getLanguageName(detectedLanguage) ?? detectedLanguage : undefined
  const suggestedDefaultName = suggestedDefault ? getLanguageName(suggestedDefault) ?? suggestedDefault : undefined

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-3 flex-wrap">
        {visibleTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-3 py-1 rounded-[8px] text-xs transition-all duration-150 font-clay-ui
              ${effectiveTab === tab.id
                ? 'bg-bg-card text-text-primary shadow-clay'
                : 'text-text-tertiary hover:text-text-primary hover:bg-border-oat-light/40'
              }
            `}
          >
            {tab.label}
          </button>
        ))}

        {detectedLanguage && detectedLanguageName && (
          <div className="ml-auto flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full bg-lemon-200/40 text-lemon-800 dark:text-lemon-400 text-[10px] font-clay-ui">
              {detectedLanguageName}
            </span>
            {availableLanguages && onLanguageCorrection && (
              <select
                defaultValue=""
                onChange={e => {
                  if (e.target.value) onLanguageCorrection(e.target.value)
                  e.target.value = ''
                }}
                className="appearance-none bg-transparent text-[10px] text-text-tertiary hover:text-text-primary cursor-pointer font-clay-ui border-none outline-none"
                title="Re-transcribe with different language"
                aria-label="Correct detected language"
              >
                <option value="" disabled>Fix language</option>
                {availableLanguages.map(l => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {/* Suggested default hint */}
      {suggestedDefault && suggestedDefaultName && onAcceptDefault && (
        <div className="mb-2 flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-lemon-200/30 border border-lemon-400/30">
          <span className="text-[11px] text-lemon-800 dark:text-lemon-400 font-clay-ui flex-1">
            Set <strong>{suggestedDefaultName}</strong> as default language?
          </span>
          <button
            onClick={() => onAcceptDefault(suggestedDefault)}
            className="px-2 py-0.5 rounded-[6px] text-[10px] font-clay-ui bg-lemon-400/60 text-lemon-900 transition-all hover:-rotate-6 hover:-translate-y-0.5 hover:shadow-[-4px_4px_0_0_#000]"
          >
            Yes
          </button>
        </div>
      )}

      {/* Content area */}
      <div className="relative bg-bg-card border border-border-oat rounded-[24px] shadow-clay flex-1 overflow-auto text-sm leading-relaxed">
        {showLoading ? (
          <div className="p-5 flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-slushie-500/50 border-t-transparent rounded-full animate-spin-smooth" />
            <span className="text-text-tertiary text-xs font-clay-ui">Processing...</span>
          </div>
        ) : showLatex && latexText ? (
          <pre className="p-5 whitespace-pre-wrap font-mono text-text-secondary text-[12px] leading-[1.6] overflow-auto">{latexText}</pre>
        ) : effectiveTab === 'clean' && cleanedText != null && onCleanedTextChange ? (
          <textarea
            value={cleanedText}
            onChange={e => onCleanedTextChange(e.target.value)}
            className="w-full h-full bg-transparent p-5 text-text-secondary resize-none outline-none whitespace-pre-wrap text-[13px] leading-[1.7]"
          />
        ) : effectiveTab === 'raw' && segments && segments.length > 0 ? (
          <p className="p-5 whitespace-pre-wrap text-text-secondary text-[13px] leading-[1.7]">
            {segments.map((seg, i) => {
              const active = currentTime != null && currentTime >= seg.start && currentTime < seg.end
              return (
                <span
                  key={i}
                  onClick={() => onSeek?.(seg.start)}
                  className={`cursor-pointer rounded px-0.5 transition-colors hover:underline ${active ? 'bg-lemon-300/30' : ''}`}
                >
                  {seg.text}
                </span>
              )
            })}
          </p>
        ) : currentText ? (
          <p className="p-5 whitespace-pre-wrap text-text-secondary text-[13px] leading-[1.7]">{currentText}</p>
        ) : (
          <div className="p-5 flex flex-col items-center justify-center h-full min-h-[200px] text-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-border-oat mb-3">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
            <p className="text-text-tertiary text-xs font-clay-ui">
              {rawText ? 'No processed text yet.' : 'Record something to get started.'}
            </p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {(showCleanButton || showPromptButton) && (
        <div className="mt-3 flex gap-2">
          {showCleanButton && (
            <button
              onClick={onClean}
              disabled={isCleanProcessing}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] text-xs font-clay-ui transition-all bg-bg-card text-text-secondary border border-border-oat shadow-clay hover:shadow-clay-hover hover:bg-ube-300/10 hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isCleanProcessing && (
                <div className="w-3 h-3 border-[1.5px] border-ube-800/50 border-t-transparent rounded-full animate-spin-smooth" />
              )}
              {isCleanProcessing ? 'Cleaning...' : cleanedText ? 'Clean again' : 'Clean'}
            </button>
          )}
          {showPromptButton && (
            <button
              onClick={onPrompt}
              disabled={isPromptProcessing}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] text-xs font-clay-ui transition-all bg-bg-card text-text-secondary border border-border-oat shadow-clay hover:shadow-clay-hover hover:bg-slushie-500/10 hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isPromptProcessing && (
                <div className="w-3 h-3 border-[1.5px] border-slushie-800/50 border-t-transparent rounded-full animate-spin-smooth" />
              )}
              {isPromptProcessing ? 'Generating prompt...' : promptText ? 'Regenerate prompt' : 'Generate prompt'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
