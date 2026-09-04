<template>
  <div class="giscus-wrap">
    <h2 class="giscus-title">讨论区</h2>
    <div ref="containerRef" class="giscus-container"></div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const containerRef = ref(null)

const GISCUS_CONFIG = {
  src: 'https://giscus.app/client.js',
  'data-repo': 'hsknemo/v_mo',
  'data-repo-id': 'R_kgDOT5OeeA',
  'data-category': 'Ideas',
  'data-category-id': 'DIC_kwDOT5OeeM4DE1LZ',
  'data-mapping': 'pathname',
  'data-strict': '0',
  'data-reactions-enabled': '1',
  'data-emit-metadata': '0',
  'data-input-position': 'top',
  'data-theme': 'preferred_color_scheme',
  'data-lang': 'zh-CN',
  'data-loading': 'lazy',
  crossorigin: 'anonymous',
  async: true,
}

function loadGiscus() {
  // 避免重复插入
  if (containerRef.value.querySelector('iframe')) return
  const script = document.createElement('script')
  Object.entries(GISCUS_CONFIG).forEach(([key, value]) => {
    script.setAttribute(key, value)
  })
  containerRef.value.appendChild(script)
}

onMounted(loadGiscus)

onBeforeUnmount(() => {
  if (containerRef.value) containerRef.value.innerHTML = ''
})
</script>

<style scoped lang="scss">
.giscus-wrap {
  margin-top: $space-xl;
  padding-top: $space-lg;
  border-top: 1px solid var(--border-color-light);
}

.giscus-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 $space-md;
}

.giscus-container {
  min-height: 200px;
}
</style>
