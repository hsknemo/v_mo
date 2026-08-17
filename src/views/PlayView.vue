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
      <!-- 密码锁定占位 -->
      <div v-if="locked" class="lock-placeholder">
        <el-icon class="lock-icon"><Lock /></el-icon>
        <p>该内容需要密码访问</p>
      </div>

      <!-- 解锁后内容 -->
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
          </div>

          <div v-if="isSeries && episodeList.length" class="play-episodes">
            <EpisodeList
              :episodes="episodeList"
              :current-id="currentEpisodeId"
              @select="selectEpisode"
            />
          </div>
        </div>
      </template>

      <!-- 密码输入弹窗 -->
      <el-dialog
        v-model="showPwdDialog"
        title="请输入密码"
        width="90%"
        style="max-width: 400px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        align-center
      >
        <p class="lock-tip">该内容需要密码访问</p>
        <p class="pwd-tip">
          <router-link to="/reward" class="pwd-reward-link">任意打赏</router-link>
          +Q群 1101193338 发截图获取密码
        </p>
        <el-input
          v-model="pwdInput"
          type="password"
          placeholder="请输入密码"
          show-password
          :disabled="lockCountdown > 0"
          @keyup.enter="submitPwd"
        />
        <div v-if="lockCountdown > 0" class="pwd-error">
          密码错误次数过多，请 {{ lockCountdown }} 秒后重试
        </div>
        <div v-else-if="pwdError" class="pwd-error">{{ pwdError }}</div>
        <template #footer>
          <el-button
            type="primary"
            :disabled="lockCountdown > 0"
            @click="submitPwd"
          >确认</el-button>
        </template>
      </el-dialog>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Star, Lock, CoffeeCup, Present } from '@element-plus/icons-vue'
import { useMediaData } from '@/composables/useMediaData'
import EpisodeList from '@/components/media/EpisodeList.vue'

const route = useRoute()
const router = useRouter()

const type = computed(() => route.params.type)
const id = computed(() => Number(route.params.id))
const isSeries = computed(() => {
  if (type.value === 'movie') return false
  if (['tv', 'variety'].includes(type.value)) return true
  if (type.value === 'food') return item.value?.category === 'tv'
  if (type.value === 'anime') return item.value?.category === 'tv'
  return false
})

const { list, loading, load } = useMediaData(type.value)

const item = computed(() => {
  return (list.value || []).find((it) => it.id === id.value) || null
})

const episodeList = computed(() => item.value?.episodeList || [])
const currentEpisodeId = ref(null)
const movieSource = ref('')

const currentSource = computed(() => {
  if (isSeries.value) {
    const ep = episodeList.value.find((e) => e.id === currentEpisodeId.value)
    if (ep?.source) return ep.source
    return item.value?.source || ''
  }
  return movieSource.value || (item.value?.source ?? '')
})

function selectEpisode(ep) {
  currentEpisodeId.value = ep.id
}

function initSource() {
  if (!item.value) return
  if (isSeries.value) {
    currentEpisodeId.value = episodeList.value[0]?.id ?? null
  } else {
    movieSource.value = item.value.source || ''
  }
}

watch(item, initSource, { immediate: true })

// 密码锁定逻辑：item 带 password 字段则需输入密码，正确后缓存到 localStorage
// 错误 5 次后短期锁定（30s 起步，每再错叠加 30s，上限 5 分钟），状态持久化防刷新绕过
const locked = ref(true)
const showPwdDialog = ref(false)
const pwdInput = ref('')
const pwdError = ref('')
const lockCountdown = ref(0)
let lockTimer = null

const FAIL_THRESHOLD = 5
const LOCK_STEP = 30
const LOCK_MAX = 300

function pwdKey() {
  return `v_movie_pwd_${type.value}_${id.value}`
}
function failKey() {
  return `v_movie_pwd_fail_${type.value}_${id.value}`
}
function lockKey() {
  return `v_movie_pwd_lock_${type.value}_${id.value}`
}

function getFailCount() {
  return Number(localStorage.getItem(failKey()) || 0)
}

function clearLock() {
  localStorage.removeItem(lockKey())
  if (lockTimer) {
    clearInterval(lockTimer)
    lockTimer = null
  }
  lockCountdown.value = 0
}

function startCountdown() {
  const until = Number(localStorage.getItem(lockKey()) || 0)
  if (!until || until <= Date.now()) {
    clearLock()
    return
  }
  const tick = () => {
    const remain = Math.ceil((until - Date.now()) / 1000)
    if (remain <= 0) {
      clearLock()
    } else {
      lockCountdown.value = remain
    }
  }
  tick()
  if (lockTimer) clearInterval(lockTimer)
  lockTimer = setInterval(tick, 1000)
}

