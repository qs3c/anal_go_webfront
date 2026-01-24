import { Card } from 'antd'
import RegisterForm from '../components/Auth/RegisterForm'

export default function Register() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
      <Card title="创建新账号" style={{ width: 400 }}>
        <RegisterForm />
      </Card>
    </div>
  )
}
