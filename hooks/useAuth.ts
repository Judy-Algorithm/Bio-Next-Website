import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { crossSiteAuth } from '@/lib/utils'

export function useAuth() {
  const { user, isAuthenticated, isLoading, error, checkAuthStatus } = useAuthStore()

  useEffect(() => {
    // 组件挂载时检查认证状态
    checkAuthStatus()
  }, [checkAuthStatus])

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    checkAuthStatus
  }
}

// 统一的认证Hook，包含CureNova跳转检测
export function useUnifiedAuth() {
  const { user, isAuthenticated, isLoading, error, checkAuthStatus, setUser } = useAuthStore()

  useEffect(() => {
    // 检查认证状态
    checkAuthStatus()
    
    // 检查是否从 CureNova 网站跳转过来
    const cureNovaData = crossSiteAuth.checkCureNovaRedirect()
    if (cureNovaData) {
      // 存储用户信息
      crossSiteAuth.storeCureNovaUser(cureNovaData.user, cureNovaData.token)
      
      // 更新认证状态
      setUser(cureNovaData.user)
      
      // 清除 URL 参数
      crossSiteAuth.clearAuthParams()
    }
  }, [checkAuthStatus, setUser])

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    checkAuthStatus
  }
}

// 保持向后兼容
export function useCureNovaAuth() {
  return useUnifiedAuth()
} 