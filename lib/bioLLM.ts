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
    // 如果有文件，创建FormData
    if (files.length > 0) {
      const formData = new FormData()
      formData.append('message', message)
      formData.append('sessionId', sessionId)
      
      // 添加所有文件
      files.forEach((file, index) => {
        formData.append(`file${index}`, file)
      })
      
      // 调用AI进行对话（带文件）
      const response = await fetch('/api/bio-llm', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Failed to call Bio LLM with files')
      }
      
      const result = await response.json()
      
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