import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SettingsPanel } from './SettingsPanel'
import { DEFAULT_CONFIG } from '../services/config-types'

describe('SettingsPanel', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    config: DEFAULT_CONFIG,
    onConfigChange: vi.fn(),
  }

  it('renders when open', () => {
    render(<SettingsPanel {...defaultProps} />)
    expect(screen.getByText('Einstellungen')).toBeInTheDocument()
  })

  it('shows close button', () => {
    render(<SettingsPanel {...defaultProps} />)
    expect(screen.getByLabelText(/schliessen/i)).toBeInTheDocument()
  })

  it('calls onClose when close button clicked', async () => {
    const onClose = vi.fn()
    render(<SettingsPanel {...defaultProps} onClose={onClose} />)
    await userEvent.click(screen.getByLabelText(/schliessen/i))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('contains STT and LLM provider sections', () => {
    render(<SettingsPanel {...defaultProps} />)
    expect(screen.getByText(/speech-to-text/i)).toBeInTheDocument()
    expect(screen.getByText(/text-aufbereitung/i)).toBeInTheDocument()
  })

  it('shows STT test button when provider configured', () => {
    const config = {
      ...DEFAULT_CONFIG,
      sttProvider: { providerId: 'groq', apiKey: 'gsk_test' },
    }
    render(<SettingsPanel {...defaultProps} config={config} />)
    expect(screen.getAllByText(/testen/i).length).toBeGreaterThan(0)
  })

  it('does not show test button when no API key', () => {
    render(<SettingsPanel {...defaultProps} />)
    expect(screen.queryByText(/testen/i)).not.toBeInTheDocument()
  })

  it('renders custom prompt textarea', () => {
    render(<SettingsPanel {...defaultProps} />)
    expect(screen.getByPlaceholderText(/eigene anweisungen/i)).toBeInTheDocument()
  })

  it('calls onConfigChange when custom prompt is typed', async () => {
    const onConfigChange = vi.fn()
    render(<SettingsPanel {...defaultProps} onConfigChange={onConfigChange} />)
    await userEvent.type(screen.getByPlaceholderText(/eigene anweisungen/i), 'Test')
    expect(onConfigChange).toHaveBeenCalled()
  })
})
