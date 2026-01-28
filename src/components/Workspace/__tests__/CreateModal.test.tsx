import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import CreateModal from '../CreateModal'

const mockCreateAnalysis = vi.fn()
const mockNavigate = vi.fn()

vi.mock('../../../hooks/useAnalysis', () => ({
  useAnalysis: () => ({ createAnalysis: mockCreateAnalysis }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

describe('CreateModal', () => {
  beforeEach(() => {
    mockCreateAnalysis.mockReset()
    mockNavigate.mockReset()
  })

  it('validates required AI fields and navigates to progress on success', async () => {
    mockCreateAnalysis.mockResolvedValue({ analysis_id: 12 })

    render(
      <MemoryRouter>
        <CreateModal open onClose={vi.fn()} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /开始分析/ }))

    expect(await screen.findByText(/请输入 GitHub 仓库地址/)).toBeInTheDocument()
    expect(await screen.findByText(/请输入起始结构体名称/)).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('https://github.com/gin-gonic/gin'), {
      target: { value: 'https://github.com/gin-gonic/gin' },
    })
    fireEvent.change(screen.getByPlaceholderText('Engine'), { target: { value: 'Engine' } })

    fireEvent.click(screen.getByRole('button', { name: /开始分析/ }))

    await waitFor(() => {
      expect(mockCreateAnalysis).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/analysis/12/progress')
    })
  })

  it('validates manual title and navigates to detail on success', async () => {
    mockCreateAnalysis.mockResolvedValue({ analysis_id: 24 })

    render(
      <MemoryRouter>
        <CreateModal open onClose={vi.fn()} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('tab', { name: /手动创建/ }))
    fireEvent.click(screen.getByRole('button', { name: /创\s*建/ }))

    expect(await screen.findByText(/请输入项目名称/)).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('我的分析项目'), { target: { value: 'My Project' } })
    fireEvent.click(screen.getByRole('button', { name: /创\s*建/ }))

    await waitFor(() => {
      expect(mockCreateAnalysis).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/analysis/24')
    })
  })
})
