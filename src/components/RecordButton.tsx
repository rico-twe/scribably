type RecordButtonState = 'idle' | 'recording' | 'processing' | 'done' | 'error'

interface RecordButtonProps {
  state: RecordButtonState;
  duration: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function RecordButton({ state, duration, onStartRecording, onStopRecording }: RecordButtonProps) {
  const handleClick = () => {
    if (state === 'idle' || state === 'done' || state === 'error') {
      onStartRecording()
    } else if (state === 'recording') {
      onStopRecording()
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Outer ring */}
      <div className={`
        relative rounded-full p-[3px] transition-all duration-300
        ${state === 'recording'
          ? 'bg-pomegranate-400/20 animate-record-pulse'
          : 'bg-border-oat-light'
        }
      `}>
        <button
          onClick={handleClick}
          disabled={state === 'processing'}
          className={`
            relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200
            ${state === 'recording'
              ? 'bg-pomegranate-400 hover:bg-pomegranate-400/90'
              : state === 'processing'
                ? 'bg-bg-card cursor-not-allowed shadow-clay'
                : 'bg-bg-card shadow-clay hover:shadow-clay-hover'
            }
          `}
        >
          {state === 'processing' ? (
            <div className="w-5 h-5 border-2 border-slushie-500/60 border-t-transparent rounded-full animate-spin-smooth" />
          ) : state === 'recording' ? (
            <div className="w-4 h-4 bg-white rounded-[3px] transition-all" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-text-primary">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          )}
        </button>
      </div>

      {/* Status text */}
      <span className="text-xs font-clay-ui text-text-tertiary tracking-wide">
        {state === 'idle' && 'Start recording'}
        {state === 'recording' && (
          <span className="text-pomegranate-400 tabular-nums">{formatDuration(duration)}</span>
        )}
        {state === 'processing' && (
          <span className="text-slushie-800">Processing...</span>
        )}
        {state === 'done' && 'Record again'}
        {state === 'error' && <span className="text-pomegranate-400">Try again</span>}
      </span>
    </div>
  )
}
