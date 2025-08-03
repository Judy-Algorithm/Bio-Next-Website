// Bio-Next 前端配置文件

export const config = {
  // 服务器配置
  server: {
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URL || 'http://47.79.1.102:8000',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
    healthCheckTimeout: 5000,
  },

  // 文件上传配置
  upload: {
    maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '104857600'), // 100MB
    allowedTypes: process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES?.split(',') || [
      // 允许所有文件类型
      '*'
    ],
  },

  // 应用配置
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Bio-Next',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },

  // API端点
  endpoints: {
    upload: '/api/upload-data',
    startAnalysis: '/api/start-analysis',
    analysisStatus: '/api/analysis-status',
    projects: '/api/projects',
    downloadResult: '/api/download-result',
    health: '/',
  },

  // 分析状态
  analysisStatus: {
    pending: 'pending',
    running: 'running',
    completed: 'completed',
    failed: 'failed',
    cancelled: 'cancelled',
  },

  // 错误消息
  errorMessages: {
    networkError: '网络连接失败，请检查网络连接',
    serverError: '服务器错误，请稍后重试',
    timeoutError: '请求超时，请稍后重试',
    uploadError: '文件上传失败',
    analysisError: '分析启动失败',
    downloadError: '文件下载失败',
  },

  // 成功消息
  successMessages: {
    uploadSuccess: '文件上传成功',
    analysisStarted: '分析已开始',
    downloadSuccess: '文件下载成功',
  },

  // CureNova配置
  cureNova: {
    loginUrl: process.env.NEXT_PUBLIC_CURENOVA_LOGIN_URL || 'https://curenova.com/login',
  },
}

// 验证配置
export function validateConfig() {
  const errors: string[] = []

  if (!config.server.baseUrl) {
    errors.push('服务器地址未配置')
  }

  if (config.upload.maxFileSize <= 0) {
    errors.push('文件大小限制配置错误')
  }

  if (config.server.timeout <= 0) {
    errors.push('API超时配置错误')
  }

  return errors
}

// 获取完整的API URL
export function getApiUrl(endpoint: string): string {
  return `${config.server.baseUrl}${endpoint}`
}

// 检查是否为开发环境
export function isDevelopment(): boolean {
  return config.app.environment === 'development'
}

// 检查是否为生产环境
export function isProduction(): boolean {
  return config.app.environment === 'production'
} 