import { withLatency } from './api'
import { loadDb, saveDb, nextId, nowIso } from './mockDb'

export const commentService = {
  async list(analysis_id: number) {
    const db = loadDb()
    const items = db.comments.filter((item) => item.analysis_id === analysis_id)
    return withLatency(items)
  },

  async create(payload: { analysis_id: number; user_id: number; content: string }) {
    const db = loadDb()
    const comment = {
      id: nextId(db.comments),
      analysis_id: payload.analysis_id,
      user_id: payload.user_id,
      content: payload.content,
      created_at: nowIso(),
    }
    db.comments.push(comment)
    saveDb(db)
    return withLatency(comment)
  },
}
