#!/bin/bash

echo "🚀 正在设置 Bio-Next 前端项目..."

# 检查 Node.js 版本
echo "📋 检查 Node.js 版本..."
node_version=$(node -v)
echo "当前 Node.js 版本: $node_version"

# 安装依赖
echo "📦 安装项目依赖..."
npm install

# 创建环境配置文件
echo "⚙️ 创建环境配置文件..."
if [ ! -f .env.local ]; then
    cp env.example .env.local
    echo "✅ 已创建 .env.local 文件"
else
    echo "⚠️ .env.local 文件已存在"
fi

# 检查 TypeScript 配置
echo "🔧 检查 TypeScript 配置..."
npx tsc --noEmit

# 运行开发服务器
echo "🎉 项目设置完成！"
echo ""
echo "📝 下一步："
echo "1. 编辑 .env.local 文件配置环境变量"
echo "2. 运行 'npm run dev' 启动开发服务器"
echo "3. 访问 http://localhost:3000 查看应用"
echo ""
echo "🔗 有用的命令："
echo "- npm run dev     # 启动开发服务器"
echo "- npm run build   # 构建生产版本"
echo "- npm run lint    # 运行代码检查"
echo "- npm run type-check # 类型检查" 