import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SettingsPanel } from './SettingsPanel'
import { DEFAULT_CONFIG } from '../services/config-types'

vi.mock('../services/audio', () => ({
  listAudioInputDevices: vi.fn().mockResolvedValue([
    { deviceId: 'mic-1', label: 'Built-in Mic' },
    { deviceId: 'mic-2', label: 'USB Mic' },
  ]),
}))

vi.mock('../services/connection-test', () => ({
  testSTTConnection: vi.fn(),
  testLLMConnection: vi.fn(),
}))

describe('SettingsPanel', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    config: DEFAULT_CONFIG,
    onConfigChange: vi.fn(),
  }

  it('renders when open', () => {
    render(<SettingsPanel {...defaultProps} />)
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('shows close button', () => {
    render(<SettingsPanel {...defaultProps} />)
    expect(screen.getByLabelText(/close/i)).toBeInTheDocument()
  })

  it('calls onClose when close button clicked', async () => {
    const onClose = vi.fn()
    render(<SettingsPanel {...defaultProps} onClose={onClose} />)
    await userEvent.click(screen.getByLabelText(/close/i))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('contains STT and LLM provider sections', () => {
    render(<SettingsPanel {...defaultProps} />)
    expect(screen.getByText(/speech-to-text/i)).toBeInTheDocument()
    expect(screen.getByText(/text processing/i)).toBeInTheDocument()
  })

  it('shows STT test button when provider configured', () => {
    const config = {
      ...DEFAULT_CONFIG,
      sttProvider: { providerId: 'groq', apiKey: 'gsk_test' },
    }
    render(<SettingsPanel {...defaultProps} config={config} />)
    expect(screen.getAllByText(/test connection/i).length).toBeGreaterThan(0)
  })

  it('does not show test button when no API key', () => {
    render(<SettingsPanel {...defaultProps} />)
    expect(screen.queryByText(/test connection/i)).not.toBeInTheDocument()
  })

  it('renders custom prompt textarea', () => {
    render(<SettingsPanel {...defaultProps} />)
    expect(screen.getByPlaceholderText(/custom instructions/i)).toBeInTheDocument()
  })

  it('calls onConfigChange when custom prompt is typed', async () => {
    const onConfigChange = vi.fn()
    render(<SettingsPanel {...defaultProps} onConfigChange={onConfigChange} />)
    await userEvent.type(screen.getByPlaceholderText(/custom instructions/i), 'Test')
    expect(onConfigChange).toHaveBeenCalled()
  })

  it('renders microphone select with audioinput devices', async () => {
    render(<SettingsPanel {...defaultProps} />)
    await waitFor(() => {
      expect(screen.getByText('Built-in Mic')).toBeInTheDocument()
      expect(screen.getByText('USB Mic')).toBeInTheDocument()
    })
  })

  it('calls onConfigChange with audioDeviceId when mic selected', async () => {
    const onConfigChange = vi.fn()
    render(<SettingsPanel {...defaultProps} onConfigChange={onConfigChange} />)
    await waitFor(() => screen.getByText('Built-in Mic'))
    const select = screen.getByDisplayValue('Default')
    await userEvent.selectOptions(select, 'mic-2')
    expect(onConfigChange).toHaveBeenCalledWith({ audioDeviceId: 'mic-2' })
  })
})
