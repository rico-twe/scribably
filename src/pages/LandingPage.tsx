import { Hero } from './landing/Hero'
import { PipelineFlow } from './landing/PipelineFlow'
import { FeatureSection } from './landing/FeatureSection'
import { ProviderGrid } from './landing/ProviderGrid'
import { CtaButton } from './landing/CtaButton'
import { Layout } from '../components/layout/Layout'
import { navigate } from '../hooks/useHashRoute'

const GITHUB_URL = 'https://github.com/ricotwesten/whisperprompt'

interface LandingPageProps {
  theme: 'cream' | 'dark'
  onThemeToggle: () => void
}

export function LandingPage({ theme, onThemeToggle }: LandingPageProps) {
  const ctaButton = (
    <CtaButton size="md" onClick={() => navigate('app')}>
      App öffnen
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
              Deine Stimme verlässt <span className="italic text-matcha-300">deinen Browser</span> nur dorthin, wo du sie hinschickst.
            </>
          }
          body={
            <>
              WhisperPrompt ist eine reine Client-App. Es gibt keinen WhisperPrompt-Server —
              nichts speichert, loggt oder leitet weiter. API-Keys bleiben in deinem{' '}
              <code className="font-mono text-[14px] bg-white/10 px-1.5 py-0.5 rounded">localStorage</code>,
              Audio wandert direkt von <em>dir</em> zu <em>deinem</em> Provider.
            </>
          }
          bullets={[
            'BYOK — keine Proxies, keine Sammelaccounts',
            'localStorage-only — nichts auf einem Backend',
            'Open Source — Code liegt offen auf GitHub',
            'MIT-Lizenz — forken, selbst hosten, auseinandernehmen',
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
                  <div className="text-white/60">// bleibt hier. punkt.</div>
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
          eyebrow="Provider-agnostisch"
          title={
            <>
              Vier Provider, <span className="italic text-ube-300">frei</span> kombinierbar.
            </>
          }
          body={
            <>
              Zwei unabhängige Provider-Registries — eine für Speech-to-Text, eine für Text-Processing.
              Mix and match, wie es dir passt. Neuer Provider? Eine Factory-Funktion, fertig.
            </>
          }
          bullets={[
            'STT: Groq Whisper, OpenAI Whisper',
            'LLM: OpenAI-kompatibel, Anthropic',
            'Zwei-Stufen-Pipeline: Clean → Prompt',
            'Connection-Test für jeden Key vor dem Absenden',
          ]}
          visual={<ProviderGrid />}
        />
      </div>

      <div className="py-6">
        <FeatureSection
          tone="lemon"
          eyebrow="Zwei-Stufen-Pipeline"
          title={
            <>
              Vom <span className="italic">„äh also, ja"</span> zum strukturierten Prompt.
            </>
          }
          body={
            <>
              Rohtext ist selten das, was du schicken willst. WhisperPrompt trennt
              Bereinigung und Prompt-Konstruktion in zwei unabhängige, abschaltbare Schritte —
              und lässt dich überall dazwischen abgreifen.
            </>
          }
          bullets={[
            'Stufe 1: Cleanup — Füllwörter, Satzbau, Tippfehler',
            'Stufe 2: Prompt — strukturiert, rollenbasiert, instruktiv',
            'Beide Stufen manuell triggerbar, nichts automatisch',
            'Custom System-Prompts pro Stufe — deine Rezepte',
          ]}
          visual={
            <div className="grid gap-4">
              <div className="bg-white border border-black/15 rounded-[20px] p-5 shadow-[-4px_4px_0_0_rgba(0,0,0,0.15)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="label-uppercase text-lemon-800">Roh</span>
                  <span className="font-mono text-[10px] text-black/50">00:12</span>
                </div>
                <p className="text-[13.5px] leading-[1.6] text-black/80 font-mono">
                  also, ähm, schreib mir bitte irgendwie eine email an das team wo drinsteht
                  dass wir montag loslegen und so, halt nicht zu förmlich aber auch nicht zu locker ne
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
                  Verfasse eine freundlich-professionelle E-Mail an das Team.
                  Inhalt: Projektstart Montag, Ton: kollegial, nicht zu förmlich.
                  Max. 6 Sätze.
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
              Raus aus dem Browser. <span className="italic">In jede Ecke.</span>
            </>
          }
          body={
            <>
              Copy-paste, Markdown, LaTeX, QR-Transfer aufs Handy.
              Dark Mode ist auch dabei.
            </>
          }
          bullets={[
            'Export: Clipboard · .txt · .md · LaTeX',
            'QR-Transfer: Config als Base64-QR aufs Handy',
            'Mobile-first responsive UI',
            'Dark Mode für Spätschichten',
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
          <p className="label-uppercase text-text-tertiary text-center mb-8">Gebaut mit</p>
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
            <p className="label-uppercase text-matcha-800 mb-6">Bereit?</p>
            <h2 className="font-clay-heading text-[56px] md:text-[96px] leading-[0.95] tracking-[-0.045em] text-matcha-800">
              Jetzt <span className="italic">aufnehmen.</span>
            </h2>
            <p className="mt-6 text-[18px] md:text-[20px] text-matcha-800/80 max-w-[520px] mx-auto leading-[1.5]">
              Keinen Account anlegen, nichts installieren. Einfach lossprechen.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <CtaButton size="lg" variant="inverse" onClick={() => navigate('app')}>
                Zur App
              </CtaButton>
              <CtaButton size="lg" variant="ghost" href={GITHUB_URL}>
                Source lesen
              </CtaButton>
            </div>

            {/* decorative glyphs */}
            <div aria-hidden className="absolute top-10 left-10 rotate-[-18deg] font-mono text-[12px] text-matcha-800/50">* MIT</div>
            <div aria-hidden className="absolute bottom-10 right-10 rotate-[12deg] font-mono text-[12px] text-matcha-800/50">v1 · beta</div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
