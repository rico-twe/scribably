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
    expect(screen.getByText(/start recording/i)).toBeInTheDocument()
  })

  it('renders file upload area', () => {
    render(<AudioRecorder {...defaultProps} />)
    expect(screen.getByText(/upload audio/i)).toBeInTheDocument()
  })
})
