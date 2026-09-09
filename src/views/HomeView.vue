<template>
  <div class="home-view">
    <BannerCarousel :banners="list" :loading="loading" />

    <el-alert
      v-if="error"
      :title="error"
      type="error"
      show-icon
      :closable="false"
      class="container error-alert"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useMediaData } from '@/composables/useMediaData'
import BannerCarousel from '@/components/home/BannerCarousel.vue'

const { list, loading, error, load } = useMediaData('banners')

onMounted(load)
</script>

<style scoped lang="scss">
/* 大 banner 全屏通顶/通底展示，抵消 app-main 的上下内边距 */
.home-view {
  margin-top: calc(-1 * #{$space-xl});
  margin-bottom: calc(-1 * #{$space-xl});

  @media (max-width: $bp-mobile) {
    margin-top: calc(-1 * #{$space-lg});
    margin-bottom: calc(-1 * #{$space-lg});
  }
}

.error-alert {
  margin-top: $space-lg;
}
</style>
