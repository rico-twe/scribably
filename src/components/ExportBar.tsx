import { useState } from 'react'

interface ExportBarProps {
  text: string;
  latexText: string | null;
  disabled: boolean;
  showLatex: boolean;
  onToggleLatex: () => void;
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function ExportBar({ text, latexText, disabled, showLatex, onToggleLatex }: ExportBarProps) {
  const [copied, setCopied] = useState(false)

  const activeText = showLatex && latexText ? latexText : text

  const handleCopy = async () => {
    await navigator.clipboard.writeText(activeText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const btnClass = `
    flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] text-xs font-clay-ui transition-all
    bg-bg-card text-text-secondary border border-border-oat shadow-clay
    hover:shadow-clay-hover hover:text-text-primary
    disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-clay disabled:hover:text-text-secondary
  `

  return (
    <div className="flex gap-1.5 mt-3">
      <button onClick={handleCopy} disabled={disabled} className={`${btnClass} hover:bg-slushie-500/10`}>
        {copied ? (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-matcha-600">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-matcha-600">Kopiert</span>
          </>
        ) : (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect width="14" height="14" x="8" y="8" rx="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
            Kopieren
          </>
        )}
      </button>

      {/* LaTeX toggle */}
      <button
        onClick={onToggleLatex}
        disabled={disabled}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] text-xs font-clay-ui transition-all border
          ${showLatex
            ? 'bg-ube-300/20 text-ube-800 border-ube-300/40 shadow-clay hover:bg-ube-300/30'
            : 'bg-bg-card text-text-secondary border-border-oat shadow-clay hover:shadow-clay-hover hover:text-text-primary hover:bg-ube-300/10'
          }
          disabled:opacity-30 disabled:cursor-not-allowed
        `}
      >
        LaTeX
      </button>

      {showLatex && latexText ? (
        <button
          onClick={() => downloadFile(latexText, 'prompt.tex', 'application/x-latex')}
          disabled={disabled}
          className={`${btnClass} hover:bg-ube-300/10`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
          .tex
        </button>
      ) : (
        <>
          <button
            onClick={() => downloadFile(text, 'prompt.md', 'text/markdown')}
            disabled={disabled}
            className={`${btnClass} hover:bg-matcha-300/10`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            .md
          </button>
          <button
            onClick={() => downloadFile(text, 'prompt.txt', 'text/plain')}
            disabled={disabled}
            className={`${btnClass} hover:bg-lemon-400/10`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            .txt
          </button>
        </>
      )}
    </div>
  )
}
