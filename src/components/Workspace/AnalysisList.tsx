import { useEffect } from 'react'
import { List, Spin, Empty } from 'antd'
import AnalysisCard from './AnalysisCard'
import { useAnalysis } from '../../hooks/useAnalysis'

export default function AnalysisList() {
  const { analyses, loading, fetchAnalyses } = useAnalysis()

  useEffect(() => {
    fetchAnalyses({ page: 1, page_size: 12 })
  }, [])

  if (loading && analyses.length === 0) {
    return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />
  }

  if (analyses.length === 0) {
    return <Empty description="暂无分析项目，点击右上角创建" style={{ margin: '50px 0' }} />
  }

  return (
    <List
      grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
      dataSource={analyses}
      renderItem={(item) => (
        <List.Item>
          <AnalysisCard analysis={item} />
        </List.Item>
      )}
    />
  )
}
