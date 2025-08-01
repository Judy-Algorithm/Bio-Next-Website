'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Send, User, Bot, FileText, Image, Video, Music } from 'lucide-react'
import ChatInterface from '@/components/ChatInterface'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { useUnifiedAuth } from '@/hooks/useAuth'
import { generateSessionId } from '@/lib/utils'

interface Project {
  id: string
  projectId: string
  name: string
  createdAt: Date
  messageCount: number
  lastMessage?: string
}

export default function Home() {
  const [sessionId, setSessionId] = useState<string>('')
  const [isClient, setIsClient] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  
  // 使用统一的认证 Hook
  const { user, isAuthenticated, isLoading: authLoading } = useUnifiedAuth()

  useEffect(() => {
    setIsClient(true)
    // 生成会话ID
    const id = generateSessionId()
    setSessionId(id)
  }, [])

  // 处理项目创建
  const handleCreateProject = (project: Project) => {
    setProjects(prev => [project, ...prev])
  }

  return (
    <div className="flex h-[100dvh] bg-[var(--background-gray-main)]">
      {/* 侧边栏 */}
      <Sidebar projects={projects} />
      
      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col h-full w-full">
        {/* 头部 */}
        <Header onToggleSidebar={() => setIsSidebarOpen(true)} />
        
        {/* 聊天界面 */}
        <div className="flex-1 flex flex-col min-h-0">
          <ChatInterface 
            sessionId={isClient ? sessionId : ''}
            onCreateProject={handleCreateProject}
          />
        </div>
      </div>
    </div>
  )
} 