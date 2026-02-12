import { Button, Typography, Space, Tag } from 'antd'
import { PlusOutlined, ThunderboltOutlined } from '@ant-design/icons'
import AnalysisList from '../components/Workspace/AnalysisList'
import CreateModal from '../components/Workspace/CreateModal'
import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { userService, type QuotaInfo } from '../services/userService'

const { Title, Text } = Typography

export default function Workspace() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const user = useAuthStore((state) => state.user)
  const [quota, setQuota] = useState<QuotaInfo | null>(null)

  useEffect(() => {
    userService.getQuota().then(setQuota).catch(() => {})
  }, [])

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 24,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          我的工作区
        </Title>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalOpen(true)}>
            创建分析
          </Button>
          <Space size={8}>
            <Tag color="blue">{(user?.subscription_level || 'free').toUpperCase()}</Tag>
            {quota && (
              <Text type="secondary" style={{ fontSize: 13 }}>
                <ThunderboltOutlined /> 今日配额 {quota.daily_remain} / {quota.daily_limit}
              </Text>
            )}
          </Space>
        </div>
      </div>

      <AnalysisList />

      <CreateModal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  )
}
