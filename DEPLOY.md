# 🚀 BlockTrans Worker 部署指南

## 📋 部署前准备

1. 准备一个 **Cloudflare 账户**（免费即可）
2. 准备 **AI API 密钥**（OpenAI、Azure OpenAI 等）

## ⚡ Cloudflare Workers 一键部署（推荐）

### 方式一：一键部署按钮

1. 点击项目 README 中的 **"Deploy to Cloudflare Workers"** 按钮
2. 授权 Cloudflare 访问你的 GitHub 账户
3. Cloudflare 会自动 Fork 仓库并部署 Worker
4. 部署完成后配置环境变量即可使用

### 方式二：手动部署

1. **Fork 仓库**
   ```bash
   # 或者克隆到本地
   git clone https://github.com/XingQiu2307/BlockTrans.git
   cd BlockTrans
   ```

2. **安装 wrangler CLI**
   ```bash
   npm install -g wrangler
   # 或者使用项目本地版本
   npm install
   ```

3. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

4. **部署 Worker**
   ```bash
   wrangler deploy
   # 或者使用 npm 脚本
   npm run deploy
   ```

就这么简单！无需构建步骤，无需配置文件，直接部署即可。

## ⚙️ 配置环境变量

部署完成后，需要配置环境变量：

### 设置步骤

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → 选择你的 Worker
3. 点击 **Settings** → **Variables**

### 添加变量

| 变量名 | 类型 | 配置方式 | 示例值 | 说明 |
|--------|------|----------|--------|------|
| `API_URL` | **Text** | 🔧 自动设置 | `https://api.openai.com/v1/chat/completions` | AI API 端点地址 |
| `MODEL_NAME` | **Text** | 🔧 自动设置 | `gpt-3.5-turbo` | 使用的模型名称 |
| `API_KEY` | **Secret** | 🔐 手动设置 | `sk-proj-...` | 你的 API 密钥 |

### 在 Dashboard 中配置

**🎉 超简单配置**：现在只需要设置一个变量！

项目内置了 OpenAI 的默认配置，开箱即用。

**只需添加 API 密钥**：

1. 点击 **"Add variable"** 按钮
2. **API_KEY**：
   - Name: `API_KEY`
   - Type: **Secret**（重要：必须选择 Secret）
   - Value: 你的实际 API 密钥（如：`sk-proj-...`）
3. 点击 **"Save"**

**就这么简单！** 🎉

### 💡 配置说明

**为什么现在只需要设置 API_KEY？**

项目采用了**智能默认值 + 可选覆盖**的配置策略：

```toml
# wrangler.toml 中的默认配置
[vars]
API_URL = "https://api.openai.com/v1/chat/completions"
MODEL_NAME = "gpt-3.5-turbo"
```

**配置优先级**：
1. **Dashboard 变量** > 2. **wrangler.toml 默认值** > 3. **代码默认值**

**优势**：
- ✅ **开箱即用** - 无需配置即可使用 OpenAI
- ✅ **配置持久** - Dashboard 设置不会因重新部署丢失
- ✅ **灵活覆盖** - 可自定义任何 AI 服务
- ✅ **开源友好** - 仓库不包含用户特定配置

**自定义其他 AI 服务**：
在 Dashboard 中添加变量即可覆盖默认值：
- 添加 `API_URL` (Text) - 如 Azure OpenAI 端点
- 添加 `MODEL_NAME` (Text) - 如 `gpt-4` 或其他模型

**重要**:
- API 密钥必须使用 Secret 类型！
- Dashboard 中的设置会永久保存，不会因重新部署丢失

### 使用 wrangler CLI 配置

```bash
# 方式一：设置为密钥（推荐，更安全）
wrangler secret put API_KEY
wrangler secret put API_URL
wrangler secret put MODEL_NAME

# 方式二：设置为环境变量（API_KEY 不推荐）
wrangler secret put API_URL --env production
wrangler secret put MODEL_NAME --env production
wrangler secret put API_KEY --env production  # 仍然是密钥
```

### 常用 AI 服务配置

