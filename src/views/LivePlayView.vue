<template>
  <div class="container live-play-container">
    <button class="back-btn" @click="goBack">
      <el-icon><ArrowLeft /></el-icon> 返回
    </button>

    <!-- 页面级密码二次阻断 -->
    <div v-if="!pagePwdUnlocked" class="lock-placeholder">
      <el-icon class="lock-icon"><Lock /></el-icon>
      <p>请先通过页面访问密码</p>
      <el-button type="primary" round @click="promptPagePwd" style="margin-top: 12px">
        输入密码
      </el-button>
    </div>

    <div v-else-if="loading" class="loading">
      <el-skeleton animated>
        <template #template>
          <el-skeleton-item variant="rect" style="width:100%; height:420px; border-radius:12px" />
          <el-skeleton-item variant="h3" style="width:40%; margin-top:24px" />
        </template>
      </el-skeleton>
    </div>

    <el-empty v-else-if="!item" description="未找到该直播源" />

    <template v-else>
      <div class="play-title-row">
        <h1 class="play-title">{{ item.title }}</h1>
        <span v-if="item.type" class="play-type-tag">{{ item.type }}</span>
      </div>

      <div class="player-wrap">
        <iframe
          :key="item.src"
          class="player-iframe"
          :src="item.src"
          frameborder="0"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowfullscreen
          scrolling="auto"
        ></iframe>
      </div>

      <div class="live-info">
        <div v-if="item.logo" class="logo-row">
          <img :src="item.logo" :alt="item.title" class="channel-logo" @error="onLogoError" />
          <span class="channel-name">{{ item.title }}</span>
        </div>
        <p class="source-tip">直播源来自第三方，如无法播放可能是源失效或被屏蔽</p>
      </div>

      <div class="reward-entry" @click="goReward">
        <div class="reward-entry-icon">
          <el-icon><CoffeeCup /></el-icon>
        </div>
        <div class="reward-entry-text">
          <p class="reward-entry-title">觉得好看？赞助一下呗</p>
          <p class="reward-entry-desc">你的支持是持续更新的动力 ❤️</p>
        </div>
        <div class="reward-entry-btn">
          <el-icon><Present /></el-icon>
          <span>打赏支持</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Lock, CoffeeCup, Present } from '@element-plus/icons-vue'
import { useMediaData } from '@/composables/useMediaData'
import { usePagePassword } from '@/composables/usePagePassword'

const route = useRoute()
const router = useRouter()

const pagePwdDlg = usePagePassword()

const pagePwdUnlocked = computed(() => {
  if (!pagePwdDlg.loaded.value) return true
  if (!pagePwdDlg.requiresPassword.value) return true
  return pagePwdDlg.unlocked.value
})

async function promptPagePwd() {
  await pagePwdDlg.loadPagePassword()
  pagePwdDlg.ensureUnlocked(true)
}

const id = computed(() => Number(route.params.id))

const { list, loading, load } = useMediaData('live')

const item = computed(() => {
  return (list.value || []).find((it) => it.id === id.value) || null
})

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/live')
  }
}

function goReward() {
  router.push('/reward')
}

function onLogoError(e) {
  e.target.style.display = 'none'
}

onMounted(load)
</script>

<style scoped lang="scss">
.live-play-container {
  padding: $space-md 0;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  padding: $space-xs 0;
  margin-bottom: $space-md;

  &:hover {
    color: var(--el-color-primary);
  }
}

.play-title-row {
  display: flex;
  align-items: center;
  gap: $space-sm;
  flex-wrap: wrap;
  margin-bottom: $space-md;
}

.play-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
}

.play-type-tag {
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--gradient-brand);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}

.player-wrap {
  width: 100%;
  background: #000;
  border-radius: $radius-md;
  overflow: hidden;
  box-shadow: var(--shadow-card);
  position: relative;
}

.player-iframe {
  display: block;
  width: 100%;
  height: 70vh;
  min-height: 360px;
  border: 0;
  background: #000;
}

.live-info {
  margin-top: $space-lg;
  padding: $space-md;
  background: var(--bg-card);
  border-radius: $radius-md;
  border: 1px solid var(--border-color-light);
}

.logo-row {
  display: flex;
  align-items: center;
  gap: $space-sm;
  margin-bottom: $space-sm;
}

.channel-logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
  border-radius: $radius-sm;
}

.channel-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.source-tip {
  margin: 0;
  font-size: 12px;
  color: var(--text-secondary);
}

.reward-entry {
  margin-top: $space-lg;
  display: flex;
  align-items: center;
  gap: $space-md;
  padding: $space-md $space-lg;
  background: linear-gradient(135deg, rgba(255, 140, 50, 0.12), rgba(255, 90, 30, 0.18));
  border: 1px solid rgba(255, 140, 50, 0.4);
  border-radius: $radius-md;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(255, 140, 50, 0.28);
  }
}

.reward-entry-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--gradient-brand);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.reward-entry-text {
  flex: 1;
}

.reward-entry-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: rgb(128, 128, 128);
}

.reward-entry-desc {
  margin: 2px 0 0;
  font-size: 12px;
  color: rgb(128, 128, 128);
}

.reward-entry-btn {
  padding: 6px 16px;
  border-radius: 999px;
  background: var(--gradient-brand);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.lock-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: var(--text-secondary);
  text-align: center;

  .lock-icon {
    font-size: 48px;
    margin-bottom: $space-sm;
    color: var(--el-color-primary);
  }
}

.loading {
  padding: $space-md 0;
}

@media (max-width: $bp-mobile) {
  .play-title {
    font-size: 20px;
  }

  .player-iframe {
    height: 50vh;
    min-height: 260px;
  }

  .reward-entry {
    flex-wrap: wrap;
    padding: $space-sm $space-md;
  }

  .reward-entry-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
