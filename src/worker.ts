/// <reference types="@cloudflare/workers-types" />

import { unzip, zip, strFromU8, strToU8 } from 'fflate';

// TypeScript 类已移除，使用前端 JavaScript 实现

interface Env {
  API_URL: string;
  MODEL_NAME: string;
  API_KEY: string;
}

// 简化版本：直接返回基本的 HTML 页面
const HTML_CONTENT = (function(): string {
  // @ts-nocheck
  const htmlContent = `<!DOCTYPE html>
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
            <p>AI 驱动的 Minecraft 附加包翻译工具</p>
            <p style="font-size: 1rem; opacity: 0.8;">支持 .lang 文件和 .zip/.mcaddon/.mcpack 附加包</p>
        </div>

        <div class="container">

            <div class="upload-area" id="uploadArea">
                <div class="upload-icon">📦</div>
                <h3>上传文件进行翻译</h3>
                <div style="margin: 15px 0;">
                    <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 15px; flex-wrap: wrap;">
                        <div style="text-align: center;">
                            <div style="font-size: 2rem;">📄</div>
                            <div style="font-weight: bold; color: #667eea;">.lang 文件</div>
                            <div style="font-size: 0.9rem; color: #666;">单个语言文件</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 2rem;">📦</div>
                            <div style="font-weight: bold; color: #667eea;">附加包</div>
                            <div style="font-size: 0.9rem; color: #666;">.zip/.mcaddon/.mcpack</div>
                        </div>
                    </div>
                </div>
                <p>拖拽文件到这里，或点击按钮选择文件</p>
                <input type="file" id="fileInput" accept=".lang,.txt,.zip,.mcaddon,.mcpack" style="display: none;">
                <button id="selectFileBtn">📂 选择文件</button>
                <button onclick="document.getElementById('fileInput').click()" style="margin-left: 10px; background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 4px;">🔧 测试选择</button>
            </div>

            <div class="loading" id="loading">
                <div class="loading-spinner"></div>
                <div id="progressContainer" style="margin: 20px 0; max-width: 400px; margin-left: auto; margin-right: auto;">
                    <div id="progressBar" style="width: 100%; height: 20px; background: #f0f0f0; border-radius: 10px; overflow: hidden; margin: 10px 0;">
                        <div id="progressFill" style="height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); width: 0%; transition: width 0.3s ease;"></div>
                    </div>
                    <div id="progressText" style="color: #667eea; font-size: 1rem; font-weight: bold;">准备中...</div>
                    <div id="progressDetails" style="color: #999; font-size: 0.9rem; margin-top: 5px;">正在初始化...</div>
                </div>
            </div>

            <div class="result" id="result"></div>
        </div>
    </div>

    <footer class="footer">
        <div class="footer-content">
            <h3>关于 BlockTrans</h3>
            <p>BlockTrans 是一个开源的 AI 驱动翻译工具，专为 Minecraft Bedrock Edition 设计。<br>
            支持单个 .lang 文件和完整附加包（.zip/.mcaddon/.mcpack）的一键翻译。<br>
            基于 Cloudflare Workers 构建，提供快速、可靠的翻译服务。</p>

            <div style="margin: 20px 0; padding: 20px; background: rgba(102, 126, 234, 0.1); border-radius: 10px;">
                <h4 style="color: #667eea; margin-bottom: 10px;">🚀 新功能亮点</h4>
                <ul style="text-align: left; max-width: 600px; margin: 0 auto;">
                    <li><strong>📦 附加包支持</strong> - 直接上传 .mcaddon/.mcpack 文件</li>
                    <li><strong>🎯 智能识别</strong> - 自动定位 res/texts/ 下的语言文件</li>
                    <li><strong>🔄 一键处理</strong> - 上传附加包，下载翻译版本</li>
                    <li><strong>🌏 中文输出</strong> - 自动重命名为 zh_CN.lang</li>
                    <li><strong>✏️ 在线编辑</strong> - 支持翻译结果的实时修改</li>
                </ul>
            </div>

            <div class="footer-links">
                <a href="https://github.com/XingQiu2307/BlockTrans" target="_blank">📚 GitHub 仓库</a>
                <a href="https://github.com/XingQiu2307/BlockTrans/issues" target="_blank">🐛 报告问题</a>
                <a href="https://github.com/XingQiu2307/BlockTrans/blob/main/README.md" target="_blank">📖 使用文档</a>
                <a href="https://vibecoding.com" target="_blank">🎵 Vibe Coding</a>
            </div>

            <div class="footer-info">
                <div id="statsDisplay" style="margin: 15px 0; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 8px; text-align: center;">
                    <span style="font-size: 0.9rem; color: #667eea;">👥 访问人数: <img src="https://count.getloli.com/@访问人数?name=访问人数&theme=minecraft&padding=7&offset=0&align=top&scale=1&pixelated=1&darkmode=auto" alt="访问统计" style="vertical-align: middle; margin-left: 5px;"></span>
                </div>
                <p><strong>作者:</strong> XingQiu2307 | <strong>技术支持:</strong> Vibe Coding</p>
                <p>本项目采用 GPL-3.0 开源协议 | © 2025 BlockTrans</p>
            </div>
        </div>
    </footer>

    <script>
        console.log('Script starting...');

        // 获取DOM元素
        var uploadArea = document.getElementById('uploadArea');
        var fileInput = document.getElementById('fileInput');
        var loading = document.getElementById('loading');
        var result = document.getElementById('result');

        console.log('Elements found:', uploadArea, fileInput, loading, result);

        // 简单的文件选择功能
        function openFileDialog() {
            console.log('Opening file dialog...');
            if (fileInput) {
                fileInput.click();
            } else {
                console.error('fileInput not found');
            }
        }

        // 绑定点击事件
        if (uploadArea) {
            uploadArea.addEventListener('click', openFileDialog);
            console.log('Click event bound to uploadArea');
        } else {
            console.error('uploadArea not found');
        }

        // 选择文件按钮
        var selectFileBtn = document.getElementById('selectFileBtn');
        if (selectFileBtn) {
            selectFileBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                console.log('Select file button clicked');
                openFileDialog();
            });
            console.log('Click event bound to selectFileBtn');
        } else {
            console.error('selectFileBtn not found');
        }

        // 文件选择
        if (fileInput) {
            fileInput.addEventListener('change', function(e) {
                console.log('File input changed');
                if (e.target.files && e.target.files.length > 0) {
                    console.log('File selected:', e.target.files[0].name);
                    handleFile(e.target.files[0]);
                } else {
                    console.log('No files selected');
                }
            });
            console.log('Change event bound to fileInput');
        } else {
            console.error('fileInput element not found for change event');
        }

        // 处理文件
        function handleFile(file) {
            console.log('handleFile called with:', file.name, file.size, 'bytes');
            var fileName = file.name.toLowerCase();

            if (fileName.endsWith('.zip') || fileName.endsWith('.mcaddon') || fileName.endsWith('.mcpack')) {
                console.log('Processing as ZIP file');
                alert('ZIP 文件处理功能暂时禁用');
            } else if (fileName.endsWith('.lang') || fileName.endsWith('.txt')) {
                console.log('Processing as .lang file');
                file.text().then(function(content) {
                    console.log('File content length:', content.length);
                    translateContent(content, 'lang');
                });
            } else {
                console.log('Unsupported file format:', fileName);
                alert('不支持的文件格式: ' + fileName);
            }
        }

        // 基本的 UI 函数
        function updateProgress(percentage, text, details) {
            console.log('Progress: ' + percentage + '% - ' + text + ' - ' + details);
            var progressFill = document.getElementById('progressFill');
            var progressText = document.getElementById('progressText');
            var progressDetails = document.getElementById('progressDetails');

            if (progressFill) progressFill.style.width = percentage + '%';
            if (progressText) progressText.textContent = text;
            if (progressDetails) progressDetails.textContent = details;
        }

        function resetProgress() {
            updateProgress(0, '准备中...', '正在初始化...');
        }

        function showNotification(message, type) {
            console.log('Notification (' + (type || 'info') + '): ' + message);
            alert(message);
        }

        // 翻译内容
        function translateContent(content, type) {
            console.log('translateContent called with type:', type);
            console.log('Content length:', content.length);

            if (loading) loading.style.display = 'block';
            if (result) result.innerHTML = '';
            resetProgress();

            try {
                updateProgress(10, '上传文件', '正在上传 .lang 文件...');

                fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain' },
                    body: content
                }).then(function(response) {
                    updateProgress(50, '处理响应', '正在处理服务器响应...');
                    console.log('Response received:', response.status, response.statusText);

                    if (!response.ok) {
                        updateProgress(100, '处理失败', '服务器返回错误');
                        showNotification('翻译请求失败: ' + response.status, 'error');
                        return;
                    }

                    return response.json();
                }).then(function(translations) {
                    if (translations) {
                        updateProgress(100, '完成', '翻译完成');
                        console.log('Translations received:', translations.length);
                        showNotification('翻译完成，共 ' + translations.length + ' 条', 'success');
                    }
                }).catch(function(error) {
                    updateProgress(100, '网络错误', error.message);
                    console.error('Translation error:', error);
                    showNotification('网络错误: ' + error.message, 'error');
                }).finally(function() {
                    setTimeout(function() {
                        if (loading) loading.style.display = 'none';
                    }, 1000);
                });
            } catch (error) {
                console.error('Translation error:', error);
                showNotification('翻译失败: ' + error.message, 'error');
            }
        }

        console.log('Basic script setup complete');

        /*
        // 处理文件
        async function handleFile(file) {
            console.log('handleFile called with:', file.name, file.size, 'bytes');
            const fileName = file.name.toLowerCase();

            if (fileName.endsWith('.zip') || fileName.endsWith('.mcaddon') || fileName.endsWith('.mcpack')) {
                console.log('Processing as ZIP file');
                // 处理 ZIP 格式文件
                await handleZipFile(file);
            } else if (fileName.endsWith('.lang') || fileName.endsWith('.txt')) {
                console.log('Processing as .lang file');
                // 处理单个 .lang 文件
                const content = await file.text();
                console.log('File content length:', content.length);
                await translateContent(content, 'lang');
            } else {
                console.log('Unsupported file format:', fileName);
                showNotification('❌ 不支持的文件格式。请选择 .lang、.zip、.mcaddon 或 .mcpack 文件', 'error');
                return;
            }
        }

        // 处理 ZIP 文件
        async function handleZipFile(file) {
            try {
                showNotification('📦 正在解析附加包...', 'info');

                const arrayBuffer = await file.arrayBuffer();
                const formData = new FormData();
                formData.append('file', new Blob([arrayBuffer]), file.name);

                await translateContent(formData, 'zip');
            } catch (error) {
                console.error('ZIP file processing error:', error);
                showNotification('❌ ZIP 文件处理失败: ' + error.message, 'error');
            }
        }

        // 翻译内容
        async function translateContent(content, type = 'lang') {
            console.log('translateContent called with type:', type);
            console.log('Content type:', typeof content, 'Length/Size:', content.length || content.size);

            loading.style.display = 'block';
            result.innerHTML = '';
            resetProgress();

            try {
                let response;

                if (type === 'zip') {
                    updateProgress(10, '上传文件', '正在上传 ZIP 文件...');
                    console.log('Making request to /api/translate-zip');

                    // ZIP 文件使用 FormData
                    response = await fetch('/api/translate-zip', {
                        method: 'POST',
                        body: content
                    });

                    updateProgress(30, '解析文件', '正在解析 ZIP 文件结构...');
                } else {
                    updateProgress(10, '上传文件', '正在上传 .lang 文件...');
                    console.log('Making request to /api/translate');

                    // .lang 文件使用文本
                    response = await fetch('/api/translate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'text/plain' },
                        body: content
                    });

                    updateProgress(30, '解析内容', '正在解析语言文件...');
                }

                console.log('Response received:', response.status, response.statusText);

                updateProgress(50, '处理响应', '正在处理服务器响应...');

                if (!response.ok) {
                    updateProgress(100, '处理失败', '服务器返回错误');

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

                if (type === 'zip') {
                    updateProgress(70, 'AI 翻译', '正在处理翻译结果...');

                    // ZIP 文件响应处理
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        updateProgress(90, '生成界面', '正在生成编辑界面...');

                        // 返回翻译结果供编辑
                        const zipResult = await response.json();
                        updateProgress(100, '完成', '翻译完成，可以编辑结果');
                        displayZipResults(zipResult);
                        return;
                    } else {
                        updateProgress(100, '处理失败', '响应格式错误');
                        // 错误响应
                        const errorData = await response.json();
                        displayError(errorData.error, errorData.details || errorData.message, response.status);
                        return;
                    }
                } else {
                    updateProgress(70, 'AI 翻译', '正在处理翻译结果...');

                    // .lang 文件响应处理
                    const translations = await response.json();

                    updateProgress(90, '生成界面', '正在生成编辑界面...');

                    // 检查是否返回了错误对象而不是翻译数组
                    if (translations.error) {
                        updateProgress(100, '翻译失败', translations.error);
                        displayError(translations.error, translations.details || translations.message, response.status);
                        return;
                    }

                    updateProgress(100, '完成', '翻译完成，可以编辑结果');
                    displayResults(translations);
                }
            } catch (error) {
                updateProgress(100, '网络错误', error.message);
                displayError('网络错误', error.message, 0);
            } finally {
                // 延迟隐藏 loading，让用户看到最终状态
                setTimeout(() => {
                    loading.style.display = 'none';
                }, 1000);
            }
        }

        // 显示错误信息
        function displayError(errorMessage, errorDetails, statusCode) {
            var html = '<div style="background: #ffe6e6; border: 1px solid #ff9999; padding: 15px; border-radius: 5px; margin: 10px 0;">';
            html += '<h3 style="color: #cc0000; margin-top: 0;">翻译失败</h3>';
            html += '<p><strong>错误信息:</strong> ' + errorMessage + '</p>';

            if (statusCode) {
                html += '<p><strong>状态码:</strong> ' + statusCode + '</p>';
            }

            if (errorDetails) {
                html += '<p><strong>详细信息:</strong> ' + errorDetails + '</p>';
            }

            // 根据错误类型提供解决建议
            html += '<div style="background: #f0f8ff; border-left: 4px solid #0066cc; padding: 10px; margin-top: 10px;">';
            html += '<h4 style="margin-top: 0;">可能的解决方案:</h4>';

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
            html += '<button id="retryBtn" style="margin-top: 10px; background: #0066cc; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">重新尝试</button>';
            html += '</div>';

            result.innerHTML = html;
        }

        // 显示结果
        function displayResults(translations) {
            console.log('displayResults called with', translations.length, 'translations');

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
                    '<td><input type="text" class="editable-input" value="' + escapeHtml(item.translation) + '" data-key="' + escapeHtml(item.key) + '"></td>' +
                    '<td><button class="reset-btn" data-index="' + index + '" style="background: #ef4444; padding: 4px 8px; font-size: 12px;" title="重置为原始翻译">🔄</button></td>' +
                '</tr>';
            });

            html += '</table>';
            html += '</div>';

            html += '<div class="action-buttons">';
            html += '<button id="downloadBtn" class="btn-success">💾 下载翻译文件</button>';
            html += '<button id="previewBtn" class="btn-secondary">👁️ 预览内容</button>';
            html += '<button id="copyBtn" class="btn-secondary">📋 复制到剪贴板</button>';
            html += '<button id="resetAllBtn">🔄 重置所有翻译</button>';
            html += '</div>';

            // 存储原始翻译数据
            window.originalTranslations = JSON.parse(JSON.stringify(translations));
            window.currentTranslations = translations;

            result.innerHTML = html;

            // 添加事件委托
            setupEventDelegation();
        }

        // HTML 转义函数
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // 设置事件委托
        function setupEventDelegation() {
            // 移除之前的事件监听器（如果存在）
            result.removeEventListener('change', handleInputChange);
            result.removeEventListener('click', handleButtonClick);

            // 添加新的事件监听器
            result.addEventListener('change', handleInputChange);
            result.addEventListener('click', handleButtonClick);
        }

        function handleInputChange(e) {
            if (e.target.classList.contains('editable-input')) {
                markAsModified(e.target);
            }
        }

        function handleButtonClick(e) {
            if (e.target.classList.contains('reset-btn')) {
                const index = parseInt(e.target.getAttribute('data-index'));
                resetTranslation(index);
            } else if (e.target.id === 'retryBtn') {
                location.reload();
            } else if (e.target.id === 'downloadBtn') {
                downloadResult();
            } else if (e.target.id === 'previewBtn') {
                previewResult();
            } else if (e.target.id === 'copyBtn') {
                copyToClipboard();
            } else if (e.target.id === 'resetAllBtn') {
                resetAllTranslations();
            } else if (e.target.id === 'downloadZipBtn') {
                downloadZipResult();
            }
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

            // 优先使用现代 Clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(content).then(() => {
                    alert('内容已复制到剪贴板！');
                }).catch(() => {
                    // 降级方案
                    fallbackCopyTextToClipboard(content);
                });
            } else {
                // 降级方案
                fallbackCopyTextToClipboard(content);
            }
        }

        function fallbackCopyTextToClipboard(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();

            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    alert('内容已复制到剪贴板！');
                } else {
                    alert('复制失败，请手动复制');
                }
            } catch (err) {
                alert('复制失败，请手动复制');
            }

            document.body.removeChild(textarea);
        }

        // 生成 .lang 文件内容
        function generateLangContent() {
            const translations = window.currentTranslations || [];
            let content = '';

            translations.forEach(item => {
                content += item.key + '=' + item.translation + '\n';
            });

            return content;
        }

        // 下载结果
        function downloadResult() {
            const content = generateLangContent();

            if (!content.trim()) {
                alert('没有可下载的内容');
                return;
            }

            var blob = new Blob([content], { type: 'text/plain; charset=utf-8' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;

            // 生成带时间戳的文件名
            var now = new Date();
            var month = now.getMonth() + 1;
            var date = now.getDate();
            var hours = now.getHours();
            var minutes = now.getMinutes();

            // 手动补零
            var monthStr = month < 10 ? '0' + month : String(month);
            var dateStr = date < 10 ? '0' + date : String(date);
            var hoursStr = hours < 10 ? '0' + hours : String(hours);
            var minutesStr = minutes < 10 ? '0' + minutes : String(minutes);

            var timestamp = now.getFullYear() + monthStr + dateStr + '_' + hoursStr + minutesStr;

            a.download = 'translated_' + timestamp + '.lang';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // 显示成功提示
            showNotification('文件下载成功！', 'success');
        }

        // 显示 ZIP 翻译结果
        function displayZipResults(zipResult) {
            var html = '<div class="zip-results">';
            html += '<h3>附加包翻译结果</h3>';
            html += '<p style="color: #666; margin-bottom: 20px;">请检查并编辑翻译结果，确认后将重新打包为附加包</p>';

            // 为每个翻译文件创建编辑区域
            for (var fileIndex = 0; fileIndex < zipResult.translatedFiles.length; fileIndex++) {
                var file = zipResult.translatedFiles[fileIndex];
                html += '<div class="file-section" style="margin-bottom: 30px; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">';
                html += '<h4 style="color: #667eea; margin-bottom: 15px;">' + file.path + '</h4>';
                html += '<div class="translation-grid">';

                for (var index = 0; index < file.translations.length; index++) {
                    var item = file.translations[index];
                    html += '<div class="translation-item">';
                    html += '<div class="translation-key">' + escapeHtml(item.key) + '</div>';
                    html += '<div class="translation-source">' + escapeHtml(item.source) + '</div>';
                    html += '<input type="text" class="translation-input" data-file="' + fileIndex + '" data-index="' + index + '" value="' + escapeHtml(item.translation) + '">';
                    html += '</div>';
                }

                html += '</div></div>';
            }

            html += '<div class="action-buttons">';
            html += '<button id="downloadZipBtn" class="download-btn">下载翻译后的附加包</button>';
            html += '</div>';
            html += '</div>';

            result.innerHTML = html;

            // 保存 ZIP 结果数据到全局变量
            window.currentZipResult = zipResult;

            // 添加事件委托
            setupEventDelegation();
        }

        // 下载 ZIP 翻译结果
        function downloadZipResult() {
            if (!window.currentZipResult) {
                showNotification('没有可下载的翻译结果', 'error');
                return;
            }

            try {
                // 显示进度条
                loading.style.display = 'block';
                updateProgress(10, '准备打包', '正在收集翻译内容...');

                showNotification('正在重新打包附加包...', 'info');

                updateProgress(30, '收集内容', '正在收集用户编辑的翻译...');

                // 收集用户编辑后的翻译内容
                var updatedFiles = [];
                for (var fileIndex = 0; fileIndex < window.currentZipResult.translatedFiles.length; fileIndex++) {
                    var file = window.currentZipResult.translatedFiles[fileIndex];
                    var updatedContent = '';
                    for (var index = 0; index < file.translations.length; index++) {
                        var item = file.translations[index];
                        var input = document.querySelector('[data-file="' + fileIndex + '"][data-index="' + index + '"]');
                        var translation = input ? input.value : item.translation;
                        updatedContent += item.key + '=' + translation + '\n';
                    }

                    updatedFiles.push({
                        path: file.path,
                        translatedContent: updatedContent
                    });
                }

                updateProgress(50, '重新打包', '正在重新打包附加包...');

                // 调用重新打包 API
                fetch('/api/repack-zip', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        originalFileName: window.currentZipResult.originalFileName,
                        originalFileExtension: window.currentZipResult.originalFileExtension,
                        translatedFiles: updatedFiles,
                        zipData: window.currentZipResult.zipData
                    })
                }).then(function(response) {
                    updateProgress(80, '处理响应', '正在处理服务器响应...');

                    if (response.ok) {
                        updateProgress(95, '准备下载', '正在准备下载文件...');

                        response.blob().then(function(blob) {
                            var url = URL.createObjectURL(blob);
                            var a = document.createElement('a');
                            a.href = url;

                            var contentDisposition = response.headers.get('content-disposition');
                            var filename = 'translated_addon.zip';
                            if (contentDisposition) {
                                var parts = contentDisposition.split('filename=');
                                if (parts.length > 1) {
                                    filename = parts[1].replace(/"/g, '');
                                }
                            }
                            a.download = filename;

                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);

                            updateProgress(100, '下载完成', '翻译后的附加包已下载');
                            showNotification('翻译后的附加包已下载！', 'success');

                            // 延迟隐藏进度条
                            setTimeout(function() {
                                loading.style.display = 'none';
                            }, 2000);
                        });
                    } else {
                        updateProgress(100, '打包失败', '服务器返回错误');
                        response.json().then(function(errorData) {
                            showNotification('重新打包失败: ' + errorData.error, 'error');

                            // 延迟隐藏进度条
                            setTimeout(function() {
                                loading.style.display = 'none';
                            }, 2000);
                        });
                    }
                }).catch(function(error) {
                    updateProgress(100, '下载失败', error.message);
                    console.error('Download ZIP result error:', error);
                    showNotification('下载失败: ' + error.message, 'error');

                    // 延迟隐藏进度条
                    setTimeout(function() {
                        loading.style.display = 'none';
                    }, 2000);
                });
            } catch (error) {
                updateProgress(100, '下载失败', error.message);
                console.error('Download ZIP result error:', error);
                showNotification('下载失败: ' + error.message, 'error');

                // 延迟隐藏进度条
                setTimeout(function() {
                    loading.style.display = 'none';
                }, 2000);
            }
        }

        // HTML 转义函数已在上面定义

        // 进度条控制函数
        function updateProgress(percentage, text, details = '') {
            const progressFill = document.getElementById('progressFill');
            const progressText = document.getElementById('progressText');
            const progressDetails = document.getElementById('progressDetails');

            if (progressFill) progressFill.style.width = percentage + '%';
            if (progressText) progressText.textContent = text;
            if (progressDetails) progressDetails.textContent = details;

            console.log("Progress: " + percentage + "% - " + text + " - " + details);
        }

        // 重置进度条
        function resetProgress() {
            updateProgress(0, '准备中...', '正在初始化...');
        }

        // 显示通知
        function showNotification(message, type) {
            type = type || 'info';
            const notification = document.createElement('div');

            // 设置样式 - 使用单独的属性设置避免字符串拼接问题
            notification.style.position = 'fixed';
            notification.style.top = '20px';
            notification.style.right = '20px';
            notification.style.color = 'white';
            notification.style.padding = '15px 20px';
            notification.style.borderRadius = '10px';
            notification.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            notification.style.zIndex = '1000';
            notification.style.fontWeight = '500';
            notification.style.transform = 'translateX(100%)';
            notification.style.transition = 'transform 0.3s ease';

            // 根据类型设置背景色
            if (type === 'success') {
                notification.style.background = '#10b981';
            } else if (type === 'error') {
                notification.style.background = '#ef4444';
            } else {
                notification.style.background = '#3b82f6';
            }

            notification.textContent = message;

            document.body.appendChild(notification);

            // 动画显示
            setTimeout(function() {
                notification.style.transform = 'translateX(0)';
            }, 100);

            // 3秒后自动消失
            setTimeout(function() {
                notification.style.transform = 'translateX(100%)';
                setTimeout(function() {
                    if (notification.parentNode) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        }
        */

    </script>
</body>
</html>`;
  return htmlContent;
})();

