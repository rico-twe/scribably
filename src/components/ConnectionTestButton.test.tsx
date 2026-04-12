import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConnectionTestButton } from './ConnectionTestButton'

describe('ConnectionTestButton', () => {
  it('renders test button', () => {
    render(<ConnectionTestButton onTest={vi.fn().mockResolvedValue({ success: true })} />)
    expect(screen.getByText(/testen/i)).toBeInTheDocument()
  })

  it('shows success state after successful test', async () => {
    const onTest = vi.fn().mockResolvedValue({ success: true })
    render(<ConnectionTestButton onTest={onTest} />)
    await userEvent.click(screen.getByText(/testen/i))
    await waitFor(() => {
      expect(screen.getByText(/verbunden/i)).toBeInTheDocument()
    })
  })

  it('shows error state after failed test', async () => {
    const onTest = vi.fn().mockResolvedValue({ success: false, error: 'Unauthorized' })
    render(<ConnectionTestButton onTest={onTest} />)
    await userEvent.click(screen.getByText(/testen/i))
    await waitFor(() => {
      expect(screen.getByText(/fehlgeschlagen/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during test', async () => {
    let resolveTest!: (v: any) => void
    const onTest = vi.fn().mockReturnValue(new Promise(r => { resolveTest = r }))
    render(<ConnectionTestButton onTest={onTest} />)
    await userEvent.click(screen.getByText(/testen/i))
    expect(screen.getByText(/teste/i)).toBeInTheDocument()
    resolveTest({ success: true })
  })

  it('disables button during test', async () => {
    let resolveTest!: (v: any) => void
    const onTest = vi.fn().mockReturnValue(new Promise(r => { resolveTest = r }))
    render(<ConnectionTestButton onTest={onTest} />)
    await userEvent.click(screen.getByText(/testen/i))
    expect(screen.getByRole('button')).toBeDisabled()
    resolveTest({ success: true })
  })
})
