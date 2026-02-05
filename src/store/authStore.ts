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
        localStorage.setItem('token', token)
        set({ token, user, is_authenticated: true })
      },
      logout: () => {
        localStorage.removeItem('token')
        set({ token: null, user: null, is_authenticated: false })
      },
      update_user: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'auth_storage',
      onRehydrateStorage: () => (state) => {
        // Sync token to localStorage when rehydrating from persist storage
        if (state?.token) {
          localStorage.setItem('token', state.token)
        }
      },
    }
  )
)
