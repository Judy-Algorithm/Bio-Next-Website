'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FolderOpen, MessageSquare, Clock, X } from 'lucide-react'
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
      <div className="flex flex-col items-center justify-center py-8 text-white">
        <FolderOpen className="w-12 h-12 mb-4 text-white" />
        <p className="text-sm">No projects yet</p>
        <p className="text-xs text-gray-300 mt-1">Click + to create a new project</p>
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
                ? 'bg-gray-700 text-white'
                : 'hover:bg-gray-800 text-white'
            }`}
            onClick={() => !isRenaming && onSelectProject(project.id)}
          >
            <div className="flex items-center space-x-3">
              <FolderOpen className={`w-4 h-4 flex-shrink-0 ${
                activeProjectId === project.id ? 'text-white' : 'text-gray-300'
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
                        className="flex-1 px-2 py-1 text-sm border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-900 text-white"
                      />
                                              <button
                          onClick={handleRenameCancel}
                          className="p-1 hover:bg-gray-800 rounded transition-colors"
                          title="Cancel rename"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                    </div>
                  ) : (
                    <h3 className="text-sm font-medium truncate">{project.name}</h3>
                  )}
                  <span className="text-xs text-gray-300 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(project.createdAt)}</span>
                  </span>
                </div>
                {project.lastMessage && (
                  <p className="text-xs text-gray-300 truncate mt-1">
                    {project.lastMessage}
                  </p>
                )}
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-3 h-3 text-gray-300" />
                    <span className="text-xs text-gray-300">{project.messageCount} messages</span>
                  </div>
                  {!isRenaming && (
                    <ProjectMenu
                      projectId={project.id}
                      projectName={project.name}
                      onRename={onRenameProject}
                      onDelete={onDeleteProject}
                      onRenameStart={() => handleRenameStart(project.id, project.name)}
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
} 