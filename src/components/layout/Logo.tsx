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
          {/* Pen body */}
          <path d="M20 6 L23 9 L11 21 L8 18 Z" stroke="currentColor" strokeWidth="2" />
          {/* Nib */}
          <path d="M8 18 L6 25 L13 23 Z" fill="currentColor" stroke="none" />
          {/* Writing baseline */}
          <line x1="5" y1="27" x2="17" y2="27" stroke="currentColor" strokeWidth="2" />
        </svg>
      </span>

      {showWordmark && (
        <span className={`font-clay-heading tracking-[-0.02em] ${textSize}`}>
          Scrib<span className="italic text-matcha-600 dark:text-matcha-300">ably</span>
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
