import { describe, it, expect } from 'vitest'
import { useAuthStore } from '../authStore'

describe('authStore', () => {
  it('starts logged out', () => {
    const state = useAuthStore.getState()
    expect(state.is_authenticated).toBe(false)
  })
})
