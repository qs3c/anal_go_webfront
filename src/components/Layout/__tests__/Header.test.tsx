import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Header from '../Header'

describe('Header', () => {
  it('renders brand name', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )
    expect(screen.getByText('Go Analyzer')).toBeInTheDocument()
  })
})
