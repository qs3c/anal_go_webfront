import { create } from 'zustand'
import type { CommunityAnalysis } from '../types'

interface CommunityState {
  items: CommunityAnalysis[]
  selected_tag: string
  loading: boolean
  error: string | null
  set_items: (items: CommunityAnalysis[]) => void
  set_selected_tag: (tag: string) => void
  set_loading: (loading: boolean) => void
  set_error: (error: string | null) => void
}

export const useCommunityStore = create<CommunityState>((set) => ({
  items: [],
  selected_tag: '',
  loading: false,
  error: null,
  set_items: (items) => set({ items }),
  set_selected_tag: (selected_tag) => set({ selected_tag }),
  set_loading: (loading) => set({ loading }),
  set_error: (error) => set({ error }),
}))
