<script setup lang="ts">
import { onMounted } from 'vue';
import { useGlobalStore } from '@/stores/modules/global';

const globalStore = useGlobalStore();

onMounted(() => {
  // 刷新后从 localStorage 恢复的主题里取出 isDark,重新挂上 class
  if (globalStore.themeConfig.isDark) {
    document.documentElement.classList.add('dark');
  }
});
</script>

<template>
  <router-view />
</template>
