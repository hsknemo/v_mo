<template>
  <div class="app-layout">
    <AppHeader />
    <main class="app-main" :class="{ 'is-locked': isLockedView }">
      <div v-if="isLockedView" class="view-lock">
        <div class="view-lock-card">
          <el-icon :size="40" class="view-lock-icon"><Lock /></el-icon>
          <h3 class="view-lock-title">内容已加密</h3>
          <p class="view-lock-desc">请输入访问密码后继续浏览</p>
          <el-button type="primary" size="large" round @click="ensureUnlocked(true)">
            输入密码
          </el-button>
        </div>
      </div>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <AppFooter />

    <!-- 首进页面欢迎弹窗 -->
    <el-dialog
      v-model="welcomeVisible"
      width="90%"
      style="max-width: 420px"
      align-center
      :close-on-click-modal="false"
      show-close
      class="welcome-dialog"
    >
      <div class="welcome-content">
        <div class="welcome-icon">
          <el-icon :size="42"><Star /></el-icon>
        </div>
        <h3 class="welcome-title">欢迎来到 维默观影</h3>

        <div class="welcome-card reward-card-item">
          <div class="card-left">
            <el-icon class="card-icon"><CoffeeCup /></el-icon>
          </div>
          <div class="card-info">
            <p class="card-title">任意打赏支持</p>
            <p class="card-desc">您的支持是持续更新的最大动力</p>
          </div>
          <router-link to="/reward" class="card-btn" @click="welcomeVisible = false">
            <el-icon><Present /></el-icon>
            <span>前往打赏</span>
          </router-link>
        </div>

        <div class="welcome-card qq-card-item">
          <div class="card-left">
            <el-icon class="card-icon qq-icon"><ChatDotRound /></el-icon>
          </div>
          <div class="card-info">
            <p class="card-title">催更群 QQ</p>
            <p class="card-qq">1101193338</p>
          </div>
          <button class="card-btn copy-btn" @click="copyQQ">
            <span v-if="copied">✓ 已复制</span>
            <span v-else>📋 复制群号</span>
          </button>
        </div>

        <div class="qr-block">
          <div class="qr-item">
            <div class="qr-img-wrap">
              <img src="/chat/qq.png" alt="QQ 群二维码" @error="onQrError($event, 'qq')" />
            </div>
            <span class="qr-label">QQ 群</span>
          </div>
          <div class="qr-item">
            <div class="qr-img-wrap">
              <img src="/chat/weixin.png" alt="微信群二维码" @error="onQrError($event, 'wx')" />
            </div>
            <span class="qr-label">微信群</span>
          </div>
        </div>

        <p class="welcome-tip">感谢您的支持，祝您观影愉快 🎬</p>
      </div>
    </el-dialog>

    <!-- 页面级密码弹窗（除赞赏/联系我外） -->
    <el-dialog
      v-model="showPagePwdDialog"
      title="访问密码"
      width="90%"
      style="max-width: 400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      align-center
    >
      <p class="page-pwd-tip">该内容需要密码访问</p>
      <p class="page-pwd-tip">已经打赏过的宝子可以用发的密码浏览所有内容及催更或发想看的剧</p>
      <p class="page-pwd-hint">
        <router-link to="/reward" class="page-pwd-link">任意打赏</router-link>
        +Q群 1101193338 / 或者微信群 发截图获取密码
      </p>
      <el-input
        v-model="pwdInputValue"
        type="password"
        placeholder="请输入密码"
        show-password
        :disabled="lockCountdown > 0"
        @keyup.enter="submitPwd"
      />
      <div v-if="lockCountdown > 0" class="page-pwd-error">
        密码错误次数过多，请 {{ lockCountdown }} 秒后重试
      </div>
      <div v-else-if="pwdErrorMsg" class="page-pwd-error">{{ pwdErrorMsg }}</div>
      <template #footer>
        <el-button
          type="primary"
          :disabled="lockCountdown > 0"
          @click="submitPwd"
        >确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Star, CoffeeCup, Present, ChatDotRound, Lock } from '@element-plus/icons-vue'
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import { usePagePassword } from '@/composables/usePagePassword'

const route = useRoute()
const router = useRouter()
const welcomeVisible = ref(false)
const copied = ref(false)

const {
  globalPassword,
  loaded,
  unlocked,
  showDialog: showPagePwdDialog,
  pwdInput: pwdInputValue,
  pwdError: pwdErrorMsg,
  lockCountdown,
  requiresPassword,
  loadPagePassword,
  ensureUnlocked,
  submitPwd,
} = usePagePassword()

