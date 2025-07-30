import { create } from 'zustand'
import { Message, Session } from '@/types'
import { generateShortSessionId } from '@/lib/utils'

interface ChatState {
  // 状态
  messages: Message[]
  currentSession: Session | null
  currentProjectId: string
  isLoading: boolean
  error: string | null
  
  // 操作
  addMessage: (message: Message) => void
  updateMessage: (id: string, updates: Partial<Message>) => void
  removeMessage: (id: string) => void
  clearMessages: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setCurrentSession: (session: Session | null) => void
  setCurrentProjectId: (projectId: string) => void
  generateNewProjectId: () => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  // 初始状态
  messages: [],
  currentSession: null,
  currentProjectId: '', // 初始为空，避免SSR/CSR不匹配
  isLoading: false,
  error: null,

  // 添加消息
  addMessage: (message: Message) => {
    set((state) => ({
      messages: [...state.messages, message]
    }))
  },

  // 更新消息
  updateMessage: (id: string, updates: Partial<Message>) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...updates } : msg
      )
    }))
  },

  // 删除消息
  removeMessage: (id: string) => {
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== id)
    }))
  },

  // 清空消息
  clearMessages: () => {
    set({ messages: [] })
  },

  // 设置加载状态
  setLoading: (loading: boolean) => {
    set({ isLoading: loading })
  },

  // 设置错误
  setError: (error: string | null) => {
    set({ error })
  },

  // 设置当前会话
  setCurrentSession: (session: Session | null) => {
    set({ currentSession: session })
  },

  // 设置当前项目ID
  setCurrentProjectId: (projectId: string) => {
    set({ currentProjectId: projectId })
  },

  // 生成新的项目ID
  generateNewProjectId: () => {
    set({ currentProjectId: generateShortSessionId() })
  }
})) 