export interface User {
  id: number
  username: string
  email: string
  avatar_url: string | null
  bio: string
  subscription_level: 'free' | 'basic' | 'pro'
  email_verified: boolean
  created_at: string
}

export interface Analysis {
  id: number
  user_id: number
  title: string
  description: string
  creation_type: 'ai' | 'manual'
  repo_url?: string
  start_struct?: string
  analysis_depth?: number
  model_name?: string
  diagram_oss_url?: string
  diagram_size?: number
  status: 'draft' | 'pending' | 'analyzing' | 'completed' | 'failed'
  error_message?: string
  is_public: boolean
  view_count: number
  like_count: number
  comment_count: number
  bookmark_count: number
  created_at: string
  updated_at: string
}

export interface CommunityAnalysis extends Analysis {
  author: {
    id: number
    username: string
    avatar_url: string
    bio: string
  }
  tags: string[]
  share_title: string
  share_description: string
  shared_at: string
  user_interaction?: {
    liked: boolean
    bookmarked: boolean
  }
}

export interface Comment {
  id: number
  user: {
    id: number
    username: string
    avatar_url: string
  }
  content: string
  parent_id: number | null
  replies?: Comment[]
  created_at: string
}

export interface ProgressMessage {
  type: 'analysis_progress' | 'analysis_completed' | 'analysis_failed'
  data: {
    job_id: number
    analysis_id: number
    status?: string
    current_step?: string
    elapsed_seconds?: number
    diagram_oss_url?: string
    error_message?: string
  }
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}
