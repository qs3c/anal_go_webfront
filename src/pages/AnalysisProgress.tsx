import { useMemo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Space, Typography } from 'antd'
import Progress from '../components/Workspace/Progress'
import { useWebSocket } from '../hooks/useWebSocket'
import type { ProgressMessage } from '../types'

const { Title, Paragraph } = Typography

export default function AnalysisProgress() {
  const params = useParams()
  const navigate = useNavigate()
  const analysisId = useMemo(() => Number(params.id), [params.id])
  const [logs, setLogs] = useState<ProgressMessage[]>([])
  const [percent, setPercent] = useState(0)

  const { progress } = useWebSocket(analysisId, (ossUrl) => {
    if (ossUrl) {
      navigate(`/analysis/${analysisId}`)
    }
  })

  useEffect(() => {
    if (!progress) return
    setLogs((prev) => [...prev, progress])
    if (progress.type === 'analysis_progress') {
      setPercent((prev) => Math.min(prev + 30, 90))
    }
    if (progress.type === 'analysis_completed' || progress.type === 'analysis_failed') {
      setPercent(100)
    }
  }, [progress])

  return (
    <div>
      <Title level={2}>分析进度</Title>
      <Paragraph>正在分析你的 Go 项目结构，请稍候。</Paragraph>
      <Progress percent={percent} progress={progress} logs={logs} />
      <Space style={{ marginTop: 16 }}>
        <Button onClick={() => navigate('/workspace')}>返回工作区</Button>
      </Space>
    </div>
  )
}
