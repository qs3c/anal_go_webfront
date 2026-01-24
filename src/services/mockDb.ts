import { storage } from '../utils/storage'
import { STORAGE_KEYS } from '../utils/constants'

type MockUser = {
  id: number
  username: string
  email: string
  created_at: string
}

type MockAnalysis = {
  id: number
  name: string
  description: string
  repo_url: string
  status: 'queued' | 'running' | 'completed' | 'failed'
  progress: number
  created_at: string
  updated_at: string
}

type MockComment = {
  id: number
  analysis_id: number
  user_id: number
  content: string
  created_at: string
}

type MockDb = {
  users: MockUser[]
  analyses: MockAnalysis[]
  comments: MockComment[]
}

const defaultDb: MockDb = {
  users: [],
  analyses: [],
  comments: [],
}

function cloneDb(db: MockDb): MockDb {
  return {
    users: [...db.users],
    analyses: [...db.analyses],
    comments: [...db.comments],
  }
}

export function loadDb(): MockDb {
  const stored = storage.get<MockDb>(STORAGE_KEYS.mockDb, defaultDb)
  return cloneDb(stored ?? defaultDb)
}

export function saveDb(db: MockDb) {
  storage.set(STORAGE_KEYS.mockDb, db)
}

export function nextId(items: { id: number }[]) {
  if (!items.length) return 1
  return Math.max(...items.map((item) => item.id)) + 1
}

export function nowIso() {
  return new Date().toISOString()
}
