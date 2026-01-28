import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import { ProtectedRoute } from '../ProtectedRoute'

const mockUseAuthStore = vi.fn()

vi.mock('../../store/authStore', () => ({
  useAuthStore: (selector: any) => selector(mockUseAuthStore()),
}))

describe('ProtectedRoute', () => {
  it('redirects to login when unauthenticated', () => {
    mockUseAuthStore.mockReturnValue({ is_authenticated: false })

    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route path="/login" element={<div>login</div>} />
          <Route
            path="/private"
            element={
              <ProtectedRoute>
                <div>secret</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('login')).toBeInTheDocument()
  })

  it('renders children when authenticated', () => {
    mockUseAuthStore.mockReturnValue({ is_authenticated: true })

    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route
            path="/private"
            element={
              <ProtectedRoute>
                <div>secret</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('secret')).toBeInTheDocument()
  })
})
