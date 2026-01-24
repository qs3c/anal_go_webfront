import { Button, Space } from 'antd'
import { GithubOutlined, WechatOutlined } from '@ant-design/icons'
import { authService } from '../../services/authService'

export default function OAuthButtons() {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Button icon={<GithubOutlined />} block onClick={() => authService.githubLogin()}>
        GitHub 登录
      </Button>
      <Button icon={<WechatOutlined />} block disabled>
        微信登录 (即将推出)
      </Button>
    </Space>
  )
}
