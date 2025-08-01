import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { 
  BIOINFORMATICS_SYSTEM_PROMPT, 
  ANALYSIS_DETECTION_PROMPT 
} from '@/lib/bioPrompts'

// 自定义API配置
const CONFIG = {
  api_key: "sk-yILYHgBzpy4zlTKhfMa4fNpKV5ms9kIuReukJZhAsIHbZP5r",
  base_url: "https://sg.uiuiapi.com/v1",
  model: "o3-mini-2025-01-31"
}

const openai = new OpenAI({
  apiKey: CONFIG.api_key,
  baseURL: CONFIG.base_url
})

export async function POST(request: NextRequest) {
  try {
    const { messages, sessionId, files } = await request.json()
    
    // 如果有文件信息，构建增强消息
    if (files && files.length > 0) {
      const fileInfo = files.map((file: any) => 
        `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB, ${file.type})`
      ).join(', ')
      
      const enhancedMessage = `${messages ? messages[messages.length - 1]?.content || '' : ''}\n\nUploaded files: ${fileInfo}`
      
      // 调用自定义API
      const completion = await openai.chat.completions.create({
        model: CONFIG.model,
        messages: [
          { role: 'system', content: BIOINFORMATICS_SYSTEM_PROMPT },
          { role: 'user', content: enhancedMessage }
        ],
        temperature: 0.7,
        max_tokens: 1500,
        stream: false
      })

      const response = completion.choices[0].message.content

      return NextResponse.json({
        content: response,
        analysisType: 'file_analysis',
        reasoning: 'Files uploaded for analysis'
      })
    } else {
      // 原有的JSON请求处理

      // 调用自定义API
      const completion = await openai.chat.completions.create({
        model: CONFIG.model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1500,
        stream: false
      })

      const response = completion.choices[0].message.content

      // 如果是分析检测请求，尝试解析JSON响应
      if (messages[0]?.role === 'system' && messages[0]?.content === ANALYSIS_DETECTION_PROMPT) {
        try {
          const parsedResponse = JSON.parse(response || '{}')
          return NextResponse.json(parsedResponse)
        } catch (e) {
          // 如果解析失败，返回默认响应
          return NextResponse.json({
            needsAnalysis: false,
            analysisType: 'other',
            requiredFiles: [],
            message: '无法解析分析需求'
          })
        }
      }

      // 返回普通对话响应
      return NextResponse.json({
        content: response
      })
    }

  } catch (error) {
    console.error('Error calling custom API:', error)
    return NextResponse.json(
      { 
        content: '抱歉，处理您的请求时遇到了错误。请稍后再试。',
        error: 'API调用失败'
      },
      { status: 500 }
    )
  }
} 