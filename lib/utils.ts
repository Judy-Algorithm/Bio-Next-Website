import { config } from './config'

/**
 * Merge CSS class names
 */
export function cn(...inputs: string[]) {
  return inputs.join(' ')
}

/**
 * 文件验证函数
 */
export function validateFile(file: File): { isValid: boolean; error?: string } {
  // 检查文件大小
  if (file.size > config.upload.maxFileSize) {
    return {
      isValid: false,
      error: `文件大小超过限制 (${formatFileSize(config.upload.maxFileSize)})`
    }
  }

  // 检查文件类型 - 允许所有文件类型
  const fileExtension = getFileExtension(file.name)
  if (config.upload.allowedTypes.includes('*')) {
    // 允许所有文件类型
    return { isValid: true }
  } else if (!config.upload.allowedTypes.includes(fileExtension.toLowerCase())) {
    return {
      isValid: false,
      error: `不支持的文件类型: ${fileExtension}。支持的类型: ${config.upload.allowedTypes.join(', ')}`
    }
  }

  return { isValid: true }
}

/**
 * 获取文件扩展名
 */
export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.')
  return lastDotIndex !== -1 ? filename.substring(lastDotIndex) : ''
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 格式化时间
 */
export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const target = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return '刚刚'
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}分钟前`
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}小时前`
  } else if (diffInSeconds < 2592000) {
    return `${Math.floor(diffInSeconds / 86400)}天前`
  } else {
    return formatDateTime(target)
  }
}

/**
 * 生成用户ID
 */
export function generateUserId(): string {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

/**
 * 生成项目ID
 */
export function generateProjectId(): string {
  return 'project_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * 错误处理函数
 */
export function handleError(error: any, context: string = ''): string {
  console.error(`错误 [${context}]:`, error)
  
  if (error.name === 'AbortError') {
    return config.errorMessages.timeoutError
  }
  
  if (error.message) {
    return error.message
  }
  
  return config.errorMessages.serverError
}

/**
 * 成功消息处理
 */
export function getSuccessMessage(action: string): string {
  switch (action) {
    case 'upload':
      return config.successMessages.uploadSuccess
    case 'analysis':
      return config.successMessages.analysisStarted
    case 'download':
      return config.successMessages.downloadSuccess
    default:
      return '操作成功'
  }
}

/**
 * 检查网络连接
 */
export async function checkNetworkConnection(): Promise<boolean> {
  try {
    const response = await fetch('/api/health', { 
      method: 'HEAD',
      cache: 'no-cache'
    })
    return response.ok
  } catch {
    return false
  }
}

/**
 * 下载文件
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

/**
 * 复制到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('复制失败:', error)
    return false
  }
}

/**
 * 生成随机颜色
 */
export function generateRandomColor(): string {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证URL格式
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Get app configuration
 */
export function getAppConfig() {
  if (typeof window !== 'undefined') {
    return (window as any).__bio_next_env__ || {}
  }
  return {}
}

/**
 * Local storage utilities
 */
export const storage = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },
  
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },
  
  remove: (key: string) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  }
}

/**
 * Theme utilities
 */
export const theme = {
  isDark: () => {
    if (typeof window === 'undefined') return false
    return document.documentElement.classList.contains('dark')
  },
  
  toggle: () => {
    if (typeof window === 'undefined') return
    const isDark = theme.isDark()
    document.documentElement.classList.toggle('dark', !isDark)
    storage.set('theme', isDark ? 'light' : 'dark')
  },
  
  set: (theme: 'light' | 'dark') => {
    if (typeof window === 'undefined') return
    document.documentElement.classList.toggle('dark', theme === 'dark')
    storage.set('theme', theme)
  }
}

/**
 * Keyboard utilities
 */
export const keyboard = {
  isCtrlOrCmd: (e: KeyboardEvent) => {
    return e.ctrlKey || e.metaKey
  },
  
  isShift: (e: KeyboardEvent) => {
    return e.shiftKey
  },
  
  isAlt: (e: KeyboardEvent) => {
    return e.altKey
  },
  
  getKeyCombo: (e: KeyboardEvent) => {
    const keys = []
    if (keyboard.isCtrlOrCmd(e)) keys.push('Ctrl')
    if (keyboard.isShift(e)) keys.push('Shift')
    if (keyboard.isAlt(e)) keys.push('Alt')
    keys.push(e.key.toUpperCase())
    return keys.join('+')
  }
} 

/**
 * Cross-site authentication utilities
 */
export const crossSiteAuth = {
  // 检查是否从CureNova跳转过来
  checkCureNovaRedirect: () => {
    if (typeof window === 'undefined') return null
    
    const urlParams = new URLSearchParams(window.location.search)
    const authToken = urlParams.get('auth_token')
    const userData = urlParams.get('user_data')

    if (authToken && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData))
        return { user, token: authToken }
      } catch (error) {
        console.error('解析CureNova跳转数据失败:', error)
        return null
      }
    }
    return null
  },

  // 清除URL中的认证参数
  clearAuthParams: () => {
    if (typeof window === 'undefined') return
    
    const newUrl = window.location.pathname
    window.history.replaceState({}, '', newUrl)
  },

  // 存储CureNova用户信息
  storeCureNovaUser: (user: any, token?: string) => {
    if (typeof window === 'undefined') return
    
    if (token) {
      localStorage.setItem('auth-token', token)
    }
    localStorage.setItem('curenova-user', JSON.stringify(user))
  },

  // 获取CureNova用户信息
  getCureNovaUser: () => {
    if (typeof window === 'undefined') return null
    
    try {
      const userData = localStorage.getItem('curenova-user')
      return userData ? JSON.parse(userData) : null
    } catch {
      localStorage.removeItem('curenova-user')
      return null
    }
  }
} 