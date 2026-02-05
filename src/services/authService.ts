import { apiClient, ApiResponse } from './api'
import type { LoginRequest, RegisterRequest, LoginResponse } from '../types/api'

export const authService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', payload)
    return response.data.data
  },

  async register(payload: RegisterRequest): Promise<{ user_id: number }> {
    const response = await apiClient.post<ApiResponse<{ user_id: number }>>('/auth/register', payload)
    return response.data.data
  },

  async demoLogin(): Promise<LoginResponse> {
    // Demo login uses a predefined demo account
    return this.login({
      email: 'demo@go-analyzer.dev',
      password: 'demo123456',
    })
  },

  logout(): void {
    localStorage.removeItem('token')
  },

  githubLogin(redirectUri?: string): void {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'
    const url = redirectUri
      ? `${baseUrl}/auth/github?redirect_uri=${encodeURIComponent(redirectUri)}`
      : `${baseUrl}/auth/github`
    window.location.href = url
  },

  wechatLogin(): void {
    // WeChat OAuth not implemented yet on backend
    console.warn('WeChat login not implemented')
  },
}
