import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AnalysisList from '../AnalysisList'

const mockFetchAnalyses = vi.fn()

const mockState = {
  analyses: [] as Array<{ analysis_id: number; title: string }>,
  loading: true,
  fetchAnalyses: mockFetchAnalyses,
}

vi.mock('../../../hooks/useAnalysis', () => ({
  useAnalysis: () => mockState,
}))

vi.mock('../AnalysisCard', () => ({
  default: ({ analysis }: { analysis: { title: string } }) => <div>{analysis.title}</div>,
}))

describe('AnalysisList', () => {
  beforeEach(() => {
    mockFetchAnalyses.mockReset()
    mockState.analyses = []
    mockState.loading = true
  })

  it('shows loading spinner when empty and loading', () => {
    const { container } = render(<AnalysisList />)
    expect(container.querySelector('.ant-spin')).toBeTruthy()
  })

  it('shows empty state when no analyses and not loading', () => {
    mockState.loading = false

    render(<AnalysisList />)

    expect(screen.getByText(/暂无分析项目/)).toBeInTheDocument()
  })

  it('renders analysis cards when analyses exist', () => {
    mockState.loading = false
    mockState.analyses = [{ analysis_id: 1, title: 'A1' }]

    render(<AnalysisList />)

    expect(screen.getByText('A1')).toBeInTheDocument()
  })
})
