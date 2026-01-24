import { describe, it, expect, beforeEach } from 'vitest'
import { storage } from '../storage'

describe('storage', () => {
  beforeEach(() => localStorage.clear())

  it('writes and reads JSON values', () => {
    storage.set('demo', { a: 1 })
    expect(storage.get('demo')).toEqual({ a: 1 })
  })
})
