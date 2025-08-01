import { BIOINFORMATICS_SYSTEM_PROMPT, ANALYSIS_DETECTION_PROMPT } from './bioPrompts'

export interface BioAnalysisResponse {
  content: string
  needsDataUpload?: boolean
  analysisType?: string
  reasoning?: string // 内部使用，用于调试和模型决策优化，不暴露给用户
}

// 检测用户是否需要数据分析
export async function detectAnalysisNeed(message: string): Promise<{
  needsAnalysis: boolean
  analysisType?: string
  reasoning?: string
}> {
  try {
    const response = await fetch('/api/bio-llm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: ANALYSIS_DETECTION_PROMPT },
          { role: 'user', content: message }
        ]
      })
    })

    if (!response.ok) {
      throw new Error('Failed to detect analysis need')
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error detecting analysis need:', error)
    return { needsAnalysis: false }
  }
}

// 调用生物信息学LLM进行对话
export async function callBioLLM({
  message,
  files = [],
  sessionId
}: {
  message: string
  files?: File[]
  sessionId: string
}): Promise<BioAnalysisResponse> {
  try {
    // 如果有文件，只传递文件名和大小信息
    if (files.length > 0) {
      const fileInfo = files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }))
      
      // 调用AI进行对话（只传递文件信息，不传递实际文件）
      const fileResponse = await fetch('/api/bio-llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          sessionId: sessionId,
          files: fileInfo
        })
      })
      
      if (!fileResponse.ok) {
        throw new Error('Failed to call Bio LLM with files')
      }
      
      const result = await fileResponse.json()
      
      return {
        content: result.content,
        needsDataUpload: false, // 已经有文件了
        analysisType: result.analysisType,
        reasoning: result.reasoning
      }
    }
    
    // 没有文件时的原有逻辑
    // 首先检测是否需要数据分析
    const analysisDetection = await detectAnalysisNeed(message)
    
    // 调用AI进行对话
    const response = await fetch('/api/bio-llm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: BIOINFORMATICS_SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
        sessionId
      })
    })

    if (!response.ok) {
      throw new Error('Failed to call Bio LLM')
    }

    const result = await response.json()
    
    return {
      content: result.content,
      needsDataUpload: analysisDetection.needsAnalysis,
      analysisType: analysisDetection.analysisType,
      reasoning: analysisDetection.reasoning
    }
  } catch (error) {
    console.error('Error calling Bio LLM:', error)
    throw error
  }
} 