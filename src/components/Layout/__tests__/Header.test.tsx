import { render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import Header from '../Header'

const mockUseAuth = vi.fn()

vi.mock('../../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}))

describe('Header', () => {
  it('shows login/register when unauthenticated', async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      is_authenticated: false,
      handleLogout: vi.fn(),
    })

    await act(async () => {
      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      )
    })

    expect(screen.getByRole('button', { name: /^登\s*录$/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^注\s*册$/ })).toBeInTheDocument()
  })

  it('shows user info and logout when authenticated', async () => {
    mockUseAuth.mockReturnValue({
      user: { username: 'Demo User', avatar_url: '' },
      is_authenticated: true,
      handleLogout: vi.fn(),
    })

    await act(async () => {
      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      )
    })

    expect(screen.getByText('Demo User')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '退出登录' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^登\s*录$/ })).toBeNull()
    expect(screen.queryByRole('button', { name: /^注\s*册$/ })).toBeNull()
  })
})
