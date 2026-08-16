// src/stores/modules/auth.ts
import { defineStore } from 'pinia';
import type { RouteRecordRaw } from 'vue-router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    /** 按钮权限列表（控制页面上的按钮显隐） */
    authButtonList: [] as string[],

    /** 后端返回的菜单列表（用于动态路由） */
    authMenuList: [] as Menu.MenuOptions[],

    /** 扁平化处理后的路由列表（用于 router.addRoute） */
    flatMenuList: [] as RouteRecordRaw[],
  }),

  actions: {
    /** 设置按钮权限 */
    setAuthButtonList(buttons: string[]) {
      this.authButtonList = buttons;
    },

    /** 设置菜单列表 */
    setAuthMenuList(menus: Menu.MenuOptions[]) {
      this.authMenuList = menus;
    },

    /** 设置扁平路由 */
    setFlatMenuList(routes: RouteRecordRaw[]) {
      this.flatMenuList = routes;
    },
  },
});
