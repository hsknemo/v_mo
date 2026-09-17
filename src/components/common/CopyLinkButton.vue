<template>
  <button
    class="copy-link-btn"
    :class="{ copied }"
    :title="copied ? '已复制' : '复制播放链接'"
    :disabled="!link"
    @click="copyLink"
  >
    <el-icon><Select v-if="copied" /><CopyDocument v-else /></el-icon>
    <span>{{ copied ? '已复制' : '复制链接' }}</span>
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { CopyDocument, Select } from '@element-plus/icons-vue'

const props = defineProps({
  // 当前 m3u8 播放地址
  link: { type: String, default: '' },
})

const copied = ref(false)
let resetTimer = null

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // 非安全上下文或权限被拒时的兜底方案
    const input = document.createElement('input')
    input.value = text
    input.style.position = 'fixed'
    input.style.opacity = '0'
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
  }
}

async function copyLink() {
  if (!props.link) return
  await copyText(props.link)
  copied.value = true
  ElMessage.success('播放链接已复制')
  if (resetTimer) clearTimeout(resetTimer)
  resetTimer = setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<style scoped lang="scss">
.copy-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-regular);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  cursor: pointer;
  transition: all 0.2s ease;

  .el-icon {
    font-size: 15px;
  }

  &:hover:not(:disabled) {
    color: var(--el-color-primary);
    border-color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
  }

  &.copied {
    color: #fff;
    border-color: var(--el-color-primary);
    background: var(--gradient-brand);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
