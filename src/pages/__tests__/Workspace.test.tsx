import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Workspace from '../Workspace'

vi.mock('../../store/authStore', () => ({
  useAuthStore: (selector: any) => selector({ user: { subscription_level: 'free' } }),
}))

vi.mock('../../hooks/useAnalysis', () => ({
  useAnalysis: () => ({
    analyses: [],
    loading: false,
    fetchAnalyses: vi.fn(),
  }),
}))

vi.mock('../../components/Workspace/CreateModal', () => ({
  default: () => null,
}))

vi.mock('../../components/Workspace/AnalysisList', () => ({
  default: () => null,
}))

describe('Workspace page', () => {
  it('renders create analysis button', () => {
    render(
      <MemoryRouter>
        <Workspace />
      </MemoryRouter>
    )
    expect(screen.getByRole('button', { name: /创建分析/i })).toBeInTheDocument()
  })
})
