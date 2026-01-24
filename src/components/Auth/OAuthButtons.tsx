import { Button, Space } from 'antd'
import { GithubOutlined, WechatOutlined } from '@ant-design/icons'
import { useAuth } from '../../hooks/useAuth'

export default function OAuthButtons() {
  const { handleGitHubLogin, handleWeChatLogin } = useAuth()

  return (
    <Space orientation="vertical" style={{ width: '100%' }}>
      <Button icon={<GithubOutlined />} block onClick={handleGitHubLogin}>
        GitHub 登录
      </Button>
      <Button icon={<WechatOutlined />} block onClick={handleWeChatLogin}>
        微信登录
      </Button>
    </Space>
  )
}
