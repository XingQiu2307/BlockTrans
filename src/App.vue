<template>
  <div id="app">
    <header class="app-header">
      <div class="logo-container">
        <a href="https://github.com/XingQiu2307/BlockTrans-fronted" target="_blank">
          <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Logo" class="github-logo">
        </a>
      </div>
      <div class="title-container">
        <h1>方块译者 (BlockTrans)</h1>
        <p>一个极简、高效的在线工具，帮助你快速将 MCBE 附加包 (.lang) 文件翻译成中文。</p>
      </div>
      <div class="about-container">
        <button @click="showAbout = true" class="about-button">关于</button>
      </div>
    </header>

    <main class="container">
      <article>
        <label for="file" class="file-label">
          <div class="file-button">
            选择或拖放 .lang 文件
          </div>
          <input type="file" id="file" name="file" @change="handleFileUpload" accept=".lang" class="file-input">
        </label>
        <div v-if="fileName" class="file-info">
          <p><strong>已上传文件:</strong> {{ fileName }}</p>
          <div class="grid">
            <button @click="translate" :disabled="isLoading || !fileContent">
              {{ isLoading ? '翻译中...' : '一键 AI 翻译' }}
            </button>
            <button @click="clearAll" class="secondary">
              清空/重新上传
            </button>
          </div>
        </div>
      </article>

      <article v-if="isLoading">
        <p>正在翻译，请稍候...</p>
      </article>

      <article v-if="error">
        <p><strong>错误:</strong> {{ error }}</p>
      </article>

      <article v-if="translations">
        <h2>翻译结果</h2>
        <table>
          <thead>
            <tr>
              <th>原文标识 (Key)</th>
              <th>原文内容 (Source Text)</th>
              <th>译文 (Translated Text)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in translations" :key="item.key">
              <td>{{ item.key }}</td>
              <td>{{ item.source }}</td>
              <td>
                <input type="text" v-model="item.translation">
              </td>
            </tr>
          </tbody>
        </table>
        <button @click="download" :disabled="!translations">下载已汉化文件</button>
      </article>
    </main>

    <div v-if="showAbout" class="modal-overlay" @click="showAbout = false">
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="showAbout = false">&times;</button>
        <div v-html="aboutContent"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'App',
  setup() {
    const fileContent = ref<string | null>(null);
    const fileName = ref<string | null>(null);
    const translations = ref<any[] | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const showAbout = ref(false);

    const aboutContent = `
      <h1>关于 方块译者 (BlockTrans)</h1>
      <p>为我的世界基岩版 (MCBE) 附加包而生的一键 AI 本地化工具。</p>
      <h2>这是什么？</h2>
      <p><strong>方块译者</strong> 是一个极简、高效的在线工具，旨在帮助每一位我的世界玩家和开发者，轻松跨越语言的障碍。</p>
      <p>只需上传附加包（Add-on）中的 <code>.lang</code> 语言文件，我们的 AI 将在数秒内为您生成高质量的中文翻译。</p>
      <hr>
      <h2>为谁而生？</h2>
      <p>我们精准地服务于两类核心用户：</p>
      <h3><strong>对于开发者：</strong></h3>
      <p>您是否希望将精心制作的附加包带给广大的中文玩家，却被语言障碍和高昂的翻译成本所困扰？</p>
      <p><strong>方块译者</strong> 为您提供了一个一键式的解决方案。告别繁琐的手动翻译，极大提升本地化效率，让您的优秀作品轻松触达庞大的中文社区。</p>
      <h3><strong>对于玩家与社区贡献者：</strong></h3>
      <p>您是否曾发现一个功能强大、玩法新颖的国外附加包，却因没有中文而无法尽兴体验，甚至望而却步？</p>
      <p>现在，您无需等待别人的汉化。只需上传它的语言文件，即可立即获得汉化版，让自己成为享受最新内容的第一批玩家，甚至可以轻松地将成果分享给社区。</p>
      <hr>
      <h2>核心特性</h2>
      <ul>
        <li><strong>一键翻译</strong>：极简的操作流程，上传文件，即刻下载译文。</li>
        <li><strong>专为 .lang 设计</strong>：深度优化对 <code>.lang</code> 文件格式的解析，保证键值对（key-value）的完整性和准确性。</li>
        <li><strong>AI 驱动，优质高效</strong>：采用先进的 AI 翻译模型，确保翻译结果自然、流畅，符合游戏语境。</li>
        <li><strong>完全免费，云端运行</strong>：无需安装任何软件，随时随地在浏览器中访问。</li>
      </ul>
      <h2>技术实现</h2>
      <p><strong>方块译者</strong> 完全构建于 <strong>Cloudflare</strong> 的全球网络之上（Pages + Workers）。这赋予了项目强大的能力：</p>
      <ul>
        <li><strong>极速访问</strong>：无论您身在何处，都能享受到飞快的加载和处理速度。</li>
        <li><strong>稳定可靠</strong>：基于世界级的边缘网络，服务可用性得到充分保障。</li>
        <li><strong>零成本维护</strong>：让我们能够将这个工具永久免费地提供给社区。</li>
      </ul>
      <h2>开发者</h2>
      <p>本项目由 <strong><a href="https://github.com/XingQiu2307" target="_blank">XingQiu2307</a></strong> 独立开发。</p>
      <h2>支持项目</h2>
      <p>如果您认为“方块译者”对您有帮助，或欣赏这个想法，请在 GitHub 上给我们点亮一颗 Star！这是对我们最大的鼓励。</p>
      <p><a href="https://github.com/XingQiu2307/BlockTrans-fronted" target="_blank"><strong>前往 GitHub 点亮 Star ⭐</strong></a></p>
      <h2>项目背景</h2>
      <p>本项目为 <strong>Vibe Coding</strong> 的实践成果，致力于用技术解决真实世界的问题。</p>
      <hr>
      <p>感谢您的使用，愿您在方块世界中探索无限！</p>
    `;

    async function translate() {
      if (!fileContent.value) {
        error.value = 'Please upload a file first.';
        return;
      }

      isLoading.value = true;
      error.value = null;
      translations.value = null;

      try {
        const response = await fetch('/api/translate', { // Use relative path for Pages Functions
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: fileContent.value,
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        translations.value = await response.json();
      } catch (e: any) {
        error.value = e.message;
      } finally {
        isLoading.value = false;
      }
    }

    function download() {
      if (!translations.value) {
        return;
      }

      const content = translations.value
        .map((item: { key: string; translation: string }) => `${item.key}=${item.translation}`)
        .join('\n');

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName.value || 'translated.lang';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    function handleFileUpload(event: Event) {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file) {
        fileName.value = file.name;
        fileContent.value = null;
        translations.value = null;
        error.value = null;
        const reader = new FileReader();
        reader.onload = (e) => {
          fileContent.value = e.target?.result as string;
        };
        reader.readAsText(file);
      }
    }

    function clearAll() {
      fileContent.value = null;
      fileName.value = null;
      translations.value = null;
      error.value = null;
      const fileInput = document.getElementById('file') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }

    return {
      fileContent,
      fileName,
      translations,
      isLoading,
      error,
      showAbout,
      aboutContent,
      translate,
      download,
      handleFileUpload,
      clearAll,
    };
  },
});
</script>

<style>
:root {
  --pico-font-size: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  line-height: 1.5;
  color: var(--pico-primary-inverse);
  background-color: var(--pico-background-color);
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--pico-card-background-color);
  border-bottom: 1px solid var(--pico-card-border-color);
}

.logo-container, .about-container {
  flex: 1;
}

.about-container {
  text-align: right;
}

.github-logo {
  height: 32px;
  width: 32px;
}

.title-container {
  flex: 2;
  text-align: center;
}

.title-container h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.title-container p {
  font-size: 1.2rem;
  color: var(--pico-secondary);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.file-label {
  display: block;
  text-align: center;
  margin-bottom: 1rem;
}

.file-button {
  display: inline-block;
  padding: 1rem 2rem;
  border: 2px dashed var(--pico-primary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.file-button:hover {
  background-color: var(--pico-primary-hover);
  color: var(--pico-primary-inverse);
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.file-input {
  display: none;
}

.file-info {
  text-align: center;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: var(--pico-card-background-color);
  padding: 2rem;
  border-radius: 8px;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
