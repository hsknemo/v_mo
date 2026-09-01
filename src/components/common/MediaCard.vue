<template>
  <article class="media-card" @click="$emit('click', item)">
    <div class="poster">
      <img
        v-if="item.poster"
        :src="item.poster"
        :alt="item.title"
        loading="lazy"
        @error="onImgError"
      />
      <div v-else class="poster-placeholder">🎬</div>
      <span class="rating">
        <el-icon><Star /></el-icon>
        {{ Number(item.rating).toFixed(1) }}
      </span>
    </div>
    <div class="info">
      <h3 class="title">{{ item.title }}</h3>
      <div class="meta">
        <span class="year">{{ item.year }}</span>
        <span v-if="item.duration" class="extra">{{ item.duration }}</span>
        <span v-else-if="item.episodes && !item.episodes.includes('完结')" class="extra">{{ item.episodes }}</span>
      </div>
      <div class="genres">
        <span v-for="g in displayGenres" :key="g" class="genre-tag">{{ g }}</span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { Star } from '@element-plus/icons-vue'

const props = defineProps({
  item: { type: Object, required: true }
})

defineEmits(['click'])

const displayGenres = computed(() => {
  const g = props.item.genre || []
  return Array.isArray(g) ? g.slice(0, 3) : []
})

function onImgError(e) {
  e.target.style.display = 'none'
}
</script>

<style scoped lang="scss">
.media-card {
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

.poster {
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

  .media-card:hover & img {
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

.rating {
  position: absolute;
  top: $space-sm;
  right: $space-sm;
  padding: 2px 8px;
  border-radius: $radius-sm;
  background: rgba(0, 0, 0, 0.65);
  color: #ffb274;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 2px;

  .el-icon {
    font-size: 12px;
  }
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
  margin-bottom: $space-sm;

  .extra {
    padding-left: $space-xs;
    border-left: 1px solid var(--border-color);
  }
}

.genres {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.genre-tag {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>
