import type { ProgressMessage } from '../types'
import { useAuthStore } from '../store/authStore'

export class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectTimer: NodeJS.Timeout | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private onMessage: (msg: ProgressMessage) => void
  private onError?: (error: Event) => void
  private onClose?: () => void

  constructor(
    onMessage: (msg: ProgressMessage) => void,
    onError?: (error: Event) => void,
    onClose?: () => void
  ) {
    this.onMessage = onMessage
    this.onError = onError
    this.onClose = onClose
  }

  connect() {
    const token = useAuthStore.getState().token
    if (!token) {
      console.error('No auth token found')
      return
    }

    const wsBase = import.meta.env.VITE_WS_URL || 'ws://localhost:8080'
    const wsURL = `${wsBase}/api/v1/ws?token=${token}`

    try {
      this.ws = new WebSocket(wsURL)

      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.reconnectAttempts = 0
      }

      this.ws.onmessage = (event) => {
        try {
          const msg: ProgressMessage = JSON.parse(event.data)
          this.onMessage(msg)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.onError?.(error)
      }

      this.ws.onclose = () => {
        console.log('WebSocket disconnected')
        this.onClose?.()
        this.scheduleReconnect()
      }
    } catch (error) {
      console.error('Failed to create WebSocket:', error)
      this.scheduleReconnect()
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000)

    console.log(`Reconnecting in ${delay}ms... (attempt ${this.reconnectAttempts})`)

    this.reconnectTimer = setTimeout(() => {
      this.connect()
    }, delay)
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}
