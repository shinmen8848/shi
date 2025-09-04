export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  role: 'admin' | 'user'
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface ApiKey {
  id: string
  name: string
  key_preview: string
  usage_count: number
  last_used_at?: string
  expires_at?: string
  is_active: boolean
  created_at: string
}

export interface ChatSession {
  id: string
  title: string
  model_config: {
    provider: string
    model: string
    temperature: number
    max_tokens: number
    system_prompt?: string
  }
  is_pinned: boolean
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  session_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  metadata: Record<string, any>
  created_at: string
}

export interface IdeProject {
  id: string
  name: string
  description?: string
  files: Record<string, any>
  settings: Record<string, any>
  is_public: boolean
  created_at: string
  updated_at: string
}