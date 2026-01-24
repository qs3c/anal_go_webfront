import { describe, it, expect, beforeEach } from 'vitest'
import { analysisService } from '../analysisService'
import { storage } from '../../utils/storage'

describe('analysisService', () => {
  beforeEach(() => storage.remove('mock_db'))

  it('creates and lists analyses', async () => {
    const createRes = await analysisService.create({
      title: 'Demo',
      description: '',
      creation_type: 'manual',
    })
    expect(createRes.data.analysis_id).toBeGreaterThan(0)

    const res = await analysisService.list({ page: 1, page_size: 10 })
    expect(res.data.items.length).toBe(1)
    expect(res.data.items[0].title).toBe('Demo')
  })
})
