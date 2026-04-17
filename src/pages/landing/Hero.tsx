import { CtaButton } from './CtaButton'
import { navigate } from '../../hooks/useHashRoute'

export function Hero() {
  const bars = Array.from({ length: 28 })

  return (
    <section className="relative px-6 md:px-10 pt-20 md:pt-28 pb-24 md:pb-32">
      <div className="max-w-[1200px] mx-auto grid md:grid-cols-[1.15fr_1fr] gap-10 md:gap-16 items-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-border-oat shadow-clay mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-matcha-600 animate-pulse" />
            <span className="label-uppercase text-text-secondary">Client-only · BYOK · MIT</span>
          </div>

          <h1 className="font-clay-heading leading-[0.95] text-[56px] md:text-[88px] tracking-[-0.04em] text-text-primary">
            <span className="block">Speech.</span>
            <span className="block">Raw.</span>
            <span className="relative inline-block">
              <span className="relative z-10 text-matcha-600 italic">Prompt.</span>
              <span
                aria-hidden
                className="absolute left-0 right-0 bottom-[0.12em] h-[0.28em] bg-lemon-400/70 -z-0 rotate-[-1.2deg]"
              />
            </span>
          </h1>

          <p className="mt-8 text-[19px] md:text-[21px] leading-[1.5] text-text-secondary max-w-[540px] tracking-[-0.01em]">
            WhisperPrompt turns speech into prompts.
            Runs in your browser. No server, no account.
            Your keys, your mic.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <CtaButton
              variant="primary"
              size="lg"
              onClick={() => navigate('app')}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
              }
            >
              Record now
            </CtaButton>
            <CtaButton
              variant="ghost"
              size="lg"
              href="https://github.com/ricotwesten/whisperprompt"
            >
              View on GitHub
            </CtaButton>
          </div>

          <dl className="mt-14 grid grid-cols-3 gap-6 max-w-[520px]">
            {[
              { k: '0', l: 'Server roundtrips' },
              { k: '4', l: 'Providers included' },
              { k: 'MIT', l: 'Open Source' },
            ].map(item => (
              <div key={item.l} className="border-t border-border-oat pt-3">
                <dt className="font-clay-heading text-[28px] leading-none text-text-primary tracking-[-0.04em]">
                  {item.k}
                </dt>
                <dd className="label-uppercase text-text-tertiary mt-2">{item.l}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Waveform card */}
        <div className="hidden md:block">
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-6 rounded-[40px] bg-gradient-to-br from-matcha-300/40 via-slushie-500/10 to-ube-300/30 blur-2xl"
            />
            <div className="relative bg-bg-card border border-border-oat rounded-[32px] shadow-clay p-8 rotate-[1.5deg]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-pomegranate-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-lemon-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-matcha-600" />
                </div>
                <span className="label-uppercase text-text-tertiary">Rec · 00:12</span>
              </div>

              <div className="h-44 flex items-center justify-between gap-[3px]">
                {bars.map((_, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-full bg-matcha-600"
                    style={{
                      animation: `waveform-bar 1.${(i % 7) + 2}s ease-in-out ${i * 0.03}s infinite`,
                      height: `${20 + ((i * 37) % 70)}%`,
                      transformOrigin: 'center',
                    }}
                  />
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-dashed border-border-oat">
                <p className="label-uppercase text-text-tertiary mb-2">Transcript</p>
                <p className="font-mono text-[13px] leading-relaxed text-text-secondary">
                  Write me an email to the team, keep it short, friendly tone,
                  project kickoff on Monday<span className="inline-block w-[8px] h-[14px] align-middle bg-text-primary animate-pulse ml-0.5" />
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className="px-2 py-1 rounded-full bg-matcha-300/40 text-matcha-800 text-[11px] font-clay-ui">groq · whisper-large-v3</span>
                <span className="px-2 py-1 rounded-full bg-ube-300/40 text-ube-800 text-[11px] font-clay-ui">en-US</span>
              </div>
            </div>

            {/* sticker */}
            <div className="absolute -top-6 -left-8 rotate-[-12deg]">
              <div className="px-3 py-1.5 rounded-full bg-lemon-400 border border-black shadow-[-4px_4px_0_0_#000] text-[11px] font-clay-heading tracking-[0.08em] uppercase">
                Your keys. Your browser.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
