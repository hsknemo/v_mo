<template>
  <AppLayout />
</template>

<script setup>
import { onBeforeMount } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { setGlobalPassword } from '@/composables/usePagePassword'

// 全局页面访问密码声明处
// 留空字符串 '' 表示关闭全站密码保护（所有路由页面直接访问）
// 填入任意字符串后，除免密页外的所有页面都需先通过密码
// const PAGE_PASSWORD = '61d4bb66-794f-447e-a8e4-9c756292547d'
const PAGE_PASSWORD = ''

onBeforeMount(() => {
  setGlobalPassword(PAGE_PASSWORD)
})
</script>
