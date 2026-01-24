import { useEffect, useState } from 'react'
import { List, Spin, Empty, message } from 'antd'
import AnalysisCard from './AnalysisCard'
import { useAnalysisStore } from '../../store/analysisStore'
import { analysisService } from '../../services/analysisService'

export default function AnalysisList() {
  const { analyses, setAnalyses, loading, setLoading, removeAnalysis } = useAnalysisStore()
  const [initialized, setInitialized] = useState(false)

  const fetchAnalyses = async () => {
    setLoading(true)
    try {
      const res = await analysisService.getMyAnalyses({ page: 1, page_size: 20 })
      // res.data is expected to be { items, total } based on service return type
      // But service definition says: api.get<... { items... }>. So res is { items, total }
      setAnalyses(res.items)
    } catch (error) {
      console.error('Fetch analyses failed:', error)
    } finally {
      setLoading(false)
      setInitialized(true)
    }
  }

  useEffect(() => {
    fetchAnalyses()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      await analysisService.deleteAnalysis(id)
      removeAnalysis(id)
      message.success('删除成功')
    } catch (error) {
      message.error('删除失败')
    }
  }

  if (!initialized && loading) {
    return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />
  }

  if (analyses.length === 0) {
    return <Empty description="暂无分析项目，点击右上角新建" style={{ margin: '50px 0' }} />
  }

  return (
    <List
      grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
      dataSource={analyses}
      renderItem={(item) => (
        <List.Item>
          <AnalysisCard analysis={item} onDelete={handleDelete} />
        </List.Item>
      )}
    />
  )
}
