import { withLatency } from './api'
import { loadDb } from './mockDb'

export const userService = {
  async profile() {
    const db = loadDb()
    const user = db.users[0] ?? {
      id: 0,
      username: 'Guest',
      email: 'guest@go-analyzer.dev',
      created_at: new Date().toISOString(),
    }
    return withLatency(user)
  },
}
