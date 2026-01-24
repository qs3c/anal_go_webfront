import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Space, Typography } from 'antd'
import Editor from '../components/Workspace/Editor'

const { Title } = Typography

export default function AnalysisEditor() {
  const params = useParams()
  const navigate = useNavigate()
  const analysisId = useMemo(() => Number(params.id), [params.id])

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => navigate('/workspace')}>返回工作区</Button>
      </Space>
      <Title level={3}>结构编辑器</Title>
      <Editor analysisId={analysisId} />
    </div>
  )
}
