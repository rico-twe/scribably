import { useCallback, useState } from 'react'
import type { TranscriptionQueueEntry, QueueEntryStatus } from '../hooks/useTranscriptionQueue'

interface FileDropZoneProps {
  onFilesDrop: (files: File[]) => void
  queueEntries: TranscriptionQueueEntry[]
  onRemove: (id: string) => void
  onReorder: (from: number, to: number) => void
  isPaused: boolean
  isProcessing: boolean
}

const ACCEPTED_TYPES = ['.webm', '.wav', '.mp3', '.m4a', '.ogg']

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

function statusIcon(status: QueueEntryStatus) {
  switch (status) {
    case 'pending':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-tertiary">
          <circle cx="12" cy="12" r="10" />
        </svg>
      )
    case 'running':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-matcha-600 animate-spin">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      )
    case 'done':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-matcha-600">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )
    case 'failed':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-pomegranate-500">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      )
    case 'paused':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-lemon-600">
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
      )
  }
}

export function FileDropZone({
  onFilesDrop,
  queueEntries,
  onRemove,
  onReorder,
  isPaused,
  isProcessing,
}: FileDropZoneProps) {
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files).filter(f =>
      ACCEPTED_TYPES.some(ext => f.name.toLowerCase().endsWith(ext) || f.type.startsWith('audio/'))
    )
    if (files.length > 0) onFilesDrop(files)
  }, [onFilesDrop])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length > 0) onFilesDrop(files)
    e.target.value = ''
  }, [onFilesDrop])

  const handleReorder = useCallback((index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1
    if (target >= 0 && target < queueEntries.length) {
      onReorder(index, target)
    }
  }, [queueEntries.length, onReorder])

  return (
    <div className="flex flex-col gap-3">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`w-full border-2 border-dashed rounded-[12px] p-6 text-center transition-all cursor-pointer ${
          dragOver
            ? 'border-matcha-600 bg-matcha-600/5 scale-[1.01]'
            : 'border-border-oat hover:border-border-input hover:bg-lemon-400/5'
        }`}
      >
        <label className="cursor-pointer flex flex-col items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-text-tertiary group-hover:text-text-secondary transition-colors">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
          </svg>
          <span className="text-[12px] text-text-tertiary transition-colors font-clay-ui">
            Audio-Dateien hierher ziehen oder
          </span>
          <input
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
      </div>

      {/* Queue list */}
      {queueEntries.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {isProcessing && !isPaused && (
            <p className="text-[10px] text-text-tertiary font-clay-ui flex items-center gap-1.5">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-matcha-600 animate-spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Wird verarbeitet — {queueEntries.filter(e => e.status === 'running').length} aktiv
            </p>
          )}
          {isPaused && (
            <p className="text-[10px] text-lemon-600 font-clay-ui flex items-center gap-1.5">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
              Warteschlange pausiert
            </p>
          )}

          {queueEntries.map((entry, index) => (
            <div
              key={entry.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-[8px] border text-[12px] transition-all ${
                entry.status === 'running'
                  ? 'border-matcha-300 bg-matcha-50 dark:bg-matcha-900/10'
                  : entry.status === 'failed'
                  ? 'border-pomegranate-300 bg-pomegranate-50/50 dark:bg-pomegranate-900/10'
                  : entry.status === 'done'
                  ? 'border-matcha-300/50 bg-matcha-50/30 dark:bg-matcha-900/5'
                  : 'border-border-oat bg-bg-card'
              }`}
            >
              {statusIcon(entry.status)}
              <span className="flex-1 truncate font-clay-ui text-text-secondary">
                {entry.file.name}
              </span>
              <span className="text-[10px] text-text-tertiary font-mono flex-shrink-0">
                {formatFileSize(entry.file.size)}
              </span>
              <button
                onClick={() => onRemove(entry.id)}
                className="p-1 rounded hover:bg-text-tertiary/10 text-text-tertiary hover:text-text-secondary transition-colors flex-shrink-0"
                title="Entfernen"
                aria-label="Eintrag entfernen"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              {entry.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleReorder(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded hover:bg-text-tertiary/10 text-text-tertiary disabled:opacity-30 disabled:cursor-default transition-colors flex-shrink-0"
                    title="Nach oben"
                    aria-label="Nach oben verschieben"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleReorder(index, 'down')}
                    disabled={index === queueEntries.length - 1}
                    className="p-1 rounded hover:bg-text-tertiary/10 text-text-tertiary disabled:opacity-30 disabled:cursor-default transition-colors flex-shrink-0"
                    title="Nach unten"
                    aria-label="Nach unten verschieben"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
