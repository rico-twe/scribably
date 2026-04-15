import type { ReactNode, MouseEvent } from 'react'

type Variant = 'primary' | 'ghost' | 'inverse'

interface CtaButtonProps {
  children: ReactNode
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  href?: string
  variant?: Variant
  size?: 'md' | 'lg'
  icon?: ReactNode
}

const base =
  'inline-flex items-center gap-2 font-clay-ui tracking-[-0.16px] rounded-full transition-[transform,box-shadow,background-color,color] duration-200 will-change-transform hover:-rotate-[6deg] hover:-translate-y-1 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#146ef5]'

const sizes = {
  md: 'px-5 py-2.5 text-[15px]',
  lg: 'px-7 py-3.5 text-[17px]',
} as const

const variants = {
  primary:
    'bg-black text-white hover:shadow-[-7px_7px_0_0_var(--color-matcha-600)]',
  ghost:
    'bg-transparent text-black border border-[#717989] hover:bg-white hover:shadow-[-7px_7px_0_0_#000]',
  inverse:
    'bg-white text-black hover:shadow-[-7px_7px_0_0_#000]',
} as const

export function CtaButton({ children, onClick, href, variant = 'primary', size = 'md', icon }: CtaButtonProps) {
  const className = `${base} ${sizes[size]} ${variants[variant]}`

  if (href) {
    return (
      <a href={href} className={className} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
        {icon}
        <span>{children}</span>
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {icon}
      <span>{children}</span>
    </button>
  )
}
