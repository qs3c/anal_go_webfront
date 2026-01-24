import { Space, Tag } from 'antd'

export default function TagList({ tags }: { tags: string[] }) {
  return (
    <Space size={[4, 4]} wrap>
      {tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </Space>
  )
}
