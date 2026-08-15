<template>
  <div class="app-layout">
    <AppHeader />
    <main class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
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
</style>
