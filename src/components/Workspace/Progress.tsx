import { Card, Progress as AntProgress, List, Tag } from 'antd'
import type { ProgressMessage } from '../../types'

interface Props {
  percent: number
  progress: ProgressMessage | null
  logs: ProgressMessage[]
}

export default function Progress({ percent, progress, logs }: Props) {
  const statusLabel = progress?.type || 'analysis_progress'

  return (
    <Card title="分析进度">
      <div style={{ marginBottom: 16 }}>
        <AntProgress percent={percent} status={percent >= 100 ? 'success' : 'active'} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <Tag color={percent >= 100 ? 'success' : 'processing'}>{statusLabel}</Tag>
        <span style={{ marginLeft: 8 }}>{progress?.data.current_step || '准备中...'}</span>
      </div>
      <List
        size="small"
        header="进度日志"
        dataSource={logs}
        renderItem={(item) => (
          <List.Item>
            <span>{item.data.current_step || item.type}</span>
            <span style={{ marginLeft: 'auto', color: '#999' }}>{item.data.elapsed_seconds ?? '--'}s</span>
          </List.Item>
        )}
      />
    </Card>
  )
}
