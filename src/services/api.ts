export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export async function withLatency<T>(data: T, delayMs = 0): Promise<ApiResponse<T>> {
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }
  return { code: 0, message: 'success', data }
}

export async function withError(message: string, code = 1000): Promise<ApiResponse<null>> {
  return { code, message, data: null }
}
