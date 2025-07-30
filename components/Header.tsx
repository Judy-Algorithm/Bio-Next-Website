'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { 
  Settings,
  Menu
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { useChatStore } from '@/store/chat'
import UserProfile from './UserProfile'

export default function Header() {
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
      className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 min-h-[64px]"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Left side - Session info */}
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs md:text-sm text-gray-600">
            <span className="hidden sm:inline">Project ID: </span>
            {isClient && currentProjectId ? currentProjectId : '...'}
          </span>
        </div>
      </div>

      {/* Right side - User actions */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Settings button */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Settings className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
        </button>

        {/* Mobile menu button - only show on mobile */}
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Menu className="w-4 h-4 text-gray-600" />
        </button>

        {/* User profile - only show if authenticated */}
        {isAuthenticated && user && (
          <div className="hidden md:block">
            <UserProfile />
          </div>
        )}
      </div>
    </motion.header>
  )
} 