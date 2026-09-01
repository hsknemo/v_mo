<template>
  <div class="container live-view">
    <h1 class="page-title">直播</h1>

    <el-alert
      v-if="error"
      :title="error"
      type="error"
      show-icon
      :closable="false"
      class="error-alert"
    />

    <el-empty
      v-if="!loading && !error && list.length === 0"
      description="暂无直播源"
      class="empty-state"
    />

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

    <div v-else-if="list.length" class="grid">
      <LiveCard
        v-for="item in list"
        :key="item.id"
        :item="item"
        @click="goPlay"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LiveCard from '@/components/common/LiveCard.vue'
import { useMediaData } from '@/composables/useMediaData'

const router = useRouter()
const { list, loading, error, load } = useMediaData('live')

const skeletonCount = 12

function goPlay(item) {
  router.push(`/liveplay/${item.id}`)
}

onMounted(load)
</script>

<style scoped lang="scss">
.error-alert {
  margin-bottom: $space-lg;
}

.empty-state {
  padding: 80px 0;
}

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