// 进度条和通知功能已移至前端 JavaScript

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

    // 统计访问量（仅统计页面访问，不统计 API 调用）
    if (pathname === '/' && request.method === 'GET') {
      await recordPageVisit(env);
    }

    // API 路由：翻译接口
    if (pathname === '/api/translate' && request.method === 'POST') {
      return handleTranslateAPI(request, env, corsHeaders);
    }

    // API 路由：ZIP 文件翻译接口
    if (pathname === '/api/translate-zip' && request.method === 'POST') {
      return handleTranslateZipAPI(request, env, corsHeaders);
    }

    // API 路由：重新打包 ZIP 文件
    if (pathname === '/api/repack-zip' && request.method === 'POST') {
      return handleRepackZipAPI(request, env, corsHeaders);
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

    // 统计翻译次数
    await recordTranslation(env, 'lang', itemsToTranslate.length);

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

// 处理 ZIP 文件翻译 API
async function handleTranslateZipAPI(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    // 环境变量检查和默认值处理
    const apiUrl = env.API_URL || 'https://api.openai.com/v1/chat/completions';
    const modelName = env.MODEL_NAME || 'gpt-3.5-turbo';
    const apiKey = env.API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({
        error: 'Server configuration error: API_KEY not configured',
        details: 'Please set API_KEY as a Secret in Cloudflare Dashboard'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({
        error: 'No file uploaded'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Processing ZIP file:', file.name, 'Size:', file.size);

    // 读取 ZIP 文件
    const zipBuffer = await file.arrayBuffer();
    const zipData = new Uint8Array(zipBuffer);

    console.log('ZIP data size:', zipData.length);

    // 解析 ZIP 文件并提取 .lang 文件
    const langFiles = await extractLangFilesFromZip(zipData);

    console.log('Extracted lang files count:', langFiles.length);

    if (langFiles.length === 0) {
      // 尝试列出 ZIP 中的所有文件来调试
      try {
        const allFiles = await extractAllFilesFromZip(zipData);
        console.log('All files in ZIP:', allFiles.map(f => f.name));

        return new Response(JSON.stringify({
          error: 'No .lang files found in the uploaded package',
          details: 'Please ensure your addon contains .lang files in texts/ directory',
          debug: {
            totalFiles: allFiles.length,
            fileList: allFiles.map(f => f.name).slice(0, 10) // 只显示前10个文件
          }
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (debugError) {
        console.error('Debug extraction failed:', debugError);
        return new Response(JSON.stringify({
          error: 'No .lang files found in the uploaded package',
          details: 'Please ensure your addon contains .lang files in texts/ directory'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    console.log('Found .lang files:', langFiles.map(f => f.path));

    // 翻译所有 .lang 文件
    const translatedFiles = [];
    for (const langFile of langFiles) {
      const itemsToTranslate = parseLangFile(langFile.content);

      if (itemsToTranslate.length > 0) {
        const textsToTranslate = itemsToTranslate.map(item => item.value);

        // 调用 AI API 翻译
        const aiResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: modelName,
            messages: [{ role: 'user', content: createTranslationPrompt(textsToTranslate) }],
            max_tokens: 2000,
            temperature: 0.3
          }),
        });

        if (!aiResponse.ok) {
          const errorText = await aiResponse.text();
          return new Response(JSON.stringify({
            error: `AI API request failed with status ${aiResponse.status}`,
            details: errorText
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const aiResult = await aiResponse.json() as { choices: Array<{ message: { content: string } }> };

        if (!aiResult.choices || !aiResult.choices[0] || !aiResult.choices[0].message) {
          throw new Error('Invalid AI API response format');
        }

        const translatedTexts = aiResult.choices[0].message.content.split('\n').filter(line => line.trim());

        if (translatedTexts.length !== itemsToTranslate.length) {
          console.warn('Translation count mismatch for', langFile.path);
        }

        // 生成翻译后的 .lang 文件内容
        let translatedContent = '';
        for (let index = 0; index < itemsToTranslate.length; index++) {
          const item = itemsToTranslate[index];
          const translation = translatedTexts[index] || item.value;
          translatedContent += `${item.key}=${translation}\n`;
        }

        // 将原文件路径改为中文路径
        const chinesePath = langFile.path.replace(/\/[^\/]+\.lang$/, '/zh_CN.lang');

        translatedFiles.push({
          path: chinesePath,
          content: translatedContent
        });
      }
    }

    // 准备翻译结果数据，包含原始 ZIP 信息
    const result = {
      originalFileName: file.name,
      originalFileExtension: file.name.split('.').pop()?.toLowerCase() || 'zip',
      translatedFiles: translatedFiles.map(f => ({
        path: f.path,
        originalContent: langFiles.find(lf => lf.path === f.path)?.content || '',
        translatedContent: f.content,
        translations: parseLangFile(f.content).map((item, index) => {
          const originalItem = parseLangFile(langFiles.find(lf => lf.path === f.path)?.content || '')[index];
          return {
            key: item.key,
            source: originalItem?.value || '',
            translation: item.value
          };
        })
      })),
      zipData: Array.from(zipData) // 保存原始 ZIP 数据用于重新打包
    };

    // 统计翻译次数
    const totalTranslations = translatedFiles.reduce((sum, file) => {
      return sum + file.content.split('\n').filter(line => line.includes('=')).length;
    }, 0);
    await recordTranslation(env, 'zip', totalTranslations);

    return new Response(JSON.stringify(result), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('ZIP translation failed:', error);
    return new Response(JSON.stringify({
      error: 'ZIP translation failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

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

// 使用 fflate 从 ZIP 数据中提取 .lang 文件
async function extractLangFilesFromZip(zipData: Uint8Array): Promise<Array<{path: string, content: string}>> {
  const langFiles: Array<{path: string, content: string}> = [];

  console.log('Starting ZIP extraction with fflate, data length:', zipData.length);

  return new Promise((resolve, reject) => {
    try {
      // 使用 fflate 解压 ZIP 文件
      unzip(zipData, (err, unzipped) => {
        if (err) {
          console.error('fflate unzip error:', err);
          reject(new Error('Failed to unzip file: ' + err.message));
          return;
        }

        console.log('Successfully unzipped, found files:', Object.keys(unzipped).length);

        // 遍历所有文件
        for (const [filePath, fileData] of Object.entries(unzipped)) {
          console.log('Processing file:', filePath);

          // 检查是否是 .lang 文件且在 texts 目录下
          if (filePath.toLowerCase().endsWith('.lang') &&
              (filePath.includes('texts/') || filePath.includes('texts\\'))) {

            console.log('Found .lang file:', filePath);

            try {
              // 将 Uint8Array 转换为字符串
              const content = strFromU8(fileData);
              console.log('Successfully extracted content for:', filePath, 'Length:', content.length);

              langFiles.push({
                path: filePath,
                content: content
              });
            } catch (decodeError) {
              console.error('Failed to decode file:', filePath, decodeError);
            }
          }
        }

        console.log('Total .lang files found:', langFiles.length);
        resolve(langFiles);
      });
    } catch (error) {
      console.error('ZIP extraction error:', error);
      reject(error);
    }
  });
}

// 使用 fflate 从 ZIP 数据中提取所有文件
async function extractAllFilesFromZip(zipData: Uint8Array): Promise<Array<{name: string, data: Uint8Array}>> {
  return new Promise((resolve, reject) => {
    try {
      unzip(zipData, (err: any, unzipped: any) => {
        if (err) {
          console.error('fflate unzip error:', err);
          reject(new Error('Failed to unzip file: ' + err.message));
          return;
        }

        const allFiles: Array<{name: string, data: Uint8Array}> = [];

        // 遍历所有文件
        for (const [filePath, fileData] of Object.entries(unzipped)) {
          if (!filePath.endsWith('/')) {
            // 只添加文件，不添加目录
            allFiles.push({
              name: filePath,
              data: fileData as Uint8Array
            });
          }
        }

        console.log('Extracted all files:', allFiles.length);
        resolve(allFiles);
      });
    } catch (error) {
      console.error('ZIP extraction error:', error);
      reject(error);
    }
  });
}

// 旧的 ZIP 处理函数已被 fflate 替代

// 旧的文件提取函数已被 fflate 替代

// 使用 fflate 创建包含翻译文件的新 ZIP，保留原有文件结构
async function createZipWithTranslations(originalZipData: Uint8Array, translatedFiles: Array<{path: string, content: string}>): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    try {
      console.log('Creating ZIP with translations using fflate');

      // 首先解压原始 ZIP 文件
      unzip(originalZipData, (err: any, unzipped: any) => {
        if (err) {
          console.error('Failed to unzip original file:', err);
          reject(new Error('Failed to unzip original file: ' + err.message));
          return;
        }

        console.log('Original ZIP extracted, files:', Object.keys(unzipped).length);

        // 创建翻译文件的映射
        const translationMap = new Map<string, string>();
        for (const file of translatedFiles) {
          translationMap.set(file.path, file.content);
        }

        // 准备新的文件数据
        const newZipData: { [path: string]: Uint8Array } = {};

        // 遍历原始文件，替换翻译文件，保留其他文件
        for (const [filePath, fileData] of Object.entries(unzipped)) {
          if (translationMap.has(filePath)) {
            // 使用翻译后的内容
            console.log('Replacing file with translation:', filePath);
            newZipData[filePath] = strToU8(translationMap.get(filePath)!);
          } else {
            // 保留原始文件
            newZipData[filePath] = fileData as Uint8Array;
          }
        }

        // 添加新的翻译文件（如果原文件中没有对应的文件）
        for (const file of translatedFiles) {
          if (!unzipped[file.path]) {
            console.log('Adding new translation file:', file.path);
            newZipData[file.path] = strToU8(file.content);
          }
        }

        console.log('Preparing to zip', Object.keys(newZipData).length, 'files');

        // 重新打包为 ZIP
        zip(newZipData, (zipErr: any, zipped: Uint8Array) => {
          if (zipErr) {
            console.error('Failed to create ZIP:', zipErr);
            reject(new Error('Failed to create ZIP: ' + zipErr.message));
            return;
          }

          console.log('Successfully created new ZIP, size:', zipped.length);
          resolve(zipped);
        });
      });
    } catch (error) {
      console.error('Error creating ZIP with translations:', error);
      reject(error);
    }
  });
}

// 旧的 ZIP 创建函数已被 fflate 替代

// 处理重新打包 ZIP 文件 API
async function handleRepackZipAPI(request: Request, _env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const requestData = await request.json() as {
      originalFileName: string;
      originalFileExtension: string;
      translatedFiles: Array<{path: string, translatedContent: string}>;
      zipData: number[];
    };
    const { originalFileName, originalFileExtension, translatedFiles, zipData } = requestData;

    if (!zipData || !translatedFiles) {
      return new Response(JSON.stringify({
        error: 'Missing required data for repackaging'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 重建原始 ZIP 数据
    const originalZipData = new Uint8Array(zipData);

    // 准备翻译后的文件，重命名为 zh_CN.lang
    const finalTranslatedFiles = translatedFiles.map((file: any) => ({
      path: file.path.replace(/\/[^\/]+\.lang$/, '/zh_CN.lang'),
      content: file.translatedContent
    }));

    // 重新打包
    const newZipData = await createZipWithTranslations(originalZipData, finalTranslatedFiles);

    // 确定输出文件名和扩展名
    const outputExtension = originalFileExtension || 'zip';
    const outputFileName = `translated_${originalFileName.replace(/\.[^.]+$/, '')}.${outputExtension}`;

    return new Response(newZipData, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${outputFileName}"`
      }
    });

  } catch (error) {
    console.error('Repack ZIP failed:', error);
    return new Response(JSON.stringify({
      error: 'Failed to repack ZIP file',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// 统计相关函数
async function recordPageVisit(_env: Env): Promise<void> {
  try {
    // 调用第三方统计服务
    await fetch('https://count.getloli.com/@访问人数?name=访问人数&theme=minecraft&padding=7&offset=0&align=top&scale=1&pixelated=1&darkmode=auto', {
      method: 'GET',
      headers: {
        'User-Agent': 'BlockTrans/1.0'
      }
    });
    console.log('Page visit recorded');
  } catch (error) {
    console.error('Failed to record page visit:', error);
  }
}

async function recordTranslation(_env: Env, type: 'lang' | 'zip', count: number): Promise<void> {
  try {
    // 简化统计，不再记录翻译次数
    console.log(`Translation recorded: type=${type}, count=${count}`);
  } catch (error) {
    console.error('Failed to record translation:', error);
  }
}


