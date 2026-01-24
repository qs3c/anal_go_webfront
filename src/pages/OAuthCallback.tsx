import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Spin, message } from 'antd'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'

export default function OAuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuthStore()

  useEffect(() => {
    const token = searchParams.get('token')

    const finish = async () => {
      try {
        const res = await authService.demoLogin()
        if (res.code === 0) {
          login(res.data.token, res.data.user)
          message.success('登录成功')
          navigate('/workspace')
          return
        }
        message.error(res.message)
      } catch (error) {
        console.error('OAuth callback error:', error)
        message.error('登录验证失败，请重试')
      }
      navigate('/login')
    }

    if (token) {
      finish()
    } else {
      message.error('登录失败：无效的请求')
      navigate('/login')
    }
  }, [searchParams, login, navigate])

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60vh',
        flexDirection: 'column',
      }}
    >
      <Spin size="large" />
      <div style={{ marginTop: 20, color: '#666' }}>正在验证登录信息...</div>
    </div>
  )
}
