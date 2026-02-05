import { describe, it, expect } from 'vitest'
import { analysisService } from '../analysisService'

describe('analysisService', () => {
  it('exports required methods', () => {
    expect(typeof analysisService.list).toBe('function')
    expect(typeof analysisService.create).toBe('function')
    expect(typeof analysisService.detail).toBe('function')
    expect(typeof analysisService.update).toBe('function')
    expect(typeof analysisService.delete).toBe('function')
    expect(typeof analysisService.share).toBe('function')
    expect(typeof analysisService.unshare).toBe('function')
    expect(typeof analysisService.getJobStatus).toBe('function')
  })

  // Integration tests require running backend
  // Run with: npm run test:integration
})
