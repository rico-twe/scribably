import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TranscriptionResult } from './TranscriptionResult'
import { EXAMPLE_SEGMENTS } from '../export/__fixtures__/example-transcript'

describe('TranscriptionResult', () => {
  it('renders only raw tab by default', () => {
    render(<TranscriptionResult rawText="raw" cleanedText={null} promptText={null} isProcessing={false} />)
    expect(screen.getByText('Raw')).toBeInTheDocument()
    expect(screen.queryByText('Cleaned')).not.toBeInTheDocument()
    expect(screen.queryByText('Prompt')).not.toBeInTheDocument()
  })

  it('renders all tabs when enabled', () => {
    render(<TranscriptionResult rawText="raw" cleanedText={null} promptText={null} isProcessing={false} showCleanTab showPromptTab />)
    expect(screen.getByText('Raw')).toBeInTheDocument()
    expect(screen.getByText('Cleaned')).toBeInTheDocument()
    expect(screen.getByText('Prompt')).toBeInTheDocument()
  })

  it('shows raw text by default', () => {
    render(<TranscriptionResult rawText="Mein Rohtext" cleanedText={null} promptText={null} isProcessing={false} />)
    expect(screen.getByText('Mein Rohtext')).toBeInTheDocument()
  })

  it('switches to cleaned text tab', async () => {
    render(<TranscriptionResult rawText="raw" cleanedText="Cleaned text" promptText={null} isProcessing={false} showCleanTab />)
    await userEvent.click(screen.getByText('Cleaned'))
    expect(screen.getByText('Cleaned text')).toBeInTheDocument()
  })

  it('shows loading state when processing', async () => {
    render(<TranscriptionResult rawText="raw" cleanedText={null} promptText={null} isProcessing={true} showCleanTab />)
    await userEvent.click(screen.getByText('Cleaned'))
    expect(screen.getByText(/processing/i)).toBeInTheDocument()
  })

  it('shows placeholder when no text', () => {
    render(<TranscriptionResult rawText={null} cleanedText={null} promptText={null} isProcessing={false} />)
    expect(screen.getByText(/record something/i)).toBeInTheDocument()
  })

  it('renders segments as clickable spans when segments prop is provided', () => {
    render(
      <TranscriptionResult
        rawText="full text"
        cleanedText={null}
        promptText={null}
        isProcessing={false}
        segments={EXAMPLE_SEGMENTS}
      />
    )
    expect(screen.getByText('Hallo und willkommen.')).toBeInTheDocument()
    expect(screen.getByText('Das ist ein Testsatz.')).toBeInTheDocument()
  })

  it('calls onSeek with segment start time on click', async () => {
    const onSeek = vi.fn()
    render(
      <TranscriptionResult
        rawText="full text"
        cleanedText={null}
        promptText={null}
        isProcessing={false}
        segments={EXAMPLE_SEGMENTS}
        onSeek={onSeek}
      />
    )
    await userEvent.click(screen.getByText('Das ist ein Testsatz.'))
    expect(onSeek).toHaveBeenCalledWith(2.5)
  })

  it('highlights active segment based on currentTime', () => {
    const { rerender } = render(
      <TranscriptionResult
        rawText="full text"
        cleanedText={null}
        promptText={null}
        isProcessing={false}
        segments={EXAMPLE_SEGMENTS}
        currentTime={3}
      />
    )
    const activeSpan = screen.getByText('Das ist ein Testsatz.')
    expect(activeSpan.className).toContain('bg-lemon-300/30')

    rerender(
      <TranscriptionResult
        rawText="full text"
        cleanedText={null}
        promptText={null}
        isProcessing={false}
        segments={EXAMPLE_SEGMENTS}
        currentTime={0.5}
      />
    )
    expect(screen.getByText('Hallo und willkommen.').className).toContain('bg-lemon-300/30')
    expect(screen.getByText('Das ist ein Testsatz.').className).not.toContain('bg-lemon-300/30')
  })
})
