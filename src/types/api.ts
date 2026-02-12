import { User } from './index'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface CreateAnalysisRequest {
  title: string
  description?: string
  creation_type: 'ai' | 'manual'
  source_type?: 'github' | 'upload'
  repo_url?: string
  upload_id?: string
  start_file?: string
  start_struct?: string
  analysis_depth?: number
  model_name?: string
  diagram_data?: any
}

export interface UpdateAnalysisRequest {
  title?: string
  description?: string
  diagram_data?: any
}

export interface ShareRequest {
  share_title: string
  share_description?: string
  tags?: string[]
}

export interface AnalysisListParams {
  page?: number
  page_size?: number
  search?: string
  status?: string
}

export interface CommunityParams {
  page?: number
  page_size?: number
  sort?: 'latest' | 'hot'
  tags?: string
}

export interface CommentRequest {
  content: string
  parent_id?: number
}

export interface UpdateProfileRequest {
  username?: string
  bio?: string
}
