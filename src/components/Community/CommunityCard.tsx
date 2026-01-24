import { Card, Space, Tag } from 'antd'
import { EyeOutlined, LikeOutlined, MessageOutlined, BookOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import type { CommunityAnalysis } from '../../types'
import { formatDate } from '../../utils/format'

export default function CommunityCard({ item }: { item: CommunityAnalysis }) {
  return (
    <Card
      title={item.share_title}
      extra={<Tag color="blue">{item.author.username}</Tag>}
      style={{ height: '100%' }}
    >
      <p style={{ color: '#666', minHeight: 44 }}>{item.share_description}</p>
      <Space size="small" wrap style={{ marginBottom: 12 }}>
        {item.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </Space>
      <Space size="large" style={{ color: '#999', fontSize: 12 }}>
        <span>
          <EyeOutlined /> {item.view_count}
        </span>
        <span>
          <LikeOutlined /> {item.like_count}
        </span>
        <span>
          <MessageOutlined /> {item.comment_count}
        </span>
        <span>
          <BookOutlined /> {item.bookmark_count}
        </span>
      </Space>
      <div style={{ marginTop: 12, fontSize: 12, color: '#999' }}>
        {formatDate(item.shared_at)} · <Link to={`/community/${item.id}`}>查看详情</Link>
      </div>
    </Card>
  )
}
