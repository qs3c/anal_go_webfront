import { withLatency } from './api'
import { loadDb, saveDb, nextId, buildAnalysis } from './mockDb'
import type { Analysis } from '../types'

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

  async create(payload: {
    title: string
    description?: string
    creation_type: 'ai' | 'manual'
    repo_url?: string
    start_struct?: string
    analysis_depth?: number
    model_name?: string
  }) {
    const db = loadDb()
    const base = buildAnalysis(payload)
    const newItem: Analysis = {
      ...base,
      id: nextId(db.analyses),
    }
    db.analyses.unshift(newItem)
    saveDb(db)
    return withLatency({
      analysis_id: newItem.id,
      job_id: payload.creation_type === 'ai' ? newItem.id + 1000 : 0,
    })
  },

  async detail(id: number) {
    const db = loadDb()
    const found = db.analyses.find((item) => item.id === id) ?? null
    return withLatency(found)
  },
}
