const FAQS = [
  {
    q: 'What is Scribably?',
    a: 'Scribably is a free, open-source web app that converts speech into structured AI prompts. It runs entirely in your browser — no server, no account, nothing stored remotely. You dictate what you need; Scribably transcribes the audio, cleans up the raw text, and turns it into a ready-to-use prompt for your AI model of choice.',
  },
  {
    q: 'How does Scribably protect my privacy?',
    a: 'Scribably has no backend. Your API keys are stored only in your browser\'s localStorage and are never sent to Scribably infrastructure. Audio travels directly from your microphone to your chosen provider (Groq or OpenAI) — not through any Scribably server. Analytics are handled by self-hosted Umami, which sets no cookies and stores no personal data. The full source code is on GitHub and auditable.',
  },
  {
    q: 'Which AI providers does Scribably support?',
    a: 'For speech-to-text, Scribably supports Groq Whisper and OpenAI Whisper. For text processing and prompt construction, it supports any OpenAI-compatible API and Anthropic Claude. The two provider registries (STT and LLM) are independent — you can mix providers freely, for example using Groq for fast transcription and Anthropic for prompt construction.',
  },
  {
    q: 'What does BYOK mean — do I need an API key?',
    a: 'BYOK stands for Bring Your Own Key. Scribably connects directly to your Groq, OpenAI, or Anthropic account — there is no shared API access or hidden subscription. Your key, your usage, your costs. Groq offers a generous free tier, so you can get started without spending anything.',
  },
  {
    q: 'Is Scribably free to use?',
    a: 'Yes. Scribably is free and open source under the Apache-2.0 license — free to use, fork, self-host, and modify. Provider costs (for transcription and LLM calls) depend on your usage and the pricing of your chosen AI provider, not Scribably itself.',
  },
]

export function FaqSection() {
  return (
    <section className="px-6 md:px-10 py-20" aria-labelledby="faq-heading">
      <div className="max-w-[760px] mx-auto">
        <p className="label-uppercase text-text-tertiary text-center mb-4">FAQ</p>
        <h2
          id="faq-heading"
          className="font-clay-heading text-[38px] md:text-[52px] leading-[1.05] tracking-[-0.04em] text-text-primary text-center mb-16"
        >
          Common questions
        </h2>

        <dl className="divide-y divide-border-oat">
          {FAQS.map(({ q, a }) => (
            <div key={q} className="py-8 grid md:grid-cols-[1fr_1.6fr] gap-4 md:gap-10">
              <dt className="font-clay-heading text-[17px] leading-[1.35] tracking-[-0.02em] text-text-primary">
                {q}
              </dt>
              <dd className="text-[15px] leading-[1.75] text-text-secondary">
                {a}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
