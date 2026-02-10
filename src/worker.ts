/// <reference types="@cloudflare/workers-types" />

import { unzip, zipSync, strFromU8, strToU8 } from 'fflate';

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
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');
        :root {
            --mc-bg: #7daee8;
            --mc-bg-dark: #4b78b3;
            --mc-dirt: #2a4f7a;
            --mc-dirt-dark: #203c5d;
            --mc-panel: #c6c6c6;
            --mc-panel-shadow: #555;
            --mc-panel-light: #fff;
            --mc-text: #1f1f1f;
            --mc-accent: #2e6db2;
            --mc-accent-dark: #24578d;
            --mc-danger: #a73939;
            --mc-warn: #ad7a1f;
            --pixel-shadow: 4px 4px 0 rgba(0, 0, 0, 0.35);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'VT323', monospace;
            min-height: 100vh;
            color: var(--mc-text);
            background:
                linear-gradient(180deg, rgba(255,255,255,0.08), rgba(0,0,0,0.18)),
                repeating-linear-gradient(
                    90deg,
                    rgba(255,255,255,0.04) 0 2px,
                    rgba(0,0,0,0.04) 2px 4px
                ),
                linear-gradient(180deg, var(--mc-bg) 0 70%, var(--mc-bg-dark) 70% 100%);
        }

        .header, .footer, .container {
            background: var(--mc-panel);
            border: 4px solid #222;
            box-shadow: inset -3px -3px 0 var(--mc-panel-shadow), inset 3px 3px 0 var(--mc-panel-light), var(--pixel-shadow);
        }

        .header {
            padding: 12px 0;
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .header-content, .footer-content, .main-container {
            max-width: 1060px;
            margin: 0 auto;
            padding: 0 16px;
        }

        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
        }

        .logo {
            font-family: 'Press Start 2P', monospace;
            font-size: 18px;
            color: #173a63;
            text-shadow: 2px 2px 0 #b8d5f3;
        }

        .github-link {
            color: #111;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 24px;
            padding: 8px 12px;
            border: 3px solid #111;
            background: #9ed0ff;
            box-shadow: inset -2px -2px 0 #4f8fcb, inset 2px 2px 0 #d9efff;
        }

        .github-link:hover { filter: brightness(0.96); }

        .main-container { padding: 26px 16px 34px; }

        .hero {
            text-align: center;
            margin-bottom: 20px;
            color: #fff;
            text-shadow: 2px 2px 0 rgba(0,0,0,0.45);
        }

        .hero h1 {
            font-family: 'Press Start 2P', monospace;
            line-height: 1.35;
            font-size: clamp(22px, 4vw, 42px);
            margin-bottom: 12px;
        }

        .hero p {
            font-size: clamp(24px, 2vw, 30px);
            margin-bottom: 8px;
        }

        .hero-sub {
            font-size: 22px;
            opacity: 0.92;
        }

        .container {
            padding: 22px;
            margin-bottom: 26px;
        }

        .upload-area {
            border: 4px dashed #1d4372;
            background: linear-gradient(180deg, #a9caee, #96bde8);
            text-align: center;
            padding: 28px 18px;
            cursor: pointer;
        }

        .upload-area:hover, .upload-area.dragover { filter: brightness(0.97); }

        .upload-icon {
            font-size: 44px;
            margin-bottom: 10px;
        }

        .upload-area h3 { font-size: 34px; margin-bottom: 14px; }

        .file-types {
            display: flex;
            justify-content: center;
            gap: 14px;
            flex-wrap: wrap;
            margin: 14px 0 16px;
        }

        .type-card {
            min-width: 170px;
            border: 3px solid #222;
            padding: 10px;
            background: #d6d6d6;
            box-shadow: inset -2px -2px 0 #7a7a7a, inset 2px 2px 0 #fff;
        }

        .type-card-title {
            font-size: 22px;
            font-weight: 700;
            color: #1f4a7a;
        }

        .type-card-sub {
            color: #3d3d3d;
            font-size: 21px;
        }

        .upload-tip { font-size: 24px; margin-bottom: 16px; }

        .alpha-toggle {
            margin: 10px auto 14px;
            padding: 10px 12px;
            max-width: 620px;
            border: 2px solid #1f4a7a;
            background: #dbe9f9;
            text-align: left;
            font-size: 21px;
            line-height: 1.3;
        }

        .alpha-toggle label {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            font-weight: 700;
        }

        .alpha-toggle input[type="checkbox"] {
            width: 18px;
            height: 18px;
            accent-color: #2e6db2;
        }

        .alpha-note {
            margin-top: 6px;
            color: #2b2b2b;
            font-size: 19px;
        }

        button, .file-trigger {
            font-family: 'VT323', monospace;
            font-size: 28px;
            line-height: 1;
            color: #fff;
            padding: 10px 18px 11px;
            border: 3px solid #111;
            background: var(--mc-accent);
            box-shadow: inset -2px -2px 0 var(--mc-accent-dark), inset 2px 2px 0 #79ace4;
            cursor: pointer;
            display: inline-block;
            text-decoration: none;
        }

        button:hover, .file-trigger:hover { filter: brightness(1.03); }
        button:active, .file-trigger:active { transform: translate(1px, 1px); }

        .file-input-native {
            position: absolute;
            width: 1px;
            height: 1px;
            opacity: 0;
            pointer-events: none;
        }

        .result { margin-top: 20px; }
        .result-empty { text-align: center; padding: 28px; color: #3f3f3f; }
        .result-header h3 { font-size: 34px; color: #1f4a7a; margin-bottom: 8px; }
        .result-header p { font-size: 24px; color: #333; margin-bottom: 12px; }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 14px;
            border: 3px solid #202020;
            background: #efefef;
        }

        th, td {
            border: 2px solid #333;
            padding: 10px;
            text-align: left;
            vertical-align: middle;
            font-size: 23px;
        }

        th {
            font-weight: 700;
            color: #fff;
            background: var(--mc-dirt);
        }

        tr:nth-child(even) { background: #e0e0e0; }

        .key-chip {
            display: inline-block;
            padding: 4px 8px;
            border: 2px solid #333;
            background: #d6d6d6;
            font-size: 19px;
            word-break: break-all;
        }

        .editable-input, .translation-input {
            width: 100%;
            border: 3px solid #222;
            padding: 8px;
            font-size: 23px;
            font-family: 'VT323', monospace;
            background: #fff;
            color: #111;
        }

        .editable-input:focus, .translation-input:focus {
            outline: none;
            border-color: #24578d;
        }

        .loading { display: none; text-align: center; margin: 22px 0; color: #1f4a7a; }
        .loading-spinner {
            display: inline-block;
            width: 34px;
            height: 34px;
            border: 4px solid #d0d0d0;
            border-top: 4px solid #24578d;
            animation: spin 0.8s linear infinite;
            margin-bottom: 10px;
        }

        #progressContainer { margin: 16px auto 0; max-width: 560px; }
        #progressBar {
            width: 100%;
            height: 24px;
            border: 3px solid #1b1b1b;
            background: #6a6a6a;
            overflow: hidden;
        }
        #progressFill {
            height: 100%;
            width: 0;
            background: linear-gradient(90deg, #4c8bd1, #2e6db2);
            transition: width 0.25s ease;
        }
        #progressText { font-size: 28px; margin-top: 8px; }
        #progressDetails { font-size: 22px; color: #2f2f2f; }

        .action-buttons {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 14px;
            flex-wrap: wrap;
        }

        .btn-secondary {
            background: #6d6d6d;
            box-shadow: inset -2px -2px 0 #474747, inset 2px 2px 0 #a8a8a8;
        }

        .btn-success {
            background: #2e6db2;
            box-shadow: inset -2px -2px 0 #24578d, inset 2px 2px 0 #6da8e6;
        }

        .reset-btn {
            background: var(--mc-danger);
            box-shadow: inset -2px -2px 0 #7d2a2a, inset 2px 2px 0 #d17171;
            padding: 6px 8px;
            font-size: 20px;
        }

        .zip-results > h3 { font-size: 34px; color: #1f4a7a; }
        .zip-intro { color: #2f2f2f; margin-bottom: 14px; font-size: 24px; }
        .file-section {
            margin-bottom: 16px;
            border: 3px solid #262626;
            background: #dddddd;
            padding: 12px;
        }
        .file-section h4 {
            color: #1f4a7a;
            margin-bottom: 10px;
            font-size: 25px;
            word-break: break-all;
        }
        .translation-item {
            display: grid;
            grid-template-columns: 1fr 1fr 1.2fr;
            gap: 8px;
            align-items: center;
            margin-bottom: 8px;
        }
        .translation-key, .translation-source {
            border: 2px solid #333;
            background: #f0f0f0;
            padding: 6px 8px;
            min-height: 42px;
            display: flex;
            align-items: center;
            word-break: break-all;
            font-size: 22px;
        }

        .error-box {
            border: 3px solid #4d1111;
            background: #f3d3d3;
            padding: 12px;
            color: #2d1010;
        }
        .error-box h3 { color: #6f1010; margin-bottom: 8px; font-size: 32px; }
        .error-hint {
            margin-top: 10px;
            border-left: 4px solid #ad7a1f;
            background: #fff3da;
            padding: 10px;
        }
        .error-hint h4 { margin-bottom: 4px; font-size: 24px; }

        .footer {
            margin-top: 30px;
            padding: 20px 0;
            border-top: 4px solid #222;
        }

        .footer h3 { color: #1f4a7a; margin-bottom: 10px; font-size: 36px; }
        .footer p { font-size: 24px; line-height: 1.35; }
        .feature-box {
            margin: 16px 0;
            padding: 14px;
            border: 3px solid #222;
            background: #e6e6e6;
            text-align: left;
        }
        .feature-box h4 { color: #1f4a7a; margin-bottom: 8px; font-size: 28px; }
        .feature-box ul { margin-left: 18px; }
        .feature-box li { font-size: 22px; margin-bottom: 4px; }

        .footer-links {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin: 12px 0;
            flex-wrap: wrap;
        }

        .footer-links a {
            color: #102c0b;
            text-decoration: none;
            font-size: 24px;
            padding: 8px 10px;
            border: 2px solid #1f4a7a;
            background: #b8dba5;
        }

        .footer-info { color: #2a2a2a; margin-top: 10px; }
        #statsDisplay {
            margin: 12px auto;
            padding: 10px;
            border: 3px solid #222;
            background: #d7d7d7;
            text-align: center;
            max-width: 520px;
            font-size: 22px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
            .header-content { flex-direction: column; }
            .logo { font-size: 16px; line-height: 1.5; text-align: center; }
            .container { padding: 14px; }
            .upload-area { padding: 20px 10px; }
            .translation-item { grid-template-columns: 1fr; }
            th, td, .editable-input, .translation-input { font-size: 20px; }
            .footer-links { flex-direction: column; align-items: stretch; }
            .action-buttons { flex-direction: column; align-items: stretch; }
            button, .file-trigger { width: 100%; text-align: center; }
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="header-content">
            <div class="logo">
                BlockTrans
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
            <h1>BlockTrans</h1>
            <p>AI 驱动的 Minecraft 附加包翻译工具</p>
            <p class="hero-sub">支持 .lang 文件和 .zip/.mcaddon/.mcpack 附加包</p>
        </div>

        <div class="container">

            <div class="upload-area" id="uploadArea">
                <div class="upload-icon">BT</div>
                <h3>上传文件进行翻译</h3>
                <div class="file-types">
                        <div class="type-card">
                            <div style="font-size: 2rem;">LANG</div>
                            <div class="type-card-title">.lang 文件</div>
                            <div class="type-card-sub">单个语言文件</div>
                        </div>
                        <div class="type-card">
                            <div style="font-size: 2rem;">ZIP</div>
                            <div class="type-card-title">附加包</div>
                            <div class="type-card-sub">.zip/.mcaddon/.mcpack</div>
                        </div>
                </div>
                <p class="upload-tip">拖拽文件到这里，或点击按钮选择文件</p>
                <div class="alpha-toggle">
                    <label>
                        <input type="checkbox" id="alphaHardcodedToggle">
                        启用 Alpha：翻译 JSON 中 display_name 硬编码文本
                    </label>
                    <div class="alpha-note">仅识别严格白名单字段（如 minecraft:display_name.value），用于测试。</div>
                </div>
                <input type="file" id="fileInput" class="file-input-native" accept=".lang,.txt,.zip,.mcaddon,.mcpack">
                <label id="selectFileBtn" class="file-trigger" for="fileInput">选择文件</label>
            </div>

            <div class="loading" id="loading">
                <div class="loading-spinner"></div>
                <div id="progressContainer">
                    <div id="progressBar">
                        <div id="progressFill"></div>
                    </div>
                    <div id="progressText">准备中...</div>
                    <div id="progressDetails">正在初始化...</div>
                </div>
            </div>

            <div class="result" id="result"></div>
        </div>
    </div>

    <footer class="footer">
        <div class="footer-content">
            <h3>关于 BlockTrans</h3>
            <p>上传 .lang 或 .zip/.mcaddon/.mcpack，自动翻译并导出中文结果。</p>

            <div class="footer-links">
                <a href="https://github.com/XingQiu2307/BlockTrans" target="_blank">GitHub 仓库</a>
                <a href="https://github.com/XingQiu2307/BlockTrans/issues" target="_blank">报告问题</a>
            </div>

            <div class="footer-info">
                <p>本项目采用 GPL-3.0 开源协议 | © 2025 BlockTrans</p>
            </div>
        </div>
    </footer>

    <script>
        console.log('Script starting...');

        // 获取DOM元素
        var uploadArea = document.getElementById('uploadArea');
        var fileInput = document.getElementById('fileInput');
        var alphaHardcodedToggle = document.getElementById('alphaHardcodedToggle');
        var loading = document.getElementById('loading');
        var result = document.getElementById('result');

        console.log('Elements found:', uploadArea, fileInput, loading, result);

        window.addEventListener('error', function(e) {
            console.error('Runtime error:', e.error || e.message);
            if (result) {
                result.innerHTML = '<div class="error-box"><h3>页面脚本错误</h3><p>' + escapeHtml(String(e.message || '未知错误')) + '</p></div>';
            }
            if (loading) loading.style.display = 'none';
        });

        window.addEventListener('unhandledrejection', function(e) {
            const message = e && e.reason ? (e.reason.message || String(e.reason)) : '未知错误';
            console.error('Unhandled rejection:', e.reason);
            if (result) {
                result.innerHTML = '<div class="error-box"><h3>请求处理失败</h3><p>' + escapeHtml(message) + '</p></div>';
            }
            if (loading) loading.style.display = 'none';
        });

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
            uploadArea.addEventListener('click', function(e) {
                // 点击原生触发器时，交给 label 的 for 机制处理，避免重复触发
                if (e.target && (e.target.id === 'selectFileBtn' || (e.target.closest && e.target.closest('.alpha-toggle')))) return;
                openFileDialog();
            });
            console.log('Click event bound to uploadArea');
        } else {
            console.error('uploadArea not found');
        }

        // 选择文件按钮使用 label for=fileInput 原生行为，不再绑定 JS 点击事件

        // 文件选择
        if (fileInput) {
            fileInput.addEventListener('change', async function(e) {
                console.log('File input changed');
                var target = e.target;
                var selectedFile = target && target.files && target.files.length > 0 ? target.files[0] : null;

                if (!selectedFile) {
                    console.log('No files selected');
                    return;
                }

                console.log('File selected:', selectedFile.name);
                try {
                    await handleFile(selectedFile);
                } catch (err) {
                    console.error('handleFile failed:', err);
                    showNotification('处理文件失败: ' + (err && err.message ? err.message : '未知错误'), 'error');
                } finally {
                    // 允许重复选择同一个文件也能触发 change
                    target.value = '';
                }
            });
            console.log('Change event bound to fileInput');
        } else {
            console.error('fileInput element not found for change event');
        }

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
                showNotification('不支持的文件格式。请选择 .lang、.zip、.mcaddon 或 .mcpack 文件', 'error');
                return;
            }
        }

        // 处理 ZIP 文件
        async function handleZipFile(file) {
            try {
                const hardcodedAlphaEnabled = !!(alphaHardcodedToggle && alphaHardcodedToggle.checked);
                showNotification('正在解析附加包...', 'info');

                const arrayBuffer = await file.arrayBuffer();
                const formData = new FormData();
                formData.append('file', new Blob([arrayBuffer]), file.name);
                formData.append('enableHardcodedAlpha', hardcodedAlphaEnabled ? 'true' : 'false');

                await translateContent(formData, 'zip');
            } catch (error) {
                console.error('ZIP file processing error:', error);
                showNotification('ZIP 文件处理失败: ' + error.message, 'error');
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
                        if (errorData.code) {
                            errorMessage = errorMessage + ' [' + errorData.code + ']';
                        }
                        if (errorData.upstream && errorData.upstream.body) {
                            var upstreamBody = String(errorData.upstream.body);
                            if (upstreamBody.length > 400) {
                                upstreamBody = upstreamBody.slice(0, 400) + '...';
                            }
                            errorDetails = (errorDetails ? errorDetails + '\\n' : '') + '上游响应: ' + upstreamBody;
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
            var html = '<div class="error-box">';
            html += '<h3>翻译失败</h3>';
            html += '<p><strong>错误信息:</strong> ' + errorMessage + '</p>';

            if (statusCode) {
                html += '<p><strong>状态码:</strong> ' + statusCode + '</p>';
            }

            if (errorDetails) {
                html += '<p><strong>详细信息:</strong> ' + errorDetails + '</p>';
            }

            // 根据错误类型提供解决建议
            html += '<div class="error-hint">';
            html += '<h4>可能的解决方案:</h4>';

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
            html += '<button id="retryBtn" style="margin-top: 10px;">重新尝试</button>';
            html += '</div>';

            result.innerHTML = html;
        }

        // 显示结果
        function displayResults(translations) {
            console.log('displayResults called with', translations.length, 'translations');

            if (translations.length === 0) {
                result.innerHTML = '<div class="result-empty"><h3>没有找到需要翻译的内容</h3><p>请检查文件格式是否正确</p></div>';
                return;
            }

            let html = '<div class="result-header">';
            html += '<h3>翻译完成 (' + translations.length + ' 条)</h3>';
            html += '<p>您可以直接编辑译文，然后下载修改后的文件</p>';
            html += '</div>';

            html += '<div style="overflow-x: auto;">';
            html += '<table>';
            html += '<tr><th style="width: 25%;">键名</th><th style="width: 35%;">原文</th><th style="width: 35%;">译文</th><th style="width: 5%;">操作</th></tr>';

            translations.forEach((item, index) => {
                html += '<tr data-index="' + index + '">' +
                    '<td><code class="key-chip">' + escapeHtml(item.key) + '</code></td>' +
                    '<td>' + escapeHtml(item.source) + '</td>' +
                    '<td><input type="text" class="editable-input" value="' + escapeHtml(item.translation) + '" data-key="' + escapeHtml(item.key) + '"></td>' +
                    '<td><button class="reset-btn" data-index="' + index + '" title="重置为原始翻译">重置</button></td>' +
                '</tr>';
            });

            html += '</table>';
            html += '</div>';

            html += '<div class="action-buttons">';
            html += '<button id="downloadBtn" class="btn-success">下载翻译文件</button>';
            html += '<button id="previewBtn" class="btn-secondary">预览内容</button>';
            html += '<button id="copyBtn" class="btn-secondary">复制到剪贴板</button>';
            html += '<button id="resetAllBtn">重置所有翻译</button>';
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
            } else if (e.target.classList.contains('hardcoded-translation-input')) {
                markHardcodedAsModified(e.target);
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
            input.style.borderColor = '#ad7a1f';
            input.style.backgroundColor = '#fff3da';

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

        function markHardcodedAsModified(input) {
            input.style.borderColor = '#ad7a1f';
            input.style.backgroundColor = '#fff3da';

            if (!window.currentZipResult || !window.currentZipResult.hardcodedItems) {
                return;
            }
            var index = parseInt(input.getAttribute('data-hardcoded-index'));
            if (!isNaN(index) && window.currentZipResult.hardcodedItems[index]) {
                window.currentZipResult.hardcodedItems[index].translation = input.value;
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
                    input.style.borderColor = '#222';
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
                content += item.key + '=' + item.translation + '\\n';
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

            a.download = 'zh_CN.lang';
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
            html += '<p class="zip-intro">请检查并编辑翻译结果，确认后将重新打包为附加包</p>';
            if (zipResult.hardcodedSummary && zipResult.hardcodedSummary.enabled) {
                html += '<p class="zip-intro">Alpha 硬编码翻译：扫描 ' + zipResult.hardcodedSummary.scannedFiles +
                    ' 个 JSON，命中 ' + zipResult.hardcodedSummary.matchedFields +
                    ' 项，修改 ' + zipResult.hardcodedSummary.changedFiles + ' 个文件。</p>';
            }

            // 为每个翻译文件创建编辑区域
            for (var fileIndex = 0; fileIndex < zipResult.translatedFiles.length; fileIndex++) {
                var file = zipResult.translatedFiles[fileIndex];
                html += '<div class="file-section">';
                html += '<h4>' + file.path + '</h4>';
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

            if (zipResult.hardcodedItems && zipResult.hardcodedItems.length > 0) {
                html += '<div class="file-section">';
                html += '<h4>Alpha 硬编码翻译项（可编辑）</h4>';
                html += '<div class="translation-grid">';

                for (var hardcodedIndex = 0; hardcodedIndex < zipResult.hardcodedItems.length; hardcodedIndex++) {
                    var hardcodedItem = zipResult.hardcodedItems[hardcodedIndex];
                    var pointerText = '';
                    if (Array.isArray(hardcodedItem.pointer)) {
                        pointerText = hardcodedItem.pointer.map(function(seg) { return String(seg); }).join('.');
                    }
                    var hardcodedLabel = hardcodedItem.filePath + (pointerText ? ' :: ' + pointerText : '');

                    html += '<div class="translation-item">';
                    html += '<div class="translation-key">' + escapeHtml(hardcodedLabel) + '</div>';
                    html += '<div class="translation-source">' + escapeHtml(hardcodedItem.source || '') + '</div>';
                    html += '<input type="text" class="translation-input hardcoded-translation-input" data-hardcoded-index="' + hardcodedIndex + '" value="' + escapeHtml(hardcodedItem.translation || '') + '">';
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
                        updatedContent += item.key + '=' + translation + '\\n';
                    }

                    updatedFiles.push({
                        path: file.path,
                        translatedContent: updatedContent
                    });
                }

                var updatedHardcodedItems = [];
                if (window.currentZipResult.hardcodedItems && window.currentZipResult.hardcodedItems.length > 0) {
                    for (var hardcodedIndex = 0; hardcodedIndex < window.currentZipResult.hardcodedItems.length; hardcodedIndex++) {
                        var hardcodedItem = window.currentZipResult.hardcodedItems[hardcodedIndex];
                        var hardcodedInput = document.querySelector('[data-hardcoded-index="' + hardcodedIndex + '"]');
                        var hardcodedTranslation = hardcodedInput ? hardcodedInput.value : hardcodedItem.translation;
                        updatedHardcodedItems.push({
                            filePath: hardcodedItem.filePath,
                            pointer: hardcodedItem.pointer,
                            source: hardcodedItem.source,
                            translation: hardcodedTranslation
                        });
                    }
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
                        hardcodedItems: updatedHardcodedItems,
                        zipData: window.currentZipResult.zipData,
                        hardcodedPatches: window.currentZipResult.hardcodedPatches || []
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
        error: '服务配置错误',
        message: 'API_KEY 未配置，无法调用翻译服务',
        code: 'CONFIG_API_KEY_MISSING',
        details: '请在 Cloudflare Workers 的变量设置中添加 API_KEY（Secret 类型）',
        hint: 'Workers & Pages → 你的 Worker → Settings → Variables and Secrets'
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
        error: '上游翻译服务调用失败',
        message: errorMessage,
        code: 'UPSTREAM_API_ERROR',
        statusCode: aiResponse.status,
        details: suggestions || '请检查 API 配置和网络连接',
        upstream: {
          status: aiResponse.status,
          body: errorText || ''
        }
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

    const translatedTexts = await backfillMissingTranslations(
      textsToTranslate,
      parseTranslatedTexts(aiResult.choices[0].message.content, itemsToTranslate.length),
      apiUrl,
      modelName,
      apiKey
    );

    const translations = itemsToTranslate.map((item, index) => ({
      key: item.key,
      source: item.value,
      translation: ensureLeadingFormatPrefix(item.value, translatedTexts[index] || item.value),
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
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    const isNetworkError = /network|connection|fetch|timeout|tls|socket/i.test(errorMessage);
    return new Response(JSON.stringify({
      error: isNetworkError ? '上游网络连接失败' : '翻译处理失败',
      message: errorMessage,
      code: isNetworkError ? 'UPSTREAM_NETWORK_ERROR' : 'TRANSLATE_INTERNAL_ERROR',
      details: isNetworkError
        ? 'Worker 与上游 API 的网络连接中断。请检查 API_URL 连通性、TLS 证书、代理或稍后重试。'
        : '请检查环境变量、模型配置和上游 API 可用性',
      hint: isNetworkError
        ? '建议先用同一 API_URL 做连通性测试，确认服务端未拦截 Cloudflare 出口。'
        : '重点检查 API_KEY / API_URL / MODEL_NAME'
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
        error: '服务配置错误',
        message: 'API_KEY 未配置，无法调用翻译服务',
        code: 'CONFIG_API_KEY_MISSING',
        details: '请在 Cloudflare Workers 的变量设置中添加 API_KEY（Secret 类型）',
        hint: 'Workers & Pages → 你的 Worker → Settings → Variables and Secrets'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const enableHardcodedAlpha = String(formData.get('enableHardcodedAlpha') || 'false') === 'true';

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

    if (langFiles.length === 0 && !enableHardcodedAlpha) {
      // 尝试列出 ZIP 中的所有文件来调试
      try {
        const allFiles = await extractAllFilesFromZip(zipData);
        console.log('All files in ZIP:', allFiles.map(f => f.name));

        return new Response(JSON.stringify({
          error: 'No .lang files found in the uploaded package',
          details: 'Please ensure your addon contains .lang files in text(s) directory, usually under a path containing res',
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
          details: 'Please ensure your addon contains .lang files in text(s) directory, usually under a path containing res'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }
    if (langFiles.length === 0 && enableHardcodedAlpha) {
      console.log('No .lang files found, continue with alpha hardcoded translation only');
    }

    console.log('Found .lang files:', langFiles.map(f => f.path));

    // 每个语言目录只选择一个源 .lang，避免多个语言文件都写成 zh_CN.lang 互相覆盖
    const selectedLangFiles = selectSourceLangFiles(langFiles);
    console.log('Selected source .lang files:', selectedLangFiles.map(f => f.path));

    // 翻译选中的 .lang 文件
    const translatedFiles: Array<{sourcePath: string, path: string, content: string}> = [];
    const sourceByChinesePath = new Map<string, {path: string, content: string}>();
    for (const langFile of selectedLangFiles) {
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
            error: '上游翻译服务调用失败',
            message: `AI API 返回状态码 ${aiResponse.status}`,
            code: 'UPSTREAM_API_ERROR',
            details: '请检查 API_KEY、API_URL、MODEL_NAME 或稍后重试',
            upstream: {
              status: aiResponse.status,
              body: errorText || ''
            }
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const aiResult = await aiResponse.json() as { choices: Array<{ message: { content: string } }> };

        if (!aiResult.choices || !aiResult.choices[0] || !aiResult.choices[0].message) {
          throw new Error('Invalid AI API response format');
        }

        const translatedTexts = await backfillMissingTranslations(
          textsToTranslate,
          parseTranslatedTexts(aiResult.choices[0].message.content, itemsToTranslate.length),
          apiUrl,
          modelName,
          apiKey
        );

        if (translatedTexts.length !== itemsToTranslate.length) {
          console.warn('Translation count mismatch for', langFile.path);
        }

        // 生成翻译后的 .lang 文件内容
        let translatedContent = '';
        for (let index = 0; index < itemsToTranslate.length; index++) {
          const item = itemsToTranslate[index];
          const translation = ensureLeadingFormatPrefix(item.value, translatedTexts[index] || item.value);
          translatedContent += `${item.key}=${translation}\n`;
        }

        // 将原文件路径改为中文路径
        const chinesePath = toZhCnLangPath(langFile.path);

        translatedFiles.push({
          sourcePath: langFile.path,
          path: chinesePath,
          content: translatedContent
        });
        sourceByChinesePath.set(chinesePath, { path: langFile.path, content: langFile.content });
      }
    }

    // Alpha：翻译 JSON 中严格白名单硬编码字段（默认关闭）
    let hardcodedPatches: Array<{path: string, content: string}> = [];
    let hardcodedItems: Array<{filePath: string, pointer: Array<string | number>, source: string, translation: string}> = [];
    let hardcodedSummary = {
      enabled: enableHardcodedAlpha,
      scannedFiles: 0,
      matchedFields: 0,
      changedFiles: 0
    };
    if (enableHardcodedAlpha) {
      try {
        const hardcodedResult = await translateHardcodedJsonFieldsInZip(zipData, apiUrl, modelName, apiKey);
        hardcodedPatches = hardcodedResult.patches;
        hardcodedItems = hardcodedResult.items;
        hardcodedSummary = {
          enabled: true,
          scannedFiles: hardcodedResult.scannedFiles,
          matchedFields: hardcodedResult.matchedFields,
          changedFiles: hardcodedResult.changedFiles
        };
      } catch (hardcodedError) {
        console.warn('Hardcoded alpha translation failed:', hardcodedError);
      }
    }

    // 准备翻译结果数据，包含原始 ZIP 信息
    const result = {
      originalFileName: file.name,
      originalFileExtension: file.name.split('.').pop()?.toLowerCase() || 'zip',
      translatedFiles: translatedFiles.map(f => ({
        sourcePath: sourceByChinesePath.get(f.path)?.path || '',
        path: f.path,
        originalContent: sourceByChinesePath.get(f.path)?.content || '',
        translatedContent: f.content,
        translations: parseLangFile(f.content).map((item, index) => {
          const originalItem = parseLangFile(sourceByChinesePath.get(f.path)?.content || '')[index];
          return {
            key: item.key,
            source: originalItem?.value || '',
            translation: item.value
          };
        })
      })),
      hardcodedPatches,
      hardcodedItems,
      hardcodedSummary,
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
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    const isNetworkError = /network|connection|fetch|timeout|tls|socket/i.test(errorMessage);
    return new Response(JSON.stringify({
      error: isNetworkError ? '上游网络连接失败' : '压缩包翻译失败',
      message: errorMessage,
      code: isNetworkError ? 'UPSTREAM_NETWORK_ERROR' : 'ZIP_TRANSLATE_INTERNAL_ERROR',
      details: isNetworkError
        ? 'Worker 与上游 API 的网络连接中断。请检查 API_URL 连通性、TLS 证书、代理或稍后重试。'
        : '请检查压缩包内容、语言文件路径及 API 配置'
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
Important: preserve all leading formatting/control prefixes in each line exactly as-is.
Do NOT delete or alter prefixes such as section symbols and segment markers, e.g. §5, §d, §7, §l, §r, or similar marker+hex/style codes.
Keep placeholders/tokens unchanged (such as %s, %1$s, {0}, \\n).
Return only translated lines.
You must keep EXACTLY the same number of output lines as input lines.
Do not merge lines, do not split lines, do not add numbering/bullets, do not add explanations.

Original Texts:
---
${texts.join('\n')}
---

Translations:`;
  return prompt;
}

function parseTranslatedTexts(rawText: string, expectedCount: number): string[] {
  const normalized = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalized.split('\n');

  while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }

  if (lines.length === expectedCount) {
    return lines.map(line => line.trim());
  }

  const deNumbered = lines.map(line => line.replace(/^\s*\d+[\).\s-]+/, '').trim());
  if (deNumbered.length === expectedCount) {
    return deNumbered;
  }

  if (deNumbered.length > expectedCount) {
    return deNumbered.slice(0, expectedCount);
  }

  return [
    ...deNumbered,
    ...new Array(expectedCount - deNumbered.length).fill('')
  ];
}

function extractLeadingFormatPrefix(text: string): string {
  // Preserve leading Minecraft-like formatting codes such as §5, §d, §7, §l, §r and §x§R§R§G§G§B§B.
  const match = text.match(/^((?:(?:§|¶)[0-9A-FK-ORa-fk-or]|(?:§|¶)x(?:(?:§|¶)[0-9A-Fa-f]){6})+)/);
  return match ? match[1] : '';
}

function ensureLeadingFormatPrefix(source: string, translated: string): string {
  const prefix = extractLeadingFormatPrefix(source);
  if (!prefix) {
    return translated;
  }
  if (translated.startsWith(prefix)) {
    return translated;
  }
  return prefix + translated;
}

function hasCjk(text: string): boolean {
  return /[\u3400-\u9FFF\uF900-\uFAFF]/.test(text);
}

function isLikelyUntranslated(source: string, translated: string): boolean {
  const s = source.trim();
  const t = translated.trim();
  if (!t) return true;
  if (t === s) {
    return /[A-Za-z]/.test(s) && !hasCjk(s);
  }
  return false;
}

async function backfillMissingTranslations(
  sources: string[],
  translated: string[],
  apiUrl: string,
  modelName: string,
  apiKey: string
): Promise<string[]> {
  const fixed = [...translated];
  const missingIndexes: number[] = [];
  for (let i = 0; i < sources.length; i++) {
    if (isLikelyUntranslated(sources[i], fixed[i] || '')) {
      missingIndexes.push(i);
    }
  }

  if (missingIndexes.length === 0) {
    return fixed;
  }

  try {
    const missingTexts = missingIndexes.map(i => sources[i]);
    const retryResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: 'user', content: createTranslationPrompt(missingTexts) }],
        max_tokens: 2000,
        temperature: 0.2
      }),
    });

    if (!retryResponse.ok) {
      return fixed;
    }

    const retryResult = await retryResponse.json() as { choices: Array<{ message: { content: string } }> };
    if (!retryResult.choices || !retryResult.choices[0] || !retryResult.choices[0].message) {
      return fixed;
    }

    const retried = parseTranslatedTexts(retryResult.choices[0].message.content, missingIndexes.length);
    for (let j = 0; j < missingIndexes.length; j++) {
      const idx = missingIndexes[j];
      const candidate = retried[j] || '';
      if (!isLikelyUntranslated(sources[idx], candidate)) {
        fixed[idx] = candidate;
      }
    }
  } catch (_e) {
    // Keep original partial translations on retry failure.
  }

  return fixed;
}

function isPotentialAddonLangPath(filePath: string): boolean {
  const lowerPath = filePath.toLowerCase();
  if (!lowerPath.endsWith('.lang')) {
    return false;
  }

  const normalizedPath = lowerPath.replace(/\\/g, '/');
  const inTextDir =
    normalizedPath.includes('/text/') ||
    normalizedPath.includes('/texts/') ||
    normalizedPath.startsWith('text/') ||
    normalizedPath.startsWith('texts/');
  if (!inTextDir) {
    return false;
  }

  return true;
}

function toZhCnLangPath(filePath: string): string {
  return filePath.replace(/[^\\/]+\.lang$/i, 'zh_CN.lang');
}

function selectSourceLangFiles(files: Array<{path: string, content: string}>): Array<{path: string, content: string}> {
  const byDir = new Map<string, Array<{path: string, content: string}>>();

  for (const file of files) {
    const normalizedPath = file.path.replace(/\\/g, '/');
    const dir = normalizedPath.includes('/') ? normalizedPath.slice(0, normalizedPath.lastIndexOf('/')) : '';
    if (!byDir.has(dir)) {
      byDir.set(dir, []);
    }
    byDir.get(dir)!.push(file);
  }

  const selected: Array<{path: string, content: string}> = [];
  for (const candidates of byDir.values()) {
    if (candidates.length === 1) {
      selected.push(candidates[0]);
      continue;
    }

    const ranked = [...candidates].sort((a, b) => scoreLangFile(b.path) - scoreLangFile(a.path));
    selected.push(ranked[0]);
  }

  return selected;
}

function scoreLangFile(filePath: string): number {
  const normalizedPath = filePath.replace(/\\/g, '/').toLowerCase();
  const fileName = normalizedPath.split('/').pop() || '';
  const code = fileName.replace(/\.lang$/, '');

  if (code === 'zh_cn') return -1000;
  if (code === 'en_us') return 1000;
  if (code === 'en_gb') return 900;
  if (code === 'zh_tw') return 850;
  if (code === 'zh_hk') return 840;

  // 其他任意语言代码都支持，如 af、de_de、fr_fr
  if (/^[a-z]{2}(_[a-z]{2})?$/.test(code)) return 700;

  return 100;
}

interface HardcodedCandidate {
  filePath: string;
  pointer: Array<string | number>;
  source: string;
}

interface HardcodedEditableItem {
  filePath: string;
  pointer: Array<string | number>;
  source: string;
  translation: string;
}

interface HardcodedTranslationResult {
  patches: Array<{path: string, content: string}>;
  items: HardcodedEditableItem[];
  scannedFiles: number;
  matchedFields: number;
  changedFiles: number;
}

function isHardcodedDisplayNameKey(key: string): boolean {
  return key === 'minecraft:display_name' || key === 'display_name';
}

function isHardcodedTranslatableText(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length < 2 || trimmed.length > 160) {
    return false;
  }

  // Must look like human-readable text.
  if (!/[A-Za-z\u3400-\u9FFF]/.test(trimmed)) {
    return false;
  }

  // Avoid namespace/id/path-like values.
  if (/^[a-z0-9_.:-]+$/i.test(trimmed)) {
    return false;
  }
  if (trimmed.includes('/') || trimmed.includes('\\')) {
    return false;
  }
  if (/\.json$/i.test(trimmed)) {
    return false;
  }

  return true;
}

function collectHardcodedCandidates(
  node: unknown,
  filePath: string,
  pointer: Array<string | number>,
  output: HardcodedCandidate[]
): void {
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      collectHardcodedCandidates(node[i], filePath, [...pointer, i], output);
    }
    return;
  }

  if (!node || typeof node !== 'object') {
    return;
  }

  const record = node as Record<string, unknown>;
  for (const [key, value] of Object.entries(record)) {
    if (isHardcodedDisplayNameKey(key)) {
      if (typeof value === 'string' && isHardcodedTranslatableText(value)) {
        output.push({
          filePath,
          pointer: [...pointer, key],
          source: value
        });
      } else if (value && typeof value === 'object' && !Array.isArray(value)) {
        const valueObj = value as Record<string, unknown>;
        if (typeof valueObj.value === 'string' && isHardcodedTranslatableText(valueObj.value)) {
          output.push({
            filePath,
            pointer: [...pointer, key, 'value'],
            source: valueObj.value
          });
        }
      }
    }

    collectHardcodedCandidates(value, filePath, [...pointer, key], output);
  }
}

function getValueAtPath(root: unknown, pointer: Array<string | number>): unknown {
  let current: any = root;
  for (const segment of pointer) {
    if (current == null) {
      return undefined;
    }
    current = current[segment as any];
  }
  return current;
}

function setValueAtPath(root: unknown, pointer: Array<string | number>, value: string): void {
  let current: any = root;
  for (let i = 0; i < pointer.length - 1; i++) {
    const segment = pointer[i];
    if (current == null) {
      return;
    }
    current = current[segment as any];
  }
  const last = pointer[pointer.length - 1];
  if (current != null) {
    current[last as any] = value;
  }
}

async function translateTextsInBatches(
  texts: string[],
  apiUrl: string,
  modelName: string,
  apiKey: string
): Promise<string[]> {
  if (texts.length === 0) {
    return [];
  }

  const batchSize = 60;
  const output: string[] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const aiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: 'user', content: createTranslationPrompt(batch) }],
        max_tokens: 2000,
        temperature: 0.2
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      throw new Error(`Alpha hardcoded translation failed (${aiResponse.status}): ${errorText}`);
    }

    const aiResult = await aiResponse.json() as { choices: Array<{ message: { content: string } }> };
    if (!aiResult.choices || !aiResult.choices[0] || !aiResult.choices[0].message) {
      throw new Error('Invalid AI response format in alpha hardcoded translation');
    }

    const parsed = parseTranslatedTexts(aiResult.choices[0].message.content, batch.length);
    const backfilled = await backfillMissingTranslations(batch, parsed, apiUrl, modelName, apiKey);
    output.push(...backfilled.map((line, idx) => ensureLeadingFormatPrefix(batch[idx], line || batch[idx])));
  }

  return output;
}

async function translateHardcodedJsonFieldsInZip(
  zipData: Uint8Array,
  apiUrl: string,
  modelName: string,
  apiKey: string
): Promise<HardcodedTranslationResult> {
  return new Promise((resolve, reject) => {
    unzip(zipData, (err, unzipped) => {
      if (err) {
        reject(new Error('Failed to unzip file for hardcoded translation: ' + err.message));
        return;
      }

      (async () => {
        let scannedFiles = 0;
        const candidates: HardcodedCandidate[] = [];
        const parsedJsonMap = new Map<string, unknown>();

        for (const [filePath, fileData] of Object.entries(unzipped)) {
          if (filePath.endsWith('/') || !filePath.toLowerCase().endsWith('.json')) {
            continue;
          }

          scannedFiles++;
          try {
            const content = strFromU8(fileData as Uint8Array);
            const json = JSON.parse(content);
            const before = candidates.length;
            collectHardcodedCandidates(json, filePath, [], candidates);
            if (candidates.length > before) {
              parsedJsonMap.set(filePath, json);
            }
          } catch {
            // Ignore non-standard JSON files in alpha mode.
          }
        }

        if (candidates.length === 0) {
          resolve({
            patches: [],
            items: [],
            scannedFiles,
            matchedFields: 0,
            changedFiles: 0
          });
          return;
        }

        const uniqueSources = Array.from(new Set(candidates.map(c => c.source)));
        const translatedUnique = await translateTextsInBatches(uniqueSources, apiUrl, modelName, apiKey);
        const translatedMap = new Map<string, string>();
        for (let i = 0; i < uniqueSources.length; i++) {
          translatedMap.set(uniqueSources[i], translatedUnique[i] || uniqueSources[i]);
        }

        const changedFiles = new Set<string>();
        const items: HardcodedEditableItem[] = [];
        for (const candidate of candidates) {
          const root = parsedJsonMap.get(candidate.filePath);
          if (!root) {
            continue;
          }

          const current = getValueAtPath(root, candidate.pointer);
          if (typeof current !== 'string') {
            continue;
          }

          const translated = translatedMap.get(candidate.source) || candidate.source;
          const finalValue = ensureLeadingFormatPrefix(candidate.source, translated);
          items.push({
            filePath: candidate.filePath,
            pointer: candidate.pointer,
            source: candidate.source,
            translation: finalValue
          });
          if (isLikelyUntranslated(candidate.source, finalValue)) {
            continue;
          }

          if (finalValue !== current) {
            setValueAtPath(root, candidate.pointer, finalValue);
            changedFiles.add(candidate.filePath);
          }
        }

        const patches: Array<{path: string, content: string}> = [];
        for (const filePath of changedFiles) {
          const root = parsedJsonMap.get(filePath);
          if (!root) {
            continue;
          }
          patches.push({
            path: filePath,
            content: JSON.stringify(root, null, 2) + '\n'
          });
        }

        resolve({
          patches,
          items,
          scannedFiles,
          matchedFields: candidates.length,
          changedFiles: changedFiles.size
        });
      })().catch(reject);
    });
  });
}

async function buildHardcodedPatchesFromItems(
  originalZipData: Uint8Array,
  items: Array<{filePath: string, pointer: Array<string | number>, translation: string}>
): Promise<Array<{path: string, content: string}>> {
  return new Promise((resolve, reject) => {
    unzip(originalZipData, (err, unzipped) => {
      if (err) {
        reject(new Error('Failed to unzip file for hardcoded repack: ' + err.message));
        return;
      }

      const byFile = new Map<string, Array<{pointer: Array<string | number>, translation: string}>>();
      for (const item of items) {
        if (!item || typeof item.filePath !== 'string' || !Array.isArray(item.pointer) || typeof item.translation !== 'string') {
          continue;
        }
        if (!byFile.has(item.filePath)) {
          byFile.set(item.filePath, []);
        }
        byFile.get(item.filePath)!.push({ pointer: item.pointer, translation: item.translation });
      }

      const patches: Array<{path: string, content: string}> = [];
      for (const [filePath, editItems] of byFile.entries()) {
        const raw = unzipped[filePath];
        if (!raw) {
          continue;
        }

        try {
          const json = JSON.parse(strFromU8(raw as Uint8Array));
          let changed = false;
          for (const edit of editItems) {
            const current = getValueAtPath(json, edit.pointer);
            if (typeof current === 'string' && current !== edit.translation) {
              setValueAtPath(json, edit.pointer, edit.translation);
              changed = true;
            }
          }
          if (changed) {
            patches.push({
              path: filePath,
              content: JSON.stringify(json, null, 2) + '\n'
            });
          }
        } catch {
          // Ignore invalid JSON files in alpha repack.
        }
      }

      resolve(patches);
    });
  });
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

          // 检查是否是附加包语言文件：支持 */text/*.lang 与 */texts/*.lang（含 res 相关路径）
          if (isPotentialAddonLangPath(filePath)) {

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

        // 使用同步 ZIP，避免运行时缺少 Worker 导致打包失败
        const zipped = zipSync(newZipData, { level: 6 });
        console.log('Successfully created new ZIP, size:', zipped.length);
        resolve(zipped);
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
      hardcodedItems?: Array<{filePath: string, pointer: Array<string | number>, source?: string, translation: string}>;
      hardcodedPatches?: Array<{path: string, content: string}>;
      zipData: number[];
    };
    const { originalFileName, originalFileExtension, translatedFiles, hardcodedItems, hardcodedPatches, zipData } = requestData;

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
      path: toZhCnLangPath(file.path),
      content: file.translatedContent
    }));
    let alphaHardcodedFiles: Array<{path: string, content: string}> = [];
    if (Array.isArray(hardcodedItems) && hardcodedItems.length > 0) {
      alphaHardcodedFiles = await buildHardcodedPatchesFromItems(
        originalZipData,
        hardcodedItems
          .filter((item: any) => item && typeof item.filePath === 'string' && Array.isArray(item.pointer) && typeof item.translation === 'string')
          .map((item: any) => ({
            filePath: item.filePath,
            pointer: item.pointer,
            translation: item.translation
          }))
      );
    } else if (Array.isArray(hardcodedPatches)) {
      alphaHardcodedFiles = hardcodedPatches
        .filter((file: any) => file && typeof file.path === 'string' && typeof file.content === 'string')
        .map((file: any) => ({ path: file.path, content: file.content }));
    }

    const filesToWrite = [...finalTranslatedFiles, ...alphaHardcodedFiles];

    // 重新打包
    const newZipData = await createZipWithTranslations(originalZipData, filesToWrite);

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
