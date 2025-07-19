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
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .container { background: #f5f5f5; padding: 20px; border-radius: 8px; }
        .upload-area { border: 2px dashed #ccc; padding: 40px; text-align: center; margin: 20px 0; }
        .upload-area.dragover { border-color: #007bff; background: #f0f8ff; }
        button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
        .result { margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .loading { display: none; text-align: center; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧱 BlockTrans - 方块译者</h1>
        <p>AI 驱动的 Minecraft .lang 文件翻译工具</p>

        <div class="upload-area" id="uploadArea">
            <p>拖拽 .lang 文件到这里，或者</p>
            <input type="file" id="fileInput" accept=".lang,.txt" style="display: none;">
            <button onclick="document.getElementById('fileInput').click()">选择文件</button>
        </div>

        <div class="loading" id="loading">
            <p>🤖 AI 正在翻译中，请稍候...</p>
        </div>

        <div class="result" id="result"></div>
    </div>

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
                    throw new Error('翻译请求失败');
                }

                const translations = await response.json();
                displayResults(translations);
            } catch (error) {
                result.innerHTML = '<p style="color: red;">翻译失败: ' + error.message + '</p>';
            } finally {
                loading.style.display = 'none';
            }
        }

        // 显示结果
        function displayResults(translations) {
            if (translations.length === 0) {
                result.innerHTML = '<p>没有找到需要翻译的内容</p>';
                return;
            }

            let html = '<h3>翻译结果</h3>';
            html += '<table><tr><th>键名</th><th>原文</th><th>译文</th></tr>';

            translations.forEach(item => {
                html += '<tr>' +
                    '<td>' + item.key + '</td>' +
                    '<td>' + item.source + '</td>' +
                    '<td><input type="text" value="' + item.translation + '" style="width: 100%; border: none; background: transparent;"></td>' +
                '</tr>';
            });

            html += '</table>';
            html += '<button onclick="downloadResult()" style="margin-top: 10px;">下载翻译文件</button>';

            result.innerHTML = html;
        }

        // 下载结果
        function downloadResult() {
            const rows = result.querySelectorAll('table tr');
            let content = '';

            for (let i = 1; i < rows.length; i++) {
                const cells = rows[i].querySelectorAll('td');
                const key = cells[0].textContent;
                const translation = cells[2].querySelector('input').value;
                content += key + '=' + translation + '\\n';
            }

            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'translated.lang';
            a.click();
            URL.revokeObjectURL(url);
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
    const langFileContent = await request.text();
    const itemsToTranslate = parseLangFile(langFileContent);

    if (itemsToTranslate.length === 0) {
      return new Response(JSON.stringify([]), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    const textsToTranslate = itemsToTranslate.map(item => item.value);

    const aiResponse = await fetch(env.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.API_KEY}`,
      },
      body: JSON.stringify({
        model: env.MODEL_NAME,
        prompt: createTranslationPrompt(textsToTranslate),
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API Error:', errorText);
      throw new Error(`AI API request failed with status ${aiResponse.status}`);
    }

    const aiResult = await aiResponse.json() as { translation: string };
    const translatedTexts = aiResult.translation.split('\n');

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
    return new Response('An error occurred during translation.', { 
      status: 500, 
      headers: corsHeaders 
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
