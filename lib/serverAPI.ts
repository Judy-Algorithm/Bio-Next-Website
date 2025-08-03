import { config } from './config'

// 服务器API配置
const 服务器基础地址 = config.server.baseUrl
const API超时时间 = config.server.timeout

export interface 上传响应 {
  成功: boolean
  项目ID: string
  消息: string
  文件路径: string
}

export interface 分析响应 {
  成功: boolean
  项目ID: string
  计划结果: any
  执行结果: any
  消息: string
}

export interface 分析状态 {
  项目ID: string
  状态: string
  当前步骤: number
  分析目标: string
  上传时间: string
  分析开始时间: string
  输出文件列表: string[]
}

export interface 项目信息 {
  项目ID: string
  项目名称: string
  状态: string
  上传时间: string
  分析目标: string
}

// 上传数据文件到服务器
export async function 上传数据到服务器(
  文件: File,
  用户ID: string,
  项目名称: string
): Promise<上传响应> {
  try {
    const 表单数据 = new FormData()
    表单数据.append('file', 文件)
    表单数据.append('user_id', 用户ID)
    表单数据.append('project_name', 项目名称)

    const 控制器 = new AbortController()
    const 超时定时器 = setTimeout(() => 控制器.abort(), API超时时间)

    const 响应 = await fetch(`${服务器基础地址}${config.endpoints.upload}`, {
      method: 'POST',
      body: 表单数据,
      signal: 控制器.signal,
    })

    clearTimeout(超时定时器)

    if (!响应.ok) {
      throw new Error(`上传失败: ${响应.statusText}`)
    }

    return await 响应.json()
  } catch (错误) {
    console.error('上传数据失败:', 错误)
    throw 错误
  }
}

// 开始分析处理
export async function 开始分析(
  项目ID: string,
  分析目标: string,
  用户ID: string
): Promise<分析响应> {
  try {
    const 表单数据 = new FormData()
    表单数据.append('project_id', 项目ID)
    表单数据.append('analysis_goal', 分析目标)
    表单数据.append('user_id', 用户ID)

    const 控制器 = new AbortController()
    const 超时定时器 = setTimeout(() => 控制器.abort(), API超时时间)

    const 响应 = await fetch(`${服务器基础地址}${config.endpoints.startAnalysis}`, {
      method: 'POST',
      body: 表单数据,
      signal: 控制器.signal,
    })

    clearTimeout(超时定时器)

    if (!响应.ok) {
      throw new Error(`分析启动失败: ${响应.statusText}`)
    }

    return await 响应.json()
  } catch (错误) {
    console.error('启动分析失败:', 错误)
    throw 错误
  }
}

// 获取分析状态
export async function 获取分析状态(项目ID: string): Promise<分析状态> {
  try {
    const 控制器 = new AbortController()
    const 超时定时器 = setTimeout(() => 控制器.abort(), API超时时间)

    const 响应 = await fetch(`${服务器基础地址}${config.endpoints.analysisStatus}/${项目ID}`, {
      signal: 控制器.signal,
    })

    clearTimeout(超时定时器)

    if (!响应.ok) {
      throw new Error(`获取状态失败: ${响应.statusText}`)
    }

    return await 响应.json()
  } catch (错误) {
    console.error('获取分析状态失败:', 错误)
    throw 错误
  }
}

// 获取用户的所有项目
export async function 获取用户项目(用户ID: string): Promise<{ 项目列表: 项目信息[] }> {
  try {
    const 控制器 = new AbortController()
    const 超时定时器 = setTimeout(() => 控制器.abort(), API超时时间)

    const 响应 = await fetch(`${服务器基础地址}${config.endpoints.projects}/${用户ID}`, {
      signal: 控制器.signal,
    })

    clearTimeout(超时定时器)

    if (!响应.ok) {
      throw new Error(`获取项目列表失败: ${响应.statusText}`)
    }

    return await 响应.json()
  } catch (错误) {
    console.error('获取项目列表失败:', 错误)
    throw 错误
  }
}

// 下载结果文件
export async function 下载结果(项目ID: string, 文件名: string): Promise<Blob> {
  try {
    const 控制器 = new AbortController()
    const 超时定时器 = setTimeout(() => 控制器.abort(), API超时时间)

    const 响应 = await fetch(`${服务器基础地址}${config.endpoints.downloadResult}/${项目ID}?filename=${文件名}`, {
      signal: 控制器.signal,
    })

    clearTimeout(超时定时器)

    if (!响应.ok) {
      throw new Error(`下载失败: ${响应.statusText}`)
    }

    return await 响应.blob()
  } catch (错误) {
    console.error('下载结果失败:', 错误)
    throw 错误
  }
}

// 检查服务器健康状态
export async function 检查服务器健康(): Promise<boolean> {
  try {
    const 控制器 = new AbortController()
    const 超时定时器 = setTimeout(() => 控制器.abort(), config.server.healthCheckTimeout)

    const 响应 = await fetch(`${服务器基础地址}${config.endpoints.health}`, {
      signal: 控制器.signal,
    })

    clearTimeout(超时定时器)
    return 响应.ok
  } catch (错误) {
    console.error('服务器连接失败:', 错误)
    return false
  }
}

// 为了保持向后兼容，保留英文函数名作为别名
export const uploadDataToServer = 上传数据到服务器
export const startAnalysis = 开始分析
export const getAnalysisStatus = 获取分析状态
export const getUserProjects = 获取用户项目
export const downloadResult = 下载结果
export const checkServerHealth = 检查服务器健康

// 保留英文接口名作为别名
export type UploadResponse = 上传响应
export type AnalysisResponse = 分析响应
export type AnalysisStatus = 分析状态
export type ProjectInfo = 项目信息 