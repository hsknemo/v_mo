<template>
  <article class="live-card" @click="$emit('click', item)">
    <div class="logo-wrap">
      <img
        v-if="item.logo"
        :src="item.logo"
        :alt="item.title"
        class="logo"
        loading="lazy"
        @error="onImgError"
      />
      <div v-else class="logo-placeholder">📡</div>
      <span class="live-badge">LIVE</span>
    </div>
    <div class="info">
      <h3 class="title">{{ item.title }}</h3>
      <div class="meta">
        <span v-if="item.type" class="type-tag">{{ item.type }}</span>
        <span class="hint">点击进入直播</span>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({
  item: { type: Object, required: true }
})
defineEmits(['click'])

function onImgError(e) {
  e.target.style.display = 'none'
}
</script>

<style scoped lang="scss">
.live-card {
  background: var(--bg-card);
  border-radius: $radius-md;
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow-card);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  border: 1px solid var(--border-color-light);

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-hover);

    .title {
      color: var(--el-color-primary);
    }
  }
}

.logo-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  background: linear-gradient(135deg, #1f2937, #111827);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.logo {
  width: 56%;
  height: 56%;
  object-fit: contain;
  transition: transform 0.4s ease;
}

.live-card:hover .logo {
  transform: scale(1.06);
}

.logo-placeholder {
  font-size: 64px;
  color: #ff9a3d;
}

.live-badge {
  position: absolute;
  top: $space-sm;
  right: $space-sm;
  padding: 2px 8px;
  border-radius: $radius-sm;
  background: var(--gradient-brand);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  box-shadow: 0 2px 6px rgba(255, 140, 50, 0.45);
  animation: live-pulse 2s ease-in-out infinite;
}

@keyframes live-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.info {
  padding: $space-sm $space-md $space-md;
}

.title {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 $space-xs;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s ease;
}

.meta {
  display: flex;
  align-items: center;
  gap: $space-xs;
  font-size: 12px;
  color: var(--text-secondary);
}

.type-tag {
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  font-size: 11px;
}

.hint {
  margin-left: auto;
}
</style>
