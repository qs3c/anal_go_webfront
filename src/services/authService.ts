import api from './api'
import type { LoginRequest, RegisterRequest, LoginResponse } from '../types/api'
import type { User } from '../types'

export const authService = {
  // 注册
  async register(data: RegisterRequest) {
    const res = await api.post<any, { data: { user_id: number } }>(
      '/auth/register',
      data
    )
    return res.data
  },

  // 登录
  async login(data: LoginRequest) {
    const res = await api.post<any, { data: LoginResponse }>('/auth/login', data)
    const { token, user } = res.data
    // Token persistence is handled by the store calling this service, 
    // but the service returns it for immediate use.
    return { token, user }
  },

  // 登出
  async logout() {
    // Optional: Call backend logout endpoint if exists
    // await api.post('/auth/logout')
  },

  // 获取用户信息
  async getProfile() {
    const res = await api.get<any, { data: User }>('/user/profile')
    return res.data
  },

  // GitHub OAuth 登录
  githubLogin() {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/auth/github`
  },

  // 微信 OAuth 登录
  wechatLogin() {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/auth/wechat`
  },
}
