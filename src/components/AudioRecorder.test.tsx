import { render, screen } from '@testing-library/react'
import { AudioRecorder } from './AudioRecorder'

describe('AudioRecorder', () => {
  const defaultProps = {
    recordingState: 'idle' as const,
    duration: 0,
    onStartRecording: vi.fn(),
    onStopRecording: vi.fn(),
    onFileUpload: vi.fn(),
  }

  it('renders RecordButton', () => {
    render(<AudioRecorder {...defaultProps} />)
    expect(screen.getByText(/aufnahme starten/i)).toBeInTheDocument()
  })

  it('renders file upload area', () => {
    render(<AudioRecorder {...defaultProps} />)
    expect(screen.getByText(/datei/i)).toBeInTheDocument()
  })
})
