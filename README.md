# 🧱 BlockTrans - 方块译者

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/XingQiu2307/BlockTrans)

一个专为 Minecraft Bedrock Edition 设计的 AI 驱动的 .lang 文件翻译工具。

**🚀 基于 Cloudflare Workers** - 更快、更简单、更可靠的部署方式！

## ✨ 功能特性

- 🤖 **AI 智能翻译** - 使用先进的大语言模型进行高质量翻译
- 📁 **文件上传** - 支持拖拽上传 .lang 格式的语言文件
- ✏️ **在线编辑** - 实时预览和编辑翻译结果
- 💾 **一键下载** - 导出符合 Minecraft 规范的 .lang 文件
- ⚡ **极速部署** - 基于 Cloudflare Workers，一键部署，秒级启动
- 🔒 **安全可靠** - API 密钥安全存储，支持自定义 AI 服务
- 🌍 **全球加速** - Cloudflare 全球 CDN，访问速度更快
- 💰 **成本更低** - Workers 免费额度更高，运行成本更低

## 🏗️ 项目架构

```
BlockTrans/
├── src/
│   ├── worker.ts          # Cloudflare Worker 主文件（包含前端+后端）
│   ├── App.vue            # Vue 3 前端源码（用于开发）
│   ├── components/        # 可复用组件
│   └── assets/           # 静态资源
├── dist/                  # 构建输出目录
├── public/               # 公共静态文件
├── package.json          # 项目配置
├── wrangler.toml         # Cloudflare Worker 配置
└── README.md             # 项目文档
```

**🔥 Worker 架构优势**：
- **单文件部署** - 前端 HTML + 后端 API 都在一个 Worker 中
- **零配置** - 无需复杂的构建设置和静态文件管理
- **更快启动** - 冷启动时间更短，响应更快
- **更简单** - 一个文件搞定所有功能

## 🚀 快速开始

### 方式一：一键部署（推荐）

� **超简单部署**：点击上方的 "Deploy to Cloudflare Workers" 按钮即可！

**部署步骤**：
1. **一键部署** → 点击上方的 Deploy 按钮
2. **连接 GitHub** → 授权 Cloudflare 访问你的 GitHub 账户
3. **自动部署** → Cloudflare 会自动 Fork 仓库并部署 Worker
4. **设置环境变量** → 在 Worker 设置中配置 `API_URL`, `MODEL_NAME`, `API_KEY`
5. **完成** → 立即可用，无需等待构建！

**Worker 部署优势**：
- ⚡ **秒级部署** - 无需构建过程，直接部署代码
- 🔧 **零配置** - 极简的 wrangler.toml，无复杂设置
- 💰 **更便宜** - 免费额度：100,000 请求/天
- 🌍 **全球分布** - 自动在全球 200+ 数据中心部署
- 🛠️ **配置简单** - 只需设置 3 个环境变量即可运行

### 方式二：本地开发

1. **克隆仓库**
   ```bash
   git clone https://github.com/XingQiu2307/BlockTrans.git
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

## ⚙️ 环境变量配置

**重要**：部署后必须在 Cloudflare Workers 中配置以下环境变量，否则翻译功能将无法正常工作。

### 配置步骤

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 Workers & Pages → 选择你的 Worker → Settings → Variables
3. 添加以下环境变量

### 环境变量配置

| 变量名 | 类型 | 必需 | 说明 | 示例值 |
|--------|------|------|------|--------|
| `API_URL` | **Text** | ✅ | AI API 端点地址 | `https://api.openai.com/v1/chat/completions` |
| `MODEL_NAME` | **Text** | ✅ | 使用的模型名称 | `gpt-3.5-turbo` |
| `API_KEY` | **Secret** | ✅ | API 密钥（加密存储） | `sk-proj-...` |

### 配置方式

#### 方式一：Cloudflare Dashboard（推荐）
1. 进入 Workers & Pages → 选择你的 Worker → Settings → Variables
2. 点击 **"Add variable"** 添加以下变量：
   - `API_URL` - 选择类型 **"Text"**
   - `MODEL_NAME` - 选择类型 **"Text"**
   - `API_KEY` - 选择类型 **"Secret"**（加密存储）

#### 方式二：wrangler CLI
```bash
# 设置环境变量
wrangler secret put API_URL
wrangler secret put MODEL_NAME
wrangler secret put API_KEY

# 或者使用 vars（不推荐用于敏感信息）
wrangler secret put API_KEY  # 推荐：密钥方式
```

