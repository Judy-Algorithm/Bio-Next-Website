'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FolderOpen, Clock, X, Hash } from 'lucide-react'
import ProjectMenu from './ProjectMenu'

interface Project {
  id: string
  projectId: string // 固定的Project ID
  name: string
  createdAt: Date
  messageCount: number
  lastMessage?: string
}

interface ProjectListProps {
  projects: Project[]
  activeProjectId: string | null
  onSelectProject: (projectId: string) => void
  onRenameProject: (projectId: string, newName: string) => void
  onDeleteProject: (projectId: string) => void
}

export default function ProjectList({ 
  projects, 
  activeProjectId, 
  onSelectProject,
  onRenameProject,
  onDeleteProject
}: ProjectListProps) {
  const [renamingProjectId, setRenamingProjectId] = useState<string | null>(null)
  const [newProjectName, setNewProjectName] = useState('')
  const renameInputRef = useRef<HTMLInputElement>(null)

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const handleRenameStart = (projectId: string, currentName: string) => {
    setRenamingProjectId(projectId)
    setNewProjectName(currentName)
    setTimeout(() => {
      renameInputRef.current?.focus()
      renameInputRef.current?.select()
    }, 100)
  }

  const handleRenameSubmit = () => {
    if (renamingProjectId && newProjectName.trim() && newProjectName.trim() !== projects.find(p => p.id === renamingProjectId)?.name) {
      onRenameProject(renamingProjectId, newProjectName.trim())
    }
    setRenamingProjectId(null)
    setNewProjectName('')
  }

  const handleRenameCancel = () => {
    setRenamingProjectId(null)
    setNewProjectName('')
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
        <FolderOpen className="w-12 h-12 mb-4 text-gray-300" />
        <p className="text-sm">No projects yet</p>
        <p className="text-xs text-gray-400 mt-1">Click + to create a new project</p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {projects.map((project) => {
        const isRenaming = renamingProjectId === project.id
        
        return (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`group px-3 py-2 rounded-lg cursor-pointer transition-colors ${
              activeProjectId === project.id
                ? 'bg-purple-100 text-purple-800'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
            onClick={(e) => {
              // 如果点击的是菜单按钮或其子元素，不触发项目选择
              if ((e.target as Element).closest('[data-menu-button]')) {
                return
              }
              if (!isRenaming) {
                onSelectProject(project.id)
              }
            }}
          >
            <div className="flex items-center space-x-3">
              <FolderOpen className={`w-4 h-4 flex-shrink-0 ${
                activeProjectId === project.id ? 'text-purple-600' : 'text-gray-500'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  {isRenaming ? (
                    <div className="flex items-center space-x-2 flex-1">
                      <input
                        ref={renameInputRef}
                        type="text"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleRenameSubmit()
                          } else if (e.key === 'Escape') {
                            handleRenameCancel()
                          }
                        }}
                        onBlur={handleRenameSubmit}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleRenameCancel}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Cancel rename"
                      >
                        <X className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  ) : (
                    <h3 className="text-sm font-medium truncate">{project.name}</h3>
                  )}
                  <span className="text-xs text-gray-400 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(project.createdAt)}</span>
                  </span>
                </div>
                
                {/* Project ID 显示 */}
                <div className="flex items-center space-x-1 mt-1">
                  <Hash className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600 font-mono">Project ID: {project.projectId}</span>
                </div>
                
                {project.lastMessage && (
                  <p className="text-xs text-gray-500 truncate mt-1">
                    {project.lastMessage}
                  </p>
                )}
                {!isRenaming && (
                  <div className="flex justify-end mt-1">
                    <ProjectMenu
                      projectId={project.id}
                      projectName={project.name}
                      onRename={onRenameProject}
                      onDelete={onDeleteProject}
                      onRenameStart={() => handleRenameStart(project.id, project.name)}
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
} 