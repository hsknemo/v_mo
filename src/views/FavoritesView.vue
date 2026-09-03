<template>
  <div class="container favorites-view">
    <h1 class="page-title">
      爱看
      <span v-if="count" class="fav-count">{{ count }}</span>
    </h1>

    <el-empty
      v-if="count === 0"
      description="还没有收藏内容，去各板块点击星标加入爱看吧"
      class="empty-state"
    />

    <el-tabs v-else v-model="activeTab" class="fav-tabs">
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.key"
        :label="`${tab.label} (${tab.items.length})`"
        :name="tab.key"
      >
        <div class="tab-grid">
          <div
            v-for="item in tab.items"
            :key="`${item.sourceType}_${item.id}`"
            class="fav-card"
            @click="goPlay(item)"
          >
            <div class="fav-poster">
              <img
                v-if="item.poster"
                :src="item.poster"
                :alt="item.title"
                loading="lazy"
                @error="onImgError"
              />
              <div v-else class="poster-placeholder">🎬</div>
              <button class="fav-remove" @click.stop="onRemove(item)">
                <el-icon><Close /></el-icon>
              </button>
            </div>
            <div class="fav-info">
              <h3 class="fav-title">{{ item.title }}</h3>
              <div class="fav-meta">
                <span v-if="item.year">{{ item.year }}</span>
                <span v-if="item.rating" class="rating-text">
                  <el-icon><Star /></el-icon>{{ Number(item.rating).toFixed(1) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Close, Star } from '@element-plus/icons-vue'
import { useFavorites, TYPE_LABELS } from '@/composables/useFavorites'

const router = useRouter()
const { favorites, grouped, count, removeFavorite } = useFavorites()

// 有收藏的类型 tab 列表，按 TYPE_LABELS 中的顺序排列
const tabs = computed(() => {
  const g = grouped.value
  const order = ['movie', 'tv', 'ustv', 'krtv', 'variety', 'anime', 'food']
  return order
    .filter((k) => g[k] && g[k].length)
    .map((k) => ({
      key: k,
      label: TYPE_LABELS[k] || k,
      items: g[k],
    }))
})

// 默认选中第一个 tab
const activeTab = ref('')
// tabs 变化时确保有选中项
const stop = watch(tabs, (t) => {
  if (t.length && !t.find((x) => x.key === activeTab.value)) {
    activeTab.value = t[0].key
  }
}, { immediate: true })

function goPlay(item) {
  router.push(`/play/${item.sourceType}/${item.id}`)
}

function onRemove(item) {
  removeFavorite(item.sourceType, item.id)
}

function onImgError(e) {
  e.target.style.display = 'none'
}
</script>

<style scoped lang="scss">
.favorites-view {
  padding-bottom: $space-xl;
}

.fav-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  margin-left: $space-xs;
  border-radius: 999px;
  background: var(--gradient-brand);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
}

.empty-state {
  padding: 80px 0;
}

.fav-tabs {
  margin-top: $space-md;
}

.tab-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: $space-md;
  padding-top: $space-sm;

  @media (max-width: $bp-mobile) {
    grid-template-columns: repeat(2, 1fr);
    gap: $space-sm;
  }
}

.fav-card {
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

    .fav-title {
      color: var(--el-color-primary);
    }
  }
}

.fav-poster {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  background: linear-gradient(135deg, #ffd9b3, #ff9a3d);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  .fav-card:hover & img {
    transform: scale(1.05);
  }
}

.poster-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
}

.fav-remove {
  position: absolute;
  top: $space-sm;
  right: $space-sm;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;

  .el-icon {
    font-size: 14px;
  }

  &:hover {
    background: #f56c6c;
    transform: scale(1.12);
  }
}

.fav-info {
  padding: $space-sm $space-sm $space-md;
}

.fav-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 $space-xs;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s ease;
}

.fav-meta {
  display: flex;
  align-items: center;
  gap: $space-xs;
  font-size: 12px;
  color: var(--text-secondary);
}

.rating-text {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  color: #ffb274;
  font-weight: 700;

  .el-icon {
    font-size: 11px;
  }
}
</style>
