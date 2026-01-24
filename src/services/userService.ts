import api from './api'
import type { UpdateProfileRequest } from '../types/api'

export const userService = {
  // 更新用户信息
  async updateProfile(data: UpdateProfileRequest) {
    const res = await api.put('/user/profile', data)
    return res.data
  },

  // 上传头像
  async uploadAvatar(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    const res = await api.post('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return res.data
  },

  // 获取配额信息
  async getQuotaInfo() {
    const res = await api.get('/quota/info')
    return res.data
  },
}
