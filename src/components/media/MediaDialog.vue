<template>
  <el-dialog
    :model-value="modelValue"
    :title="item ? item.title : ''"
    width="720px"
    class="media-dialog"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div v-if="item" class="detail">
      <div class="poster">
        <img v-if="item.poster" :src="item.poster" :alt="item.title" />
        <div v-else class="poster-placeholder">🎬</div>
        <div class="rating-box">
          <el-icon><Star /></el-icon>
          <span>{{ Number(item.rating).toFixed(1) }}</span>
        </div>
      </div>
      <div class="detail-info">
        <p v-if="item.originalTitle" class="original-title">
          {{ item.originalTitle }}
        </p>
        <div class="meta-row">
          <span class="meta-item">{{ item.year }}</span>
          <span v-if="item.duration" class="meta-item">{{ item.duration }}</span>
          <span v-if="item.episodes" class="meta-item">{{ item.episodes }}</span>
        </div>
        <div v-if="item.genre?.length" class="meta-row">
          <span v-for="g in item.genre" :key="g" class="genre-tag">{{ g }}</span>
        </div>
        <div v-if="item.director" class="field">
          <span class="label">导演</span>
          <span>{{ item.director }}</span>
        </div>
        <div v-if="item.cast?.length" class="field">
          <span class="label">主演</span>
          <span>{{ item.cast.join(' / ') }}</span>
        </div>
        <div v-if="item.summary" class="field summary">
          <span class="label">简介</span>
          <span>{{ item.summary }}</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { Star } from '@element-plus/icons-vue'

defineProps({
  modelValue: { type: Boolean, default: false },
  item: { type: Object, default: null }
})

defineEmits(['update:modelValue'])
</script>

<style scoped lang="scss">
.detail {
  display: flex;
  gap: $space-lg;

  @media (max-width: $bp-mobile) {
    flex-direction: column;
  }
}

.poster {
  position: relative;
  flex-shrink: 0;
  width: 200px;
  aspect-ratio: 3 / 4;
  border-radius: $radius-md;
  overflow: hidden;
  background: linear-gradient(135deg, #ffd9b3, #ff9a3d);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: $bp-mobile) {
    width: 140px;
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

.rating-box {
  position: absolute;
  bottom: $space-sm;
  left: $space-sm;
  padding: 2px 8px;
  border-radius: $radius-sm;
  background: rgba(0, 0, 0, 0.65);
  color: #ffb274;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 3px;
}

.detail-info {
  flex: 1;
  min-width: 0;
}

.original-title {
  margin: 0 0 $space-sm;
  color: var(--text-secondary);
  font-size: 14px;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
  margin-bottom: $space-md;

  .meta-item {
    color: var(--text-regular);
    font-size: 14px;
  }
}

.genre-tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.field {
  margin-bottom: $space-md;
  font-size: 14px;
  color: var(--text-regular);
  line-height: 1.6;

  .label {
    display: inline-block;
    width: 42px;
    color: var(--text-secondary);
    font-weight: 600;
    flex-shrink: 0;
  }

  &.summary {
    display: flex;
    gap: $space-sm;
  }
}
</style>
