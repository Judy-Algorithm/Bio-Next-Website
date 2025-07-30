// 消息相关类型
export interface Message {
  id: string
  content: string
  type: 'user' | 'assistant'
  timestamp: Date
  isTyping?: boolean
  metadata?: {
    tokens?: number
    model?: string
    temperature?: number
  }
}

// 会话相关类型
export interface Session {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  messageCount: number
  isArchived?: boolean
  isStarred?: boolean
}

// 用户相关类型
export interface User {
  _id?: string
  email: string
  name: string
  avatar?: string
  isEmailVerified?: boolean
  googleId?: string
  role?: 'user' | 'admin'
  isActive?: boolean
  lastLogin?: Date
  createdAt?: Date
  updatedAt?: Date
  plan?: 'free' | 'pro' | 'enterprise'
  settings?: UserSettings
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto'
  language: 'zh-CN' | 'en-US'
  notifications: boolean
  autoSave: boolean
}

// 认证相关类型
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  error?: string
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 聊天相关类型
export interface ChatState {
  messages: Message[]
  currentSession: Session | null
  isLoading: boolean
  error: string | null
}

// 文件上传类型
export interface FileUpload {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: Date
}

// 环境配置类型
export interface AppConfig {
  env: 'dev' | 'staging' | 'prod'
  serverUrl: string
  wsUrl: string
  googleDriveAppId?: string
  googleMapApiKey?: string
  amplitudeKey?: string
}

// 主题类型
export interface Theme {
  name: string
  colors: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
  }
}

// 快捷键类型
export interface KeyboardShortcut {
  key: string
  description: string
  action: () => void
}

// 通知类型
export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
}

// WebSocket 消息类型
export interface WebSocketMessage {
  type: 'message' | 'typing' | 'status' | 'error'
  data: any
  timestamp: Date
}

// 搜索相关类型
export interface SearchResult {
  id: string
  type: 'message' | 'session' | 'file'
  title: string
  content: string
  timestamp: Date
  relevance: number
}

// 分析统计类型
export interface Analytics {
  totalMessages: number
  totalSessions: number
  averageResponseTime: number
  popularTopics: Array<{
    topic: string
    count: number
  }>
} 