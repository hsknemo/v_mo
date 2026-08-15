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

    <el-drawer v-model="drawer" direction="rtl" size="70%" :show-close="false">
      <template #header>
        <span class="drawer-title">菜单</span>
      </template>
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
    </el-drawer>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import site from '@/config/site'
import ThemeToggle from '@/components/common/ThemeToggle.vue'

const menus = site.menus
const drawer = ref(false)
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

.drawer-title {
  font-weight: 700;
  font-size: 16px;
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
