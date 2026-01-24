import { Card } from 'antd'
import LoginForm from '../components/Auth/LoginForm'
import { APP_NAME } from '../utils/constants'

export default function Login() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
      <Card title={`登录 ${APP_NAME}`} style={{ width: 420 }}>
        <LoginForm />
      </Card>
    </div>
  )
}
