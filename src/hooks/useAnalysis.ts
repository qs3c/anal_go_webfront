import { useState } from 'react'
import { message } from 'antd'
import { analysisService } from '../services/analysisService'
import { useAnalysisStore } from '../store/analysisStore'
import type { Analysis } from '../types'

export const useAnalysis = () => {
  const [loading, setLoading] = useState(false)
  const {
    analyses,
    current_analysis,
    set_analyses,
    set_current_analysis,
  } = useAnalysisStore()

  const fetchAnalyses = async (params: { page: number; page_size: number }) => {
    setLoading(true)
    try {
      const res = await analysisService.list(params)
      if (res.code === 0) {
        set_analyses(res.data.items as Analysis[])
      } else {
        message.error(res.message)
      }
    } catch (error) {
      console.error('Fetch analyses failed:', error)
      message.error('加载分析列表失败')
    } finally {
      setLoading(false)
    }
  }

  const createAnalysis = async (payload: {
    title: string
    description?: string
    creation_type: 'ai' | 'manual'
    repo_url?: string
    start_struct?: string
    analysis_depth?: number
    model_name?: string
  }) => {
    setLoading(true)
    try {
      const res = await analysisService.create(payload)
      if (res.code === 0) {
        return res.data
      }
      message.error(res.message)
      return null
    } catch (error) {
      console.error('Create analysis failed:', error)
      message.error('创建分析失败')
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    analyses,
    current_analysis,
    loading,
    set_current_analysis,
    fetchAnalyses,
    createAnalysis,
  }
}
