import { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Space, Typography } from 'antd'
import Progress from '../components/Workspace/Progress'
import { useWebSocket } from '../hooks/useWebSocket'
import type { ProgressMessage } from '../types'

const { Title, Paragraph } = Typography

// 步骤到进度的映射
const STEP_PROGRESS_MAP: Record<string, number> = {
  cloning: 20,
  parsing: 40,
  analyzing: 70,
  uploading: 90,
  done: 100,
}

export default function AnalysisProgress() {
  const params = useParams()
  const navigate = useNavigate()
  const analysisId = useMemo(() => Number(params.id), [params.id])
  const [logs, setLogs] = useState<ProgressMessage[]>([])
  const [displayPercent, setDisplayPercent] = useState(0)
  const [targetPercent, setTargetPercent] = useState(0)
  const [completionData, setCompletionData] = useState<{ ossUrl: string; timestamp: number } | null>(null)
  const animationFrameRef = useRef<number>()
  const MIN_DISPLAY_TIME = 3000 // 最小显示时间 3 秒

  // 平滑动画更新进度条
  useEffect(() => {
    if (displayPercent >= targetPercent) return

    const animate = () => {
      setDisplayPercent((prev) => {
        const diff = targetPercent - prev
        if (diff < 0.1) return targetPercent
        // 使用缓动函数，进度越接近目标越慢
        return prev + diff * 0.1
      })
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [displayPercent, targetPercent])

  // 处理完成后的延迟跳转
  useEffect(() => {
    if (!completionData) return

    const elapsed = Date.now() - completionData.timestamp
    const remainingTime = Math.max(MIN_DISPLAY_TIME - elapsed, 0)

    // 确保进度条到达 100%
    setTargetPercent(100)

    // 一旦进度到达 100%，等待 500ms 后跳转
    if (displayPercent >= 99.5) {
      const timer = setTimeout(() => {
        if (completionData.ossUrl) {
          navigate(`/analysis/${analysisId}`)
        }
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [completionData, displayPercent, navigate, analysisId])

  // 使用 useCallback 稳定回调函数，避免频繁重新创建
  const handleCompleted = useCallback((ossUrl: string) => {
    if (ossUrl) {
      setCompletionData({ ossUrl, timestamp: Date.now() })
    }
  }, [])

  const { progress, connected } = useWebSocket(analysisId, handleCompleted)

  // 处理进度更新
  useEffect(() => {
    if (!progress) return

    setLogs((prev) => [...prev, progress])

    if (progress.type === 'analysis_progress' && progress.data.current_step) {
      // 根据步骤设置目标进度
      const stepProgress = STEP_PROGRESS_MAP[progress.data.current_step] || 0
      setTargetPercent(stepProgress)
    } else if (progress.type === 'analysis_completed') {
      setTargetPercent(100)
    } else if (progress.type === 'analysis_failed') {
      setTargetPercent(100)
    }
  }, [progress])

  return (
    <div>
      <Title level={2}>分析进度</Title>
      <Paragraph>
        正在分析你的 Go 项目结构，请稍候。
        {connected ? ' (已连接)' : ' (连接中...)'}
      </Paragraph>
      <Progress percent={Math.round(displayPercent)} progress={progress} logs={logs} />
      <Space style={{ marginTop: 16 }}>
        <Button onClick={() => navigate('/workspace')}>返回工作区</Button>
      </Space>
    </div>
  )
}
