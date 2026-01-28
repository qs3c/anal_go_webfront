import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import RegisterForm from '../RegisterForm'

const mockHandleRegister = vi.fn()

vi.mock('../../../hooks/useAuth', () => ({
  useAuth: () => ({
    handleRegister: mockHandleRegister,
    loading: false,
  }),
}))

describe('RegisterForm', () => {
  beforeEach(() => {
    mockHandleRegister.mockClear()
  })

  it('submits registration form with valid values', async () => {
    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    )

    await userEvent.type(screen.getByPlaceholderText('用户名'), 'demo')
    await userEvent.type(screen.getByPlaceholderText('邮箱'), 'demo@go-analyzer.dev')
    await userEvent.type(screen.getByPlaceholderText('密码'), 'secret123')
    await userEvent.type(screen.getByPlaceholderText('确认密码'), 'secret123')
    await userEvent.click(screen.getByRole('button', { name: /^注\s*册$/ }))

    expect(mockHandleRegister).toHaveBeenCalled()
  })
})
