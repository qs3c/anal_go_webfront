import { Card } from 'antd'
import type { Comment } from '../../types'

export default function CommentItem({ comment }: { comment: Comment }) {
  return (
    <Card size="small" style={{ marginBottom: 12 }}>
      <div style={{ fontWeight: 600 }}>{comment.user.username}</div>
      <div style={{ color: '#666' }}>{comment.content}</div>
      <div style={{ fontSize: 12, color: '#999', marginTop: 6 }}>{comment.created_at}</div>
    </Card>
  )
}
