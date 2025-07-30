'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { 
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { useChatStore } from '@/store/chat'
import UserProfile from './UserProfile'

// 添加侧边栏状态管理
interface HeaderProps {
  onToggleSidebar?: () => void
}

export default function Header({ onToggleSidebar }: HeaderProps = {}) {
  const { user, isAuthenticated, isLoading, checkAuthStatus } = useAuthStore()
  const { currentProjectId } = useChatStore()
  const [isClient, setIsClient] = useState(false)

  // Check authentication status when page loads
  useEffect(() => {
    checkAuthStatus()
    setIsClient(true)
  }, [checkAuthStatus])

  return (
    <motion.header 
      className="h-16 bg-transparent border-b border-white/20 flex items-center justify-between px-4 md:px-6 min-h-[64px] text-white"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Left side - Session info */}
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs md:text-sm text-gray-600">
            <span className="hidden md:inline">Project ID: </span>
            {isClient && currentProjectId ? currentProjectId : '...'}
          </span>
        </div>
      </div>

      {/* Right side - User actions */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* User profile - show on all devices */}
        {isAuthenticated && user && (
          <div className="block">
            <UserProfile />
          </div>
        )}
      </div>
    </motion.header>
  )
} 