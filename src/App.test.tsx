import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders WhisperPrompt header', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/WhisperPrompt/)
  })

  it('renders settings button', () => {
    render(<App />)
    expect(screen.getAllByText('Einstellungen').length).toBeGreaterThan(0)
  })

  it('renders record button', () => {
    render(<App />)
    expect(screen.getByText('Aufnahme starten')).toBeInTheDocument()
  })
})
