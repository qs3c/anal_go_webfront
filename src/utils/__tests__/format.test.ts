import { describe, it, expect } from 'vitest'
import { formatDate } from '../format'

describe('formatDate', () => {
  it('formats RFC3339 date to readable string', () => {
    expect(formatDate('2025-01-20T10:30:00Z')).toBe('2025-01-20 10:30')
  })
})
