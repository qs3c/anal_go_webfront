import { apiClient, ApiResponse } from './api'
import type { User } from '../types'
import type { UpdateProfileRequest } from '../types/api'

export interface QuotaInfo {
  tier: string
  daily_limit: number
  daily_used: number
  daily_remain: number
  max_depth: number
  reset_at: string
}

export const userService = {
  async profile(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/user/profile')
    return response.data.data
  },

  async updateProfile(payload: UpdateProfileRequest): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>('/user/profile', payload)
    return response.data.data
  },

  async uploadAvatar(file: File): Promise<{ avatar_url: string }> {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post<ApiResponse<{ avatar_url: string }>>('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data
  },

  async getQuota(): Promise<QuotaInfo> {
    const response = await apiClient.get<ApiResponse<QuotaInfo>>('/user/quota')
    return response.data.data
  },
}
