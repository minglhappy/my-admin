// src/stores/modules/user.ts
import { defineStore } from 'pinia';
import type { UserInfo } from '@/stores/interface';
import { createPersistedState } from '@/stores/helper/persist';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userInfo: {} as UserInfo,
  }),

  actions: {
    /** 设置 token */
    setToken(token: string) {
      this.token = token;
    },

    /** 设置用户信息 */
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo;
    },

    /** 退出登录 */
    loginOut() {
      this.token = '';
      this.userInfo = {} as UserInfo;
    },
  },

  // ★ 持久化 token，刷新不丢失
  persist: createPersistedState('user', ['token', 'userInfo']),
});
