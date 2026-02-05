import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { RouterProvider } from 'react-router-dom'

describe('Router 404', () => {
  it('renders 404 for unknown routes', async () => {
    window.history.pushState({}, '', '/unknown-route')
    vi.resetModules()
    const { router } = await import('../router')
    render(<RouterProvider router={router} />)
    expect(await screen.findByText(/404/)).toBeInTheDocument()
  })
})
