import { Form, Input, Slider, Select } from 'antd'

export default function ConfigForm() {
  return (
    <>
      <Form.Item
        name="repo_url"
        label="仓库地址"
        rules={[{ required: true, message: '请输入 GitHub 仓库地址' }, { type: 'url', message: '请输入有效的 URL' }]}
        extra="仅支持公开的 GitHub 仓库"
      >
        <Input placeholder="https://github.com/gin-gonic/gin" />
      </Form.Item>

      <Form.Item
        name="start_struct"
        label="起始结构体"
        rules={[{ required: true, message: '请输入起始结构体名称' }]}
        extra="例如: Engine"
      >
        <Input placeholder="Engine" />
      </Form.Item>

      <Form.Item name="analysis_depth" label="分析深度" initialValue={3}>
        <Slider min={1} max={10} marks={{ 1: '1', 3: '3', 5: '5', 10: '10' }} />
      </Form.Item>

      <Form.Item name="model_name" label="选择模型" initialValue="gpt-3.5-turbo">
        <Select>
          <Select.Option value="gpt-3.5-turbo">GPT-3.5 Turbo (基础)</Select.Option>
          <Select.Option value="gpt-4" disabled>
            GPT-4 (Pro 仅限)
          </Select.Option>
        </Select>
      </Form.Item>
    </>
  )
}