function checkLock() {
  if (!item.value) return
  const pwd = item.value.password
  if (!pwd) {
    locked.value = false
    showPwdDialog.value = false
    return
  }
  const cached = localStorage.getItem(pwdKey())
  if (cached === pwd) {
    locked.value = false
    showPwdDialog.value = false
    return
  }
  locked.value = true
  showPwdDialog.value = true
  pwdInput.value = ''
  pwdError.value = ''
  startCountdown()
}

function submitPwd() {
  const pwd = item.value?.password
  if (!pwd || lockCountdown.value > 0) return
  if (pwdInput.value === pwd) {
    localStorage.setItem(pwdKey(), pwdInput.value)
    localStorage.removeItem(failKey())
    clearLock()
    locked.value = false
    showPwdDialog.value = false
    pwdInput.value = ''
    pwdError.value = ''
  } else {
    const failCount = getFailCount() + 1
    localStorage.setItem(failKey(), String(failCount))
    pwdInput.value = ''
    if (failCount >= FAIL_THRESHOLD) {
      const seconds = Math.min(LOCK_STEP * (failCount - FAIL_THRESHOLD + 1), LOCK_MAX)
      localStorage.setItem(lockKey(), String(Date.now() + seconds * 1000))
      startCountdown()
    } else {
      pwdError.value = `密码错误，剩余 ${FAIL_THRESHOLD - failCount} 次尝试机会`
    }
  }
}

watch(item, checkLock, { immediate: true })

onBeforeUnmount(() => {
  if (lockTimer) clearInterval(lockTimer)
})

function goBack() {
  router.push(`/${type.value}`)
}

function goReward() {
  router.push('/reward')
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

.lock-placeholder {
  text-align: center;
  padding: 100px 0;
  color: var(--text-secondary);

  .lock-icon {
    font-size: 48px;
    color: var(--el-color-primary);
    margin-bottom: $space-md;
  }

  p {
    margin: 0;
    font-size: 15px;
  }
}

.lock-tip {
  margin: 0 0 12px;
  color: var(--text-secondary);
  font-size: 14px;
}

.pwd-tip {
  margin: 0 0 16px;
  padding: 10px 12px;
  background: var(--bg-card);
  border: 1px solid var(--border-color-light);
  border-radius: $radius-sm;
  color: var(--text-regular);
  font-size: 13px;
  line-height: 1.6;

  .pwd-reward-link {
    color: var(--el-color-primary);
    font-weight: 600;
    text-decoration: underline;
  }
}

.pwd-error {
  color: var(--el-color-danger);
  margin-top: 8px;
  font-size: 13px;
}

.reward-entry {
  margin-top: $space-lg;
  display: flex;
  align-items: center;
  gap: $space-md;
  padding: $space-md $space-lg;
  border-radius: $radius-md;
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  border: 1px solid #fdba74;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba(249, 115, 22, 0.08) 0%, transparent 70%);
    border-radius: 50%;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(249, 115, 22, 0.18);
    border-color: #f97316;
  }

  &:active {
    transform: translateY(0);
  }
}

.reward-entry-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(249, 115, 22, 0.3);

  .el-icon {
    font-size: 22px;
  }
}

.reward-entry-text {
  flex: 1;
  min-width: 0;

  .reward-entry-title {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #9a3412;
    line-height: 1.4;
  }

  .reward-entry-desc {
    margin: 2px 0 0;
    font-size: 12px;
    color: #c2410c;
    opacity: 0.85;
  }
}

.reward-entry-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  border-radius: 999px;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 3px 8px rgba(234, 88, 12, 0.35);
  transition: all 0.2s ease;

  .el-icon {
    font-size: 14px;
  }

  .reward-entry:hover & {
    box-shadow: 0 4px 12px rgba(234, 88, 12, 0.45);
  }
}

@media (max-width: $bp-mobile) {
  .reward-entry {
    padding: $space-sm $space-md;
    gap: $space-sm;
  }

  .reward-entry-icon {
    width: 38px;
    height: 38px;

    .el-icon {
      font-size: 18px;
    }
  }

  .reward-entry-text {
    .reward-entry-title {
      font-size: 14px;
    }

    .reward-entry-desc {
      font-size: 11px;
    }
  }

  .reward-entry-btn {
    padding: 6px 12px;
    font-size: 12px;

    .el-icon {
      font-size: 12px;
    }
  }
}
</style>
