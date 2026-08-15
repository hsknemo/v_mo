<template>
  <footer class="app-footer">
    <div class="container footer-inner">
      <span>© {{ year }} v_movie · 影视收藏展示</span>
      <span class="divider">·</span>
      <span>仅供学习展示使用</span>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped lang="scss">
.app-footer {
  margin-top: auto;
  padding: $space-lg 0;
  border-top: 1px solid var(--border-color-light);
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: 13px;
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-sm;
  flex-wrap: wrap;
  text-align: center;
}

.divider {
  opacity: 0.5;
}
</style>