### 📝 Cloudflare Workers 变量类型说明

Cloudflare Workers 支持三种变量类型：

| 类型 | 用途 | 安全性 | 适用场景 |
|------|------|--------|----------|
| **Text** | 普通文本变量 | 🔓 可见 | 非敏感配置（API_URL, MODEL_NAME） |
| **Secret** | 加密存储变量 | 🔒 加密 | 敏感信息（API_KEY, 密码） |
| **JSON** | JSON 格式数据 | 🔓 可见 | 复杂配置对象 |

**⚠️ 重要提醒**：
- `API_URL` 和 `MODEL_NAME` 设置为 **Text** 类型
- `API_KEY` **必须**设置为 **Secret** 类型，不能设置为 Text
- Secret 类型是加密存储的，更安全
- Text 类型的变量在日志中可能被看到，所以敏感信息要用 Secret

### 🚀 快速配置示例

**OpenAI 配置**：
```
API_URL = https://api.openai.com/v1/chat/completions
MODEL_NAME = gpt-3.5-turbo
API_KEY = sk-proj-your-openai-key-here
```

**Azure OpenAI 配置**：
```
API_URL = https://your-resource.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2023-05-15
MODEL_NAME = gpt-35-turbo
API_KEY = your-azure-api-key
```

### 支持的 AI 服务

- **OpenAI**: `https://api.openai.com/v1/chat/completions`
- **Azure OpenAI**: `https://your-resource.openai.azure.com/openai/deployments/your-deployment/chat/completions?api-version=2023-05-15`
- **其他兼容 OpenAI API 的服务**

## 🛠️ 技术栈

- **架构**: Cloudflare Workers (单文件全栈应用)
- **前端**: 内嵌 HTML + 原生 JavaScript
- **后端**: TypeScript + Cloudflare Workers Runtime
- **部署**: Cloudflare Workers (全球边缘计算)
- **开发**: Vue 3 + TypeScript + Vite (可选，用于复杂 UI 开发)
- **包管理**: pnpm
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

本项目采用 GPLv3 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Cloudflare Pages](https://pages.cloudflare.com/) - 现代化的 JAMstack 平台
- [Vite](https://vitejs.dev/) - 下一代前端构建工具

## � 故障排除

### 常见部署问题

1. **构建失败**
   - 确保使用 Node.js 22+ 版本
   - 检查依赖安装：`pnpm install`

2. **部署失败**
   - 确保使用 **Cloudflare Workers**（不是 Pages）
   - 点击一键部署按钮，或使用 `wrangler deploy` 命令
   - 无需设置构建命令，Worker 直接部署源代码

3. **翻译功能不工作（500 错误）**
   - **检查环境变量**：确认在 Cloudflare Workers 中已设置所有必需变量
     - `API_URL` (Text 类型)
     - `MODEL_NAME` (Text 类型)
     - `API_KEY` (Secret 类型)
   - **检查 API 密钥**：确保 API 密钥有效且有足够余额
   - **检查 API_URL**：确保 URL 格式正确，如 `https://api.openai.com/v1/chat/completions`
   - **查看日志**：在 Worker 设置中查看 Logs 标签页，查看具体错误信息

4. **快速诊断 500 错误**
   ```bash
   # 使用 wrangler 查看实时日志
   wrangler tail

   # 或者在浏览器中查看
   # Cloudflare Dashboard → Workers & Pages → 你的 Worker → Logs
   ```

   常见错误信息：
   - `Missing environment variables` → 环境变量未设置
   - `AI API request failed` → API 密钥或 URL 错误
   - `Invalid AI API response format` → API 响应格式问题

5. **Worker 优势说明**
   - ✅ **更简单** - 无需复杂的构建配置
   - ✅ **更快** - 冷启动时间更短
   - ✅ **更便宜** - 免费额度更高
   - ✅ **更可靠** - 单文件部署，减少故障点

## �📞 支持

如果你在使用过程中遇到问题，请：

1. 查看 [Issues](https://github.com/XingQiu2307/BlockTrans/issues) 中是否有类似问题
2. 创建新的 Issue 描述你的问题
3. 提供详细的错误信息和复现步骤

---

**让 Minecraft 模组本地化变得更简单！** 🎮✨
