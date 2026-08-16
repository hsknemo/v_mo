<template>
  <div class="container">
    <h1 class="page-title">动漫</h1>

    <el-alert
      v-if="error"
      :title="error"
      type="error"
      show-icon
      :closable="false"
      class="error-alert"
    />

    <div v-show="!error" class="anime-tabs">
      <button
        v-for="t in tabs"
        :key="t.value"
        class="anime-tab"
        :class="{ active: activeTab === t.value }"
        @click="activeTab = t.value"
      >
        {{ t.label }}
      </button>
    </div>

    <MediaGrid
      v-show="!error"
      :items="filtered"
      :loading="loading"
      @select="goPlay"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMediaData } from '@/composables/useMediaData'
import MediaGrid from '@/components/common/MediaGrid.vue'

const router = useRouter()
const { list, loading, error, load } = useMediaData('anime')

const tabs = [
  { value: 'all', label: '全部' },
  { value: 'tv', label: 'TV番剧' },
  { value: 'movie', label: '剧场版' }
]
const activeTab = ref('all')

const filtered = computed(() => {
  if (activeTab.value === 'all') return list.value
  return list.value.filter((it) => it.category === activeTab.value)
})

function goPlay(item) {
  router.push(`/play/anime/${item.id}`)
}

onMounted(load)
</script>

<style scoped lang="scss">
.error-alert {
  margin-bottom: $space-lg;
}

.anime-tabs {
  display: flex;
  gap: $space-sm;
  margin-bottom: $space-lg;
  flex-wrap: wrap;
}

.anime-tab {
  padding: 6px 18px;
  border: 1px solid var(--border-color);
  border-radius: $radius-sm;
  background: var(--bg-card);
  color: var(--text-regular);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: var(--el-color-primary);
    border-color: var(--el-color-primary);
  }

  &.active {
    color: #fff;
    background: var(--gradient-brand);
    border-color: transparent;
  }
}
</style>
