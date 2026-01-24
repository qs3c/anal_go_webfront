import { Card } from 'antd'
import RegisterForm from '../components/Auth/RegisterForm'
import { APP_NAME } from '../utils/constants'

export default function Register() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
      <Card title={`注册 ${APP_NAME}`} style={{ width: 420 }}>
        <RegisterForm />
      </Card>
    </div>
  )
}
