interface LevelMeterProps {
  level: number
  isClipping: boolean
  isSilent: boolean
}

export function LevelMeter({ level, isClipping, isSilent }: LevelMeterProps) {
  const SEGMENTS = 16
  const active = Math.round(level * SEGMENTS)

  return (
    <div>
      {/* Visual bar — aria-hidden, screenreader uses live region below */}
      <div aria-hidden="true" className="flex gap-0.5">
        {Array.from({ length: SEGMENTS }, (_, i) => {
          const lit = i < active
          let color = 'bg-matcha-600'
          if (i >= 13) color = 'bg-pomegranate-400'
          else if (i >= 10) color = 'bg-lemon-500'
          return (
            <div
              key={i}
              className={`h-2 flex-1 rounded-sm transition-all duration-75 ${lit ? color : 'bg-border-oat'}`}
            />
          )
        })}
      </div>
      {/* ARIA live region for screenreaders */}
      <div role="status" aria-live="polite" className="sr-only">
        {isClipping ? 'Eingangspegel übersteuert' : isSilent ? 'Kein Audio-Signal' : ''}
      </div>
    </div>
  )
}
