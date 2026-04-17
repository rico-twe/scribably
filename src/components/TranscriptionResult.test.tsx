import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TranscriptionResult } from './TranscriptionResult'

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
    expect(screen.getByText(/start recording/i)).toBeInTheDocument()
  })
})
