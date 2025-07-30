import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, AuthState } from '@/types'

interface AuthStore extends AuthState {
  // 操作
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
  
  // 检查用户是否已登录
  checkAuthStatus: () => Promise<void>
  
  // 从其他网站获取用户信息
  fetchUserFromCureNova: () => Promise<User | null>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // 设置用户
      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
          error: null
        })
      },

      // 设置加载状态
      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      // 设置错误
      setError: (error: string | null) => {
        set({ error })
      },

      // 登出
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null
        })
        // 清除本地存储
        localStorage.removeItem('auth-token')
      },

      // 检查认证状态
      checkAuthStatus: async () => {
        set({ isLoading: true })
        try {
          // 首先尝试从 CureNova 获取用户信息
          const user = await get().fetchUserFromCureNova()
          if (user) {
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null
            })
          } else {
            // 如果没有从 CureNova 获取到用户，检查本地存储
            const token = localStorage.getItem('auth-token')
            if (token) {
              // 验证本地 token
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              })
              if (response.ok) {
                const data = await response.json()
                set({
                  user: data.user,
                  isAuthenticated: true,
                  isLoading: false,
                  error: null
                })
              } else {
                // Token 无效，清除
                localStorage.removeItem('auth-token')
                set({
                  user: null,
                  isAuthenticated: false,
                  isLoading: false,
                  error: null
                })
              }
            } else {
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
              })
            }
          }
        } catch (error) {
          set({
            isLoading: false,
            error: '认证检查失败'
          })
        }
      },

      // 从 CureNova 获取用户信息
      fetchUserFromCureNova: async (): Promise<User | null> => {
        try {
          // 方法1: 尝试从 CureNova 的 API 获取用户信息
          const response = await fetch('https://cure-nova-website.vercel.app/api/auth/me', {
            credentials: 'include', // 包含 cookies
            headers: {
              'Content-Type': 'application/json'
            }
          })

          if (response.ok) {
            const data = await response.json()
            if (data.success && data.user) {
              return data.user
            }
          }

          // 方法2: 尝试从 localStorage 获取 CureNova 用户信息
          const cureNovaUser = localStorage.getItem('curenova-user')
          if (cureNovaUser) {
            try {
              const user = JSON.parse(cureNovaUser)
              return user
            } catch {
              // 解析失败，清除无效数据
              localStorage.removeItem('curenova-user')
            }
          }

          // 方法3: 检查 URL 参数中的认证信息
          if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search)
            const authToken = urlParams.get('auth_token')
            const userData = urlParams.get('user_data')

            if (authToken && userData) {
              try {
                const user = JSON.parse(decodeURIComponent(userData))
                // 存储用户信息
                localStorage.setItem('auth-token', authToken)
                localStorage.setItem('curenova-user', JSON.stringify(user))
                return user
              } catch (error) {
                console.error('解析URL参数中的用户数据失败:', error)
              }
            }
          }

          // 方法4: 尝试从 sessionStorage 获取（如果CureNova使用sessionStorage）
          if (typeof window !== 'undefined') {
            const sessionUser = sessionStorage.getItem('curenova-user')
            if (sessionUser) {
              try {
                const user = JSON.parse(sessionUser)
                return user
              } catch {
                sessionStorage.removeItem('curenova-user')
              }
            }
          }

          return null
        } catch (error) {
          console.error('从 CureNova 获取用户信息失败:', error)
          return null
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
) 