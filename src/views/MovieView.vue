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

    <!-- 筛选栏暂未开放
    <MediaFilter
      v-show="!error"
      v-model:keyword="keyword"
      v-model:genre="genre"
      :genres="genres"
    />
    -->

    <MediaGrid
      v-show="!error"
      :items="filtered"
      :loading="loading"
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
const { keyword, genre, genres, filtered } = useMediaFilter(list)

function goPlay(item) {
  router.push(`/play/movie/${item.id}`)
}

onMounted(load)
</script>

<style scoped lang="scss">
.error-alert {
  margin-bottom: $space-lg;
}
</style>
