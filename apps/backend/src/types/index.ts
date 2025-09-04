export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: 'admin' | 'user';
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key_preview: string;
  permissions: Record<string, any>;
  usage_count: number;
  last_used_at?: Date;
  expires_at?: Date;
  is_active: boolean;
  created_at: Date;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  model_config: {
    provider: string;
    model: string;
    temperature: number;
    max_tokens: number;
    system_prompt?: string;
  };
  is_pinned: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata: Record<string, any>;
  created_at: Date;
}

export interface IdeProject {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  files: Record<string, any>;
  settings: Record<string, any>;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface WebSocketMessage {
  type: string;
  payload: any;
  sessionId?: string;
}