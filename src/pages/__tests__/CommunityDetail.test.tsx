import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AnalysisDetail from '../AnalysisDetail'

const mockDetail = vi.hoisted(() => vi.fn())
const mockList = vi.hoisted(() => vi.fn())

vi.mock('../../services/communityService', () => ({
  communityService: { detail: mockDetail },
}))

vi.mock('../../services/commentService', () => ({
  commentService: { list: mockList, create: vi.fn() },
}))

vi.mock('../../store/authStore', () => ({
  useAuthStore: (selector: any) => selector({ is_authenticated: true }),
}))

vi.mock('../../components/Comment/CommentInput', () => ({
  default: () => <div>comment-input</div>,
}))

vi.mock('../../components/Comment/CommentList', () => ({
  default: () => <div>comment-list</div>,
}))

describe('Community detail', () => {
  it('renders detail and back button', async () => {
    mockDetail.mockResolvedValue({
      code: 0,
      data: { share_title: 'T1', share_description: 'D1', author: { username: 'U1' } },
    })
    mockList.mockResolvedValue({ code: 0, data: [] })

    render(
      <MemoryRouter initialEntries={["/analysis/99"]}>
        <Routes>
          <Route path="/analysis/:id" element={<AnalysisDetail />} />
        </Routes>
      </MemoryRouter>
    )

    expect(await screen.findByText('T1')).toBeInTheDocument()
    expect(screen.getByText(/返回广场/)).toBeInTheDocument()
  })
})
