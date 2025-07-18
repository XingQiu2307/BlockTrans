# 🧱 BlockTrans - 方块译者

[![Deploy to Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/XingQiu2307/BlockTrans)

一个专为 Minecraft Bedrock Edition 设计的 AI 驱动的 .lang 文件翻译工具。

## ✨ 功能特性

- 🤖 **AI 智能翻译** - 使用先进的大语言模型进行高质量翻译
- 📁 **文件上传** - 支持直接上传 .lang 格式的语言文件
- ✏️ **在线编辑** - 实时预览和编辑翻译结果
- 💾 **一键下载** - 导出符合 Minecraft 规范的 .lang 文件
- 🚀 **一键部署** - 基于 Cloudflare Pages，支持快速部署
- 🔒 **安全可靠** - API 密钥安全存储，支持自定义 AI 服务

## 🏗️ 项目架构

```
BlockTrans/
├── src/                    # Vue 3 前端源码
│   ├── App.vue            # 主应用组件
│   ├── components/        # 可复用组件
│   └── assets/           # 静态资源
├── functions/             # Cloudflare Pages Functions
│   └── api/
│       └── translate.ts   # 翻译 API 端点
├── dist/                  # 构建输出目录
├── public/               # 公共静态文件
├── package.json          # 项目配置
├── wrangler.toml         # Cloudflare 部署配置
└── README.md             # 项目文档
```

## 🚀 快速开始

### 方式一：一键部署（推荐）

1. 点击上方的 "Deploy to Cloudflare Pages" 按钮
2. 连接你的 GitHub 账户并 Fork 此仓库
3. 在 Cloudflare Pages 中配置环境变量（见下方配置说明）
4. 等待自动构建和部署完成

### 方式二：手动部署

1. **克隆仓库**
   ```bash
   git clone https://github.com/your-username/BlockTrans.git
   cd BlockTrans
   ```

2. **安装依赖**
   ```bash
   pnpm install
   # 或者使用 npm
   npm install
   ```

3. **本地开发**
   ```bash
   pnpm dev
   ```

4. **构建项目**
   ```bash
   pnpm build
   ```

5. **部署到 Cloudflare Pages**
   ```bash
   pnpm deploy
   ```

## ⚙️ 环境变量配置

在 Cloudflare Pages 项目设置中配置以下环境变量：

### 生产环境 (Production)

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `API_URL` | AI API 端点地址 | `https://api.openai.com/v1/chat/completions` |
| `MODEL_NAME` | 使用的模型名称 | `gpt-3.5-turbo` |
| `API_KEY` | API 密钥 | `sk-...` |

### 预览环境 (Preview)

建议使用与生产环境相同的配置，或者使用测试用的 API 密钥。

## 🛠️ 技术栈

- **前端**: Vue 3 + TypeScript + Vite
- **部署**: Cloudflare Pages + Pages Functions
- **包管理**: pnpm
- **构建工具**: Vite 7.0+
- **类型检查**: TypeScript 5.8+

## 📋 系统要求

- Node.js 22+ (推荐使用最新 LTS 版本)
- pnpm 8+ (推荐) 或 npm 10+

## 🔧 开发指南

### 本地开发环境设置

1. **环境变量配置**

   创建 `.env.local` 文件（仅用于本地开发）：
   ```env
   API_URL=https://api.openai.com/v1/chat/completions
   MODEL_NAME=gpt-3.5-turbo
   API_KEY=your-api-key-here
   ```

2. **启动开发服务器**
   ```bash
   pnpm dev
   ```

3. **类型检查**
   ```bash
   pnpm run build
   ```

### 项目结构说明

- `src/App.vue` - 主应用组件，包含文件上传、翻译展示和编辑功能
- `functions/api/translate.ts` - 后端翻译逻辑，处理 .lang 文件解析和 AI API 调用
- `wrangler.toml` - Cloudflare 部署配置文件
- `package.json` - 项目依赖和脚本配置

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Cloudflare Pages](https://pages.cloudflare.com/) - 现代化的 JAMstack 平台
- [Vite](https://vitejs.dev/) - 下一代前端构建工具

## 📞 支持

如果你在使用过程中遇到问题，请：

1. 查看 [Issues](https://github.com/your-username/BlockTrans/issues) 中是否有类似问题
2. 创建新的 Issue 描述你的问题
3. 提供详细的错误信息和复现步骤

---

**让 Minecraft 模组本地化变得更简单！** 🎮✨
