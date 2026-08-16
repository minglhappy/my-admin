// src/stores/modules/global.ts
import { defineStore } from 'pinia';
import { DEFAULT_PRIMARY } from '@/config';
import type { ThemeConfig } from '@/stores/interface';
import { createPersistedState } from '@/stores/helper/persist';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    /** 语言：zh 中文 / en 英文 */
    language: 'zh' as string,

    /** Element 组件大小：default / small / large */
    assemblySize: 'default' as string,

    /** 主题配置 */
    themeConfig: {
      primary: DEFAULT_PRIMARY,
      isDark: false,
      isGrey: false,
      isWeak: false,
      layout: 'classic',
      breadcrumb: true,
      tabs: true,
      footer: true,
    } as ThemeConfig,
  }),

  actions: {
    /** 切换语言 */
    setLanguage(lang: string) {
      this.language = lang;
    },

    /** 切换组件大小 */
    setAssemblySize(size: string) {
      this.assemblySize = size;
    },

    /** 更新主题配置（支持部分更新） */
    setThemeConfig(config: Partial<ThemeConfig>) {
      Object.assign(this.themeConfig, config);
    },
  },

  // 持久化，刷新后保持用户偏好
  persist: createPersistedState('global', ['language', 'assemblySize', 'themeConfig']),
});
