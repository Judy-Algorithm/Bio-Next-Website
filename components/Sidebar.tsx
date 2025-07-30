'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { 
  Search, 
  MessageSquare, 
  Plus, 
  LogIn, 
  User,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { useChatStore } from '@/store/chat'
import NewProjectModal from './NewProjectModal'
import ProjectList from './ProjectList'
import { redirectToCureNovaLogin, generateShortSessionId } from '@/lib/utils'

interface Project {
  id: string
  projectId: string // 固定的Project ID
  name: string
  createdAt: Date
  messageCount: number
  lastMessage?: string
}

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const { user, isAuthenticated, logout } = useAuthStore()
  const { generateNewProjectId, setCurrentProjectId } = useChatStore()

  const handleLogin = () => {
    redirectToCureNovaLogin()
  }

  const handleLogout = () => {
    logout()
  }

  const handleCreateProject = (projectName: string) => {
    const newProject: Project = {
      id: Math.random().toString(36).substring(2, 15),
      projectId: generateShortSessionId(), // 为每个项目生成固定的Project ID
      name: projectName,
      createdAt: new Date(),
      messageCount: 0
    }
    setProjects(prev => [newProject, ...prev])
    setActiveProjectId(newProject.id)
    // 设置当前项目的Project ID
    setCurrentProjectId(newProject.projectId)
  }

  const handleSelectProject = (projectId: string) => {
    setActiveProjectId(projectId)
    // 获取选中项目的固定Project ID
    const selectedProject = projects.find(p => p.id === projectId)
    if (selectedProject) {
      setCurrentProjectId(selectedProject.projectId)
    }
    console.log('切换到项目:', projectId)
  }

  const handleRenameProject = (projectId: string, newName: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, name: newName }
        : project
    ))
  }

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId))
    if (activeProjectId === projectId) {
      setActiveProjectId(projects.length > 1 ? projects[0]?.id || null : null)
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCollapsed(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div 
        className={`fixed md:relative z-50 h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
          isCollapsed 
            ? 'w-64 translate-x-0' 
            : 'w-0 md:w-64 -translate-x-full md:translate-x-0'
        }`}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 min-h-[64px]">
          <div className="flex items-center space-x-3">
            {/* Logo */}
            <div className="w-8 h-8 relative flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Bio-Next Logo"
                width={32}
                height={32}
                className="rounded-lg object-contain"
                priority
                quality={100}
              />
            </div>
            <h1 className="text-lg md:text-xl font-bold text-gray-800">Bio-Next</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="p-2 rounded-lg hover:bg-purple-200 transition-colors"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
            </button>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsCollapsed(false)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 md:px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Projects list */}
        <div className="flex-1 px-2 md:px-4 overflow-y-auto">
          <ProjectList
            projects={projects}
            activeProjectId={activeProjectId}
            onSelectProject={handleSelectProject}
            onRenameProject={handleRenameProject}
            onDeleteProject={handleDeleteProject}
          />
        </div>

        {/* Bottom user info */}
        <div className="px-4 md:px-6 py-4 border-t border-gray-200">
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Logout"
              >
                <LogIn className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Not logged in</p>
                <p className="text-xs text-gray-500">Please login to access full features</p>
              </div>
              <button
                onClick={handleLogin}
                className="flex items-center justify-center space-x-2 px-3 py-2 bg-purple-300 hover:bg-purple-400 text-purple-800 rounded-lg transition-colors text-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Mobile toggle button */}
      <button
        onClick={() => setIsCollapsed(true)}
        className="fixed bottom-4 left-4 z-30 md:hidden p-3 bg-white border border-gray-200 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onCreateProject={handleCreateProject}
      />
    </>
  )
} 