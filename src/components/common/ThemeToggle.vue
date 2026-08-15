<template>
  <el-switch
    :model-value="isDark"
    inline-prompt
    active-text="夜"
    inactive-text="日"
    class="theme-toggle"
    @change="toggle"
  />
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'

const { isDark } = useTheme()

function toggle(val) {
  isDark.value = val
}
</script>

<style scoped lang="scss">
.theme-toggle {
  --el-switch-on-color: #2c2c2e;
  --el-switch-off-color: #ffb274;
}
</style>
