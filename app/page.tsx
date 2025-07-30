'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Send, User, Bot, FileText, Image, Video, Music } from 'lucide-react'
import ChatInterface from '@/components/ChatInterface'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { useUnifiedAuth } from '@/hooks/useAuth'
import { generateSessionId } from '@/lib/utils'

export default function Home() {
  const [sessionId, setSessionId] = useState<string>('')
  const [isClient, setIsClient] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  // 使用统一的认证 Hook
  const { user, isAuthenticated, isLoading: authLoading } = useUnifiedAuth()

  useEffect(() => {
    setIsClient(true)
    // 生成会话ID
    const id = generateSessionId()
    setSessionId(id)
  }, [])

  return (
    <div className="flex h-[100dvh] bg-[var(--background-gray-main)]">
      {/* 侧边栏 */}
      <Sidebar />
      
      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col h-full w-full">
        {/* 头部 */}
        <Header onToggleSidebar={() => setIsSidebarOpen(true)} />
        
        {/* 聊天界面 */}
        <div className="flex-1 flex flex-col min-h-0">
          <ChatInterface 
            sessionId={isClient ? sessionId : ''}
          />
        </div>
      </div>
    </div>
  )
} 