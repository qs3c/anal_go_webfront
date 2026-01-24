import { describe, it, expect, beforeEach } from 'vitest'
import { analysisService } from '../analysisService'
import { storage } from '../../utils/storage'

describe('analysisService', () => {
  beforeEach(() => storage.remove('mock_db'))

  it('creates and lists analyses', async () => {
    await analysisService.create({ name: 'Demo', description: '', repo_url: '' })
    const res = await analysisService.list({ page: 1, page_size: 10 })
    expect(res.data.items.length).toBe(1)
    expect(res.data.items[0].name).toBe('Demo')
  })
})
