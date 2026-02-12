import { Card, Progress as AntProgress, Tag } from 'antd'
import { useState, useEffect, useRef } from 'react'

interface Props {
  percent: number
  currentStep: string
  logs: string[]
  status?: 'running' | 'success' | 'failed'
}

export default function Progress({ percent, currentStep, logs, status = 'running' }: Props) {
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval>>()
  const stepRef = useRef(currentStep)

  // 当步骤变化时重置计时器
  useEffect(() => {
    if (currentStep !== stepRef.current) {
      stepRef.current = currentStep
      setElapsed(0)
    }

    if (status === 'success' || status === 'failed') {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1)
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [currentStep, status])

  const progressStatus = status === 'failed' ? 'exception' : status === 'success' ? 'success' : 'active'

  const tagColor = status === 'failed' ? 'error' : status === 'success' ? 'success' : 'processing'
  const tagText = status === 'failed' ? '已失败' : status === 'success' ? '已完成' : '进行中'

  return (
    <Card title="分析进度">
      <div style={{ marginBottom: 16 }}>
        <AntProgress percent={percent} status={progressStatus} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <Tag color={tagColor}>{tagText}</Tag>
        <span style={{ marginLeft: 8, color: status === 'failed' ? '#ff4d4f' : undefined }}>
          {currentStep}
          {status === 'running' && elapsed > 0 && (
            <span style={{ color: '#999', marginLeft: 4 }}>({elapsed}s)</span>
          )}
        </span>
      </div>
      <div
        style={{
          background: '#1e1e1e',
          borderRadius: 8,
          padding: 16,
          maxHeight: 240,
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: 13,
          lineHeight: 1.8,
        }}
      >
        <div style={{ color: '#888', marginBottom: 8 }}>进度日志</div>
        {logs.length === 0 ? (
          <div style={{ color: '#666' }}>等待任务开始...</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} style={{ color: '#d4d4d4' }}>{log}</div>
          ))
        )}
      </div>
    </Card>
  )
}
