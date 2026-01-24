import { storage } from '../utils/storage'
import { STORAGE_KEYS } from '../utils/constants'
import type { Analysis, User } from '../types'

type MockComment = {
  id: number
  analysis_id: number
  user_id: number
  content: string
  created_at: string
}

type MockDb = {
  users: User[]
  analyses: Analysis[]
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

export function buildAnalysis(payload: {
  title: string
  description?: string
  creation_type: 'ai' | 'manual'
  repo_url?: string
  start_struct?: string
  analysis_depth?: number
  model_name?: string
}): Analysis {
  const timestamp = nowIso()
  return {
    id: 0,
    user_id: 1,
    title: payload.title,
    description: payload.description ?? '',
    creation_type: payload.creation_type,
    repo_url: payload.repo_url,
    start_struct: payload.start_struct,
    analysis_depth: payload.analysis_depth,
    model_name: payload.model_name,
    diagram_oss_url: '',
    diagram_size: 0,
    status: 'pending',
    error_message: '',
    is_public: false,
    view_count: 0,
    like_count: 0,
    comment_count: 0,
    bookmark_count: 0,
    created_at: timestamp,
    updated_at: timestamp,
  }
}
