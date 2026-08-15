<template>
  <div class="container">
    <h1 class="page-title">电视剧</h1>

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

    <MediaGrid
      v-show="!error"
      :items="filtered"
      :loading="loading"
      @select="openDetail"
    />

    <MediaDialog v-model="dialogVisible" :item="current" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMediaData } from '@/composables/useMediaData'
import { useMediaFilter } from '@/composables/useMediaFilter'
import MediaFilter from '@/components/media/MediaFilter.vue'
import MediaGrid from '@/components/common/MediaGrid.vue'
import MediaDialog from '@/components/media/MediaDialog.vue'

const { list, loading, error, load } = useMediaData('tv')
const { keyword, genre, genres, filtered } = useMediaFilter(list)

const dialogVisible = ref(false)
const current = ref(null)

function openDetail(item) {
  current.value = item
  dialogVisible.value = true
}

onMounted(load)
</script>

<style scoped lang="scss">
.error-alert {
  margin-bottom: $space-lg;
}
</style>