#### OpenAI
```
API_URL = https://api.openai.com/v1/chat/completions
MODEL_NAME = gpt-3.5-turbo
API_KEY = sk-proj-...
```

#### Azure OpenAI
```
API_URL = https://your-resource.openai.azure.com/openai/deployments/your-deployment/chat/completions?api-version=2023-05-15
MODEL_NAME = gpt-35-turbo
API_KEY = your-azure-api-key
```

#### 其他兼容服务
```
API_URL = https://your-api-endpoint.com/v1/chat/completions
MODEL_NAME = your-model-name
API_KEY = your-api-key
```

## ✅ 验证部署

### 检查 Worker 状态

1. 访问你的 Worker 域名（如 `blocktrans.your-subdomain.workers.dev`）
2. 应该看到 BlockTrans 的上传界面
3. 尝试上传一个测试 .lang 文件
4. 检查翻译功能是否正常工作

### 测试用 .lang 文件

创建一个测试文件 `test.lang`：
```
entity.minecraft.pig.name=Pig
entity.minecraft.cow.name=Cow
item.minecraft.apple.name=Apple
```

上传后应该得到中文翻译结果。

### 性能检查

- **首次访问**：应该在 1-2 秒内加载完成
- **翻译请求**：通常在 3-10 秒内完成（取决于 AI API 响应速度）
- **全球访问**：在世界各地访问速度都应该很快

## ✅ 验证部署

1. 访问你的 Pages 域名
2. 尝试上传一个 `.lang` 文件
3. 检查翻译功能是否正常工作

## 🔧 常见问题

### Q: 部署失败，提示认证错误？
**A**: 检查以下设置：
- 确保已经登录 Cloudflare：`wrangler login`
- 检查 API Token 权限是否包含 Workers 编辑权限
- 尝试重新登录：`wrangler logout` 然后 `wrangler login`

### Q: 部署成功但翻译功能不工作？
**A**: 检查环境变量是否正确设置：
- 进入 Workers & Pages → 选择你的 Worker → Settings → Variables
- 确认 `API_URL`、`MODEL_NAME` 已设置为环境变量
- 确认 `API_KEY` 已设置为 **Secret**（不是环境变量）
- 检查 API 密钥是否有效且有足够余额

### Q: 如何更新 Worker？
**A**:
1. 修改代码后运行 `wrangler deploy`
2. 或者在 GitHub 中提交更改，使用一键部署会自动更新
3. 无需重新配置环境变量

### Q: Worker 启动慢或超时？
**A**:
- Worker 冷启动通常在 100ms 内，比 Pages 更快
- 如果超时，检查 AI API 调用是否正常
- 可以设置更长的超时时间或优化 API 调用

### Q: 为什么选择 Worker 而不是 Pages？
**A**: Worker 有以下优势：
- ⚡ **更快部署** - 无需构建过程，秒级部署
- 🔧 **零配置** - 无需设置构建命令和输出目录
- 💰 **更便宜** - 免费额度更高（100,000 请求/天）
- 🌍 **更快响应** - 边缘计算，全球 200+ 数据中心
- 📦 **更简单** - 单文件包含前端+后端，减少故障点

### Q: 如何查看 Worker 日志？
**A**:
1. 在 Cloudflare Dashboard 中进入你的 Worker
2. 点击 **"Logs"** 标签页
3. 可以实时查看请求日志和错误信息
4. 或使用 `wrangler tail` 命令在本地查看日志

## 🌐 自定义域名（可选）

1. 在 Worker 设置中进入 **"Triggers"** → **"Custom Domains"**
2. 点击 **"Add Custom Domain"**
3. 输入你的域名并按照指示配置 DNS
4. Worker 支持自动 HTTPS 和全球 CDN

## 📞 需要帮助？

如果遇到问题，请：
1. 查看 [GitHub Issues](https://github.com/XingQiu2307/BlockTrans/issues)
2. 创建新的 Issue 并提供详细的错误信息
3. 包含构建日志和错误截图

---

**祝你部署成功！** 🎉
