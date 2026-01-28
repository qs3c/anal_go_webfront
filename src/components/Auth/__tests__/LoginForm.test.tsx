import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LoginForm from '../LoginForm'

const mockHandleLogin = vi.fn()
const mockHandleDemoLogin = vi.fn()

vi.mock('../../../hooks/useAuth', () => ({
  useAuth: () => ({
    handleLogin: mockHandleLogin,
    handleDemoLogin: mockHandleDemoLogin,
    loading: false,
  }),
}))

describe('LoginForm', () => {
  beforeEach(() => {
    mockHandleLogin.mockClear()
    mockHandleDemoLogin.mockClear()
  })

  it('submits login form with email and password', async () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    )

    await userEvent.type(screen.getByPlaceholderText('邮箱'), 'demo@go-analyzer.dev')
    await userEvent.type(screen.getByPlaceholderText('密码'), 'secret123')
    await userEvent.click(screen.getByRole('button', { name: /^登\s*录$/ }))

    expect(mockHandleLogin).toHaveBeenCalled()
  })

  it('triggers demo login', async () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    )

    await userEvent.click(screen.getByRole('button', { name: '演示体验' }))
    expect(mockHandleDemoLogin).toHaveBeenCalled()
  })
})
