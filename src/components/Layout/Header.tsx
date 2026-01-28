import { Layout, Menu, Button, Space, Avatar } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { GithubOutlined } from '@ant-design/icons'
import { APP_NAME } from '../../utils/constants'
import { useAuth } from '../../hooks/useAuth'

const { Header: AntHeader } = Layout

export default function Header() {
  const location = useLocation()
  const { user, is_authenticated, handleLogout } = useAuth()

  const menuItems = [
    {
      key: '/',
      label: <Link to="/">首页</Link>,
    },
    {
      key: '/community',
      label: <Link to="/community">广场</Link>,
    },
    {
      key: '/workspace',
      label: <Link to="/workspace">工作区</Link>,
    },
  ]

  return (
    <AntHeader
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        padding: '0 24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link
          to="/"
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#1677ff',
            marginRight: 40,
            textDecoration: 'none',
          }}
        >
          {APP_NAME}
        </Link>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ borderBottom: 'none', minWidth: 300 }}
        />
      </div>

      <Space>
        <Button
          type="text"
          icon={<GithubOutlined />}
          href="https://github.com/qs3c/struct_element"
          target="_blank"
        />
        {is_authenticated && user ? (
          <Space>
            <Avatar size="small" src={user.avatar_url || undefined}>
              {!user.avatar_url ? user.username?.slice(0, 1) : null}
            </Avatar>
            <span>{user.username || user.email || '用户'}</span>
            <Button type="primary" ghost onClick={handleLogout}>
              退出登录
            </Button>
          </Space>
        ) : (
          <>
            <Link to="/login">
              <Button type="primary" ghost>
                登录
              </Button>
            </Link>
            <Link to="/register">
              <Button type="primary">注册</Button>
            </Link>
          </>
        )}
      </Space>
    </AntHeader>
  )
}
