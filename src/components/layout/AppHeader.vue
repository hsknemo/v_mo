<template>
  <header class="app-header">
    <div class="container header-inner">
      <router-link to="/" class="logo">
        <span class="logo-icon">🎬</span>
        <span class="logo-text">v_movie</span>
      </router-link>

      <nav class="nav-pc">
        <router-link
          v-for="m in menus"
          :key="m.name"
          :to="m.path"
          class="nav-link"
          active-class="active"
        >
          {{ m.label }}
        </router-link>
      </nav>

      <div class="header-actions">
        <ThemeToggle />
        <button class="hamburger" aria-label="菜单" @click="drawer = true">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>

  <transition name="overlay-fade">
    <div v-if="drawer" class="sidebar-overlay" @click="drawer = false"></div>
  </transition>
  <aside class="sidebar" :class="{ open: drawer }">
    <div class="sidebar-header">
      <span class="sidebar-title">菜单</span>
      <button class="sidebar-close" aria-label="关闭" @click="drawer = false">✕</button>
    </div>
    <nav class="nav-mobile">
      <router-link
        v-for="m in menus"
        :key="m.name"
        :to="m.path"
        class="mobile-link"
        active-class="active"
        @click="drawer = false"
      >
        {{ m.label }}
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { ref, watch } from 'vue'
import site from '@/config/site'
import ThemeToggle from '@/components/common/ThemeToggle.vue'

const menus = site.menus
const drawer = ref(false)

watch(drawer, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})
</script>

<style scoped lang="scss">
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: $header-height;
  background: var(--bg-header);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color-light);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.header-inner {
  height: 100%;
  display: flex;
  align-items: center;
  gap: $space-lg;
}

.logo {
  display: flex;
  align-items: center;
  gap: $space-sm;
  font-size: 20px;
  font-weight: 800;
  color: var(--text-primary);

  .logo-icon {
    font-size: 24px;
  }

  .logo-text {
    background: var(--gradient-brand);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.nav-pc {
  display: flex;
  gap: $space-md;
  margin-left: $space-md;
  flex: 1;

  .nav-link {
    padding: 6px 14px;
    border-radius: $radius-sm;
    color: var(--text-regular);
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      color: var(--el-color-primary);
      background: var(--el-color-primary-light-9);
    }

    &.active {
      color: #fff;
      background: var(--gradient-brand);
    }
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: $space-md;
}

.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;

  span {
    display: block;
    height: 2px;
    width: 100%;
    background: var(--text-primary);
    border-radius: 1px;
  }
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: var(--bg-overlay);
  z-index: 9998;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 70%;
  max-width: 320px;
  background: var(--bg-card);
  border-right: 1px solid var(--border-color);
  box-shadow: 2px 0 16px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  padding: $space-md;

  &.open {
    transform: translateX(0);
  }
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-sm $space-sm $space-md;
  border-bottom: 1px solid var(--border-color-light);
  margin-bottom: $space-md;
}

.sidebar-title {
  font-weight: 700;
  font-size: 16px;
  color: var(--text-primary);
}

.sidebar-close {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 4px 8px;
  border-radius: $radius-sm;
  color: var(--text-secondary);
  transition: all 0.2s ease;

  &:hover {
    color: var(--text-primary);
    background: var(--bg-elevated);
  }
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

.nav-mobile {
  display: flex;
  flex-direction: column;
  gap: $space-sm;

  .mobile-link {
    padding: 14px 16px;
    border-radius: $radius-md;
    color: var(--text-regular);
    font-size: 16px;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      background: var(--el-color-primary-light-9);
      color: var(--el-color-primary);
    }

    &.active {
      color: #fff;
      background: var(--gradient-brand);
    }
  }
}

@media (max-width: $bp-mobile) {
  .nav-pc {
    display: none;
  }
  .hamburger {
    display: flex;
  }
  .header-inner {
    gap: $space-sm;
  }
  .logo-text {
    font-size: 18px;
  }
}
</style>
