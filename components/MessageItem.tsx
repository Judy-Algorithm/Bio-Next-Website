'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { User, Bot, Copy, ThumbsUp, ThumbsDown, MoreHorizontal } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  id: string
  content: string
  type: 'user' | 'assistant'
  timestamp: Date
  isTyping?: boolean
}

interface MessageItemProps {
  message: Message
}

export default function MessageItem({ message }: MessageItemProps) {
  const isUser = message.type === 'user'
  const { user } = useAuthStore()

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // AI消息 - 左侧显示
  if (!isUser) {
    return (
      <motion.div
        className="w-full flex justify-center px-3 md:px-6 py-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="max-w-4xl w-full">
          {/* Avatar and Name Row */}
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
              <Image
                src="/Pig_Robot.png"
                alt="AI Assistant"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
            
            {/* Name */}
            <span className="text-sm font-medium text-gray-700">Bio-Next AI Assistant</span>
          </div>
          
          {/* Message Content */}
          <div className="ml-11">
            <div className="text-gray-800">
              <div className="prose prose-sm max-w-none text-base leading-relaxed break-words">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
            
            {/* Timestamp */}
            <div className="mt-2 text-xs text-gray-400">
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // 用户消息 - 右侧显示
  return (
    <motion.div
      className="w-full flex justify-center px-3 md:px-6 py-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="max-w-4xl w-full">
        {/* Avatar and Name Row - 右侧对齐 */}
        <div className="flex items-center justify-end space-x-3 mb-3">
          {/* Name */}
          <span className="text-sm font-medium text-gray-700">{user?.name || 'You'}</span>
          
          {/* Avatar */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center border-2 border-purple-300 shadow-sm">
                <User className="w-4 h-4 text-purple-600" />
              </div>
            )}
          </div>
        </div>
        
        {/* Message Content - 右侧对齐 */}
        <div className="flex justify-end">
          <div className="max-w-2xl">
            <div className="px-4 py-3 rounded-2xl bg-purple-100 border border-purple-200 shadow-sm">
              <div className="whitespace-pre-wrap break-words leading-relaxed text-gray-800">
                {message.content}
              </div>
            </div>
            
            {/* Timestamp */}
            <div className="mt-2 text-xs text-gray-400 text-right">
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 