import { useEffect, useState } from 'react'
import { message } from 'antd'
import { WebSocketService } from '../services/wsService'
import type { ProgressMessage } from '../types'

export const useWebSocket = (analysisId: number, onCompleted?: (ossURL: string) => void) => {
  const [progress, setProgress] = useState<ProgressMessage | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!analysisId) return

    const ws = new WebSocketService(
      (msg) => {
        // 只处理当前分析的消息
        if (msg.data.analysis_id === analysisId) {
          setProgress(msg)

          if (msg.type === 'analysis_completed') {
            message.success('分析完成！')
            onCompleted?.(msg.data.diagram_oss_url!)
          } else if (msg.type === 'analysis_failed') {
            message.error(`分析失败: ${msg.data.error_message}`)
          }
        }
      },
      (error) => {
        console.error('WebSocket error:', error)
        setConnected(false)
      },
      () => {
        setConnected(false)
      }
    )

    ws.connect()
    setConnected(true)

    return () => {
      ws.disconnect()
    }
  }, [analysisId, onCompleted])

  return { progress, connected }
}
