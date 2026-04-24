import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExportBar } from './ExportBar'
import { EXAMPLE_SEGMENTS } from '../export/__fixtures__/example-transcript'

const defaultProps = {
  text: 'test',
  latexText: null,
  disabled: false,
  showLatex: false,
  onToggleLatex: () => {},
}

describe('ExportBar', () => {
  it('renders export buttons including LaTeX toggle', () => {
    render(<ExportBar {...defaultProps} />)
    expect(screen.getByText(/^copy$/i)).toBeInTheDocument()
    expect(screen.getByText(/\.md/i)).toBeInTheDocument()
    expect(screen.getByText(/\.txt/i)).toBeInTheDocument()
    expect(screen.getByText(/latex/i)).toBeInTheDocument()
  })

  it('renders .srt, .vtt and .docx buttons', () => {
    render(<ExportBar {...defaultProps} />)
    expect(screen.getByText(/\.srt/i)).toBeInTheDocument()
    expect(screen.getByText(/\.vtt/i)).toBeInTheDocument()
    expect(screen.getByText(/\.docx/i)).toBeInTheDocument()
  })

  it('copy button calls clipboard API', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })

    render(<ExportBar {...defaultProps} text="copy me" />)
    await userEvent.click(screen.getByText(/^copy$/i))
    expect(writeText).toHaveBeenCalledWith('copy me')
  })

  it('shows .tex download when LaTeX is active', () => {
    render(<ExportBar {...defaultProps} showLatex={true} latexText="\\section{Test}" />)
    expect(screen.getByText(/\.tex/i)).toBeInTheDocument()
    expect(screen.queryByText(/\.md/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/\.txt/i)).not.toBeInTheDocument()
  })

  it('.srt and .vtt are disabled without segments', () => {
    render(<ExportBar {...defaultProps} />)
    expect(screen.getByText(/\.srt/i).closest('button')).toBeDisabled()
    expect(screen.getByText(/\.vtt/i).closest('button')).toBeDisabled()
  })

  it('.srt and .vtt are enabled with segments', () => {
    render(<ExportBar {...defaultProps} segments={EXAMPLE_SEGMENTS} />)
    expect(screen.getByText(/\.srt/i).closest('button')).not.toBeDisabled()
    expect(screen.getByText(/\.vtt/i).closest('button')).not.toBeDisabled()
  })

  it('.docx is always enabled', () => {
    render(<ExportBar {...defaultProps} />)
    expect(screen.getByText(/\.docx/i).closest('button')).not.toBeDisabled()
  })

  it('buttons are disabled when disabled prop is true', () => {
    render(<ExportBar {...defaultProps} text="" disabled={true} />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach(btn => expect(btn).toBeDisabled())
  })
})
