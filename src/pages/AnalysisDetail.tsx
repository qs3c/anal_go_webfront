import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Space, Typography, message } from 'antd'
import { communityService } from '../services/communityService'
import { commentService } from '../services/commentService'
import CommentList from '../components/Comment/CommentList'
import CommentInput from '../components/Comment/CommentInput'
import type { CommunityAnalysis, Comment } from '../types'
import { useAuthStore } from '../store/authStore'

const { Title, Paragraph } = Typography

export default function AnalysisDetail() {
  const params = useParams()
  const navigate = useNavigate()
  const analysisId = useMemo(() => Number(params.id), [params.id])
  const isAuthenticated = useAuthStore((state) => state.is_authenticated)
  const [detail, setDetail] = useState<CommunityAnalysis | null>(null)
  const [comments, setComments] = useState<Comment[]>([])

  const loadDetail = async () => {
    try {
      const data = await communityService.detail(analysisId)
      setDetail(data)
    } catch (error) {
      console.error('Failed to load detail:', error)
    }
  }

  const loadComments = async () => {
    try {
      const data = await commentService.list(analysisId)
      setComments(data)
    } catch (error) {
      console.error('Failed to load comments:', error)
    }
  }

  const handleSubmit = async (content: string) => {
    if (!isAuthenticated) {
      message.info('请先登录后再评论')
      navigate('/login')
      return
    }
    try {
      await commentService.create(analysisId, { content })
      await loadComments()
    } catch (error) {
      console.error('Failed to create comment:', error)
      message.error('评论失败')
    }
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
