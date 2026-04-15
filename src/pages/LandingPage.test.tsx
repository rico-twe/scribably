import { render, screen, fireEvent } from '@testing-library/react'
import { LandingPage } from './LandingPage'

describe('LandingPage', () => {
  beforeEach(() => {
    window.location.hash = ''
  })

  it('renders the hero headline and primary CTA', () => {
    render(<LandingPage />)
    expect(screen.getByText('Sprache.')).toBeInTheDocument()
    expect(screen.getByText('Prompt.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /jetzt aufnehmen/i })).toBeInTheDocument()
  })

  it('navigates to #/app when the primary CTA is clicked', () => {
    render(<LandingPage />)
    fireEvent.click(screen.getByRole('button', { name: /jetzt aufnehmen/i }))
    expect(window.location.hash).toBe('#/app')
  })

  it('renders pipeline, providers and privacy sections', () => {
    render(<LandingPage />)
    expect(screen.getByText(/so funktioniert/i)).toBeInTheDocument()
    expect(screen.getByText(/provider-agnostisch/i)).toBeInTheDocument()
    expect(screen.getByText(/privacy by design/i)).toBeInTheDocument()
  })
})
