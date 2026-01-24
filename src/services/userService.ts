import { withLatency } from './api'
import { loadDb, saveDb } from './mockDb'
import type { User } from '../types'

export const userService = {
  async profile() {
    const db = loadDb()
    const user = db.users[0] ?? {
      id: 0,
      username: 'Guest',
      email: 'guest@go-analyzer.dev',
      avatar_url: '',
      bio: '',
      subscription_level: 'free',
      email_verified: false,
      created_at: new Date().toISOString(),
    }
    return withLatency(user)
  },

  async updateProfile(payload: Partial<User>) {
    const db = loadDb()
    if (!db.users.length) {
      db.users.push({
        id: 1,
        username: payload.username ?? 'Guest',
        email: payload.email ?? 'guest@go-analyzer.dev',
        avatar_url: '',
        bio: payload.bio ?? '',
        subscription_level: 'free',
        email_verified: false,
        created_at: new Date().toISOString(),
      })
    } else {
      db.users[0] = { ...db.users[0], ...payload }
    }
    saveDb(db)
    return withLatency(db.users[0])
  },

  async uploadAvatar(_file: File) {
    return withLatency({ avatar_url: 'https://oss.example.com/avatars/demo.jpg' })
  },
}
