<template>
  <div class="container reward-container">
    <h1 class="page-title">赞赏支持</h1>

    <div class="reward-card">
      <div class="reward-intro">
        <p class="lead">如果这个站点对你有帮助，可以请作者喝杯咖啡 ☕</p>
        <p class="desc">
          你的支持是持续更新的动力，金额不限，心意到即可。<br />
          扫描下方二维码即可赞赏。
        </p>
      </div>

      <div class="qr-group">
        <div v-for="q in qrs" :key="q.name" class="qr-item">
          <div class="qr-img">
            <img :src="q.src" :alt="q.name" @error="onError($event, q)" />
            <div v-if="q.fallback" class="qr-fallback">
              <span>{{ q.icon }}</span>
              <span>{{ q.name }}二维码</span>
              <small>请替换为真实二维码</small>
            </div>
          </div>
          <span class="qr-name">{{ q.name }}</span>
        </div>
      </div>

      <div class="thanks">
        <el-icon><Coffee /></el-icon>
        <span>感谢每一份支持！</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { Coffee } from '@element-plus/icons-vue'

const qrs = reactive([
  {
    name: '微信赞赏',
    icon: '💚',
    src: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wechat%20donation%20QR%20code%20placeholder%20green%20clean&image_size=square_hd',
    fallback: false
  },
  {
    name: '支付宝赞赏',
    icon: '💙',
    src: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=alipay%20donation%20QR%20code%20placeholder%20blue%20clean&image_size=square_hd',
    fallback: false
  }
])

function onError(e, q) {
  q.fallback = true
  e.target.style.display = 'none'
}
</script>

<style scoped lang="scss">
.reward-container {
  max-width: 760px;
}

.reward-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color-light);
  border-radius: $radius-lg;
  padding: $space-xl;
  box-shadow: var(--shadow-card);
  text-align: center;
}

.reward-intro {
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

.qr-group {
  display: flex;
  justify-content: center;
  gap: $space-xl;
  flex-wrap: wrap;
  margin-bottom: $space-xl;
}

.qr-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-sm;
}

.qr-img {
  position: relative;
  width: 180px;
  height: 180px;
  border-radius: $radius-md;
  overflow: hidden;
  border: 1px solid var(--border-color);
  background: var(--bg-elevated);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
  font-size: 14px;
  font-weight: 600;

  span:first-child {
    font-size: 36px;
  }

  small {
    font-weight: 400;
    font-size: 11px;
    opacity: 0.7;
  }
}

.qr-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-regular);
}

.thanks {
  display: inline-flex;
  align-items: center;
  gap: $space-sm;
  padding: $space-sm $space-lg;
  border-radius: $radius-md;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  font-weight: 600;
  font-size: 14px;

  .el-icon {
    font-size: 18px;
  }
}

@media (max-width: $bp-mobile) {
  .reward-card {
    padding: $space-lg $space-md;
  }
  .qr-group {
    gap: $space-lg;
  }
  .qr-img {
    width: 150px;
    height: 150px;
  }
}
</style>
