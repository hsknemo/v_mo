<template>
  <div v-loading="loading" class="banner-carousel">
    <swiper
      v-if="banners.length"
      :modules="modules"
      effect="fade"
      :fade-effect="{ crossFade: true }"
      :loop="banners.length > 1"
      :speed="800"
      :autoplay="{ delay: 4500, disableOnInteraction: false }"
      :pagination="{ clickable: true }"
      :navigation="true"
      class="banner-swiper"
    >
      <swiper-slide
        v-for="(b, i) in banners"
        :key="i"
        class="banner-slide"
        @click="goLink(b.link)"
      >
        <img :src="b.image" :alt="b.title" class="banner-img" loading="lazy" />
        <div class="banner-mask"></div>
        <div class="banner-content">
          <h2 class="banner-title">{{ b.title }}</h2>
          <p v-if="b.subtitle" class="banner-subtitle">{{ b.subtitle }}</p>
          <button
            v-if="b.cta"
            class="banner-cta"
            @click.stop="goLink(b.link)"
          >
            {{ b.cta }}
          </button>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'
import { useRouter } from 'vue-router'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

defineProps({
  banners: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})

const router = useRouter()
const modules = [Autoplay, Pagination, Navigation, EffectFade]

function goLink(link) {
  if (link) router.push(link)
}
</script>

<style scoped lang="scss">
.banner-carousel {
  width: 100%;
  background: #000;
  min-height: clamp(300px, 42vw, 520px);
}

.banner-swiper {
  width: 100%;
  height: clamp(300px, 42vw, 520px);

  // 覆盖 swiper 主题色为品牌橙
  --swiper-theme-color: #ff8a3d;
  --swiper-navigation-size: 28px;
}

.banner-slide {
  position: relative;
  cursor: pointer;
  overflow: hidden;
}

.banner-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.banner-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.72) 0%,
    rgba(0, 0, 0, 0.35) 45%,
    rgba(0, 0, 0, 0.05) 75%
  );
}

.banner-content {
  position: absolute;
  left: clamp(20px, 6vw, 80px);
  bottom: clamp(28px, 6vw, 72px);
  max-width: 560px;
  color: #fff;
}

.banner-title {
  margin: 0 0 $space-sm;
  font-size: clamp(26px, 4vw, 44px);
  font-weight: 800;
  letter-spacing: 1px;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.4);
}

.banner-subtitle {
  margin: 0 0 $space-lg;
  font-size: clamp(14px, 1.6vw, 18px);
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.4);
}

.banner-cta {
  padding: 10px 26px;
  border: none;
  border-radius: 999px;
  background: var(--gradient-brand);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(255, 138, 61, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 138, 61, 0.55);
  }
}

// 分页点加大、可点击
:deep(.swiper-pagination-bullet) {
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.55);
  opacity: 1;
}

:deep(.swiper-pagination-bullet-active) {
  width: 24px;
  border-radius: 6px;
  background: var(--gradient-brand);
}

:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);

  &::after {
    font-size: 18px;
    font-weight: 700;
  }
}

:deep(.swiper-button-prev) {
  left: 16px;
}

:deep(.swiper-button-next) {
  right: 16px;
}

@media (max-width: $bp-mobile) {
  /* 移动端用 dvh 适配浏览器地址栏伸缩 */
  .banner-carousel {
    height: calc(100vh - #{$header-height});
    height: calc(100dvh - #{$header-height});
  }

  .banner-mask {
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0.75) 100%
    );
  }

  .banner-content {
    left: 20px;
    right: 20px;
    bottom: 36px;
  }

  :deep(.swiper-button-prev),
  :deep(.swiper-button-next) {
    display: none;
  }
}
</style>
