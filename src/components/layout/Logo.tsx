interface LogoProps {
  size?: 'sm' | 'md'
  showWordmark?: boolean
  showBadge?: boolean
  onClick?: () => void
  /** Override for icon background, e.g. 'bg-white/15' in footer */
  iconBgClassName?: string
}

export function Logo({
  size = 'sm',
  showWordmark = true,
  showBadge = false,
  onClick,
  iconBgClassName,
}: LogoProps) {
  const iconSize = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'
  const svgSize = size === 'sm' ? 15 : 20
  const textSize = size === 'sm' ? 'text-[17px]' : 'text-[20px]'

  const content = (
    <>
      <span
        className={`relative ${iconSize} rounded-[10px] ${iconBgClassName ?? 'bg-matcha-300/40'} flex items-center justify-center transition-all duration-200 ${
          onClick
            ? 'group-hover:bg-matcha-300/60 group-hover:-rotate-6 group-hover:-translate-y-0.5 group-hover:shadow-[-4px_4px_0_0_#000] dark:group-hover:shadow-[-4px_4px_0_0_var(--color-matcha-600)]'
            : ''
        }`}
      >
        <svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 32 32"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-matcha-800 dark:text-matcha-300"
          aria-hidden
        >
          {/* Mic stand */}
          <line x1="16" y1="26" x2="16" y2="29" stroke="currentColor" strokeWidth="2" />
          <path d="M22 18v1a6 6 0 0 1-12 0v-1" stroke="currentColor" strokeWidth="2" />
          {/* Speech-bubble mic head */}
          <rect x="10" y="3" width="12" height="14" rx="4" stroke="currentColor" strokeWidth="2" />
          {/* Prompt cursor >_ inside bubble */}
          <path d="M13 8l2 2-2 2" stroke="currentColor" strokeWidth="1.6" />
          <line x1="17" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </span>

      {showWordmark && (
        <span className={`font-clay-heading tracking-[-0.02em] ${textSize}`}>
          Whisper<span className="italic text-matcha-600 dark:text-matcha-300">Prompt</span>
        </span>
      )}

      {showBadge && (
        <span className="hidden md:inline-block ml-2 px-2 py-0.5 rounded-full bg-lemon-400/60 text-[10px] font-mono tracking-wider uppercase text-lemon-800">
          v1 · beta
        </span>
      )}
    </>
  )

  if (onClick) {
    return (
      <button
        onClick={onClick}
        aria-label="Back to home"
        className="flex items-center gap-2.5 group"
      >
        {content}
      </button>
    )
  }

  return <div className="flex items-center gap-2.5">{content}</div>
}
