import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AnalysisDetail from '../AnalysisDetail'

const mockUseAuthStore = vi.fn()

vi.mock('../../store/authStore', () => ({
  useAuthStore: (selector: any) => selector(mockUseAuthStore()),
}))

const createMock = vi.fn().mockResolvedValue({ code: 0, data: true })
const listMock = vi.fn().mockResolvedValue({ code: 0, data: [] })
const detailMock = vi.fn().mockResolvedValue({
  code: 0,
  data: {
    id: 2,
    share_title: 'gin Analysis',
    share_description: 'desc',
    author: { username: 'gopher' },
  },
})

vi.mock('../../services/communityService', () => ({
  communityService: {
    detail: (...args: any[]) => detailMock(...args),
  },
}))

vi.mock('../../services/commentService', () => ({
  commentService: {
    list: (...args: any[]) => listMock(...args),
    create: (...args: any[]) => createMock(...args),
  },
}))

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd')
  return {
    ...actual,
    message: {
      info: vi.fn(),
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      loading: vi.fn(),
      open: vi.fn(),
    },
  }
})

describe('AnalysisDetail', () => {
  beforeEach(() => {
    createMock.mockClear()
    listMock.mockClear()
    detailMock.mockClear()
  })

  it('blocks comment submission when unauthenticated', async () => {
    mockUseAuthStore.mockReturnValue({ is_authenticated: false })

    render(
      <MemoryRouter initialEntries={['/community/2']}>
        <Routes>
          <Route path="/community/:id" element={<AnalysisDetail />} />
        </Routes>
      </MemoryRouter>
    )

    const input = await screen.findByPlaceholderText('写下你的评论...')
    await userEvent.type(input, 'hello')
    await userEvent.click(screen.getByRole('button', { name: '发表评论' }))

    expect(createMock).not.toHaveBeenCalled()
  })

  it('submits comment when authenticated', async () => {
    mockUseAuthStore.mockReturnValue({ is_authenticated: true })

    render(
      <MemoryRouter initialEntries={['/community/2']}>
        <Routes>
          <Route path="/community/:id" element={<AnalysisDetail />} />
        </Routes>
      </MemoryRouter>
    )

    const input = await screen.findByPlaceholderText('写下你的评论...')
    await userEvent.type(input, 'hello')
    await userEvent.click(screen.getByRole('button', { name: '发表评论' }))

    expect(createMock).toHaveBeenCalled()
  })
})
