import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Community from '../Community'

vi.mock('../../services/communityService', () => ({
  communityService: {
    list: vi.fn().mockResolvedValue({ code: 0, data: { items: [], total: 0, page: 1, page_size: 12 } }),
  },
}))

vi.mock('../../components/Community/AnalysisGrid', () => ({
  default: () => <div>grid</div>,
}))

vi.mock('../../components/Community/FilterBar', () => ({
  default: () => <div>筛选</div>,
}))

describe('Community', () => {
  it('renders filter bar', () => {
    render(
      <MemoryRouter>
        <Community />
      </MemoryRouter>
    )
    expect(screen.getByText(/筛选/)).toBeInTheDocument()
  })
})
