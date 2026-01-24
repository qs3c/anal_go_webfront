import api from './api'
import type {
  CreateAnalysisRequest,
  UpdateAnalysisRequest,
  AnalysisListParams,
  ShareRequest,
  Analysis,
} from '../types/api'

export const analysisService = {
  // 获取我的分析列表
  async getMyAnalyses(params: AnalysisListParams) {
    const res = await api.get<any, { data: { items: Analysis[], total: number } }>('/analyses', { params })
    return res.data
  },

  // 创建分析
  async createAnalysis(data: CreateAnalysisRequest) {
    const res = await api.post<any, { data: { analysis_id: number; job_id?: number } }>('/analyses', data)
    return res.data
  },

  // 获取分析详情
  async getAnalysis(id: number) {
    const res = await api.get<any, { data: Analysis }>(`/analyses/${id}`)
    return res.data
  },

  // 更新分析
  async updateAnalysis(id: number, data: UpdateAnalysisRequest) {
    const res = await api.put<any, { data: Analysis }>(`/analyses/${id}`, data)
    return res.data
  },

  // 删除分析
  async deleteAnalysis(id: number) {
    await api.delete(`/analyses/${id}`)
  },

  // 分享到广场
  async shareAnalysis(id: number, data: ShareRequest) {
    const res = await api.post(`/analyses/${id}/share`, data)
    return res.data
  },

  // 取消分享
  async unshareAnalysis(id: number) {
    await api.delete(`/analyses/${id}/share`)
  },

  // 获取任务状态
  async getJobStatus(id: number) {
    const res = await api.get(`/analyses/${id}/job-status`)
    return res.data
  },
}
