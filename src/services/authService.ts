import { withLatency } from './api'
import { loadDb, saveDb, nextId, nowIso } from './mockDb'

export const authService = {
  async login(payload: { email: string; password: string }) {
    const db = loadDb()
    const user = db.users.find((item) => item.email === payload.email)
    if (!user) {
      return withLatency({
        token: 'demo-token',
        user: {
          id: 0,
          username: payload.email.split('@')[0],
          email: payload.email,
          created_at: nowIso(),
        },
      })
    }
    return withLatency({ token: 'demo-token', user })
  },

  async register(payload: { username: string; email: string; password: string }) {
    const db = loadDb()
    const timestamp = nowIso()
    const user = {
      id: nextId(db.users),
      username: payload.username,
      email: payload.email,
      created_at: timestamp,
    }
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
    const timestamp = nowIso()
    const user = {
      id: nextId(db.users),
      username: 'Demo User',
      email: 'demo@go-analyzer.dev',
      created_at: timestamp,
    }
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
