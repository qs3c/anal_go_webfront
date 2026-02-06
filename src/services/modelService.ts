import { apiClient } from './api'
import type { ApiResponse } from './api'

export interface Model {
  name: string
  display_name: string
  required_level: 'free' | 'basic' | 'pro'
  description: string
  available: boolean
}

export interface ModelsResponse {
  models: Model[]
}

export const modelService = {
  // 获取可用模型列表
  async getModels(): Promise<ModelsResponse> {
    const response = await apiClient.get<ApiResponse<ModelsResponse>>('/models')
    return response.data.data
  }
}
