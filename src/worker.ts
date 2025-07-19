/// <reference types="@cloudflare/workers-types" />

interface Env {
  API_URL: string;
  MODEL_NAME: string;
  API_KEY: string;
}

// 简化版本：直接返回基本的 HTML 页面
const HTML_CONTENT = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BlockTrans - 方块译者</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }

        .header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 15px 0;
            box-shadow: 0 2px 20px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .header-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
        }

        .github-link {
            background: #24292e;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
        }

        .github-link:hover {
            background: #0366d6;
            transform: translateY(-2px);
        }

        .main-container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .hero {
            text-align: center;
            margin-bottom: 40px;
            color: white;
        }

        .hero h1 {
            font-size: 3rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .hero p {
            font-size: 1.2rem;
            opacity: 0.9;
            margin-bottom: 30px;
        }

        .container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }

        .upload-area {
            border: 3px dashed #667eea;
            padding: 50px;
            text-align: center;
            margin: 30px 0;
            border-radius: 15px;
            background: linear-gradient(45deg, #f8f9ff, #f0f4ff);
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .upload-area:hover, .upload-area.dragover {
            border-color: #4f46e5;
            background: linear-gradient(45deg, #eef2ff, #e0e7ff);
            transform: translateY(-2px);
        }

        .upload-icon {
            font-size: 3rem;
            margin-bottom: 15px;
            color: #667eea;
        }

        button {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .result { margin-top: 30px; }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        th, td {
            border: none;
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }

        th {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            font-weight: 600;
        }

        tr:hover {
            background: #f8f9ff;
        }

        .editable-input {
            width: 100%;
            border: 1px solid #e5e7eb;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        .editable-input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .loading {
            display: none;
            text-align: center;
            margin: 30px 0;
            color: #667eea;
        }

        .loading-spinner {
            display: inline-block;
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 15px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .footer {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 40px 0;
            margin-top: 50px;
            border-top: 1px solid rgba(255,255,255,0.2);
        }

        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            text-align: center;
        }

        .footer h3 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 1.5rem;
        }

        .footer-links {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin: 20px 0;
            flex-wrap: wrap;
        }

        .footer-links a {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .footer-links a:hover {
            color: #4f46e5;
            transform: translateY(-2px);
        }

        .footer-info {
            color: #666;
            margin-top: 20px;
            line-height: 1.6;
        }

        .action-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 20px;
            flex-wrap: wrap;
        }

        .btn-secondary {
            background: linear-gradient(45deg, #6b7280, #9ca3af);
        }

        .btn-success {
            background: linear-gradient(45deg, #10b981, #059669);
        }

        @media (max-width: 768px) {
            .hero h1 { font-size: 2rem; }
            .hero p { font-size: 1rem; }
            .container { padding: 20px; margin: 0 10px; }
            .upload-area { padding: 30px 20px; }
            .footer-links { flex-direction: column; gap: 15px; }
            .action-buttons { flex-direction: column; align-items: center; }
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="header-content">
            <div class="logo">
                🧱 BlockTrans
            </div>
            <a href="https://github.com/XingQiu2307/BlockTrans" target="_blank" class="github-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
            </a>
        </div>
    </header>

    <div class="main-container">
        <div class="hero">
            <h1>🧱 BlockTrans</h1>
            <p>AI 驱动的 Minecraft .lang 文件翻译工具</p>
        </div>

        <div class="container">

            <div class="upload-area" id="uploadArea">
                <div class="upload-icon">📁</div>
                <h3>上传 .lang 文件</h3>
                <p>拖拽文件到这里，或点击按钮选择文件</p>
                <input type="file" id="fileInput" accept=".lang,.txt" style="display: none;">
                <button onclick="document.getElementById('fileInput').click()">📂 选择文件</button>
            </div>

            <div class="loading" id="loading">
                <div class="loading-spinner"></div>
                <p>🤖 AI 正在翻译中，请稍候...</p>
            </div>

            <div class="result" id="result"></div>
        </div>
    </div>

    <footer class="footer">
        <div class="footer-content">
            <h3>关于 BlockTrans</h3>
            <p>BlockTrans 是一个开源的 AI 驱动翻译工具，专为 Minecraft Bedrock Edition 的 .lang 文件设计。<br>
            基于 Cloudflare Workers 构建，提供快速、可靠的翻译服务。</p>

            <div class="footer-links">
                <a href="https://github.com/XingQiu2307/BlockTrans" target="_blank">📚 GitHub 仓库</a>
                <a href="https://github.com/XingQiu2307/BlockTrans/issues" target="_blank">🐛 报告问题</a>
                <a href="https://github.com/XingQiu2307/BlockTrans/blob/main/README.md" target="_blank">📖 使用文档</a>
                <a href="https://vibecoding.com" target="_blank">🎵 Vibe Coding</a>
            </div>

            <div class="footer-info">
                <p><strong>作者:</strong> XingQiu2307 | <strong>技术支持:</strong> Vibe Coding</p>
                <p>本项目采用 GPL-3.0 开源协议 | © 2025 BlockTrans</p>
            </div>
        </div>
    </footer>

    <script>
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const loading = document.getElementById('loading');
        const result = document.getElementById('result');

        // 拖拽上传
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFile(files[0]);
            }
        });

        // 文件选择
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFile(e.target.files[0]);
            }
        });

        // 处理文件
        async function handleFile(file) {
            if (!file.name.endsWith('.lang') && !file.name.endsWith('.txt')) {
                alert('请选择 .lang 或 .txt 文件');
                return;
            }

            const content = await file.text();
            await translateContent(content);
        }

        // 翻译内容
        async function translateContent(content) {
            loading.style.display = 'block';
            result.innerHTML = '';

            try {
                const response = await fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain' },
                    body: content
                });

                if (!response.ok) {
                    // 尝试解析错误响应
                    let errorMessage = '翻译请求失败';
                    let errorDetails = '';

                    try {
                        const errorData = await response.json();
                        if (errorData.error) {
                            errorMessage = errorData.error;
                        }
                        if (errorData.details) {
                            errorDetails = errorData.details;
                        }
                        if (errorData.message) {
                            errorDetails = errorData.message;
                        }
                    } catch (e) {
                        // 如果无法解析 JSON，使用状态文本
                        errorMessage = response.statusText || '未知错误';
                    }

                    displayError(errorMessage, errorDetails, response.status);
                    return;
                }

                const translations = await response.json();

                // 检查是否返回了错误对象而不是翻译数组
                if (translations.error) {
                    displayError(translations.error, translations.details || translations.message, response.status);
                    return;
                }

                displayResults(translations);
            } catch (error) {
                displayError('网络错误', error.message, 0);
            } finally {
                loading.style.display = 'none';
            }
        }

        // 显示错误信息
        function displayError(errorMessage, errorDetails, statusCode) {
            let html = '<div style="background: #ffe6e6; border: 1px solid #ff9999; padding: 15px; border-radius: 5px; margin: 10px 0;">';
            html += '<h3 style="color: #cc0000; margin-top: 0;">❌ 翻译失败</h3>';
            html += '<p><strong>错误信息:</strong> ' + errorMessage + '</p>';

            if (statusCode) {
                html += '<p><strong>状态码:</strong> ' + statusCode + '</p>';
            }

            if (errorDetails) {
                html += '<p><strong>详细信息:</strong> ' + errorDetails + '</p>';
            }

            // 根据错误类型提供解决建议
            html += '<div style="background: #f0f8ff; border-left: 4px solid #0066cc; padding: 10px; margin-top: 10px;">';
            html += '<h4 style="margin-top: 0;">💡 可能的解决方案:</h4>';

            if (errorMessage.includes('Missing required environment variables')) {
                html += '<ul>';
                html += '<li>检查 Cloudflare Worker 中是否已设置环境变量</li>';
                html += '<li>确认 API_URL, MODEL_NAME, API_KEY 都已正确配置</li>';
                html += '</ul>';
            } else if (statusCode === 401) {
                html += '<ul>';
                html += '<li>检查 API_KEY 是否正确</li>';
                html += '<li>确认 API 密钥没有过期</li>';
                html += '<li>验证 OpenAI 账户状态</li>';
                html += '</ul>';
            } else if (statusCode === 429) {
                html += '<ul>';
                html += '<li>API 请求频率过高，请稍后重试</li>';
                html += '<li>检查 OpenAI 账户余额</li>';
                html += '</ul>';
            } else if (statusCode === 502) {
                html += '<ul>';
                html += '<li>AI 服务暂时不可用，请稍后重试</li>';
                html += '<li>检查 API_URL 是否正确</li>';
                html += '<li>确认网络连接正常</li>';
                html += '</ul>';
            } else {
                html += '<ul>';
                html += '<li>检查网络连接</li>';
                html += '<li>确认所有环境变量已正确设置</li>';
                html += '<li>查看 Cloudflare Worker 日志获取更多信息</li>';
                html += '</ul>';
            }

            html += '</div>';
            html += '<button onclick="location.reload()" style="margin-top: 10px; background: #0066cc; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">🔄 重新尝试</button>';
            html += '</div>';

            result.innerHTML = html;
        }

        // 显示结果
        function displayResults(translations) {
            if (translations.length === 0) {
                result.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;"><h3>📝 没有找到需要翻译的内容</h3><p>请检查文件格式是否正确</p></div>';
                return;
            }

            let html = '<div style="margin-bottom: 20px;">';
            html += '<h3 style="color: #667eea; margin-bottom: 15px;">✅ 翻译完成 (' + translations.length + ' 条)</h3>';
            html += '<p style="color: #666; margin-bottom: 20px;">您可以直接编辑译文，然后下载修改后的文件</p>';
            html += '</div>';

            html += '<div style="overflow-x: auto;">';
            html += '<table>';
            html += '<tr><th style="width: 25%;">键名</th><th style="width: 35%;">原文</th><th style="width: 35%;">译文</th><th style="width: 5%;">操作</th></tr>';

            translations.forEach((item, index) => {
                html += '<tr data-index="' + index + '">' +
                    '<td><code style="background: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-size: 12px;">' + escapeHtml(item.key) + '</code></td>' +
                    '<td style="color: #374151;">' + escapeHtml(item.source) + '</td>' +
                    '<td><input type="text" class="editable-input" value="' + escapeHtml(item.translation) + '" data-key="' + escapeHtml(item.key) + '" onchange="markAsModified(this)"></td>' +
                    '<td><button onclick="resetTranslation(' + index + ')" style="background: #ef4444; padding: 4px 8px; font-size: 12px;" title="重置为原始翻译">🔄</button></td>' +
                '</tr>';
            });

            html += '</table>';
            html += '</div>';

            html += '<div class="action-buttons">';
            html += '<button onclick="downloadResult()" class="btn-success">💾 下载翻译文件</button>';
            html += '<button onclick="previewResult()" class="btn-secondary">👁️ 预览内容</button>';
            html += '<button onclick="copyToClipboard()" class="btn-secondary">📋 复制到剪贴板</button>';
            html += '<button onclick="resetAllTranslations()">🔄 重置所有翻译</button>';
            html += '</div>';

            // 存储原始翻译数据
            window.originalTranslations = JSON.parse(JSON.stringify(translations));
            window.currentTranslations = translations;

            result.innerHTML = html;
        }

        // HTML 转义函数
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // 标记为已修改
        function markAsModified(input) {
            input.style.borderColor = '#f59e0b';
            input.style.backgroundColor = '#fffbeb';

            // 更新当前翻译数据
            const key = input.getAttribute('data-key');
            const newValue = input.value;

            if (window.currentTranslations) {
                const item = window.currentTranslations.find(t => t.key === key);
                if (item) {
                    item.translation = newValue;
                }
            }
        }

        // 重置单个翻译
        function resetTranslation(index) {
            if (window.originalTranslations && window.currentTranslations) {
                const original = window.originalTranslations[index];
                const current = window.currentTranslations[index];

                current.translation = original.translation;

                const input = document.querySelector('tr[data-index="' + index + '"] .editable-input');
                if (input) {
                    input.value = original.translation;
                    input.style.borderColor = '#e5e7eb';
                    input.style.backgroundColor = 'white';
                }
            }
        }

        // 重置所有翻译
        function resetAllTranslations() {
            if (confirm('确定要重置所有翻译到原始状态吗？')) {
                if (window.originalTranslations) {
                    window.currentTranslations = JSON.parse(JSON.stringify(window.originalTranslations));
                    displayResults(window.currentTranslations);
                }
            }
        }

        // 预览结果
        function previewResult() {
            const content = generateLangContent();
            const previewWindow = window.open('', '_blank');
            previewWindow.document.write('<html><head><title>预览 - .lang 文件</title></head><body>');
            previewWindow.document.write('<h2>预览内容</h2>');
            previewWindow.document.write('<pre style="background: #f5f5f5; padding: 20px; border-radius: 8px; overflow: auto;">' + escapeHtml(content) + '</pre>');
            previewWindow.document.write('<button onclick="window.close()">关闭</button>');
            previewWindow.document.write('</body></html>');
        }

        // 复制到剪贴板
        function copyToClipboard() {
            const content = generateLangContent();
            navigator.clipboard.writeText(content).then(() => {
                alert('✅ 内容已复制到剪贴板！');
            }).catch(() => {
                // 降级方案
                const textarea = document.createElement('textarea');
                textarea.value = content;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                alert('✅ 内容已复制到剪贴板！');
            });
        }

        // 生成 .lang 文件内容
        function generateLangContent() {
            const translations = window.currentTranslations || [];
            let content = '';

            translations.forEach(item => {
                content += item.key + '=' + item.translation + '\\n';
            });

            return content;
        }

        // 下载结果
        function downloadResult() {
            const content = generateLangContent();

            if (!content.trim()) {
                alert('❌ 没有可下载的内容');
                return;
            }

            const blob = new Blob([content], { type: 'text/plain; charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            // 生成带时间戳的文件名
            const now = new Date();
            const timestamp = now.getFullYear() +
                String(now.getMonth() + 1).padStart(2, '0') +
                String(now.getDate()).padStart(2, '0') + '_' +
                String(now.getHours()).padStart(2, '0') +
                String(now.getMinutes()).padStart(2, '0');

            a.download = 'translated_' + timestamp + '.lang';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // 显示成功提示
            showNotification('✅ 文件下载成功！', 'success');
        }

        // 显示通知
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.style.cssText = \`
                position: fixed;
                top: 20px;
                right: 20px;
                background: \${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                z-index: 1000;
                font-weight: 500;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            \`;
            notification.textContent = message;

            document.body.appendChild(notification);

            // 动画显示
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);

            // 3秒后自动消失
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        }
    </script>
</body>
</html>`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // CORS 头部
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // API 路由：翻译接口
    if (pathname === '/api/translate' && request.method === 'POST') {
      return handleTranslateAPI(request, env, corsHeaders);
    }

    // 静态文件路由 - 返回内嵌的 HTML 页面
    return new Response(HTML_CONTENT, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html',
      },
    });
  },
};

