<template>
  <div class="container">
    <h1 class="page-title">综艺</h1>

    <el-alert
      v-if="error"
      :title="error"
      type="error"
      show-icon
      :closable="false"
      class="error-alert"
    />

    <MediaFilter
      v-show="!error"
      v-model:keyword="keyword"
      v-model:genre="genre"
      :genres="genres"
    />

    <el-empty
      v-if="!loading && !error && filtered.length === 0"
      :description="debouncedKeyword ? `没有找到与「${debouncedKeyword}」匹配的综艺` : '暂无数据'"
      class="empty-state"
    />

    <MediaGrid
      v-show="!error && (loading || filtered.length > 0)"
      :items="filtered"
      :loading="loading"
      source-type="variety"
      @select="goPlay"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMediaData } from '@/composables/useMediaData'
import { useMediaFilter } from '@/composables/useMediaFilter'
import MediaFilter from '@/components/media/MediaFilter.vue'
import MediaGrid from '@/components/common/MediaGrid.vue'

const router = useRouter()
const { list, loading, error, load } = useMediaData('variety')
const { keyword, debouncedKeyword, genre, genres, filtered } = useMediaFilter(list)

function goPlay(item) {
  router.push(`/play/variety/${item.id}`)
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
</style>
