import { Card } from 'antd'
import LoginForm from '../components/Auth/LoginForm'

export default function Login() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
      <Card title="登录 GoAnalyzer" style={{ width: 400 }}>
        <LoginForm />
      </Card>
    </div>
  )
}
