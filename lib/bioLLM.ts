import { BIOINFORMATICS_SYSTEM_PROMPT, ANALYSIS_DETECTION_PROMPT } from './bioPrompts'

export interface BioAnalysisResponse {
  content: string
  needsDataUpload?: boolean
  analysisType?: string
}

// 检测用户是否需要数据分析
export async function detectAnalysisNeed(message: string): Promise<{
  needsAnalysis: boolean
  analysisType?: string
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
      analysisType: analysisDetection.analysisType
    }
  } catch (error) {
    console.error('Error calling Bio LLM:', error)
    throw error
  }
} 