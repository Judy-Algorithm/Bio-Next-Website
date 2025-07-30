'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FolderOpen, Lightbulb } from 'lucide-react'

interface NewProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateProject: (projectName: string) => void
}

export default function NewProjectModal({ isOpen, onClose, onCreateProject }: NewProjectModalProps) {
  const [projectName, setProjectName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (projectName.trim()) {
      onCreateProject(projectName.trim())
      setProjectName('')
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#1a0b2e] rounded-lg shadow-xl w-96 max-w-md mx-4 border border-gray-600"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-600">
              <h2 className="text-xl font-semibold text-white">Project Name</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-purple-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g., Birthday Party Plan"
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[#2d1b4e] text-white placeholder-gray-300"
                    autoFocus
                  />
                </div>

                {/* Help section */}
                <div className="mb-6 p-4 bg-[#2d1b4e] rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-white mb-2">What is this project?</h3>
                      <p className="text-sm text-gray-300">
                        This project links user-uploaded files and Bio-Next agent–generated result files under a single Project ID, allowing all related content to be centrally saved, organized, and automatically displayed in the file panel for easier access and ongoing work management.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-600 rounded-lg text-white hover:bg-purple-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!projectName.trim()}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      projectName.trim()
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 