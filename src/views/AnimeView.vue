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

    <div v-show="!error" class="anime-toolbar">
      <el-input
        v-model="keywordRaw"
        placeholder="搜索片名"
        clearable
        class="search-input"
        :prefix-icon="Search"
      />
      <div class="anime-tabs">
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
    </div>

    <el-empty
      v-if="!loading && !error && filtered.length === 0"
      :description="keyword ? `没有找到与「${keyword}」匹配的动漫` : '暂无数据'"
      class="empty-state"
    />

    <MediaGrid
      v-show="!error && (loading || filtered.length > 0)"
      :items="filtered"
      :loading="loading"
      source-type="anime"
      @select="goPlay"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
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

const keywordRaw = ref('')
const keyword = ref('')
let dbTimer = null
watch(keywordRaw, (v) => {
  if (dbTimer) clearTimeout(dbTimer)
  dbTimer = setTimeout(() => { keyword.value = v }, 200)
})
onBeforeUnmount(() => { if (dbTimer) clearTimeout(dbTimer) })

function matchKeyword(item, kw) {
  if (!kw) return true
  const hay = [item.title, item.originalTitle].filter(Boolean).join(' ').toLowerCase()
  return hay.includes(kw)
}

const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  const arr = list.value || []
  return arr.filter((it) => {
    const matchTab = activeTab.value === 'all' || it.category === activeTab.value
    return matchTab && matchKeyword(it, kw)
  })
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

.anime-toolbar {
  display: flex;
  gap: $space-md;
  margin-bottom: $space-lg;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 220px;
  max-width: 360px;

  @media (max-width: $bp-mobile) {
    max-width: none;
  }
}

.anime-tabs {
  display: flex;
  gap: $space-sm;
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

.empty-state {
  padding: 80px 0;
}
</style>
