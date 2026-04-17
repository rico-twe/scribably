import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecordButton } from './RecordButton'

describe('RecordButton', () => {
  const defaultProps = {
    state: 'idle' as const,
    duration: 0,
    onStartRecording: vi.fn(),
    onStopRecording: vi.fn(),
  }

  it('shows "Start recording" in idle state', () => {
    render(<RecordButton {...defaultProps} />)
    expect(screen.getByText(/start recording/i)).toBeInTheDocument()
  })

  it('calls onStartRecording on click in idle state', async () => {
    const onStart = vi.fn()
    render(<RecordButton {...defaultProps} onStartRecording={onStart} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onStart).toHaveBeenCalledOnce()
  })

  it('shows duration during recording', () => {
    render(<RecordButton {...defaultProps} state="recording" duration={65.3} />)
    expect(screen.getByText(/1:05/)).toBeInTheDocument()
  })

  it('calls onStopRecording on click during recording', async () => {
    const onStop = vi.fn()
    render(<RecordButton {...defaultProps} state="recording" onStopRecording={onStop} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onStop).toHaveBeenCalledOnce()
  })

  it('shows loading indicator in processing state', () => {
    render(<RecordButton {...defaultProps} state="processing" />)
    expect(screen.getByText(/processing/i)).toBeInTheDocument()
  })
})
