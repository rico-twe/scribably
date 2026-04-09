import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProviderConfig } from './ProviderConfig'

const sttProviders = [
  { id: 'groq', name: 'Groq (Whisper Large v3)' },
  { id: 'openai-whisper', name: 'OpenAI (Whisper)' },
]

describe('ProviderConfig', () => {
  it('renders provider dropdown', () => {
    render(
      <ProviderConfig
        label="Speech-to-Text"
        providers={sttProviders}
        selectedId={null}
        apiKey=""
        onProviderChange={vi.fn()}
        onApiKeyChange={vi.fn()}
      />
    )
    expect(screen.getByText('Speech-to-Text')).toBeInTheDocument()
  })

  it('shows API key input when provider selected', () => {
    render(
      <ProviderConfig
        label="Speech-to-Text"
        providers={sttProviders}
        selectedId="groq"
        apiKey=""
        onProviderChange={vi.fn()}
        onApiKeyChange={vi.fn()}
      />
    )
    expect(screen.getByPlaceholderText(/api key/i)).toBeInTheDocument()
  })

  it('calls onApiKeyChange when typing', async () => {
    const onChange = vi.fn()
    render(
      <ProviderConfig
        label="STT"
        providers={sttProviders}
        selectedId="groq"
        apiKey=""
        onProviderChange={vi.fn()}
        onApiKeyChange={onChange}
      />
    )
    await userEvent.type(screen.getByPlaceholderText(/api key/i), 'g')
    expect(onChange).toHaveBeenCalled()
  })
})
