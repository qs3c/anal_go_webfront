import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AnalysisEditor from '../AnalysisEditor'

vi.mock('../../components/Workspace/Editor', () => ({
  default: () => <div>Editor Canvas</div>,
}))

describe('AnalysisEditor', () => {
  it('renders editor toolbar', () => {
    render(
      <MemoryRouter initialEntries={["/analysis/1"]}>
        <Routes>
          <Route path="/analysis/:id" element={<AnalysisEditor />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText(/编辑器/i)).toBeInTheDocument()
  })
})
