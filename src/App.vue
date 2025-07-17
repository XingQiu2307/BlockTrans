<template>
  <main class="container">
    <header>
      <h1>方块译者 (BlockTrans)</h1>
      <p>一个极简、高效的在线工具，帮助你快速将 MCBE 附加包 (.lang) 文件翻译成中文。</p>
    </header>

    <article>
      <label for="file">
        上传 .lang 文件
        <input type="file" id="file" name="file" @change="handleFileUpload" accept=".lang">
      </label>
      <div v-if="fileName">
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

    async function translate() {
      if (!fileContent.value) {
        error.value = 'Please upload a file first.';
        return;
      }

      isLoading.value = true;
      error.value = null;
      translations.value = null;

      try {
        const response = await fetch('http://127.0.0.1:8787/api/translate', { // Assuming local dev server for worker
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
        .map(item => `${item.key}=${item.translation}`)
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
      // Reset file input
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

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}
</style>
