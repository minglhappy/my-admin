<script setup lang="ts">
import { useGlobalStore } from '@/stores/modules/global';

const globalStore = useGlobalStore();

/** 切换暗黑模式：① 持久化到 store ② 切换 html 的 dark class */
const toggleDark = (val: string | number | boolean) => {
  const isDark = Boolean(val);
  globalStore.setThemeConfig({ isDark });
  document.documentElement.classList.toggle('dark', isDark);
};
</script>

<template>
  <el-switch :model-value="globalStore.themeConfig.isDark" size="large" inline-prompt active-icon="Moon" inactive-icon="Sunny" @change="toggleDark" />
</template>
