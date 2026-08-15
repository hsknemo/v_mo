<template>
  <div class="container play-container">
    <button class="back-btn" @click="goBack">
      <el-icon><ArrowLeft /></el-icon> 返回
    </button>

    <div v-if="loading" class="loading">
      <el-skeleton animated>
        <template #template>
          <el-skeleton-item variant="rect" style="width:100%; height:420px; border-radius:12px" />
          <el-skeleton-item variant="h3" style="width:40%; margin-top:24px" />
          <el-skeleton-item variant="text" style="width:80%; margin-top:16px" />
        </template>
      </el-skeleton>
    </div>

    <el-empty v-else-if="!item" description="未找到该内容" />

    <template v-else>
      <h1 class="play-title">{{ item.title }}</h1>
      <p v-if="item.originalTitle" class="play-subtitle">{{ item.originalTitle }}</p>

      <div class="player-wrap">
        <video
          :key="currentSource"
          class="player"
          :src="currentSource"
          :poster="item.poster"
          controls
          autoplay
          playsinline
        >
          您的浏览器不支持视频播放
        </video>
      </div>

      <div class="play-body">
        <div class="play-info">
          <div class="meta-row">
            <span v-if="item.year" class="meta-item">{{ item.year }}</span>
            <span v-if="item.duration" class="meta-item">{{ item.duration }}</span>
            <span v-if="item.episodes" class="meta-item">{{ item.episodes }}</span>
            <span class="rating">
              <el-icon><Star /></el-icon>
              {{ Number(item.rating).toFixed(1) }}
            </span>
          </div>
          <div v-if="item.genre?.length" class="meta-row">
            <span v-for="g in item.genre" :key="g" class="genre-tag">{{ g }}</span>
          </div>
          <p v-if="item.summary" class="summary">{{ item.summary }}</p>
          <div v-if="item.director" class="field">
            <span class="label">导演</span><span>{{ item.director }}</span>
          </div>
          <div v-if="item.cast?.length" class="field">
            <span class="label">主演</span><span>{{ item.cast.join(' / ') }}</span>
          </div>
        </div>

        <div v-if="isTv && episodeList.length" class="play-episodes">
          <EpisodeList
            :episodes="episodeList"
            :current-id="currentEpisodeId"
            @select="selectEpisode"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Star } from '@element-plus/icons-vue'
import { useMediaData } from '@/composables/useMediaData'
import EpisodeList from '@/components/media/EpisodeList.vue'

const route = useRoute()
const router = useRouter()

const type = computed(() => route.params.type)
const id = computed(() => Number(route.params.id))
const isTv = computed(() => type.value === 'tv')

const { list, loading, load } = useMediaData(type.value)

const item = computed(() => {
  return (list.value || []).find((it) => it.id === id.value) || null
})

const episodeList = computed(() => item.value?.episodeList || [])
const currentEpisodeId = ref(null)
const movieSource = ref('')

const currentSource = computed(() => {
  if (isTv.value) {
    const ep = episodeList.value.find((e) => e.id === currentEpisodeId.value)
    return ep ? ep.source : ''
  }
  return movieSource.value
})

function selectEpisode(ep) {
  currentEpisodeId.value = ep.id
}

function initSource() {
  if (!item.value) return
  if (isTv.value) {
    currentEpisodeId.value =
      episodeList.value[0]?.id ?? null
  } else {
    movieSource.value = item.value.source || ''
  }
}

watch(item, initSource, { immediate: true })

function goBack() {
  router.push(`/${type.value}`)
}

onMounted(async () => {
  if (!list.value.length) await load()
})
</script>

<style scoped lang="scss">
.play-container {
  max-width: 1100px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: $space-xs;
  padding: 6px 14px;
  border: 1px solid var(--border-color);
  border-radius: $radius-sm;
  background: var(--bg-card);
  color: var(--text-regular);
  cursor: pointer;
  font-size: 14px;
  margin-bottom: $space-lg;
  transition: all 0.2s ease;

  &:hover {
    color: var(--el-color-primary);
    border-color: var(--el-color-primary);
  }
}

.loading {
  margin-top: $space-md;
}

.play-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 $space-xs;
  color: var(--text-primary);
}

.play-subtitle {
  margin: 0 0 $space-md;
  color: var(--text-secondary);
  font-size: 14px;
}

.player-wrap {
  width: 100%;
  background: #000;
  border-radius: $radius-md;
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.player {
  width: 100%;
  max-height: 70vh;
  display: block;
}

.play-body {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: $space-xl;
  margin-top: $space-lg;

  @media (max-width: $bp-tablet) {
    grid-template-columns: 1fr;
  }
}

.play-info {
  min-width: 0;
}

.meta-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: $space-sm;
  margin-bottom: $space-sm;

  .meta-item {
    color: var(--text-secondary);
    font-size: 14px;
  }

  .rating {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    color: #ffb274;
    font-weight: 700;
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

.summary {
  margin: $space-md 0;
  color: var(--text-regular);
  line-height: 1.8;
  font-size: 14px;
}

.field {
  margin-bottom: $space-sm;
  font-size: 14px;
  color: var(--text-regular);

  .label {
    display: inline-block;
    width: 42px;
    color: var(--text-secondary);
    font-weight: 600;
  }
}

.play-episodes {
  background: var(--bg-card);
  border: 1px solid var(--border-color-light);
  border-radius: $radius-md;
  padding: $space-md;
  box-shadow: var(--shadow-card);
  align-self: start;
}
</style>
