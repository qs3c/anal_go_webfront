import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { RouterProvider } from 'react-router-dom'

vi.mock('../pages/AnalysisEditor', () => ({
  default: () => <div>AnalysisEditor</div>,
}))

import { router } from '../router'

describe('Router', () => {
  it('renders home page', () => {
    window.history.pushState({}, '', '/')
    render(<RouterProvider router={router} />)
    expect(screen.getByText(/welcome/i)).toBeInTheDocument()
  })
})
