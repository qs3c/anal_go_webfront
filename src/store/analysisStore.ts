import { create } from 'zustand'
import type { Analysis } from '../types'

interface AnalysisState {
  analyses: Analysis[]
  currentAnalysis: Analysis | null
  loading: boolean
  error: string | null
  setAnalyses: (analyses: Analysis[]) => void
  setCurrentAnalysis: (analysis: Analysis | null) => void
  addAnalysis: (analysis: Analysis) => void
  updateAnalysis: (id: number, updates: Partial<Analysis>) => void
  removeAnalysis: (id: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  analyses: [],
  currentAnalysis: null,
  loading: false,
  error: null,
  setAnalyses: (analyses) => set({ analyses }),
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
  addAnalysis: (analysis) =>
    set((state) => ({
      analyses: [analysis, ...state.analyses],
    })),
  updateAnalysis: (id, updates) =>
    set((state) => ({
      analyses: state.analyses.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
      currentAnalysis:
        state.currentAnalysis?.id === id
          ? { ...state.currentAnalysis, ...updates }
          : state.currentAnalysis,
    })),
  removeAnalysis: (id) =>
    set((state) => ({
      analyses: state.analyses.filter((a) => a.id !== id),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))
