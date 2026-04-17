import { render, screen } from '@testing-library/react'
import { QRCodeTransfer } from './QRCodeTransfer'

describe('QRCodeTransfer', () => {
  it('renders QR code section', () => {
    render(<QRCodeTransfer configBase64="dGVzdA==" onImport={vi.fn()} />)
    expect(screen.getByText(/share config/i)).toBeInTheDocument()
  })

  it('shows warning about API keys', () => {
    render(<QRCodeTransfer configBase64="dGVzdA==" onImport={vi.fn()} />)
    expect(screen.getByText(/api keys/i)).toBeInTheDocument()
  })
})
