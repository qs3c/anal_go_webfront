import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Space, Typography } from 'antd'
import { communityService } from '../services/communityService'
import { commentService } from '../services/commentService'
import CommentList from '../components/Comment/CommentList'
import CommentInput from '../components/Comment/CommentInput'
import type { CommunityAnalysis, Comment } from '../types'

const { Title, Paragraph } = Typography

export default function AnalysisDetail() {
  const params = useParams()
  const navigate = useNavigate()
  const analysisId = useMemo(() => Number(params.id), [params.id])
  const [detail, setDetail] = useState<CommunityAnalysis | null>(null)
  const [comments, setComments] = useState<Comment[]>([])

  const loadDetail = async () => {
    const res = await communityService.detail(analysisId)
    if (res.code === 0) {
      setDetail(res.data as CommunityAnalysis)
    }
  }

  const loadComments = async () => {
    const res = await commentService.list(analysisId)
    if (res.code === 0) {
      setComments(
        (res.data as any[]).map((item) => ({
          id: item.id,
          user: {
            id: item.user_id,
            username: `user_${item.user_id}`,
            avatar_url: '',
          },
          content: item.content,
          parent_id: null,
          created_at: item.created_at,
        }))
      )
    }
  }

  const handleSubmit = async (content: string) => {
    await commentService.create({ analysis_id: analysisId, user_id: 1, content })
    await loadComments()
  }

  useEffect(() => {
    loadDetail()
    loadComments()
  }, [analysisId])

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => navigate('/community')}>返回广场</Button>
      </Space>
      <Card>
        <Title level={3}>{detail?.share_title || '分析详情'}</Title>
        <Paragraph>{detail?.share_description}</Paragraph>
        <Paragraph type="secondary">作者: {detail?.author.username}</Paragraph>
      </Card>

      <Title level={4} style={{ marginTop: 24 }}>
        评论
      </Title>
      <CommentInput onSubmit={handleSubmit} />
      <CommentList items={comments} />
    </div>
  )
}
