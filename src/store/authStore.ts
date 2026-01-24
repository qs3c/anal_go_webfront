import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  is_authenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  update_user: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      is_authenticated: false,
      login: (token, user) => {
        set({ token, user, is_authenticated: true })
      },
      logout: () => {
        set({ token: null, user: null, is_authenticated: false })
      },
      update_user: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'auth_storage',
    }
  )
)
