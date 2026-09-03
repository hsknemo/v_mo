<template>
  <div class="container">
    <h1 class="page-title">电影</h1>

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
      :description="debouncedKeyword ? `没有找到与「${debouncedKeyword}」匹配的影片` : '暂无数据'"
      class="empty-state"
    />

    <MediaGrid
      v-show="!error && (loading || filtered.length > 0)"
      :items="filtered"
      :loading="loading"
      source-type="movie"
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
const { list, loading, error, load } = useMediaData('movie')
const { keyword, debouncedKeyword, genre, genres, filtered } = useMediaFilter(list)

function goPlay(item) {
  router.push(`/play/movie/${item.id}`)
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
