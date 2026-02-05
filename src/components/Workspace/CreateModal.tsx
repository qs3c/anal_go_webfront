import { useState } from 'react'
import { Modal, Form, Input, Tabs, Button, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import ConfigForm from './ConfigForm'
import { useAnalysis } from '../../hooks/useAnalysis'
import { GoFileInfo } from '../../services/uploadService'

interface Props {
  open: boolean
  onClose: () => void
}

export default function CreateModal({ open, onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'ai' | 'manual'>('ai')
  const [uploadId, setUploadId] = useState<string>('')
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { createAnalysis } = useAnalysis()

  const handleUploadSuccess = (id: string, _files: GoFileInfo[]) => {
    setUploadId(id)
    form.setFieldValue('upload_id', id)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const sourceType = values.source_type || 'github'
      const isUpload = sourceType === 'upload'

      // 生成默认标题
      let defaultTitle = 'Untitled Analysis'
      if (isUpload && values.start_file) {
        defaultTitle = `${values.start_file.split('/').pop()} Analysis`
      } else if (values.repo_url) {
        defaultTitle = `${values.repo_url.split('/').pop()} Analysis`
      }

      const payload = {
        title: values.title || defaultTitle,
        description: values.description || '',
        creation_type: activeTab,
        source_type: sourceType,
        repo_url: isUpload ? undefined : values.repo_url,
        upload_id: isUpload ? (uploadId || values.upload_id) : undefined,
        start_file: isUpload ? values.start_file : undefined,
        start_struct: values.start_struct,
        analysis_depth: values.analysis_depth,
        model_name: values.model_name,
      }

      const res = await createAnalysis(payload)
      if (!res) {
        message.error('创建失败')
        return
      }

      message.success('创建成功')
      onClose()
      form.resetFields()

      if (activeTab === 'ai') {
        navigate(`/analysis/${res.analysis_id}/progress`)
      } else {
        navigate(`/analysis/${res.analysis_id}`)
      }
    } catch (error) {
      console.error('Create failed:', error)
      message.error('创建失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="创建分析"
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          {activeTab === 'ai' ? '开始分析' : '创建'}
        </Button>,
      ]}
    >
      <Tabs
        activeKey={activeTab}
        destroyInactiveTabPane
        onChange={(key) => setActiveTab(key as 'ai' | 'manual')}
        items={[
          {
            key: 'ai',
            label: 'AI 自动分析',
            children: (
              <Form form={form} layout="vertical">
                <Form.Item name="title" label="项目名称 (可选)">
                  <Input placeholder="默认为仓库名" />
                </Form.Item>
                <ConfigForm onUploadSuccess={handleUploadSuccess} />
              </Form>
            ),
          },
          {
            key: 'manual',
            label: '手动创建',
            children: (
              <Form form={form} layout="vertical">
                <Form.Item name="title" label="项目名称" rules={[{ required: true, message: '请输入项目名称' }]}>
                  <Input placeholder="我的分析项目" />
                </Form.Item>
                <Form.Item name="description" label="描述">
                  <Input.TextArea rows={4} />
                </Form.Item>
              </Form>
            ),
          },
        ]}
      />
    </Modal>
  )
}
