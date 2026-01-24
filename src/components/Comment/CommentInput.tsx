import { useState } from 'react'
import { Button, Input, Space } from 'antd'

export default function CommentInput({ onSubmit }: { onSubmit: (content: string) => void }) {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setValue('')
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Input.TextArea
        rows={3}
        placeholder="写下你的评论..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button type="primary" onClick={handleSubmit}>
        发表评论
      </Button>
    </Space>
  )
}
