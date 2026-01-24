import { Button, Typography, Row, Col, Statistic } from 'antd'
import { PlusOutlined, DatabaseOutlined, ClockCircleOutlined } from '@ant-design/icons'
import AnalysisList from '../components/Workspace/AnalysisList'
// import CreateModal from '../components/Workspace/CreateModal' // Next task
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'

const { Title } = Typography

export default function Workspace() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const user = useAuthStore(state => state.user)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>我的工作区</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalOpen(true)}>
          新建分析
        </Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Statistic title="订阅等级" value={user?.subscription_level.toUpperCase() || 'FREE'} prefix={<DatabaseOutlined />} />
        </Col>
        <Col span={12}>
           {/* Mock quota info */}
          <Statistic title="今日配额" value="3 / 5" prefix={<ClockCircleOutlined />} />
        </Col>
      </Row>

      <AnalysisList />
      
      {/* Placeholder for modal, will be implemented in next task */}
      {/* <CreateModal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} /> */}
    </div>
  )
}
