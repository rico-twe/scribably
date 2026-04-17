interface Step {
  num: string
  title: string
  body: string
  tone: string
  icon: React.ReactNode
}

const steps: Step[] = [
  {
    num: '01',
    title: 'Record',
    body: 'Microphone or file. MediaRecorder API directly in the browser, no uploads.',
    tone: 'bg-matcha-300/40 text-matcha-800',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Transcribe',
    body: 'STT provider of your choice — Groq Whisper, OpenAI Whisper. Language detection included.',
    tone: 'bg-slushie-500/30 text-slushie-800',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12h3l2-8 4 16 2-8h5" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Clean',
    body: 'LLM removes filler words, fixes sentence structure and grammar. Optional, toggleable.',
    tone: 'bg-lemon-400/50 text-lemon-800',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21 4-6 6-4-4-8 8" />
        <path d="M14 4h7v7" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Prompt',
    body: 'Second step: cleaned text becomes a structured prompt. Copy, export, Markdown, LaTeX.',
    tone: 'bg-ube-300/50 text-ube-800',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m4 17 6-6-6-6" />
        <path d="M12 19h8" />
      </svg>
    ),
  },
]

export function PipelineFlow() {
  return (
    <section className="px-6 md:px-10 py-24">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div>
            <p className="label-uppercase text-text-tertiary mb-3">How it works</p>
            <h2 className="font-clay-heading text-[40px] md:text-[56px] leading-[1.02] tracking-[-0.035em] max-w-[640px]">
              Four steps between <span className="italic text-matcha-600">"uh…"</span> and a finished prompt.
            </h2>
          </div>
          <p className="text-[17px] leading-[1.55] text-text-secondary max-w-[360px]">
            Each step is independently configurable. You decide where your audio goes —
            and where it stops.
          </p>
        </div>

        <div className="relative grid md:grid-cols-4 gap-5">
          {/* dashed connector line */}
          <div
            aria-hidden
            className="hidden md:block absolute top-[68px] left-[8%] right-[8%] border-t border-dashed border-border-oat pointer-events-none"
          />
          {steps.map(step => (
            <article
              key={step.num}
              className="relative bg-bg-card border border-border-oat rounded-[24px] shadow-clay p-6 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="flex items-center justify-between">
                <span className={`w-11 h-11 rounded-full flex items-center justify-center ${step.tone}`}>
                  {step.icon}
                </span>
                <span className="font-mono text-[11px] text-text-tertiary tracking-wider">
                  {step.num}
                </span>
              </div>
              <h3 className="font-clay-heading text-[22px] leading-tight tracking-[-0.02em]">
                {step.title}
              </h3>
              <p className="text-[14px] leading-[1.55] text-text-secondary">
                {step.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
