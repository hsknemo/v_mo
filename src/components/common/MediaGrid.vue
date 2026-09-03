<template>
  <div class="media-grid-wrap">
    <div v-if="loading" class="grid">
      <div v-for="n in skeletonCount" :key="n" class="skeleton-card">
        <el-skeleton animated>
          <template #template>
            <el-skeleton-item variant="image" style="width:100%; aspect-ratio:3/4" />
            <div style="padding: 12px 16px">
              <el-skeleton-item variant="text" style="width: 80%" />
              <el-skeleton-item variant="text" style="width: 50%; margin-top: 8px" />
            </div>
          </template>
        </el-skeleton>
      </div>
    </div>

    <div v-else-if="items.length" class="grid">
      <MediaCard
        v-for="item in items"
        :key="item.id"
        :item="item"
        :source-type="sourceType"
        @click="$emit('select', item)"
      />
    </div>

    <el-empty v-else description="暂无内容" />
  </div>
</template>

<script setup>
import MediaCard from './MediaCard.vue'

defineProps({
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  sourceType: { type: String, default: '' }
})

defineEmits(['select'])

const skeletonCount = 12
</script>

<style scoped lang="scss">
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: $space-md;

  @media (max-width: $bp-mobile) {
    grid-template-columns: repeat(2, 1fr);
    gap: $space-sm;
  }
}

.skeleton-card {
  background: var(--bg-card);
  border-radius: $radius-md;
  overflow: hidden;
  border: 1px solid var(--border-color-light);
}
</style>
