import { render, screen, fireEvent } from '@testing-library/react'
import { LandingPage } from './LandingPage'

describe('LandingPage', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('renders the hero headline and primary CTA', () => {
    render(<LandingPage theme="cream" onThemeToggle={() => {}} />)
    expect(screen.getByText('Speech')).toBeInTheDocument()
    expect(screen.getByText('Prompt.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /record now/i })).toBeInTheDocument()
  })

  it('navigates to /app when the primary CTA is clicked', () => {
    render(<LandingPage theme="cream" onThemeToggle={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: /record now/i }))
    expect(window.location.pathname).toBe('/app')
  })

  it('renders pipeline, providers and privacy sections', () => {
    render(<LandingPage theme="cream" onThemeToggle={() => {}} />)
    expect(screen.getByText(/how it works/i)).toBeInTheDocument()
    expect(screen.getByText(/provider-agnostic/i)).toBeInTheDocument()
    expect(screen.getByText(/privacy by design/i)).toBeInTheDocument()
  })
})
