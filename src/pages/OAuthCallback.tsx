import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Spin, message } from 'antd'
import { useAuthStore } from '../store/authStore'
import { userService } from '../services/userService'

export default function OAuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuthStore()
  const handledRef = useRef(false)

  useEffect(() => {
    if (handledRef.current) return
    handledRef.current = true
    const token = searchParams.get('token')

    const finish = async (oauthToken: string) => {
      try {
        // Store token first so API calls are authenticated
        localStorage.setItem('token', oauthToken)
        // Fetch user profile with the token
        const user = await userService.profile()
        login(oauthToken, user)
        message.success('登录成功')
        navigate('/workspace')
      } catch (error) {
        console.error('OAuth callback error:', error)
        localStorage.removeItem('token')
        message.error('登录验证失败，请重试')
        navigate('/login')
      }
    }

    if (token) {
      finish(token)
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
