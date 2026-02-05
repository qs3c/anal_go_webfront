import { apiClient, ApiResponse } from './api'
import type { Analysis } from '../types'
import type { CreateAnalysisRequest, UpdateAnalysisRequest, ShareRequest, AnalysisListParams } from '../types/api'

interface AnalysisListResponse {
  total: number
  page: number
  page_size: number
  items: Analysis[]
}

interface CreateAnalysisResponse {
  analysis_id: number
  job_id?: number
}

interface JobStatusResponse {
  job_id: number
  analysis_id: number
  status: string
  current_step?: string
  elapsed_seconds?: number
  error_message?: string
  started_at?: string
}

export const analysisService = {
  async list(params: AnalysisListParams): Promise<AnalysisListResponse> {
    const response = await apiClient.get<ApiResponse<AnalysisListResponse>>('/analyses', { params })
    return response.data.data
  },

  async create(payload: CreateAnalysisRequest): Promise<CreateAnalysisResponse> {
    const response = await apiClient.post<ApiResponse<CreateAnalysisResponse>>('/analyses', payload)
    return response.data.data
  },

  async detail(id: number): Promise<Analysis | null> {
    const response = await apiClient.get<ApiResponse<Analysis>>(`/analyses/${id}`)
    return response.data.data
  },

  async update(id: number, payload: UpdateAnalysisRequest): Promise<Analysis> {
    const response = await apiClient.put<ApiResponse<Analysis>>(`/analyses/${id}`, payload)
    return response.data.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/analyses/${id}`)
  },

  async share(id: number, payload: ShareRequest): Promise<void> {
    await apiClient.post(`/analyses/${id}/share`, payload)
  },

  async unshare(id: number): Promise<void> {
    await apiClient.delete(`/analyses/${id}/share`)
  },

  async getJobStatus(id: number): Promise<JobStatusResponse> {
    const response = await apiClient.get<ApiResponse<JobStatusResponse>>(`/analyses/${id}/job-status`)
    return response.data.data
  },

  async getDiagramData(id: number): Promise<any> {
    const response = await apiClient.get<any>(`/analyses/${id}/diagram`)
    return response.data
  },

  async fetchDiagramFromUrl(url: string): Promise<any> {
    // 处理相对路径和绝对路径
    if (url.startsWith('/api/')) {
      // 本地 API 端点
      const response = await apiClient.get<any>(url.replace('/api/v1', ''))
      return response.data
    } else {
      // 外部 URL (OSS)
      const response = await fetch(url)
      return response.json()
    }
  },
}
