import { withLatency } from './api'
import { loadDb } from './mockDb'

export const communityService = {
  async list(params: { page: number; page_size: number; tag?: string }) {
    const db = loadDb()
    const start = (params.page - 1) * params.page_size
    const end = start + params.page_size
    const items = db.analyses.slice(start, end)
    return withLatency({
      total: db.analyses.length,
      page: params.page,
      page_size: params.page_size,
      items,
      tag: params.tag ?? '',
    })
  },

  async detail(id: number) {
    const db = loadDb()
    const item = db.analyses.find((analysis) => analysis.id === id)
    return withLatency(item ?? null)
  },
}
