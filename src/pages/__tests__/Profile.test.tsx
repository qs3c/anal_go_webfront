import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Profile from '../Profile'

const mockUpdateUser = vi.fn()

vi.mock('../../store/authStore', () => ({
  useAuthStore: () => ({
    user: {
      id: 1,
      username: 'Demo User',
      email: 'demo@go-analyzer.dev',
      avatar_url: '',
      bio: '',
      subscription_level: 'free',
      email_verified: false,
      created_at: new Date('2026-01-01').toISOString(),
    },
    update_user: mockUpdateUser,
  }),
}))

vi.mock('../../services/userService', () => ({
  userService: {
    updateProfile: vi.fn().mockResolvedValue({ code: 0, data: {} }),
    uploadAvatar: vi.fn().mockResolvedValue({ code: 0, data: { avatar_url: '' } }),
  },
}))

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd')
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
      loading: vi.fn(),
      open: vi.fn(),
    },
  }
})

describe('Profile page', () => {
  beforeEach(() => {
    mockUpdateUser.mockClear()
  })

  it('shows user info summary', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    )

    expect(screen.getByText('个人信息')).toBeInTheDocument()
    expect(screen.getByText('Demo User')).toBeInTheDocument()
    expect(screen.getByText('demo@go-analyzer.dev')).toBeInTheDocument()
    expect(screen.getByText('FREE')).toBeInTheDocument()
  })

  it('toggles to edit form', async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    )

    await userEvent.click(screen.getByRole('button', { name: /编\s*辑/ }))
    expect(screen.getByRole('button', { name: '保存修改' })).toBeInTheDocument()
  })
})
