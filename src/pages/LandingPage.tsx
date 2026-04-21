import { Hero } from './landing/Hero'
import { PipelineFlow } from './landing/PipelineFlow'
import { FeatureSection } from './landing/FeatureSection'
import { ProviderGrid } from './landing/ProviderGrid'
import { CtaButton } from './landing/CtaButton'
import { Layout } from '../components/layout/Layout'
import { navigate } from '../hooks/useHashRoute'

const GITHUB_URL = 'https://github.com/rico-twe/scribably'

interface LandingPageProps {
  theme: 'cream' | 'dark'
  onThemeToggle: () => void
}

export function LandingPage({ theme, onThemeToggle }: LandingPageProps) {
  const ctaButton = (
    <CtaButton size="md" onClick={() => { window.umami?.track('cta-open-app'); navigate('app') }}>
      Open app
    </CtaButton>
  )

  return (
    <Layout
      context="landing"
      theme={theme}
      onThemeToggle={onThemeToggle}
      headerActions={ctaButton}
    >
      <Hero />

      <div id="pipeline">
        <PipelineFlow />
      </div>

      <div id="privacy" className="py-6">
        <FeatureSection
          tone="matcha"
          eyebrow="Privacy by Design"
          title={
            <>
              Your voice leaves <span className="italic text-matcha-300">your browser</span> only where you send it.
            </>
          }
          body={
            <>
              Scribably is a pure client app. No Scribably server.
              Nothing logs or forwards anything. API keys stay in your{' '}
              <code className="font-mono text-[14px] bg-white/10 px-1.5 py-0.5 rounded">localStorage</code>,
              audio goes directly from <em>you</em> to <em>your</em> provider.
            </>
          }
          bullets={[
            'BYOK — no proxies, no shared accounts',
            'localStorage only — nothing on a backend',
            'Open source — code is on GitHub',
            'Apache-2.0 — fork it, self-host it, take it apart',
          ]}
          visual={
            <div className="relative">
              <div className="bg-black/20 border border-white/10 rounded-[24px] p-6 font-mono text-[12.5px] leading-[1.8] backdrop-blur">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                  <span className="text-matcha-300">~ / whisperprompt</span>
                  <span className="opacity-50">localStorage</span>
                </div>
                <div className="space-y-1">
                  <div><span className="text-matcha-300">const</span> keys = <span className="text-lemon-400">{'{'}</span></div>
                  <div className="pl-5"><span className="text-slushie-500">stt</span>: <span className="text-white">'sk-...'</span>,</div>
                  <div className="pl-5"><span className="text-slushie-500">llm</span>: <span className="text-white">'sk-ant-...'</span>,</div>
                  <div><span className="text-lemon-400">{'}'}</span></div>
                  <div className="h-2" />
                  <div className="text-white/60">// stays here. period.</div>
                  <div><span className="text-matcha-300">localStorage</span>.setItem(<span className="text-white">'wp-config'</span>, …)</div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-lemon-400 text-black border border-black rounded-full px-4 py-2 shadow-[-4px_4px_0_0_#000] rotate-[6deg] text-[12px] font-clay-heading uppercase tracking-wider">
                Zero Server
              </div>
            </div>
          }
        />
      </div>

      <div id="providers" className="py-6">
        <FeatureSection
          tone="ube"
          reverse
          eyebrow="Provider-agnostic"
          title={
            <>
              Four providers, <span className="italic text-ube-300">mix</span> and match.
            </>
          }
          body={
            <>
              Two independent provider registries: one for Speech-to-Text, one for Text Processing.
              Mix and match. New provider? One factory function, done.
            </>
          }
          bullets={[
            'STT: Groq Whisper, OpenAI Whisper',
            'LLM: OpenAI-compatible, Anthropic',
            'Two-step pipeline: Clean → Prompt',
            'Connection test for every key before sending',
          ]}
          visual={<ProviderGrid />}
        />
      </div>

      <div className="py-6">
        <FeatureSection
          tone="lemon"
          eyebrow="Two-step pipeline"
          title={
            <>
              From <span className="italic">"um, well, yeah"</span> to a structured prompt.
            </>
          }
          body={
            <>
              Raw text is rarely what you want to send. Scribably splits
              cleanup and prompt construction into two toggleable steps.
              Grab the output at any point.
            </>
          }
          bullets={[
            'Step 1: Cleanup — filler words, sentence structure, typos',
            'Step 2: Prompt — structured, role-based, instructive',
            'Both steps triggered manually, nothing automatic',
            'Custom system prompts per step — your recipes',
          ]}
          visual={
            <div className="grid gap-4">
              <div className="bg-white border border-black/15 rounded-[20px] p-5 shadow-[-4px_4px_0_0_rgba(0,0,0,0.15)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="label-uppercase text-lemon-800">Raw</span>
                  <span className="font-mono text-[10px] text-black/50">00:12</span>
                </div>
                <p className="text-[13.5px] leading-[1.6] text-black/80 font-mono">
                  um, uh, can you write an email to the team saying we kick off monday,
                  not too formal but not too stiff either you know
                </p>
              </div>

              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.12em] text-black/60">
                  <span className="w-8 border-t border-dashed border-black/40" />
                  cleanup + prompt
                  <span className="w-8 border-t border-dashed border-black/40" />
                </div>
              </div>

              <div className="bg-black text-white border border-black rounded-[20px] p-5 shadow-[-4px_4px_0_0_#fff]">
                <div className="flex items-center justify-between mb-3">
                  <span className="label-uppercase text-lemon-400">Prompt</span>
                  <span className="font-mono text-[10px] text-white/50">ready</span>
                </div>
                <p className="text-[13.5px] leading-[1.6] font-mono">
                  Write a warm, professional email to the team.
                  Content: project starts Monday, tone: collegial, not too formal.
                  Max. 6 sentences.
                </p>
              </div>
            </div>
          }
        />
      </div>

      <div className="py-6">
        <FeatureSection
          tone="slushie"
          reverse
          eyebrow="Export & Mobile"
          title={
            <>
              Out of the browser. <span className="italic">Into every corner.</span>
            </>
          }
          body={
            <>
              Copy-paste, Markdown, LaTeX, QR transfer to your phone.
              Dark mode too.
            </>
          }
          bullets={[
            'Export: Clipboard · .txt · .md · LaTeX',
            'QR transfer: config as Base64 QR to your phone',
            'Mobile-first responsive UI',
            'Dark mode for late nights',
          ]}
          visual={
            <div className="relative">
              <div className="bg-white border border-black/10 rounded-[28px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                <div className="label-uppercase text-slushie-800 mb-4">Transfer · Config</div>

                {/* fake QR */}
                <div className="grid grid-cols-12 gap-[2px] aspect-square bg-white p-3 border border-black/20 rounded-[12px]">
                  {Array.from({ length: 144 }).map((_, i) => {
                    const on = (i * 37 + (i % 7)) % 3 !== 0
                    const r = Math.floor(i / 12), c = i % 12
                    const corner = (r < 3 && c < 3) || (r < 3 && c > 8) || (r > 8 && c < 3)
                    return (
                      <span
                        key={i}
                        className={`aspect-square rounded-[2px] ${corner ? 'bg-black' : on ? 'bg-black' : 'bg-transparent'}`}
                      />
                    )
                  })}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="px-2 py-1 rounded-full bg-matcha-300/60 text-matcha-800 text-[11px] font-clay-ui">Base64</span>
                  <span className="px-2 py-1 rounded-full bg-ube-300/60 text-ube-800 text-[11px] font-clay-ui">encrypted localhost</span>
                </div>
              </div>

              <div className="absolute -top-4 -right-3 bg-black text-white rounded-full px-3 py-1.5 text-[11px] font-clay-heading tracking-wider uppercase rotate-[8deg]">
                Scan → Setup
              </div>
            </div>
          }
        />
      </div>

      {/* Tech stack strip */}
      <section className="px-6 md:px-10 py-20">
        <div className="max-w-[1100px] mx-auto">
          <p className="label-uppercase text-text-tertiary text-center mb-8">Built with</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 font-clay-heading text-[22px] md:text-[28px] tracking-[-0.03em] text-text-secondary">
            <span>React</span>
            <span className="text-text-quaternary">·</span>
            <span>TypeScript</span>
            <span className="text-text-quaternary">·</span>
            <span>Vite</span>
            <span className="text-text-quaternary">·</span>
            <span>Tailwind 4</span>
            <span className="text-text-quaternary">·</span>
            <span>Vitest</span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 md:px-6 pb-10">
        <div className="relative max-w-[1280px] mx-auto bg-matcha-300 rounded-[40px] overflow-hidden">
          <div className="relative px-8 md:px-16 py-24 md:py-32 text-center">
            <p className="label-uppercase text-matcha-800 mb-6">Ready?</p>
            <h2 className="font-clay-heading text-[56px] md:text-[96px] leading-[0.95] tracking-[-0.045em] text-matcha-800">
              Record <span className="italic">now.</span>
            </h2>
            <p className="mt-6 text-[18px] md:text-[20px] text-matcha-800/80 max-w-[520px] mx-auto leading-[1.5]">
              No account needed, nothing to install. Just start talking.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <CtaButton size="lg" variant="inverse" onClick={() => { window.umami?.track('cta-open-app'); navigate('app') }}>
                Open app
              </CtaButton>
              <CtaButton size="lg" variant="ghost" href={GITHUB_URL}>
                Read source
              </CtaButton>
            </div>

            {/* decorative glyphs */}
            <div aria-hidden className="absolute top-10 left-10 rotate-[-18deg] font-mono text-[12px] text-matcha-800/50">* Apache-2.0</div>
            <div aria-hidden className="absolute bottom-10 right-10 rotate-[12deg] font-mono text-[12px] text-matcha-800/50">v1 · beta</div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
