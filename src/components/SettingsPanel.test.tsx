import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SettingsPanel } from './SettingsPanel'
import { DEFAULT_CONFIG } from '../services/config-types'
import type { AppConfig } from '../services/config-types'

// Provide a real localStorage mock since jsdom's localStorage is not functional in this environment
const presetStore: Record<string, string> = {}
const localStorageMock = {
  getItem: (key: string) => presetStore[key] ?? null,
  setItem: (key: string, value: string) => { presetStore[key] = value },
  removeItem: (key: string) => { delete presetStore[key] },
  clear: () => { Object.keys(presetStore).forEach(k => delete presetStore[k]) },
}

beforeAll(() => {
  vi.stubGlobal('localStorage', localStorageMock)
})

afterAll(() => {
  vi.unstubAllGlobals()
})

beforeEach(() => {
  Object.keys(presetStore).forEach(k => delete presetStore[k])
})

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

  it('shows demo mode block when config has isDemo flag', () => {
    const demoConfig: AppConfig = {
      sttProvider: { providerId: 'groq', apiKey: 'gsk_demo', isDemo: true },
      llmProvider: { providerId: 'openai-compatible', apiKey: 'gsk_demo', isDemo: true },
      language: 'en',
      enableCleaning: true,
    }
    render(<SettingsPanel isOpen config={demoConfig} onClose={() => {}} onConfigChange={() => {}} />)
    expect(screen.getByText(/demo mode active/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset to demo mode/i })).toBeInTheDocument()
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

  describe('PresetSelector', () => {
    it('shows "Quick presets" section', () => {
      render(<SettingsPanel {...defaultProps} />)
      expect(screen.getByText('Quick presets')).toBeInTheDocument()
    })

    it('renders all built-in preset buttons', () => {
      render(<SettingsPanel {...defaultProps} />)
      expect(screen.getByText('Journal Entry')).toBeInTheDocument()
      expect(screen.getByText('Claude Prompt')).toBeInTheDocument()
      expect(screen.getByText('Email Draft')).toBeInTheDocument()
      expect(screen.getByText('Meeting Memo')).toBeInTheDocument()
      expect(screen.getByText('Commit Message')).toBeInTheDocument()
      expect(screen.getByText('Raw')).toBeInTheDocument()
    })

    it('calls onConfigChange with preset values when Journal Entry clicked', async () => {
      const onConfigChange = vi.fn()
      render(<SettingsPanel {...defaultProps} onConfigChange={onConfigChange} />)
      await userEvent.click(screen.getByText('Journal Entry'))
      expect(onConfigChange).toHaveBeenCalledWith(
        expect.objectContaining({
          enableCleaning: true,
          enablePrompt: false,
          activePreset: 'journal-entry',
        }),
      )
    })

    it('calls onConfigChange with preset values when Raw clicked', async () => {
      const onConfigChange = vi.fn()
      render(<SettingsPanel {...defaultProps} onConfigChange={onConfigChange} />)
      await userEvent.click(screen.getByText('Raw'))
      expect(onConfigChange).toHaveBeenCalledWith(
        expect.objectContaining({
          enableCleaning: false,
          enablePrompt: false,
          activePreset: 'raw',
        }),
      )
    })

    it('shows active preset with highlight styling', async () => {
      const config = { ...DEFAULT_CONFIG, activePreset: 'claude-prompt' }
      render(<SettingsPanel {...defaultProps} config={config} />)
      expect(screen.getByText('Claude Prompt')).toBeInTheDocument()
    })

    it('shows "Save current setup as custom preset" button', () => {
      render(<SettingsPanel {...defaultProps} />)
      expect(screen.getByText(/Save current setup as custom preset/i)).toBeInTheDocument()
    })

    it('saves a custom preset when name is provided', async () => {
      render(<SettingsPanel {...defaultProps} />)
      await userEvent.click(screen.getByText(/Save current setup as custom preset/i))
      const input = screen.getByPlaceholderText('Preset name')
      await userEvent.type(input, 'My Preset')
      const saveButtons = screen.getAllByRole('button', { name: 'Save' })
      await userEvent.click(saveButtons[0])
      expect(screen.queryByPlaceholderText('Preset name')).not.toBeInTheDocument()
    })

    it('shows error when saving custom preset with empty name', async () => {
      render(<SettingsPanel {...defaultProps} />)
      await userEvent.click(screen.getByText(/Save current setup as custom preset/i))
      const saveButtons = screen.getAllByRole('button', { name: 'Save' })
      await userEvent.click(saveButtons[0])
      expect(screen.getByText('Name is required.')).toBeInTheDocument()
    })

    it('displays custom presets after saving', async () => {
      render(<SettingsPanel {...defaultProps} />)
      await userEvent.click(screen.getByText(/Save current setup as custom preset/i))
      const input = screen.getByPlaceholderText('Preset name')
      await userEvent.type(input, 'Delete Me')
      const saveButtons = screen.getAllByRole('button', { name: 'Save' })
      await userEvent.click(saveButtons[0])
      expect(screen.getByText('Delete Me')).toBeInTheDocument()
    })
  })
})
