import { withLatency } from './api'
import { loadDb, saveDb, nextId, nowIso } from './mockDb'
import type { User } from '../types'

function buildUser(payload: { id: number; username: string; email: string }): User {
  return {
    id: payload.id,
    username: payload.username,
    email: payload.email,
    avatar_url: '',
    bio: '',
    subscription_level: 'free',
    email_verified: false,
    created_at: nowIso(),
  }
}

export const authService = {
  async login(payload: { email: string; password: string }) {
    const db = loadDb()
    const user = db.users.find((item) => item.email === payload.email)
    if (!user) {
      return withLatency({
        token: 'demo-token',
        user: buildUser({ id: 0, username: payload.email.split('@')[0], email: payload.email }),
      })
    }
    return withLatency({ token: 'demo-token', user })
  },

  async register(payload: { username: string; email: string; password: string }) {
    const db = loadDb()
    const user = buildUser({ id: nextId(db.users), username: payload.username, email: payload.email })
    db.users.push(user)
    saveDb(db)
    return withLatency({ token: 'demo-token', user })
  },

  async demoLogin() {
    const db = loadDb()
    const existing = db.users.find((item) => item.email === 'demo@go-analyzer.dev')
    if (existing) {
      return withLatency({ token: 'demo-token', user: existing })
    }
    const user = buildUser({ id: nextId(db.users), username: 'Demo User', email: 'demo@go-analyzer.dev' })
    db.users.push(user)
    saveDb(db)
    return withLatency({ token: 'demo-token', user })
  },
  logout() {
    return withLatency(true)
  },
  githubLogin() {
    return withLatency(true)
  },
  wechatLogin() {
    return withLatency(true)
  },
}
