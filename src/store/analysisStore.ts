import { create } from 'zustand'
import type { Analysis } from '../types'

interface AnalysisState {
  analyses: Analysis[]
  current_analysis: Analysis | null
  loading: boolean
  error: string | null
  set_analyses: (analyses: Analysis[]) => void
  set_current_analysis: (analysis: Analysis | null) => void
  add_analysis: (analysis: Analysis) => void
  update_analysis: (id: number, updates: Partial<Analysis>) => void
  remove_analysis: (id: number) => void
  set_loading: (loading: boolean) => void
  set_error: (error: string | null) => void
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  analyses: [],
  current_analysis: null,
  loading: false,
  error: null,
  set_analyses: (analyses) => set({ analyses }),
  set_current_analysis: (analysis) => set({ current_analysis: analysis }),
  add_analysis: (analysis) =>
    set((state) => ({
      analyses: [analysis, ...state.analyses],
    })),
  update_analysis: (id, updates) =>
    set((state) => ({
      analyses: state.analyses.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
      current_analysis:
        state.current_analysis?.id === id
          ? { ...state.current_analysis, ...updates }
          : state.current_analysis,
    })),
  remove_analysis: (id) =>
    set((state) => ({
      analyses: state.analyses.filter((a) => a.id !== id),
    })),
  set_loading: (loading) => set({ loading }),
  set_error: (error) => set({ error }),
}))
