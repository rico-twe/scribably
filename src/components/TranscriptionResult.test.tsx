import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TranscriptionResult } from './TranscriptionResult'

describe('TranscriptionResult', () => {
  it('renders only raw tab by default', () => {
    render(<TranscriptionResult rawText="raw" cleanedText={null} promptText={null} isProcessing={false} />)
    expect(screen.getByText('Rohtext')).toBeInTheDocument()
    expect(screen.queryByText('Bereinigt')).not.toBeInTheDocument()
    expect(screen.queryByText('Prompt')).not.toBeInTheDocument()
  })

  it('renders all tabs when enabled', () => {
    render(<TranscriptionResult rawText="raw" cleanedText={null} promptText={null} isProcessing={false} showCleanTab showPromptTab />)
    expect(screen.getByText('Rohtext')).toBeInTheDocument()
    expect(screen.getByText('Bereinigt')).toBeInTheDocument()
    expect(screen.getByText('Prompt')).toBeInTheDocument()
  })

  it('shows raw text by default', () => {
    render(<TranscriptionResult rawText="Mein Rohtext" cleanedText={null} promptText={null} isProcessing={false} />)
    expect(screen.getByText('Mein Rohtext')).toBeInTheDocument()
  })

  it('switches to cleaned text tab', async () => {
    render(<TranscriptionResult rawText="raw" cleanedText="Bereinigter Text" promptText={null} isProcessing={false} showCleanTab />)
    await userEvent.click(screen.getByText('Bereinigt'))
    expect(screen.getByText('Bereinigter Text')).toBeInTheDocument()
  })

  it('shows loading state when processing', async () => {
    render(<TranscriptionResult rawText="raw" cleanedText={null} promptText={null} isProcessing={true} showCleanTab />)
    await userEvent.click(screen.getByText('Bereinigt'))
    expect(screen.getByText(/wird verarbeitet/i)).toBeInTheDocument()
  })

  it('shows placeholder when no text', () => {
    render(<TranscriptionResult rawText={null} cleanedText={null} promptText={null} isProcessing={false} />)
    expect(screen.getByText(/aufnahme starten/i)).toBeInTheDocument()
  })
})