// 免密码页面：赞赏、联系我、首页（电影）
const FREE_PAGES = ['reward', 'contact', 'movie']

const isProtectedPage = computed(() => {
  const n = route.name
  // 首页进入时路由可能尚未解析（name 为 undefined），不再按受保护页处理，避免误弹密码框
  // if (!n) return true
  if (!n) return false
  return !FREE_PAGES.includes(n)
})

const isLockedView = computed(() => {
  if (!loaded.value) return false
  if (!requiresPassword.value) return false
  if (!isProtectedPage.value) return false
  return !unlocked.value
})

let guardTimer = null
function startGuard() {
  if (guardTimer) return
  // 1.5s 轮询一次：缓存被清 / 密码弹窗被 DOM 强制关掉时，强制重新弹窗
  guardTimer = setInterval(() => {
    if (!loaded.value) return
    if (!requiresPassword.value) return
    if (!isProtectedPage.value) return
    ensureUnlocked()
  }, 1500)
}

async function checkPagePassword() {
  await loadPagePassword()
  if (!requiresPassword.value) return
  if (!isProtectedPage.value) return
  ensureUnlocked()
}

// 监听 showDialog：被用户通过 DOM 操作强制关闭时，立即恢复
watch(showPagePwdDialog, (v) => {
  if (v) return
  if (!loaded.value) return
  if (!requiresPassword.value) return
  if (!isProtectedPage.value) return
  if (unlocked.value) return
  // 100ms 后回弹，避免竞态
  setTimeout(() => {
    showPagePwdDialog.value = true
  }, 100)
})

// unlocked 由 false → true 时（正常输对密码），不回弹；clear: 不需要

onMounted(async () => {
  // 等待路由解析完成再检查密码，避免首页进入时误弹输入密码弹窗
  await router.isReady()
  await checkPagePassword()
  startGuard()
  setTimeout(() => {
    welcomeVisible.value = true
  }, 300)
})

onBeforeUnmount(() => {
  if (guardTimer) {
    clearInterval(guardTimer)
    guardTimer = null
  }
})

watch(
  () => route.name,
  (name) => {
    // 免密码页面：任何情况下都自动关闭密码弹窗
    if (FREE_PAGES.includes(name)) {
      if (showPagePwdDialog.value) showPagePwdDialog.value = false
      return
    }
    checkPagePassword()
  }
)

function copyQQ() {
  const qq = '1101193338'
  const doFallback = () => {
    const textarea = document.createElement('textarea')
    textarea.value = qq
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
      onCopied()
    } catch (e) {
      ElMessage.error('复制失败，请手动复制')
    } finally {
      document.body.removeChild(textarea)
    }
  }
  const onCopied = () => {
    copied.value = true
    ElMessage.success('群号已复制')
    setTimeout(() => { copied.value = false }, 2000)
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(qq).then(onCopied).catch(doFallback)
  } else {
    doFallback()
  }
}

function onQrError(e, type) {
  const el = e.target
  const wrap = el.parentElement
  if (!wrap) return
  el.style.display = 'none'
  const fallback = document.createElement('div')
  fallback.className = 'qr-fallback'
  if (type === 'qq') {
    fallback.innerHTML = '<span>💬</span><small>QQ群二维码</small>'
  } else {
    fallback.innerHTML = '<span>💚</span><small>微信群二维码</small>'
  }
  wrap.appendChild(fallback)
}

onMounted(() => {
  // 首进页面弹窗 - 每次进入网站时显示
  setTimeout(() => {
    welcomeVisible.value = true
  }, 300)
})
</script>

<style scoped lang="scss">
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-main {
  flex: 1;
  padding: $space-xl 0;

  @media (max-width: $bp-mobile) {
    padding: $space-lg 0;
  }
}

/* 欢迎弹窗样式 */
.welcome-content {
  text-align: center;
  padding: $space-xs 0;
}

.welcome-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto $space-md;
  border-radius: 50%;
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 18px rgba(249, 115, 22, 0.35);
}

.welcome-title {
  margin: 0 0 $space-lg;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.welcome-card {
  display: flex;
  align-items: center;
  gap: $space-sm;
  padding: $space-md;
  border-radius: $radius-md;
  margin-bottom: $space-sm;
  text-align: left;
  transition: all 0.2s ease;
}

.reward-card-item {
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  border: 1px solid #fdba74;

  &:hover {
    border-color: #f97316;
    box-shadow: 0 4px 14px rgba(249, 115, 22, 0.15);
  }
}

.qq-card-item {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #93c5fd;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.15);
  }
}

