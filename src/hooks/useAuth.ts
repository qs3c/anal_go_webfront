import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'
import type { LoginRequest, RegisterRequest } from '../types/api'

export const useAuth = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, login, logout } = useAuthStore()
  const [loading, setLoading] = useState(false)

  // 登录
  const handleLogin = async (data: LoginRequest) => {
    setLoading(true)
    try {
      const res = await authService.login(data)
      login(res.token, res.user)
      message.success('登录成功')
      navigate('/workspace')
    } catch (error) {
      console.error('Login failed:', error)
      // 错误已在拦截器处理
    } finally {
      setLoading(false)
    }
  }

  // 注册
  const handleRegister = async (data: RegisterRequest) => {
    setLoading(true)
    try {
      await authService.register(data)
      message.success('注册成功，请查收验证邮件')
      navigate('/login')
    } catch (error) {
      console.error('Register failed:', error)
    } finally {
      setLoading(false)
    }
  }

  // 登出
  const handleLogout = () => {
    logout()
    authService.logout()
    message.success('已退出登录')
    navigate('/login')
  }

  // GitHub 登录
  const handleGitHubLogin = () => {
    authService.githubLogin()
  }

  // 微信登录
  const handleWeChatLogin = () => {
    authService.wechatLogin()
  }

  return {
    user,
    isAuthenticated,
    loading,
    handleLogin,
    handleRegister,
    handleLogout,
    handleGitHubLogin,
    handleWeChatLogin,
  }
}
