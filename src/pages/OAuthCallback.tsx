import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Spin, message } from 'antd'
import { useAuthStore } from '../store/authStore'

export default function OAuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuthStore()

  useEffect(() => {
    const token = searchParams.get('token')

    if (token) {
      // 使用 fetch 直接获取用户信息，绕过 store 依赖
      const fetchProfile = async () => {
        try {
          const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1'
          const response = await fetch(`${baseURL}/user/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (!response.ok) {
            throw new Error('Failed to verify token')
          }
          
          const res = await response.json()
          // 假设后端返回标准结构 { code: 0, data: User }
          const user = res.data
          
          login(token, user)
          message.success('登录成功')
          navigate('/workspace')
        } catch (error) {
          console.error('OAuth callback error:', error)
          message.error('登录验证失败，请重试')
          navigate('/login')
        }
      }
      
      fetchProfile()
    } else {
      message.error('登录失败：无效的请求')
      navigate('/login')
    }
  }, [searchParams, login, navigate])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column' }}>
      <Spin size="large" />
      <div style={{ marginTop: 20, color: '#666' }}>正在验证登录信息...</div>
    </div>
  )
}
