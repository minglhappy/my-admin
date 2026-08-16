// src/stores/modules/tabs.ts
import { defineStore } from 'pinia';
import type { TabsItem } from '@/stores/interface';
import { HOME_URL } from '@/config';

export const useTabsStore = defineStore('tabs', {
  state: () => ({
    tabsMenuList: [{ path: HOME_URL, title: '首页', icon: 'HomeFilled', isKeepAlive: true }] as TabsItem[],
  }),

  actions: {
    /** 添加标签页 */
    addTabs(tab: TabsItem) {
      const exists = this.tabsMenuList.find((item) => item.path === tab.path);
      if (!exists) {
        this.tabsMenuList.push(tab);
      }
    },

    /** 关闭标签页 */
    removeTabs(path: string) {
      if (path === HOME_URL) return; // 首页不可关闭
      this.tabsMenuList = this.tabsMenuList.filter((item) => item.path !== path);
    },

    /** 关闭其他标签页 */
    closeTabsOnSide(path: string, type: 'left' | 'right' | 'other') {
      const index = this.tabsMenuList.findIndex((item) => item.path === path);
      if (index === -1) return;

      if (type === 'left') {
        this.tabsMenuList = this.tabsMenuList.filter((_, i) => i >= index || this.tabsMenuList[i].path === HOME_URL);
      } else if (type === 'right') {
        this.tabsMenuList = this.tabsMenuList.filter((_, i) => i <= index || this.tabsMenuList[i].path === HOME_URL);
      } else if (type === 'other') {
        this.tabsMenuList = this.tabsMenuList.filter((item) => item.path === path || item.path === HOME_URL);
      }
    },
  },
});
