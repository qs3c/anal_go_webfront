import { apiClient, ApiResponse } from './api'

export interface GoFileInfo {
  path: string
  structs: string[]
}

export interface ParseUploadResponse {
  upload_id: string
  expires_at: string
  files: GoFileInfo[]
  total_files: number
  total_structs: number
}

export const uploadService = {
  async parseZip(file: File): Promise<ParseUploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post<ApiResponse<ParseUploadResponse>>(
      '/upload/parse',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data.data
  },
}
