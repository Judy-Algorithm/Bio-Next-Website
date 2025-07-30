import { type ClassValue, clsx } from 'clsx'

/**
 * Merge CSS class names
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/**
 * Format time
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Format date
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Format relative time
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} minutes ago`
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)} hours ago`
  } else if (diffInSeconds < 2592000) {
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  } else {
    return formatDate(date)
  }
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

/**
 * Generate session ID
 */
export function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15)
}

/**
 * Generate short session ID
 */
export function generateShortSessionId(): string {
  return Math.random().toString(36).substring(2, 8)
}

/**
 * Redirect to CureNova login
 */
export function redirectToCureNovaLogin(): void {
  window.open('https://cure-nova-website.vercel.app/login', '_blank')
}

/**
 * Debounce function
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
 * Throttle function
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
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Copy failed:', err)
    return false
  }
}

/**
 * Download file
 */
export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate URL format
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