import { StrictMode } from 'react'
import { render, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import OAuthCallback from '../OAuthCallback'

const mockNavigate = vi.hoisted(() => vi.fn())

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const messageError = vi.hoisted(() => vi.fn())

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd')
  return {
    ...actual,
    message: {
      error: messageError,
      success: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
      loading: vi.fn(),
      open: vi.fn(),
    },
  }
})

describe('OAuthCallback', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    messageError.mockClear()
  })

  it('shows a single error when token is missing', async () => {
    render(
      <StrictMode>
        <MemoryRouter initialEntries={['/auth/callback']}>
          <Routes>
            <Route path="/auth/callback" element={<OAuthCallback />} />
            <Route path="/login" element={<div>login</div>} />
          </Routes>
        </MemoryRouter>
      </StrictMode>
    )

    await waitFor(() => {
      expect(messageError).toHaveBeenCalled()
    })

    expect(messageError).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })
})
