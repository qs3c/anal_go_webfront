import { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Space, Typography, message } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import Progress from '../components/Workspace/Progress'
import { useWebSocket } from '../hooks/useWebSocket'
import { analysisService } from '../services/analysisService'
import type { Analysis } from '../types'

const { Title, Paragraph } = Typography

// 步骤到进度的映射（英文来自 WebSocket，中文来自轮询 API）
const STEP_PROGRESS_MAP: Record<string, number> = {
  cloning: 20,
  parsing: 40,
  analyzing: 70,
  uploading: 90,
  done: 100,
  '正在克隆仓库': 20,
  '正在解析项目结构': 40,
  '正在进行 AI 分析': 70,
  '正在上传结果': 90,
  '分析完成': 100,
}

export default function AnalysisProgress() {
  const params = useParams()
  const navigate = useNavigate()
  const analysisId = useMemo(() => Number(params.id), [params.id])
  const [logs, setLogs] = useState<string[]>([])
  const [displayPercent, setDisplayPercent] = useState(0)
  const [targetPercent, setTargetPercent] = useState(0)
  const [currentStep, setCurrentStep] = useState<string>('准备中...')
  const [modelName, setModelName] = useState<string>('')
  const [failed, setFailed] = useState(false)
  const [failedMessage, setFailedMessage] = useState('')
  const [retrying, setRetrying] = useState(false)
  const [analysisDetail, setAnalysisDetail] = useState<Analysis | null>(null)
  const [completionData, setCompletionData] = useState<{ ossUrl: string; timestamp: number } | null>(null)
  const animationFrameRef = useRef<number>()
  const pollingRef = useRef<ReturnType<typeof setInterval>>()
  const lastStepRef = useRef<string>('')

  // 步骤 key 转用户友好描述
  const getStepDescription = useCallback((step: string) => {
    const model = modelName || 'AI'
    const map: Record<string, string> = {
      cloning: '正在克隆 GitHub 仓库...',
      parsing: '正在解析项目结构与结构体列表...',
      analyzing: `正在调用 ${model} 模型进行 AI 分析...`,
      uploading: '正在上传分析结果...',
      done: '分析完成！',
      '正在克隆仓库': '正在克隆 GitHub 仓库...',
      '正在解析项目结构': '正在解析项目结构与结构体列表...',
      '正在进行 AI 分析': `正在调用 ${model} 模型进行 AI 分析...`,
      '正在上传结果': '正在上传分析结果...',
      '分析完成': '分析完成！',
    }
    return map[step] || step
  }, [modelName])

  // 步骤顺序，用于补全跳过的步骤
  const STEP_ORDER = ['parsing', 'analyzing', 'uploading', 'done']
  const STEP_ORDER_CN = ['正在解析项目结构', '正在进行 AI 分析', '正在上传结果', '分析完成']

  // 添加日志（去重 + 补全跳过的步骤）
  const addLog = useCallback((step: string) => {
    if (lastStepRef.current === step) return

    let currentIndex = STEP_ORDER.indexOf(step)
    if (currentIndex === -1) currentIndex = STEP_ORDER_CN.indexOf(step)
    if (currentIndex === -1) {
      lastStepRef.current = step
      const time = new Date().toLocaleTimeString()
      setLogs((prev) => [...prev, `[${time}] ${getStepDescription(step)}`])
      return
    }

    let lastIndex = STEP_ORDER.indexOf(lastStepRef.current)
    if (lastIndex === -1) lastIndex = STEP_ORDER_CN.indexOf(lastStepRef.current)

    const time = new Date().toLocaleTimeString()
    const newLogs: string[] = []
    for (let i = lastIndex + 1; i <= currentIndex; i++) {
      newLogs.push(`[${time}] ${getStepDescription(STEP_ORDER[i])}`)
    }

    if (newLogs.length > 0) {
      lastStepRef.current = step
      setLogs((prev) => [...prev, ...newLogs])
    }
  }, [getStepDescription])

  // 标记失败
  const markFailed = useCallback((errMsg: string) => {
    setFailed(true)
    setFailedMessage(errMsg || '未知错误')
    setCurrentStep(errMsg || '分析失败')
    const time = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev, `[${time}] 分析失败: ${errMsg || '未知错误'}`])
    if (pollingRef.current) clearInterval(pollingRef.current)
  }, [])

  // 重新分析
  const handleRetry = useCallback(async () => {
    if (!analysisDetail) {
      message.error('无法获取分析详情，请返回工作区重新创建')
      return
    }
    setRetrying(true)
    try {
      const result = await analysisService.create({
        title: analysisDetail.title,
        creation_type: analysisDetail.creation_type,
        source_type: analysisDetail.repo_url ? 'github' : 'upload',
        repo_url: analysisDetail.repo_url,
        start_struct: analysisDetail.start_struct,
        analysis_depth: analysisDetail.analysis_depth,
        model_name: analysisDetail.model_name,
      })
      message.success('已重新提交分析任务')
      navigate(`/progress/${result.analysis_id}`)
    } catch {
      message.error('重新提交失败，请稍后重试')
    } finally {
      setRetrying(false)
    }
  }, [analysisDetail, navigate])

  // 加载分析详情获取模型名和重试所需参数
  useEffect(() => {
    analysisService.detail(analysisId).then((detail) => {
      if (detail) {
        if (detail.model_name) setModelName(detail.model_name)
        setAnalysisDetail(detail)
      }
    }).catch(() => {})
  }, [analysisId])

  // 主动轮询当前任务状态
  useEffect(() => {
    const pollStatus = async () => {
      try {
        const status = await analysisService.getJobStatus(analysisId)
        if (status.status === 'completed') {
          setTargetPercent(100)
          setCurrentStep('分析完成！')
          addLog('done')
          try {
            const detail = await analysisService.detail(analysisId)
            setCompletionData((prev) => prev || { ossUrl: detail?.diagram_oss_url || '', timestamp: Date.now() })
          } catch {
            setCompletionData((prev) => prev || { ossUrl: '', timestamp: Date.now() })
          }
        } else if (status.status === 'failed') {
          markFailed(status.error_message || '未知错误')
        } else if (status.current_step) {
          const stepProgress = STEP_PROGRESS_MAP[status.current_step] || 0
          setTargetPercent((prev) => Math.max(prev, stepProgress))
          setCurrentStep(getStepDescription(status.current_step))
          addLog(status.current_step)
        }
      } catch {
        // ignore
      }
    }

    pollStatus()
    pollingRef.current = setInterval(pollStatus, 3000)

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [analysisId, getStepDescription, addLog, markFailed])

  // completionData 设置后停止轮询
  useEffect(() => {
    if (completionData && pollingRef.current) {
      clearInterval(pollingRef.current)
    }
  }, [completionData])

  // 平滑动画更新进度条
  useEffect(() => {
    if (displayPercent >= targetPercent) return

    const animate = () => {
      setDisplayPercent((prev) => {
        const diff = targetPercent - prev
        if (diff < 0.1) return targetPercent
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

    setTargetPercent(100)

    if (displayPercent >= 99.5) {
      const timer = setTimeout(() => {
        navigate(`/analysis/${analysisId}`)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [completionData, displayPercent, navigate, analysisId])

  const handleCompleted = useCallback((ossUrl: string) => {
    setCompletionData({ ossUrl: ossUrl || '', timestamp: Date.now() })
  }, [])

  const { progress, connected } = useWebSocket(analysisId, handleCompleted)

  // 处理 WebSocket 进度更新
  useEffect(() => {
    if (!progress) return

    if (progress.type === 'analysis_progress' && progress.data.current_step) {
      const step = progress.data.current_step
      const stepProgress = STEP_PROGRESS_MAP[step] || 0
      setTargetPercent(stepProgress)
      setCurrentStep(getStepDescription(step))
      addLog(step)
    } else if (progress.type === 'analysis_completed') {
      setTargetPercent(100)
      setCurrentStep('分析完成！')
      addLog('done')
    } else if (progress.type === 'analysis_failed') {
      markFailed(progress.data.error_message || '未知错误')
    }
  }, [progress, getStepDescription, addLog, markFailed])

  const progressStatus = failed ? 'failed' : completionData ? 'success' : 'running'

  return (
    <div>
      <Title level={2}>分析进度</Title>
      <Paragraph>
        {failed
          ? '分析任务失败，请查看错误信息。'
          : '正在分析你的 Go 项目结构，请稍候。'}
        {!failed && (connected ? ' (已连接)' : ' (连接中...)')}
      </Paragraph>
      <Progress
        percent={Math.round(displayPercent)}
        currentStep={currentStep}
        logs={logs}
        status={progressStatus}
      />
      {failed && failedMessage && (
        <div style={{
          marginTop: 16,
          padding: '12px 16px',
          background: '#fff2f0',
          border: '1px solid #ffccc7',
          borderRadius: 8,
          color: '#ff4d4f',
        }}>
          {failedMessage}
        </div>
      )}
      <Space style={{ marginTop: 16 }}>
        {failed && (
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            loading={retrying}
            onClick={handleRetry}
          >
            重新分析
          </Button>
        )}
        <Button onClick={() => navigate('/workspace')}>返回工作区</Button>
      </Space>
    </div>
  )
}
