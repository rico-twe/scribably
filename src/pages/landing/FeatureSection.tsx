import type { ReactNode } from 'react'

type Tone = 'matcha' | 'ube' | 'lemon' | 'slushie'

interface FeatureSectionProps {
  tone: Tone
  eyebrow: string
  title: ReactNode
  body: ReactNode
  bullets?: string[]
  visual: ReactNode
  reverse?: boolean
}

const tones: Record<Tone, { bg: string; text: string; eyebrow: string; accent: string }> = {
  matcha: {
    bg: 'bg-matcha-800',
    text: 'text-white',
    eyebrow: 'text-matcha-300',
    accent: 'text-matcha-300',
  },
  ube: {
    bg: 'bg-ube-800',
    text: 'text-white',
    eyebrow: 'text-ube-300',
    accent: 'text-ube-300',
  },
  lemon: {
    bg: 'bg-lemon-400',
    text: 'text-black',
    eyebrow: 'text-lemon-800',
    accent: 'text-lemon-800',
  },
  slushie: {
    bg: 'bg-slushie-500',
    text: 'text-black',
    eyebrow: 'text-slushie-800',
    accent: 'text-slushie-800',
  },
}

export function FeatureSection({ tone, eyebrow, title, body, bullets, visual, reverse }: FeatureSectionProps) {
  const t = tones[tone]
  return (
    <section className="px-4 md:px-6">
      <div className={`relative overflow-hidden ${t.bg} ${t.text} rounded-[40px] max-w-[1280px] mx-auto`}>
        <div className={`relative grid md:grid-cols-2 gap-12 md:gap-16 items-center px-8 md:px-16 py-20 md:py-28`}>
          <div className={reverse ? 'md:order-2' : ''}>
            <p className={`label-uppercase ${t.eyebrow} mb-5`}>{eyebrow}</p>
            <h2 className="font-clay-heading text-[40px] md:text-[56px] leading-[1.03] tracking-[-0.035em]">
              {title}
            </h2>
            <div className="mt-6 text-[17px] md:text-[18px] leading-[1.6] opacity-90 max-w-[480px]">
              {body}
            </div>
            {bullets && (
              <ul className="mt-8 space-y-3">
                {bullets.map(b => (
                  <li key={b} className="flex items-start gap-3 text-[15px] leading-[1.5]">
                    <span className={`mt-[7px] w-1.5 h-1.5 rounded-full ${t.accent.replace('text-', 'bg-')} flex-shrink-0`} />
                    <span className="opacity-95">{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={reverse ? 'md:order-1' : ''}>
            {visual}
          </div>
        </div>
      </div>
    </section>
  )
}
