import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExportBar } from './ExportBar'

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
    expect(screen.getByText(/kopieren/i)).toBeInTheDocument()
    expect(screen.getByText(/\.md/i)).toBeInTheDocument()
    expect(screen.getByText(/\.txt/i)).toBeInTheDocument()
    expect(screen.getByText(/latex/i)).toBeInTheDocument()
  })

  it('copy button calls clipboard API', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })

    render(<ExportBar {...defaultProps} text="copy me" />)
    await userEvent.click(screen.getByText(/kopieren/i))
    expect(writeText).toHaveBeenCalledWith('copy me')
  })

  it('shows .tex download when LaTeX is active', () => {
    render(<ExportBar {...defaultProps} showLatex={true} latexText="\\section{Test}" />)
    expect(screen.getByText(/\.tex/i)).toBeInTheDocument()
    expect(screen.queryByText(/\.md/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/\.txt/i)).not.toBeInTheDocument()
  })

  it('buttons are disabled when disabled prop is true', () => {
    render(<ExportBar {...defaultProps} text="" disabled={true} />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach(btn => expect(btn).toBeDisabled())
  })
})
