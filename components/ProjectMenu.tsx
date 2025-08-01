'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MoreHorizontal, Edit, Trash2, X } from 'lucide-react'

interface ProjectMenuProps {
  projectId: string
  projectName: string
  onRename: (projectId: string, newName: string) => void
  onDelete: (projectId: string) => void
  isRenaming?: boolean
  onRenameStart?: () => void
  onRenameCancel?: () => void
}

export default function ProjectMenu({ 
  projectId, 
  projectName, 
  onRename, 
  onDelete,
  isRenaming = false,
  onRenameStart,
  onRenameCancel
}: ProjectMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newName, setNewName] = useState(projectName)
  const menuRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleRename = () => {
    if (onRenameStart) {
      onRenameStart()
    }
    setIsOpen(false)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 100)
  }

  const handleRenameSubmit = () => {
    if (newName.trim() && newName.trim() !== projectName) {
      onRename(projectId, newName.trim())
    }
    if (onRenameCancel) {
      onRenameCancel()
    }
    setNewName(projectName)
  }

  const handleRenameCancel = () => {
    if (onRenameCancel) {
      onRenameCancel()
    }
    setNewName(projectName)
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${projectName}"?`)) {
      onDelete(projectId)
    }
    setIsOpen(false)
  }

  // 重命名输入框 - 这个应该由父组件控制显示
  if (isRenaming) {
    return (
      <div className="flex items-center space-x-2">
        <input
          ref={inputRef}
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
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
    )
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => {
          console.log('Menu button clicked, current isOpen:', isOpen)
          setIsOpen(!isOpen)
        }}
        className="p-1 hover:bg-gray-200 rounded transition-colors opacity-60 hover:opacity-100 focus:outline-none"
      >
        <MoreHorizontal className="w-4 h-4 text-gray-500" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] min-w-32"
            style={{ zIndex: 9999 }}
          >
            <div className="py-1">
              <button
                onClick={handleRename}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Rename Project</span>
              </button>
              <button
                onClick={handleDelete}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Project</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 