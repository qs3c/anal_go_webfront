import { useEffect, useState, useRef } from 'react'
import { Spin, message } from 'antd'
import ExcalidrawWrapper from './core/components/ExcalidrawWrapper'
import { analysisService } from '../../../services/analysisService'
import './core/styles.css'
import '@excalidraw/excalidraw/index.css'

export default function Editor({ analysisId }: { analysisId: number }) {
  console.log('[Editor] Component rendering, analysisId:', analysisId)

  const [loading, setLoading] = useState(true)
  const [initialData, setInitialData] = useState<any>(null)
  const loadedRef = useRef(false)

  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true

    const loadDiagram = async () => {
      try {
        // 获取分析详情
        console.log('[Editor] Loading analysis:', analysisId)
        const analysis = await analysisService.detail(analysisId)
        console.log('[Editor] Analysis detail:', analysis)

        if (!analysis) {
          console.log('[Editor] Analysis not found')
          setLoading(false)
          return
        }

        console.log('[Editor] diagram_oss_url:', analysis.diagram_oss_url)
        console.log('[Editor] status:', analysis.status)

        // 如果有图表 URL，获取图表数据
        if (analysis.diagram_oss_url && analysis.status === 'completed') {
          try {
            console.log('[Editor] Fetching diagram from:', analysis.diagram_oss_url)
            const diagramData = await analysisService.fetchDiagramFromUrl(analysis.diagram_oss_url)
            console.log('[Editor] Diagram data received:', diagramData)

            if (diagramData && diagramData.structs) {
              setInitialData(diagramData)
              message.success(`已加载分析结果: ${diagramData.structs.length} 个结构体`)
            } else {
              console.warn('[Editor] Invalid diagram data - no structs array')
            }
          } catch (err) {
            console.error('[Editor] Failed to load diagram data:', err)
            message.error('加载图表数据失败')
          }
        } else {
          console.log('[Editor] No diagram URL or analysis not completed')
        }
      } catch (error) {
        console.error('[Editor] Failed to load analysis:', error)
        message.error('加载分析失败')
      } finally {
        setLoading(false)
      }
    }

    loadDiagram()
  }, [analysisId])

  if (loading) {
    return (
      <div style={{ width: '100%', height: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" tip="加载分析数据..." />
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 64px)', position: 'relative' }}>
       <ExcalidrawWrapper storageKey={`analysis_editor_${analysisId}`} initialData={initialData} />
    </div>
  )
}
