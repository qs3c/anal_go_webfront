import { apiClient, ApiResponse } from './api'
import type { Comment } from '../types'
import type { CommentRequest } from '../types/api'

export const commentService = {
  async list(analysisId: number): Promise<Comment[]> {
    const response = await apiClient.get<ApiResponse<Comment[]>>(`/analyses/${analysisId}/comments`)
    return response.data.data
  },

  async create(analysisId: number, payload: CommentRequest): Promise<Comment> {
    const response = await apiClient.post<ApiResponse<Comment>>(`/analyses/${analysisId}/comments`, payload)
    return response.data.data
  },

  async delete(commentId: number): Promise<void> {
    await apiClient.delete(`/comments/${commentId}`)
  },
}
