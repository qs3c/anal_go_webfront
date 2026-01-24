import { Form, Input, Button, Divider } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useAuth } from '../../hooks/useAuth'
import OAuthButtons from './OAuthButtons'
import { Link } from 'react-router-dom'

export default function LoginForm() {
  const { handleLogin, handleDemoLogin, loading } = useAuth()

  return (
    <div style={{ maxWidth: 360, margin: '0 auto' }}>
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={handleLogin}
        size="large"
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: '请输入邮箱!' }, { type: 'email', message: '邮箱格式不正确!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="邮箱" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="密码" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            登录
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="default" block onClick={handleDemoLogin} loading={loading}>
            演示体验
          </Button>
        </Form.Item>

        <Divider plain>或使用以下方式登录</Divider>

        <OAuthButtons />

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          还没有账号？ <Link to="/register">立即注册</Link>
        </div>
      </Form>
    </div>
  )
}
