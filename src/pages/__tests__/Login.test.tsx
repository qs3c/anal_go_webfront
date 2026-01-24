import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Login from '../Login'

describe('Login page', () => {
  it('shows demo login button', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
    expect(screen.getByRole('button', { name: /演示|demo/i })).toBeInTheDocument()
  })
})
