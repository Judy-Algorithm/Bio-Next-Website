'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Paperclip, Smile, Bot, User, X, Upload, AlertCircle } from 'lucide-react'
import MessageItem from './MessageItem'
import EmojiPickerComponent from './EmojiPicker'
import { callBioLLM } from '@/lib/bioLLM'
import Image from 'next/image'
import { useChatStore } from '@/store/chat'
import { generateShortSessionId } from '@/lib/utils'

interface Message {
  id: string
  content: string
  type: 'user' | 'assistant'
  timestamp: Date
  isTyping?: boolean
}

interface Project {
  id: string
  projectId: string
  name: string
  createdAt: Date
  messageCount: number
  lastMessage?: string
}

interface ChatInterfaceProps {
  sessionId: string
  onCreateProject?: (project: Project) => void
}

export default function ChatInterface({ sessionId, onCreateProject }: ChatInterfaceProps) {
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
  const [hasCreatedProject, setHasCreatedProject] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { setCurrentProjectId } = useChatStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 根据AI回答生成项目名称
  const generateProjectName = (aiResponse: string): string => {
    // 提取关键词作为项目名称
    const keywords = aiResponse.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 3)
      .join(' ')
    
    if (keywords) {
      return keywords.charAt(0).toUpperCase() + keywords.slice(1)
    }
    
    // 如果没有合适的关键词，使用时间戳
    return `Project_${new Date().toLocaleDateString()}`
  }

  // 创建新项目
  const createNewProject = (aiResponse: string) => {
    console.log('createNewProject called with:', aiResponse)
    if (hasCreatedProject) {
      console.log('Project already created, skipping')
      return
    }

    const projectName = generateProjectName(aiResponse)
    const projectId = generateShortSessionId()
    
    console.log('Generated project name:', projectName)
    console.log('Generated project ID:', projectId)
    
    const newProject: Project = {
      id: Math.random().toString(36).substring(2, 15),
      projectId: projectId,
      name: projectName,
      createdAt: new Date(),
      messageCount: 2 // 用户消息 + AI回复
    }

    // 设置当前项目ID
    setCurrentProjectId(projectId)
    
    // 通知父组件创建项目
    if (onCreateProject) {
      console.log('Calling onCreateProject with:', newProject)
      onCreateProject(newProject)
    } else {
      console.log('onCreateProject is not provided')
    }
    
    setHasCreatedProject(true)
    console.log('Project creation completed')
  }

  const handleSendMessage = async () => {
    if (isTyping) return
    
    // 如果没有输入文本也没有选择文件，则不发送
    if (!inputValue.trim() && selectedFiles.length === 0) return

    // 如果用户没有输入文本但有文件，添加默认消息
    const messageContent = inputValue.trim() || (selectedFiles.length > 0 ? `Uploaded ${selectedFiles.length} file(s) for analysis` : '')
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      type: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => {
      const newMessages = [...prev, userMessage]
      console.log('Added user message, total messages:', newMessages.length)
      return newMessages
    })
    setInputValue('')
    setSelectedFiles([]) // 清空文件列表
    setIsTyping(true)

    try {
      // 调用生物信息学LLM
      const response = await callBioLLM({
        message: messageContent,
        files: selectedFiles,
        sessionId
      })

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        type: 'assistant',
        timestamp: new Date(),
      }

      setMessages(prev => {
        const newMessages = [...prev, assistantMessage]
        console.log('Added assistant message, total messages:', newMessages.length)
        
        // 在更新后的消息列表中检查用户消息数量
        const userMessages = newMessages.filter(msg => msg.type === 'user')
        if (!hasCreatedProject && userMessages.length === 1) {
          console.log('Creating project with AI response:', response.content)
          console.log('Current messages length:', newMessages.length)
          console.log('User messages count:', userMessages.length)
          createNewProject(response.content)
        }
        
        return newMessages
      })
      
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
    <div className="flex-1 flex flex-col bg-white h-full">
      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-6 min-h-0 pb-32 md:pb-8">
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
                <span className="text-sm font-medium text-gray-700">Bio-Next AI Assistant</span>
              </div>
              
              {/* Typing indicator */}
              <div className="ml-11">
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
          className="mx-6 mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-purple-700">Please upload files</span>
            </div>
            <div className="flex items-center space-x-2">
                              <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm"
                >
                  Upload
                </button>
                <button
                  onClick={() => setShowUploadPrompt(false)}
                  className="px-3 py-1 text-purple-600 hover:bg-purple-100 rounded text-sm"
                >
                  Close
                </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Selected files display */}
      {selectedFiles.length > 0 && (
        <div className="px-2 md:px-4 py-2 border-t border-gray-100 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center space-x-2 bg-white px-2 md:px-3 py-2 rounded-lg border">
                <Paperclip className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                <span className="text-xs md:text-sm text-gray-700 truncate max-w-20 md:max-w-32">{file.name}</span>
                <span className="text-xs text-gray-500 hidden sm:inline">({formatFileSize(file.size)})</span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input area - fixed at bottom on mobile */}
      <div className="border-t border-gray-200 px-3 md:px-6 py-3 md:py-4 bg-white flex-shrink-0 pb-safe">
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* File upload button */}
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept=".fastq,.fq,.fasta,.fa,.bam,.sam,.cram,.vcf,.bcf,.gff,.gtf,.bed,.bedgraph,.wig,.bigwig,.bigbed,.maf,.ace,.ab1,.scf,.pdb,.mmcif,.sra,.hdf5,.h5,.loom,.mtx,.cel,.cdf,.mzML,.mzXML,.mgf,.pepXML,.protXML,.phy,.nex,.nwk,.tree,.newick,.csv,.tsv,.txt,.xlsx,.xls,.ods,.json,.yaml,.yml,.xml,.obo,.owl,.sbml,.rds,.rdata,.cool,.hic,.mcool"
              title="Upload bioinformatics files (FASTQ, BAM, VCF, BED, etc.)"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 md:p-2.5 hover:bg-purple-200 rounded-lg transition-colors"
              title="Upload bioinformatics files (FASTQ, BAM, VCF, BED, etc.)"
            >
              <Paperclip className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
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
              className="w-full resize-none border border-gray-200 rounded-lg px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
            disabled={(!inputValue.trim() && selectedFiles.length === 0) || isTyping}
            className={`p-2 md:p-2.5 rounded-lg transition-colors ${
              (inputValue.trim() || selectedFiles.length > 0) && !isTyping
                ? 'bg-purple-300 hover:bg-purple-400 text-purple-800'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  )
} 