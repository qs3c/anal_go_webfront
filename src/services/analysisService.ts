import { withLatency } from './api'
import { loadDb, saveDb, nextId, nowIso } from './mockDb'

export const analysisService = {
  async list(params: { page: number; page_size: number }) {
    const db = loadDb()
    const start = (params.page - 1) * params.page_size
    const end = start + params.page_size
    const items = db.analyses.slice(start, end)
    return withLatency({
      total: db.analyses.length,
      page: params.page,
      page_size: params.page_size,
      items,
    })
  },

  async create(payload: { name: string; description: string; repo_url: string }) {
    const db = loadDb()
    const timestamp = nowIso()
    const newItem = {
      id: nextId(db.analyses),
      name: payload.name,
      description: payload.description,
      repo_url: payload.repo_url,
      status: 'queued' as const,
      progress: 0,
      created_at: timestamp,
      updated_at: timestamp,
    }
    db.analyses.unshift(newItem)
    saveDb(db)
    return withLatency(newItem)
  },
}
