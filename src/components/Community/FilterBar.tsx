import { Space, Tag } from 'antd'

interface Props {
  tags: string[]
  activeTag: string
  onChange: (tag: string) => void
}

export default function FilterBar({ tags, activeTag, onChange }: Props) {
  return (
    <Space wrap style={{ marginBottom: 16 }}>
      <span style={{ color: '#666' }}>筛选:</span>
      <Tag color={activeTag === '' ? 'blue' : 'default'} onClick={() => onChange('')}>
        全部
      </Tag>
      {tags.map((tag) => (
        <Tag
          key={tag}
          color={activeTag === tag ? 'blue' : 'default'}
          onClick={() => onChange(tag)}
        >
          {tag}
        </Tag>
      ))}
    </Space>
  )
}
