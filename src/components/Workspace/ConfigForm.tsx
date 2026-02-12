import { Form, Input, Slider, Select, Spin, Radio, Upload, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { modelService, Model } from '../../services/modelService'
import { uploadService, GoFileInfo } from '../../services/uploadService'
import { useAuthStore } from '../../store/authStore'

const { Dragger } = Upload

interface ConfigFormProps {
  onUploadSuccess?: (uploadId: string, files: GoFileInfo[]) => void
}

export default function ConfigForm({ onUploadSuccess }: ConfigFormProps) {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(false)
  const [sourceType, setSourceType] = useState<'github' | 'upload'>('github')
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<GoFileInfo[]>([])
  const [selectedFile, setSelectedFile] = useState<string>('')
  const [uploadId, setUploadId] = useState<string>('')
  const user = useAuthStore((state) => state.user)
  const userLevel = user?.subscription_level || 'free'
  const form = Form.useFormInstance()

  useEffect(() => {
    loadModels()
  }, [])

  const loadModels = async () => {
    try {
      setLoading(true)
      const data = await modelService.getModels()
      setModels(data.models || [])
    } catch (error) {
      console.error('Failed to load models:', error)
      setModels([
        {
          name: 'glm-4.7',
          display_name: 'GLM-4.7',
          required_level: 'free',
          description: '智谱AI基础模型，快速分析（默认）',
          available: true
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const canUseModel = (requiredLevel: string) => {
    const levels = ['free', 'basic', 'pro']
    const userLevelIndex = levels.indexOf(userLevel)
    const requiredLevelIndex = levels.indexOf(requiredLevel)
    return userLevelIndex >= requiredLevelIndex
  }

  const getDefaultModel = () => {
    const availableModel = models.find(m => canUseModel(m.required_level) && m.available)
    return availableModel?.name || 'glm-4.7'
  }

  const handleUpload = async (file: File) => {
    // 检查文件类型
    if (!file.name.endsWith('.zip')) {
      message.error('仅支持 ZIP 格式')
      return false
    }

    // 检查文件大小 (100MB)
    if (file.size > 100 * 1024 * 1024) {
      message.error('文件过大，最大支持 100MB')
      return false
    }

    setUploading(true)
    try {
      const result = await uploadService.parseZip(file)
      setUploadId(result.upload_id)
      setUploadedFiles(result.files)
      setSelectedFile('')
      message.success(`解析成功: ${result.total_files} 个文件, ${result.total_structs} 个结构体`)
      onUploadSuccess?.(result.upload_id, result.files)
    } catch (error: any) {
      console.error('Upload failed:', error)
      message.error(error.response?.data?.message || '上传失败')
    } finally {
      setUploading(false)
    }
    return false // 阻止默认上传行为
  }

  const getStructsForFile = (filePath: string): string[] => {
    const file = uploadedFiles.find(f => f.path === filePath)
    return file?.structs || []
  }

  return (
    <>
      <Form.Item label="数据来源" name="source_type" initialValue="github">
        <Radio.Group
          onChange={(e) => {
            setSourceType(e.target.value)
            setUploadedFiles([])
            setSelectedFile('')
            setUploadId('')
          }}
          value={sourceType}
        >
          <Radio value="github">从 GitHub</Radio>
          <Radio value="upload">从本地文件</Radio>
        </Radio.Group>
      </Form.Item>

      {sourceType === 'github' ? (
        <>
          <Form.Item
            name="repo_url"
            label="仓库地址"
            rules={[{ required: true, message: '请输入 GitHub 仓库地址' }, { type: 'url', message: '请输入有效的 URL' }]}
            extra="仅支持公开的 GitHub 仓库"
          >
            <Input
              placeholder="https://github.com/gin-gonic/gin"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !form.getFieldValue('repo_url')) {
                  e.preventDefault()
                  form.setFieldsValue({ repo_url: 'https://github.com/gin-gonic/gin' })
                }
              }}
            />
          </Form.Item>

          <Form.Item
            name="start_struct"
            label="起始结构体"
            rules={[{ required: true, message: '请输入起始结构体名称' }]}
            extra="例如: Engine"
          >
            <Input
              placeholder="Engine"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !form.getFieldValue('start_struct')) {
                  e.preventDefault()
                  form.setFieldsValue({ start_struct: 'Engine' })
                }
              }}
            />
          </Form.Item>
        </>
      ) : (
        <>
          <Form.Item label="上传文件" required>
            <Dragger
              accept=".zip"
              showUploadList={false}
              beforeUpload={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
                <div style={{ padding: '20px 0' }}>
                  <Spin />
                  <p style={{ marginTop: 8 }}>正在解析...</p>
                </div>
              ) : uploadedFiles.length > 0 ? (
                <div style={{ padding: '20px 0', color: '#52c41a' }}>
                  <p>解析成功</p>
                  <p style={{ fontSize: 12, color: '#999' }}>
                    {uploadedFiles.length} 个文件, 点击重新上传
                  </p>
                </div>
              ) : (
                <>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">拖拽 ZIP 文件到此处</p>
                  <p className="ant-upload-hint">或点击选择文件，最大 100MB</p>
                </>
              )}
            </Dragger>
          </Form.Item>

          <Form.Item name="upload_id" hidden initialValue="">
            <Input value={uploadId} />
          </Form.Item>

          {uploadedFiles.length > 0 && (
            <>
              <Form.Item
                name="start_file"
                label="起始文件"
                rules={[{ required: true, message: '请选择起始文件' }]}
              >
                <Select
                  placeholder="选择 Go 文件"
                  onChange={(value) => setSelectedFile(value)}
                  showSearch
                  optionFilterProp="children"
                >
                  {uploadedFiles.map((file) => (
                    <Select.Option key={file.path} value={file.path}>
                      {file.path} ({file.structs.length} 个结构体)
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="start_struct"
                label="起始结构体"
                rules={[{ required: true, message: '请选择起始结构体' }]}
              >
                <Select
                  placeholder={selectedFile ? '选择结构体' : '请先选择文件'}
                  disabled={!selectedFile}
                  showSearch
                >
                  {getStructsForFile(selectedFile).map((struct) => (
                    <Select.Option key={struct} value={struct}>
                      {struct}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}
        </>
      )}

      <Form.Item name="analysis_depth" label="分析深度" initialValue={3}>
        <Slider min={1} max={10} marks={{ 1: '1', 3: '3', 5: '5', 10: '10' }} />
      </Form.Item>

      <Form.Item
        name="model_name"
        label="选择模型"
        initialValue={getDefaultModel()}
        tooltip="不同订阅等级可使用不同的模型"
      >
        <Select loading={loading} placeholder="选择AI模型">
          {loading ? (
            <Select.Option value="" disabled>
              <Spin size="small" /> 加载中...
            </Select.Option>
          ) : (
            models.map((model) => {
              const canUse = canUseModel(model.required_level) && model.available

              return (
                <Select.Option
                  key={model.name}
                  value={model.name}
                  disabled={!canUse}
                >
                  {model.display_name}
                  {!model.available && ' (暂不可用)'}
                  {model.available && !canUseModel(model.required_level) && ' 🔒'}
                </Select.Option>
              )
            })
          )}
        </Select>
      </Form.Item>
    </>
  )
}
