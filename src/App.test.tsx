import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders WhisperPrompt header', () => {
    render(<App theme="cream" onThemeToggle={() => {}} />)
    expect(screen.getByLabelText('Zur Startseite')).toBeInTheDocument()
  })

  it('renders settings button', () => {
    render(<App theme="cream" onThemeToggle={() => {}} />)
    expect(screen.getAllByText('Einstellungen').length).toBeGreaterThan(0)
  })

  it('renders record button', () => {
    render(<App theme="cream" onThemeToggle={() => {}} />)
    expect(screen.getByText('Aufnahme starten')).toBeInTheDocument()
  })
})
