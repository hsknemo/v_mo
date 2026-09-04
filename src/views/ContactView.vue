<template>
  <div class="container contact-container">
    <h1 class="page-title">联系我</h1>

    <div class="contact-card">
      <div class="contact-intro">
        <p class="lead">想交流影视资源、反馈问题或加入讨论？</p>
        <p class="desc">欢迎加入 QQ 群，一起聊聊。</p>
      </div>

      <div class="qq-block">
        <div class="qq-icon">
          <el-icon><ChatDotRound /></el-icon>
        </div>
        <div class="qq-info">
          <span class="qq-label">QQ 群</span>
          <span class="qq-number">1101193338</span>
        </div>
        <button class="copy-btn" @click="copyQQ">
          {{ copied ? '已复制 ✓' : '复制群号' }}
        </button>
      </div>

      <div class="qr-group">
        <div class="qr-item">
          <div class="qr-img">
            <img
              v-if="!qrFallback.qq"
              src="/chat/qq.png"
              alt="QQ 群二维码"
              @error="qrFallback.qq = true"
            />
            <div v-else class="qr-fallback">
              <span>💬</span>
              <small>QQ群二维码</small>
            </div>
          </div>
          <span class="qr-name">QQ 群二维码</span>
        </div>
        <div class="qr-item">
          <div class="qr-img">
            <img
              v-if="!qrFallback.wx"
              src="/chat/weixin.png"
              alt="微信群二维码"
              @error="qrFallback.wx = true"
            />
            <div v-else class="qr-fallback">
              <span>💚</span>
              <small>微信群二维码</small>
            </div>
          </div>
          <span class="qr-name">微信群二维码</span>
        </div>
      </div>

      <div class="contact-tip">
        + 群 1101193338
      </div>
    </div>

    <GiscusComment class="contact-giscus" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ChatDotRound } from '@element-plus/icons-vue'
import GiscusComment from '@/components/common/GiscusComment.vue'

const copied = ref(false)
const qrFallback = reactive({ qq: false, wx: false })

async function copyQQ() {
  try {
    await navigator.clipboard.writeText('1101193338')
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (e) {
    const input = document.createElement('input')
    input.value = '1101193338'
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}
</script>

<style scoped lang="scss">
.contact-container {
  max-width: 640px;
}

.contact-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color-light);
  border-radius: $radius-lg;
  padding: $space-xl;
  box-shadow: var(--shadow-card);
  text-align: center;
}

.contact-intro {
  margin-bottom: $space-xl;

  .lead {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 $space-sm;
  }

  .desc {
    color: var(--text-secondary);
    line-height: 1.7;
    font-size: 14px;
    margin: 0;
  }
}

.qq-block {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-md;
  padding: $space-lg;
  border-radius: $radius-md;
  background: var(--el-color-primary-light-9);
  margin-bottom: $space-lg;
  flex-wrap: wrap;
}

.qq-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--gradient-brand);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;

  .el-icon {
    font-size: 24px;
  }
}

.qq-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.qq-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.qq-number {
  font-size: 22px;
  font-weight: 700;
  color: var(--el-color-primary);
  letter-spacing: 1px;
}

.copy-btn {
  padding: 8px 18px;
  border: none;
  border-radius: $radius-sm;
  background: var(--el-color-primary);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.85;
  }
}

.qr-group {
  display: flex;
  justify-content: center;
  gap: $space-xl;
  margin-bottom: $space-lg;
  flex-wrap: wrap;
}

.qr-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-sm;
}

.qr-img {
  position: relative;
  width: 160px;
  height: 160px;
  border-radius: $radius-md;
  overflow: hidden;
  border: 1px solid var(--border-color);
  background: #fff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);

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
  gap: 6px;
  background: var(--bg-elevated);
  color: var(--text-secondary);

  span {
    font-size: 48px;
  }

  small {
    font-size: 12px;
    opacity: 0.8;
  }
}

.qr-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-regular);
}

.contact-tip {
  padding: $space-sm $space-lg;
  border-radius: $radius-sm;
  background: var(--bg-elevated);
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 700;
  display: inline-block;
}

.tip {
  padding: $space-sm $space-lg;
  border-radius: $radius-sm;
  background: var(--bg-elevated);
  color: var(--text-regular);
  font-size: 15px;
  font-weight: 600;
  display: inline-block;
}

.contact-giscus {
  margin-top: $space-lg;
}

@media (max-width: $bp-mobile) {
  .contact-card {
    padding: $space-lg $space-md;
  }

  .qq-block {
    flex-direction: column;
    gap: $space-sm;
  }

  .qq-info {
    align-items: center;
  }

  .qr-group {
    gap: $space-lg;
  }

  .qr-img {
    width: 130px;
    height: 130px;
  }
}
</style>
