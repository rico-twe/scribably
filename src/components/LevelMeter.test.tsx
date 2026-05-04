import { render, screen } from '@testing-library/react'
import { LevelMeter } from './LevelMeter'

it('has aria live region', () => {
  render(<LevelMeter level={0.5} isClipping={false} isSilent={false} />)
  expect(screen.getByRole('status')).toBeInTheDocument()
})

it('announces clipping', () => {
  render(<LevelMeter level={1} isClipping={true} isSilent={false} />)
  expect(screen.getByRole('status')).toHaveTextContent('Eingangspegel übersteuert')
})

it('announces silence', () => {
  render(<LevelMeter level={0} isClipping={false} isSilent={true} />)
  expect(screen.getByRole('status')).toHaveTextContent('Kein Audio-Signal')
})

it('shows no announcement when neither clipping nor silent', () => {
  render(<LevelMeter level={0.3} isClipping={false} isSilent={false} />)
  expect(screen.getByRole('status')).toHaveTextContent('')
})
