import { Hero } from './landing/Hero'
import { PipelineFlow } from './landing/PipelineFlow'
import { FeatureSection } from './landing/FeatureSection'
import { ProviderGrid } from './landing/ProviderGrid'
import { CtaButton } from './landing/CtaButton'
import { navigate } from '../hooks/useHashRoute'

const GITHUB_URL = 'https://github.com/ricotwesten/whisperprompt'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-page text-text-primary relative overflow-x-hidden">
      {/* Paper grain overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Decorative blobs */}
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full bg-matcha-300/30 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute top-[520px] -right-40 w-[520px] h-[520px] rounded-full bg-ube-300/40 blur-3xl" />

      {/* Header */}
      <header className="relative z-10 sticky top-0 backdrop-blur-md bg-bg-page/70 border-b border-border-oat">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[10px] bg-matcha-300/40 flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-matcha-800">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            </div>
            <span className="font-clay-heading tracking-[-0.02em] text-[17px]">WhisperPrompt</span>
            <span className="hidden md:inline-block ml-2 px-2 py-0.5 rounded-full bg-lemon-400/60 text-[10px] font-mono tracking-wider uppercase">v1 · beta</span>
          </a>

          <nav className="hidden md:flex items-center gap-7 text-[14px] font-clay-ui text-text-secondary">
            <a href="#pipeline" className="hover:text-text-primary transition-colors">Pipeline</a>
            <a href="#providers" className="hover:text-text-primary transition-colors">Provider</a>
            <a href="#privacy" className="hover:text-text-primary transition-colors">Privacy</a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors">GitHub</a>
          </nav>

          <CtaButton size="md" onClick={() => navigate('app')}>
            App öffnen
          </CtaButton>
        </div>
      </header>

      <main className="relative z-10">
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
              'Open Source — jede Zeile überprüfbar auf GitHub',
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
                Vier Wege rein. <span className="italic text-ube-300">Unendlich</span> viele Wege raus.
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
                Copy-paste, Markdown-Download, LaTeX-Export, QR-Config-Transfer aufs Phone,
                Dark Mode für nachts. Die letzten 5 Meter sind das, was zählt — und sie sind eingebaut.
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
                      // corner markers
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
              <p className="label-uppercase text-matcha-800 mb-6">Bereit?</p>
              <h2 className="font-clay-heading text-[56px] md:text-[96px] leading-[0.95] tracking-[-0.045em] text-matcha-800">
                Jetzt <span className="italic">aufnehmen.</span>
              </h2>
              <p className="mt-6 text-[18px] md:text-[20px] text-matcha-800/80 max-w-[520px] mx-auto leading-[1.5]">
                Kein Account. Kein Server. Einfach sprechen — und den Rest dem Browser überlassen.
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

        {/* Footer */}
        <footer className="px-4 md:px-6 pb-10">
          <div className="max-w-[1280px] mx-auto bg-ube-900 text-white rounded-[40px] px-8 md:px-16 py-14">
            <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-10">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-[10px] bg-white/15 flex items-center justify-center">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-matcha-300">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" x2="12" y1="19" y2="22" />
                    </svg>
                  </div>
                  <span className="font-clay-heading tracking-[-0.02em] text-[17px]">WhisperPrompt</span>
                </div>
                <p className="text-[14px] leading-[1.6] text-white/70 max-w-[320px]">
                  Eine Open-Source-Webapp, um gesprochene Sprache in saubere Prompts zu verwandeln.
                  Client-only, BYOK, MIT.
                </p>
              </div>

              <div>
                <p className="label-uppercase text-ube-300 mb-3">Projekt</p>
                <ul className="space-y-2 text-[14px] text-white/85">
                  <li><a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">GitHub</a></li>
                  <li><a href={`${GITHUB_URL}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer" className="hover:text-white">Lizenz · MIT</a></li>
                  <li><a href={`${GITHUB_URL}/issues`} target="_blank" rel="noopener noreferrer" className="hover:text-white">Issues</a></li>
                </ul>
              </div>

              <div>
                <p className="label-uppercase text-ube-300 mb-3">Docs</p>
                <ul className="space-y-2 text-[14px] text-white/85">
                  <li><a href={`${GITHUB_URL}/tree/main/docs`} target="_blank" rel="noopener noreferrer" className="hover:text-white">Architektur</a></li>
                  <li><a href={`${GITHUB_URL}/blob/main/docs/providers.md`} target="_blank" rel="noopener noreferrer" className="hover:text-white">Provider</a></li>
                  <li><a href={`${GITHUB_URL}/blob/main/docs/config.md`} target="_blank" rel="noopener noreferrer" className="hover:text-white">Config</a></li>
                </ul>
              </div>

              <div>
                <p className="label-uppercase text-ube-300 mb-3">App</p>
                <ul className="space-y-2 text-[14px] text-white/85">
                  <li><button onClick={() => navigate('app')} className="hover:text-white">App öffnen</button></li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-white/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[12px] font-mono uppercase tracking-[0.1em] text-white/60">
              <span>© {new Date().getFullYear()} · WhisperPrompt</span>
              <span>Made with cream, matcha &amp; ube.</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
