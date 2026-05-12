import { useState, useMemo } from 'react'
import { search } from '../services/history-search'
import type { HistoryEntry } from '../services/history'

interface HistoryListProps {
  entries: HistoryEntry[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  currentRawText: string | null
  isViewingHistory: boolean
  onClear?: () => void
  onRemove?: (id: string) => void
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} h ago`
  return new Date(timestamp).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return m > 0 ? `${m}:${s.toString().padStart(2, '0')}` : `${s}s`
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).trimEnd() + '\u2026'
}

export function HistoryList({ entries, selectedId, onSelect, currentRawText, isViewingHistory, onClear, onRemove }: HistoryListProps) {
  const [confirming, setConfirming] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const hasCurrentRecording = !!currentRawText
  if (entries.length === 0 && !hasCurrentRecording) return null

  const filteredEntries = useMemo(() => {
    if (searchQuery.trim().length < 2) return entries
    return search(searchQuery)
  }, [entries, searchQuery])

  const handleConfirm = () => {
    onClear?.()
    setSearchQuery('')
    setConfirming(false)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Aktuelle Aufnahme */}
      {hasCurrentRecording && (
        <div>
          <p className="label-uppercase text-text-tertiary mb-2">Current recording</p>
          <button
            onClick={() => onSelect(null)}
            className={`
              w-full text-left p-3 rounded-[12px] border transition-all duration-150
              ${!isViewingHistory
                ? 'border-matcha-400 bg-matcha-300/10 shadow-clay'
                : 'border-border-oat bg-bg-card shadow-clay hover:bg-border-oat-light/40'
              }
            `}
          >
            <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
              {truncate(currentRawText, 80)}
            </p>
          </button>
        </div>
      )}

      {/* Letzte Aufnahmen */}
      {entries.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="label-uppercase text-text-tertiary">Recent recordings</p>
            {filteredEntries.length !== entries.length && (
              <span className="text-[10px] text-text-tertiary font-clay-ui">
                {filteredEntries.length} result
              </span>
            )}
          </div>
          {entries.length >= 3 && (
            <div className="relative mb-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none">
                <circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="History durchsuchen…"
                className="w-full pl-8 pr-3 py-1.5 rounded-[8px] border border-border-oat bg-bg-card text-[12px] text-text-secondary font-clay-ui placeholder:text-text-tertiary/60 focus:outline-none focus:border-matcha-500 focus:ring-1 focus:ring-matcha-500/30 transition-all"
              />
              {searchQuery.trim().length > 0 && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                  aria-label="Suche löschen"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          )}
          <div className="flex flex-col gap-2">
            {filteredEntries.map(entry => {
              const isSelected = entry.id === selectedId
              return (
                <button
                  key={entry.id}
                  onClick={() => onSelect(isSelected ? null : entry.id)}
                  className={`
                    w-full text-left p-3 rounded-[12px] border transition-all duration-150
                    ${isSelected
                      ? 'border-slushie-500 bg-slushie-500/5 shadow-clay'
                      : 'border-border-oat bg-bg-card shadow-clay hover:bg-border-oat-light/40'
                    }
                  `}
                >
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-1">
                    {truncate(entry.rawText, 60)}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-text-tertiary font-clay-ui">
                      {formatRelativeTime(entry.timestamp)}
                    </span>
                    <span className="text-[10px] text-text-tertiary font-clay-ui opacity-50">
                      {formatDuration(entry.duration)}
                    </span>
                    {entry.cleanedText && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-[4px] bg-ube-300/15 text-ube-600 font-clay-ui">
                        cleaned
                      </span>
                    )}
                    {entry.promptText && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-[4px] bg-slushie-500/15 text-slushie-600 font-clay-ui">
                        prompt
                      </span>
                    )}
                    {onRemove && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onRemove(entry.id)
                        }}
                        className="ml-auto text-text-tertiary hover:text-pomegranate-400 transition-colors"
                        aria-label="Eintrag löschen"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Löschen-Footer */}
          {onClear && (
            <div className="mt-3 pt-3 border-t border-dashed border-border-oat">
              {!confirming ? (
                <button
                  onClick={() => setConfirming(true)}
                  className="w-full label-uppercase text-text-tertiary py-2 px-3 rounded-[8px] border border-border-oat bg-transparent hover:text-pomegranate-400 hover:border-pomegranate-400/60 transition-colors duration-150"
                >
                  Clear history
                </button>
              ) : (
                <div className="flex flex-col gap-2 animate-fade-in">
                  <p className="text-[11px] text-text-tertiary text-center font-clay-ui">
                    Clear all history? This can't be undone.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfirming(false)}
                      className="flex-1 label-uppercase text-text-secondary py-2 px-3 rounded-[8px] border border-border-oat bg-bg-card hover:bg-border-oat-light/50 transition-colors duration-150"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="flex-1 label-uppercase text-white py-2 px-3 rounded-[8px] border border-pomegranate-400 bg-pomegranate-400 hover:-rotate-2 hover:shadow-[-4px_4px_0_0_#000] transition-all duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
