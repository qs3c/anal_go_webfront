import { create } from 'zustand'

interface UiState {
  global_loading: boolean
  create_modal_open: boolean
  set_global_loading: (loading: boolean) => void
  set_create_modal_open: (open: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  global_loading: false,
  create_modal_open: false,
  set_global_loading: (global_loading) => set({ global_loading }),
  set_create_modal_open: (create_modal_open) => set({ create_modal_open }),
}))