// 处理翻译 API
async function handleTranslateAPI(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    // 环境变量检查和默认值处理
    const apiUrl = env.API_URL || 'https://api.openai.com/v1/chat/completions';
    const modelName = env.MODEL_NAME || 'gpt-3.5-turbo';
    const apiKey = env.API_KEY;

    // API_KEY 是必需的，没有默认值
    if (!apiKey) {
      console.error('Missing API_KEY environment variable');
      return new Response(JSON.stringify({
        error: 'Server configuration error: API_KEY not configured',
        details: 'Please set API_KEY as a Secret in Cloudflare Dashboard',
        instructions: 'Go to Workers & Pages → Your Worker → Settings → Variables → Add variable (Type: Secret)'
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    console.log('Using configuration:', {
      API_URL: apiUrl,
      MODEL_NAME: modelName,
      API_KEY_SET: !!apiKey
    });

    const langFileContent = await request.text();
    console.log('Received content length:', langFileContent.length);

    const itemsToTranslate = parseLangFile(langFileContent);
    console.log('Parsed items:', itemsToTranslate.length);

    if (itemsToTranslate.length === 0) {
      return new Response(JSON.stringify([]), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    const textsToTranslate = itemsToTranslate.map(item => item.value);

    console.log('Calling AI API:', apiUrl);
    console.log('Using model:', modelName);

    const aiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: 'user',
            content: createTranslationPrompt(textsToTranslate)
          }
        ],
        max_tokens: 2000,
        temperature: 0.3
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API Error:', aiResponse.status, errorText);

      let errorMessage = `AI API request failed with status ${aiResponse.status}`;
      let suggestions = '';

      // 根据状态码提供具体的错误信息
      switch (aiResponse.status) {
        case 401:
          errorMessage = 'API 密钥无效或已过期';
          suggestions = '请检查 API_KEY 是否正确设置为 Secret 类型';
          break;
        case 429:
          errorMessage = 'API 请求频率限制或余额不足';
          suggestions = '请检查 OpenAI 账户余额或稍后重试';
          break;
        case 502:
          errorMessage = 'AI 服务暂时不可用';
          suggestions = '这通常是临时问题，请稍后重试。如果持续出现，请检查 API_URL 是否正确';
          break;
        case 503:
          errorMessage = 'AI 服务过载';
          suggestions = '服务器繁忙，请稍后重试';
          break;
        default:
          errorMessage = `AI API 返回错误 ${aiResponse.status}`;
          suggestions = '请检查 API 配置和网络连接';
      }

      return new Response(JSON.stringify({
        error: errorMessage,
        details: errorText || suggestions,
        statusCode: aiResponse.status,
        suggestions: suggestions
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    const aiResult = await aiResponse.json() as { choices: Array<{ message: { content: string } }> };
    console.log('AI Response:', aiResult);

    if (!aiResult.choices || !aiResult.choices[0] || !aiResult.choices[0].message) {
      throw new Error('Invalid AI API response format');
    }

    const translatedTexts = aiResult.choices[0].message.content.split('\n').filter(line => line.trim());

    if (translatedTexts.length !== itemsToTranslate.length) {
      throw new Error('Mismatch between original and translated item count.');
    }

    const translations = itemsToTranslate.map((item, index) => ({
      key: item.key,
      source: item.value,
      translation: translatedTexts[index],
    }));

    return new Response(JSON.stringify(translations), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Translation failed:', error);
    return new Response(JSON.stringify({
      error: 'Translation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: 'Please check your environment variables and API configuration'
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      }
    });
  }
}

// Worker 版本不需要复杂的静态资源处理，所有内容都内嵌在 HTML 中

// 解析 .lang 文件
interface TranslationItem {
  key: string;
  value: string;
}

function parseLangFile(content: string): TranslationItem[] {
  const lines = content.split('\n');
  const items: TranslationItem[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('#') || trimmedLine === '') {
      continue;
    }

    const parts = trimmedLine.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim();
      if (key && value) {
        items.push({ key, value });
      }
    }
  }

  return items;
}

// 创建翻译提示词
function createTranslationPrompt(texts: string[]): string {
  const prompt = `You are a professional game translator for Minecraft.
Translate the following English game content into Simplified Chinese.
Maintain the style and terminology of the game.
Return only the translated text, with each translation on a new line. Do not include the original text.

Original Texts:
---
${texts.join('\n')}
---

Translations:`;
  return prompt;
}
