import axios from 'axios'

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// Create axios instance for real API calls
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
apiClient.interceptors.response.use(
  (response) => {
    // Check business error code in response body
    const data = response.data
    if (data && typeof data.code === 'number' && data.code !== 0) {
      // Business error - reject with error info
      const error = new Error(data.message || '请求失败') as any
      error.response = response
      error.code = data.code
      return Promise.reject(error)
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export { apiClient }

export async function withLatency<T>(data: T, delayMs = 0): Promise<ApiResponse<T>> {
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }
  return { code: 0, message: 'success', data }
}

export async function withError(message: string, code = 1000): Promise<ApiResponse<null>> {
  return { code, message, data: null }
}
