import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HistoryList } from './HistoryList'
import type { HistoryEntry } from '../services/history'

function makeEntry(overrides: Partial<HistoryEntry> = {}): HistoryEntry {
  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    rawText: 'Ein Beispieltext fuer den Test',
    language: 'de',
    duration: 12.5,
    cleanedText: null,
    promptText: null,
    ...overrides,
  }
}

const defaultProps = {
  entries: [] as HistoryEntry[],
  selectedId: null as string | null,
  onSelect: () => {},
  currentRawText: null as string | null,
  isViewingHistory: false,
}

describe('HistoryList', () => {
  it('renders nothing when entries and currentRawText are empty', () => {
    const { container } = render(<HistoryList {...defaultProps} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders current recording card when currentRawText is set', () => {
    render(<HistoryList {...defaultProps} currentRawText="Aktuelle Transkription" />)
    expect(screen.getByText(/Aktuelle Aufnahme/i)).toBeInTheDocument()
    expect(screen.getByText(/Aktuelle Transkription/)).toBeInTheDocument()
  })

  it('renders entries with text preview', () => {
    const entries = [makeEntry({ rawText: 'Hallo Welt, das ist ein Test' })]
    render(<HistoryList {...defaultProps} entries={entries} />)
    expect(screen.getByText(/Hallo Welt/)).toBeInTheDocument()
    expect(screen.getByText(/Letzte Aufnahmen/i)).toBeInTheDocument()
  })

  it('calls onSelect when entry is clicked', async () => {
    const onSelect = vi.fn()
    const entry = makeEntry()
    render(<HistoryList {...defaultProps} entries={[entry]} onSelect={onSelect} />)
    await userEvent.click(screen.getByText(entry.rawText))
    expect(onSelect).toHaveBeenCalledWith(entry.id)
  })

  it('calls onSelect(null) when current recording card is clicked while viewing history', async () => {
    const onSelect = vi.fn()
    const entry = makeEntry()
    render(
      <HistoryList
        {...defaultProps}
        entries={[entry]}
        selectedId={entry.id}
        onSelect={onSelect}
        currentRawText="Aktueller Text"
        isViewingHistory={true}
      />
    )
    await userEvent.click(screen.getByText(/Aktueller Text/))
    expect(onSelect).toHaveBeenCalledWith(null)
  })

  it('deselects when clicking selected entry', async () => {
    const onSelect = vi.fn()
    const entry = makeEntry()
    render(<HistoryList {...defaultProps} entries={[entry]} selectedId={entry.id} onSelect={onSelect} />)
    await userEvent.click(screen.getByText(entry.rawText))
    expect(onSelect).toHaveBeenCalledWith(null)
  })

  it('shows badges for cleaned and prompt text', () => {
    const entry = makeEntry({ cleanedText: 'clean', promptText: 'prompt' })
    render(<HistoryList {...defaultProps} entries={[entry]} />)
    expect(screen.getByText('bereinigt')).toBeInTheDocument()
    expect(screen.getByText('prompt')).toBeInTheDocument()
  })
})
