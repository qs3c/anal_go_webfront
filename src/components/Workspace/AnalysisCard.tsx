import { Card, Tag, Tooltip } from 'antd'
import { EditOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import type { Analysis } from '../../types'
import { formatDate } from '../../utils/format'

interface Props {
  analysis: Analysis
}

const statusColors: Record<Analysis['status'], string> = {
  draft: 'default',
  pending: 'warning',
  analyzing: 'processing',
  completed: 'success',
  failed: 'error',
}

export default function AnalysisCard({ analysis }: Props) {
  return (
    <Card
      title={analysis.title}
      extra={<Tag color={statusColors[analysis.status]}>{analysis.status.toUpperCase()}</Tag>}
      actions={[
        <Tooltip key="edit" title="查看/编辑">
          <Link to={`/analysis/${analysis.id}`}>
            <EditOutlined />
          </Link>
        </Tooltip>,
      ]}
    >
      <div style={{ marginBottom: 12 }}>
        <Tag color="blue">{analysis.creation_type === 'ai' ? 'AI Analysis' : 'Manual'}</Tag>
        {analysis.analysis_depth ? <Tag>Depth: {analysis.analysis_depth}</Tag> : null}
      </div>
      <p style={{ color: '#666', minHeight: 40 }}>{analysis.description || '暂无描述'}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#999' }}>
        <span>👁 {analysis.view_count}</span>
        <span>
          <ClockCircleOutlined style={{ marginRight: 4 }} />
          {formatDate(analysis.updated_at)}
        </span>
      </div>
    </Card>
  )
}
