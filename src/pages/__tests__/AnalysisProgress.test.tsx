import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import AnalysisProgress from '../AnalysisProgress'

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

describe('AnalysisProgress page', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('does not trigger maximum update depth warnings', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <MemoryRouter initialEntries={['/analysis/1/progress']}>
        <Routes>
          <Route path="/analysis/:id/progress" element={<AnalysisProgress />} />
        </Routes>
      </MemoryRouter>
    )

    vi.runOnlyPendingTimers()

    const hasMaxDepthWarning = errorSpy.mock.calls.some((args) =>
      String(args[0]).includes('Maximum update depth exceeded')
    )
    expect(hasMaxDepthWarning).toBe(false)
  })
})
