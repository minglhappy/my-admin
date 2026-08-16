// src/stores/modules/keepAlive.ts
import { defineStore } from 'pinia';

export const useKeepAliveStore = defineStore('keepAlive', {
  state: () => ({
    keepAliveName: [] as string[],
  }),

  actions: {
    /** 添加缓存页面 */
    addKeepAliveName(name: string) {
      if (!this.keepAliveName.includes(name)) {
        this.keepAliveName.push(name);
      }
    },

    /** 移除缓存 */
    removeKeepAliveName(name: string) {
      this.keepAliveName = this.keepAliveName.filter((item) => item !== name);
    },

    /** 批量设置 */
    setKeepAliveName(names: string[]) {
      this.keepAliveName = names;
    },
  },
});
