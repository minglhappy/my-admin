<script setup lang="ts">
import { computed, onMounted } from 'vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import enLocale from 'element-plus/es/locale/lang/en';
import i18n from '@/languages';

import { useGlobalStore } from '@/stores/modules/global';

const globalStore = useGlobalStore();

const elementLocale = computed(() => {
  return globalStore.language === 'zh' ? zhCn : enLocale;
});

onMounted(() => {
  i18n.global.locale.value = globalStore.language;
  // 刷新后从 localStorage 恢复的主题里取出 isDark,重新挂上 class
  if (globalStore.themeConfig.isDark) {
    document.documentElement.classList.add('dark');
  }
});
</script>

<template>
  <el-config-provider :locale="elementLocale">
    <router-view />
  </el-config-provider>
</template>
