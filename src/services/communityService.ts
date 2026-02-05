import { apiClient, ApiResponse } from './api'
import type { CommunityAnalysis } from '../types'
import type { CommunityParams } from '../types/api'

interface CommunityListResponse {
  total: number
  page: number
  page_size: number
  items: CommunityAnalysis[]
}

export const communityService = {
  async list(params: CommunityParams): Promise<CommunityListResponse> {
    const response = await apiClient.get<ApiResponse<CommunityListResponse>>('/community/analyses', { params })
    return response.data.data
  },

  async detail(id: number): Promise<CommunityAnalysis | null> {
    const response = await apiClient.get<ApiResponse<CommunityAnalysis>>(`/community/analyses/${id}`)
    return response.data.data
  },

  async like(id: number): Promise<void> {
    await apiClient.post(`/community/analyses/${id}/like`)
  },

  async unlike(id: number): Promise<void> {
    await apiClient.delete(`/community/analyses/${id}/like`)
  },

  async bookmark(id: number): Promise<void> {
    await apiClient.post(`/community/analyses/${id}/bookmark`)
  },

  async unbookmark(id: number): Promise<void> {
    await apiClient.delete(`/community/analyses/${id}/bookmark`)
  },
}
