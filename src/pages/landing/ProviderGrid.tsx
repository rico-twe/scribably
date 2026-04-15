interface Provider {
  name: string
  type: 'STT' | 'LLM' | 'STT + LLM'
  tagline: string
  dot: string
}

const providers: Provider[] = [
  { name: 'Groq', type: 'STT + LLM', tagline: 'Whisper Large V3. Schnell, günstig, Default.', dot: 'bg-lemon-500' },
  { name: 'OpenAI', type: 'STT + LLM', tagline: 'Whisper API · GPT-4o-compatible Endpoint.', dot: 'bg-matcha-300' },
  { name: 'Anthropic', type: 'LLM', tagline: 'Claude Sonnet / Opus. Direkt aus dem Browser.', dot: 'bg-pomegranate-400' },
  { name: 'OpenAI-kompatibel', type: 'LLM', tagline: 'OpenRouter, LMStudio, Ollama, dein eigener Server.', dot: 'bg-slushie-500' },
]

export function ProviderGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4">
      {providers.map(p => (
        <article
          key={p.name}
          className="group bg-white/5 hover:bg-white/10 backdrop-blur border border-white/15 rounded-[20px] p-5 transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <span className={`w-2.5 h-2.5 rounded-full ${p.dot}`} />
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] opacity-60">
              {p.type}
            </span>
          </div>
          <h4 className="font-clay-heading text-[20px] tracking-[-0.02em] mb-2">{p.name}</h4>
          <p className="text-[13px] leading-[1.5] opacity-75">{p.tagline}</p>
        </article>
      ))}
    </div>
  )
}
