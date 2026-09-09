<template>
  <div class="player-wrap">
    <iframe
      v-if="playerUrl"
      :key="playerUrl"
      class="player-iframe"
      :src="playerUrl"
      frameborder="0"
      allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
      allowfullscreen
      scrolling="no"
    ></iframe>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // m3u8 播放地址
  source: { type: String, default: '' },
})

// 第三方解析播放：把 m3u8 地址交给 dxfbk 播放器
// key 随地址变化，切集时强制重建 iframe，避免 iframe 内页面不刷新
const playerUrl = computed(() => {
  if (!props.source) return ''
  return `https://dxfbk.com/?url=${encodeURIComponent(props.source)}`
})
</script>

<style scoped lang="scss">
.player-wrap {
  width: 100%;
  background: #000;
  border-radius: $radius-md;
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.player-iframe {
  display: block;
  width: 100%;
  height: 70vh;
  min-height: 320px;
  border: 0;
  background: #000;
}

@media (max-width: $bp-mobile) {
  .player-iframe {
    height: 50vh;
    min-height: 240px;
  }
}
</style>
