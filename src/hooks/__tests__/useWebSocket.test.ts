import { describe, it, expect } from 'vitest'
import { createMockProgressStream } from '../useWebSocket'

describe('mock progress', () => {
  it('emits progress events', async () => {
    const events = await createMockProgressStream()
    expect(events.length).toBeGreaterThan(0)
  })
})
