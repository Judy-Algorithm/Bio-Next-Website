'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Paperclip, Smile, Bot, User, X, Upload, AlertCircle } from 'lucide-react'
import MessageItem from './MessageItem'
import EmojiPickerComponent from './EmojiPicker'
import { callBioLLM } from '@/lib/bioLLM'
import Image from 'next/image'

interface Message {
  id: string
  content: string
  type: 'user' | 'assistant'
  timestamp: Date
  isTyping?: boolean
}

interface ChatInterfaceProps {
  sessionId: string
}

export default function ChatInterface({ sessionId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I am Bio-Next AI Assistant, a specialized AI assistant in the field of bioinformatics, proficient in computational biology, data analysis, and biological data interpretation. Whether it\'s sequence analysis, gene expression analysis, or genomics, proteomics, and metabolomics data analysis, I can provide you with professional and detailed guidance. If you have any bioinformatics-related questions or needs, please feel free to tell me, and I will do my best to help you.',
      type: 'assistant',
      timestamp: new Date(),
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [showUploadPrompt, setShowUploadPrompt] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      type: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      // 调用生物信息学LLM
      const response = await callBioLLM({
        message: inputValue,
        files: selectedFiles,
        sessionId
      })

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        type: 'assistant',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // 如果需要上传文件，显示提示
      if (response.needsDataUpload) {
        setShowUploadPrompt(true)
      }
    } catch (error) {
      console.error('Error calling Bio LLM:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, an error occurred while processing your request. Please try again later.',
        type: 'assistant',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    // Auto adjust height
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(prev => [...prev, ...files])
    setShowUploadPrompt(false) // 隐藏上传提示
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleEmojiClick = (emoji: string) => {
    setInputValue(prev => prev + emoji)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="flex-1 flex flex-col bg-[#282342] h-full text-white">
      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-6 min-h-0 pb-20 md:pb-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={message.type === 'assistant' ? 'w-full' : ''}
            >
              <MessageItem message={message} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex justify-center px-3 md:px-6 py-4"
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
                <span className="text-sm font-medium text-white">Bio-Next AI Assistant</span>
              </div>
              
              {/* Typing indicator */}
              <div className="ml-11">
                <div className="flex items-center space-x-2 text-white">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* File upload prompt */}
      {showUploadPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-6 mb-4 p-3 bg-gray-900 border border-gray-600 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-gray-300" />
              <span className="text-sm text-white">Please upload files</span>
            </div>
            <div className="flex items-center space-x-2">
                              <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm"
                >
                  Upload
                </button>
                <button
                  onClick={() => setShowUploadPrompt(false)}
                  className="px-3 py-1 text-gray-300 hover:bg-gray-800 rounded text-sm"
                >
                  Close
                </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Selected files display */}
      {selectedFiles.length > 0 && (
        <div className="px-2 md:px-4 py-2 border-t border-gray-600 bg-black">
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center space-x-2 bg-gray-900 px-2 md:px-3 py-2 rounded-lg border border-gray-600">
                <Paperclip className="w-3 h-3 md:w-4 md:h-4 text-white" />
                <span className="text-xs md:text-sm text-white truncate max-w-20 md:max-w-32">{file.name}</span>
                <span className="text-xs text-gray-300 hidden sm:inline">({formatFileSize(file.size)})</span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-300 hover:text-red-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input area - fixed at bottom on mobile */}
      <div className="border-t border-gray-700 px-3 md:px-6 py-3 md:py-4 bg-black flex-shrink-0 pb-safe">
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* File upload button */}
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept=".fastq,.fq,.fasta,.fa,.bam,.sam,.vcf,.gff,.gtf,.bed,.csv,.tsv,.txt,.xlsx,.xls,.json,.xml"
              title="Upload bioinformatics files"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 md:p-2.5 hover:bg-white/20 rounded-lg transition-colors"
              title="Upload bioinformatics files"
            >
              <Paperclip className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </button>
          </div>

          {/* Input field */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full resize-none border border-gray-600 rounded-lg px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent bg-[#282342] text-white placeholder-gray-400"
              style={{ minHeight: '40px', maxHeight: '100px' }}
              disabled={isTyping}
            />
          </div>

          {/* Emoji picker - hidden on mobile to save space */}
          <div className="hidden md:block">
            <EmojiPickerComponent
              onEmojiClick={handleEmojiClick}
              className="relative"
            />
          </div>

          {/* Send button */}
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className={`p-2 md:p-2.5 rounded-lg transition-colors ${
              inputValue.trim() && !isTyping
                ? 'bg-white/20 hover:bg-white/30 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  )
} 