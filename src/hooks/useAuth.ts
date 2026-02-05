import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'
import type { LoginRequest, RegisterRequest } from '../types/api'

export const useAuth = () => {
  const navigate = useNavigate()
  const { user, is_authenticated, login, logout } = useAuthStore()
  const [loading, setLoading] = useState(false)

  // 登录
  const handleLogin = async (data: LoginRequest) => {
    setLoading(true)
    try {
      const res = await authService.login(data)
      login(res.token, res.user)
      message.success('登录成功')
      navigate('/workspace')
    } catch (error: any) {
      console.error('Login failed:', error)
      message.error(error.response?.data?.message || '登录失败，请稍后再试')
    } finally {
      setLoading(false)
    }
  }

  // 注册
  const handleRegister = async (data: RegisterRequest) => {
    setLoading(true)
    try {
      await authService.register(data)
      message.success('注册成功')
      navigate('/login')
    } catch (error: any) {
      console.error('Register failed:', error)
      message.error(error.response?.data?.message || '注册失败，请稍后再试')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    try {
      const res = await authService.demoLogin()
      login(res.token, res.user)
      message.success('已进入演示工作区')
      navigate('/workspace')
    } catch (error: any) {
      console.error('Demo login failed:', error)
      message.error(error.response?.data?.message || '演示登录失败，请稍后再试')
    } finally {
      setLoading(false)
    }
  }

  // 登出
  const handleLogout = () => {
    logout()
    message.success('已退出登录')
    navigate('/login')
  }

  // GitHub 登录
  const handleGitHubLogin = () => {
    const redirectUri = `${window.location.origin}/auth/callback`
    authService.githubLogin(redirectUri)
  }

  // 微信登录
  const handleWeChatLogin = () => {
    message.info('微信登录暂未接入')
  }

  return {
    user,
    is_authenticated,
    loading,
    handleLogin,
    handleRegister,
    handleDemoLogin,
    handleLogout,
    handleGitHubLogin,
    handleWeChatLogin,
  }
}
