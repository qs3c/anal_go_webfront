import { useEffect, useRef, useState } from 'react'
import { message } from 'antd'
import type { ProgressMessage } from '../types'

const MAX_RECONNECT_ATTEMPTS = 10
const RECONNECT_BASE_DELAY = 1000 // 1秒起步，指数退避

export const useWebSocket = (analysisId: number, onCompleted?: (ossURL: string) => void) => {
  const [progress, setProgress] = useState<ProgressMessage | null>(null)
  const [connected, setConnected] = useState(false)
  const onCompletedRef = useRef(onCompleted)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)
  // 标记分析是否已完成/失败，完成后不再重连
  const terminalRef = useRef(false)

  useEffect(() => {
    onCompletedRef.current = onCompleted
  }, [onCompleted])

  useEffect(() => {
    console.log('[useWebSocket] Effect triggered, analysisId:', analysisId)
    isMountedRef.current = true
    terminalRef.current = false
    reconnectAttemptsRef.current = 0

    if (!analysisId) {
      console.log('[useWebSocket] No analysisId, skipping')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      console.error('[useWebSocket] No token found')
      message.error('请先登录')
      return
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const baseUrl = '47.250.132.14:8080/api/v1/ws'
    const wsUrl = `${protocol}//${baseUrl}?token=${token}`

    const connect = () => {
      if (!isMountedRef.current || terminalRef.current) return

      console.log('[useWebSocket] Connecting...', wsUrl)
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('[useWebSocket] Connected')
        // 只处理当前连接的事件，忽略被替换的旧连接
        if (wsRef.current !== ws) return
        if (isMountedRef.current) {
          setConnected(true)
          reconnectAttemptsRef.current = 0
        }
      }

      ws.onmessage = (event) => {
        if (wsRef.current !== ws || !isMountedRef.current) return

        try {
          const msg: ProgressMessage = JSON.parse(event.data)
          console.log('[useWebSocket] Message received:', msg)

          if (msg.data.analysis_id !== analysisId) {
            console.log('[useWebSocket] Ignoring message for different analysis:', msg.data.analysis_id)
            return
          }

          setProgress(msg)

          if (msg.type === 'analysis_completed') {
            terminalRef.current = true
            message.success('分析完成！')
            onCompletedRef.current?.(msg.data.diagram_oss_url || '')
          } else if (msg.type === 'analysis_failed') {
            terminalRef.current = true
            message.error(`分析失败: ${msg.data.error_message || '未知错误'}`)
          }
        } catch (err) {
          console.error('[useWebSocket] Failed to parse message:', err)
        }
      }

      ws.onerror = (error) => {
        console.error('[useWebSocket] Error:', error)
      }

      ws.onclose = (event) => {
        console.log('[useWebSocket] Disconnected, code:', event.code, 'reason:', event.reason)

        // 忽略已被替换的旧连接的 close 事件（React StrictMode 场景）
        if (wsRef.current !== ws) {
          console.log('[useWebSocket] Ignoring close from stale connection')
          return
        }

        if (isMountedRef.current) {
          setConnected(false)
        }

        // 如果分析已完成/失败或组件已卸载，不重连
        if (terminalRef.current || !isMountedRef.current) return

        // 自动重连（指数退避）
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          const delay = RECONNECT_BASE_DELAY * Math.pow(2, reconnectAttemptsRef.current)
          reconnectAttemptsRef.current++
          console.log(`[useWebSocket] Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current})`)
          reconnectTimerRef.current = setTimeout(connect, delay)
        } else {
          message.error('WebSocket 连接失败，请刷新页面重试')
        }
      }
    }

    connect()

    return () => {
      console.log('[useWebSocket] Cleanup')
      isMountedRef.current = false
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current)
        reconnectTimerRef.current = null
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [analysisId])

  return { progress, connected }
}