.card-left {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.reward-card-item .card-left {
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
}

.qq-card-item .card-left {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
}

.card-icon {
  font-size: 20px;
}

.card-info {
  flex: 1;
  min-width: 0;

  .card-title {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.4;
    color: rgb(128, 128, 128);
  }

  .card-desc,
  .card-qq {
    margin: 2px 0 0;
    font-size: 12px;
    color: rgb(128, 128, 128);
  }

  .card-qq {
    font-weight: 700;
    font-size: 15px;
  }
}

.card-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 7px 12px;
  border-radius: 999px;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;

  .el-icon {
    font-size: 13px;
  }
}

.reward-card-item .card-btn {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  box-shadow: 0 3px 8px rgba(234, 88, 12, 0.35);

  &:hover {
    box-shadow: 0 4px 12px rgba(234, 88, 12, 0.5);
    transform: translateY(-1px);
  }
}

.qq-card-item .card-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 3px 8px rgba(37, 99, 235, 0.35);

  &:hover {
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.5);
    transform: translateY(-1px);
  }
}

.welcome-tip {
  margin: $space-lg 0 0;
  font-size: 13px;
  color: rgb(128, 128, 128);
  font-weight: 500;
}

.qr-block {
  display: flex;
  justify-content: center;
  gap: $space-lg;
  margin-top: $space-md;
  flex-wrap: wrap;
}

.qr-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-xs;
}

.qr-img-wrap {
  position: relative;
  width: 110px;
  height: 110px;
  border-radius: $radius-md;
  overflow: hidden;
  border: 1px solid var(--border-color);
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.qr-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: var(--bg-elevated);
  color: var(--text-secondary);

  span {
    font-size: 36px;
  }

  small {
    font-size: 11px;
    opacity: 0.8;
  }
}

.qr-label {
  font-size: 12px;
  font-weight: 600;
  color: rgb(128, 128, 128);
}

/* 穿透 dialog header */
:deep(.welcome-dialog .el-dialog__header) {
  padding-bottom: 0;
  margin-right: 8px;
}

:deep(.welcome-dialog .el-dialog__body) {
  padding-top: $space-sm;
}

@media (max-width: $bp-mobile) {
  .welcome-icon {
    width: 60px;
    height: 60px;

    .el-icon {
      font-size: 32px !important;
    }
  }

  .welcome-title {
    font-size: 18px;
  }

  .welcome-card {
    padding: $space-sm;
    gap: $space-xs;
  }

  .card-left {
    width: 36px;
    height: 36px;
    border-radius: 8px;

    .card-icon {
      font-size: 18px;
    }
  }

  .card-info {
    .card-title {
      font-size: 13px;
    }

    .card-desc {
      font-size: 11px;
    }

    .card-qq {
      font-size: 14px;
    }
  }

  .card-btn {
    padding: 6px 10px;
    font-size: 11px;

    .el-icon {
      font-size: 12px;
    }
  }

  .qr-block {
    gap: $space-md;
  }

  .qr-img-wrap {
    width: 90px;
    height: 90px;
  }
}

/* 页面级密码弹窗样式 */
.page-pwd-tip {
  margin: 0 0 $space-sm;
  font-size: 14px;
  color: var(--text-regular);
  text-align: center;
}

.page-pwd-hint {
  margin: 0 0 $space-md;
  font-size: 13px;
  color: var(--text-regular);
  text-align: center;
  line-height: 1.6;
}

.page-pwd-link {
  color: var(--el-color-primary);
  font-weight: 700;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
  cursor: pointer;
}

.page-pwd-error {
  margin-top: $space-sm;
  font-size: 13px;
  color: var(--el-color-danger);
  line-height: 1.5;
}

/* 页面级锁定遮罩 */
.app-main.is-locked {
  position: relative;
  min-height: 70vh;

  > *:not(.view-lock) {
    visibility: hidden !important;
    pointer-events: none !important;
  }
}

.view-lock {
  position: relative;
  z-index: 10;
  width: 100%;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-lg;
}

.view-lock-card {
  max-width: 360px;
  width: 100%;
  padding: $space-xl $space-lg;
  text-align: center;
  background: var(--bg-elevated);
  border-radius: $radius-lg;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-card);
}

.view-lock-icon {
  color: var(--el-color-primary);
  margin-bottom: $space-md;
}

.view-lock-title {
  margin: 0 0 $space-xs;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.view-lock-desc {
  margin: 0 0 $space-lg;
  font-size: 13px;
  color: rgb(128, 128, 128);
}
</style>
