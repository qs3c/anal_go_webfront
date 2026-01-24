import { useEffect, useState } from 'react'
import { message } from 'antd'
import type { ProgressMessage } from '../types'

function buildMockEvents(analysisId: number): ProgressMessage[] {
  return [
    {
      type: 'analysis_progress',
      data: {
        job_id: analysisId + 1000,
        analysis_id: analysisId,
        status: 'processing',
        current_step: '正在解析项目结构',
        elapsed_seconds: 10,
      },
    },
    {
      type: 'analysis_progress',
      data: {
        job_id: analysisId + 1000,
        analysis_id: analysisId,
        status: 'processing',
        current_step: '正在构建依赖关系',
        elapsed_seconds: 30,
      },
    },
    {
      type: 'analysis_progress',
      data: {
        job_id: analysisId + 1000,
        analysis_id: analysisId,
        status: 'processing',
        current_step: '正在生成结构图',
        elapsed_seconds: 60,
      },
    },
    {
      type: 'analysis_completed',
      data: {
        job_id: analysisId + 1000,
        analysis_id: analysisId,
        diagram_oss_url: 'https://oss.example.com/diagrams/demo.json.gz',
        elapsed_seconds: 90,
      },
    },
  ]
}

export async function createMockProgressStream() {
  return buildMockEvents(1)
}

export const useWebSocket = (analysisId: number, onCompleted?: (ossURL: string) => void) => {
  const [progress, setProgress] = useState<ProgressMessage | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!analysisId) return

    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | null = null
    const events = buildMockEvents(analysisId)
    let index = 0

    setConnected(true)

    const tick = () => {
      if (cancelled) return
      const event = events[index]
      setProgress(event)

      if (event.type === 'analysis_completed') {
        message.success('分析完成！')
        if (event.data.diagram_oss_url) {
          onCompleted?.(event.data.diagram_oss_url)
        }
        setConnected(false)
        return
      }

      if (event.type === 'analysis_failed') {
        message.error(`分析失败: ${event.data.error_message}`)
        setConnected(false)
        return
      }

      index += 1
      if (index < events.length) {
        timer = setTimeout(tick, 800)
      }
    }

    tick()

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
      setConnected(false)
    }
  }, [analysisId, onCompleted])

  return { progress, connected }
}
