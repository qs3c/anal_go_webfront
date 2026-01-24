import { useEffect, useState } from 'react'
import { Typography, Spin } from 'antd'
import FilterBar from '../components/Community/FilterBar'
import AnalysisGrid from '../components/Community/AnalysisGrid'
import { communityService } from '../services/communityService'
import type { CommunityAnalysis } from '../types'

const { Title } = Typography

const defaultTags = ['Web框架', '路由', '微服务', '架构设计']

export default function Community() {
  const [items, setItems] = useState<CommunityAnalysis[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTag, setActiveTag] = useState('')

  const load = async (tag = '') => {
    setLoading(true)
    try {
      const res = await communityService.list({ page: 1, page_size: 12, tag })
      if (res.code === 0) {
        setItems(res.data.items as CommunityAnalysis[])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(activeTag)
  }, [activeTag])

  return (
    <div>
      <Title level={2}>社区广场</Title>
      <FilterBar tags={defaultTags} activeTag={activeTag} onChange={setActiveTag} />
      {loading ? <Spin /> : <AnalysisGrid items={items} />}
    </div>
  )
}
