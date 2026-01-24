import { Empty } from 'antd'
import CommentItem from './CommentItem'
import type { Comment } from '../../types'

export default function CommentList({ items }: { items: Comment[] }) {
  if (!items.length) {
    return <Empty description="暂无评论" style={{ margin: '24px 0' }} />
  }

  return (
    <div>
      {items.map((item) => (
        <CommentItem key={item.id} comment={item} />
      ))}
    </div>
  )
}
