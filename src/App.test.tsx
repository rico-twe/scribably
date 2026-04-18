import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders Scribably header', () => {
    render(<App theme="cream" onThemeToggle={() => {}} />)
    expect(screen.getByLabelText('Back to home')).toBeInTheDocument()
  })

  it('renders settings button', () => {
    render(<App theme="cream" onThemeToggle={() => {}} />)
    expect(screen.getAllByText('Settings').length).toBeGreaterThan(0)
  })

  it('renders record button', () => {
    render(<App theme="cream" onThemeToggle={() => {}} />)
    expect(screen.getByText('Start recording')).toBeInTheDocument()
  })
})
