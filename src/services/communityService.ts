import { withLatency } from './api'
import { loadDb } from './mockDb'
import type { CommunityAnalysis } from '../types'

function mapToCommunity(item: any): CommunityAnalysis {
  return {
    ...item,
    share_title: item.title,
    share_description: item.description || '暂无描述',
    tags: ['Go', '结构分析'],
    author: {
      id: item.user_id || 1,
      username: 'gopher',
      avatar_url: '',
      bio: 'Go developer',
    },
    shared_at: item.updated_at,
    user_interaction: {
      liked: false,
      bookmarked: false,
    },
  }
}

export const communityService = {
  async list(params: { page: number; page_size: number; tag?: string }) {
    const db = loadDb()
    const start = (params.page - 1) * params.page_size
    const end = start + params.page_size
    const items = db.analyses.slice(start, end).map(mapToCommunity)
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
    return withLatency(item ? mapToCommunity(item) : null)
  },
}
