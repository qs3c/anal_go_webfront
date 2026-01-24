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
      if (res.code === 0) {
        login(res.data.token, res.data.user)
        message.success('登录成功')
        navigate('/workspace')
      } else {
        message.error(res.message)
      }
    } catch (error) {
      console.error('Login failed:', error)
      message.error('登录失败，请稍后再试')
    } finally {
      setLoading(false)
    }
  }

  // 注册
  const handleRegister = async (data: RegisterRequest) => {
    setLoading(true)
    try {
      const res = await authService.register(data)
      if (res.code === 0) {
        message.success('注册成功')
        navigate('/login')
      } else {
        message.error(res.message)
      }
    } catch (error) {
      console.error('Register failed:', error)
      message.error('注册失败，请稍后再试')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    try {
      const res = await authService.demoLogin()
      if (res.code === 0) {
        login(res.data.token, res.data.user)
        message.success('已进入演示工作区')
        navigate('/workspace')
      } else {
        message.error(res.message)
      }
    } catch (error) {
      console.error('Demo login failed:', error)
      message.error('演示登录失败，请稍后再试')
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
    message.info('GitHub 登录暂未接入')
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
