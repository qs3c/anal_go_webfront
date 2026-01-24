import { Card, Tag, Popconfirm, Tooltip } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import type { Analysis } from '../../types'

interface Props {
  analysis: Analysis
  onDelete: (id: number) => void
}

export default function AnalysisCard({ analysis, onDelete }: Props) {
  const statusColors = {
    draft: 'default',
    pending: 'warning',
    analyzing: 'processing',
    completed: 'success',
    failed: 'error',
  }

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
        <Popconfirm
            key="delete"
            title="确定删除吗？"
            onConfirm={() => onDelete(analysis.id)}
        >
            <DeleteOutlined style={{ color: 'red' }} />
        </Popconfirm>
      ]}
    >
      <div style={{ marginBottom: 12 }}>
         <Tag color="blue">{analysis.creation_type === 'ai' ? 'AI Analysis' : 'Manual'}</Tag>
         {analysis.analysis_depth && <Tag>Depth: {analysis.analysis_depth}</Tag>}
      </div>
      <p style={{ color: '#666', minHeight: 40 }}>
        {analysis.description || '暂无描述'}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#999' }}>
         <span>👁 {analysis.view_count}</span>
         <span>{new Date(analysis.updated_at).toLocaleDateString()}</span>
      </div>
    </Card>
  )
}
