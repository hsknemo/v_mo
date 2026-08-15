<template>
  <div class="episode-list">
    <h3 class="list-title">选集</h3>
    <div class="episodes">
      <button
        v-for="ep in episodes"
        :key="ep.id"
        class="episode-item"
        :class="{ active: ep.id === currentId }"
        @click="$emit('select', ep)"
      >
        {{ ep.title }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  episodes: { type: Array, default: () => [] },
  currentId: { type: [Number, String], default: null }
})

defineEmits(['select'])
</script>

<style scoped lang="scss">
.list-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 $space-md;
  color: var(--text-primary);
}

.episodes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: $space-sm;

  @media (max-width: $bp-mobile) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.episode-item {
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: $radius-sm;
  background: var(--bg-card);
  color: var(--text-regular);
  font-size: 13px;
  cursor: pointer;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.2s ease;

  &:hover {
    color: var(--el-color-primary);
    border-color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
  }

  &.active {
    color: #fff;
    background: var(--gradient-brand);
    border-color: transparent;
  }
}
</style>
