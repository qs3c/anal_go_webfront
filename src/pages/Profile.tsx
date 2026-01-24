import { useState } from 'react'
import { Card, Form, Input, Button, Avatar, Upload, message, Descriptions, Tag } from 'antd'
import { UserOutlined, UploadOutlined } from '@ant-design/icons'
import { useAuthStore } from '../store/authStore'
import { userService } from '../services/userService'

export default function Profile() {
  const { user, updateUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)

  const handleUpdate = async (values: any) => {
    setLoading(true)
    try {
      await userService.updateProfile(values)
      updateUser(values)
      message.success('个人信息更新成功')
      setEditing(false)
    } catch (error) {
      console.error('Update failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (options: any) => {
    const { file, onSuccess, onError } = options
    try {
      const res = await userService.uploadAvatar(file)
      updateUser({ avatar_url: res.data.avatar_url })
      onSuccess(res.data)
      message.success('头像上传成功')
    } catch (error) {
      onError(error)
      message.error('头像上传失败')
    }
  }

  if (!user) return null

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Card
        title="个人信息"
        extra={
          !editing ? (
            <Button onClick={() => setEditing(true)}>编辑</Button>
          ) : (
            <Button onClick={() => setEditing(false)}>取消</Button>
          )
        }
      >
        <div style={{ display: 'flex', marginBottom: 40, alignItems: 'flex-start' }}>
            <div style={{ marginRight: 40, textAlign: 'center' }}>
                <Avatar 
                    size={100} 
                    src={user.avatar_url} 
                    icon={<UserOutlined />} 
                />
                <div style={{ marginTop: 16 }}>
                    <Upload 
                        customRequest={handleAvatarUpload} 
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />} size="small">更换头像</Button>
                    </Upload>
                </div>
            </div>
            
            <div style={{ flex: 1 }}>
                {!editing ? (
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="用户名">{user.username}</Descriptions.Item>
                        <Descriptions.Item label="邮箱">
                            {user.email} 
                            {user.email_verified ? <Tag color="success" style={{ marginLeft: 8 }}>已验证</Tag> : <Tag color="warning" style={{ marginLeft: 8 }}>未验证</Tag>}
                        </Descriptions.Item>
                        <Descriptions.Item label="订阅等级">
                            <Tag color="blue">{user.subscription_level.toUpperCase()}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="个人简介">{user.bio || '暂无简介'}</Descriptions.Item>
                        <Descriptions.Item label="注册时间">{new Date(user.created_at).toLocaleDateString()}</Descriptions.Item>
                    </Descriptions>
                ) : (
                    <Form
                        layout="vertical"
                        initialValues={{
                            username: user.username,
                            bio: user.bio
                        }}
                        onFinish={handleUpdate}
                    >
                        <Form.Item label="用户名" name="username" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="个人简介" name="bio">
                            <Input.TextArea rows={4} />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            保存修改
                        </Button>
                    </Form>
                )}
            </div>
        </div>
      </Card>
    </div>
  )
}
