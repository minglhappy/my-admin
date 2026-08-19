// src/routers/modules/dynamicRouter.ts
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/modules/auth';

/** 动态路由（登录后根据角色加载，后面阶段逐个添加） */
export const dynamicRouter: RouteRecordRaw[] = [
  // 阶段 8 后会逐步添加：用户管理、角色管理、图表、表单等
];

/**
 * 初始化动态路由
 * 1. 调接口获取菜单列表
 * 2. 转换菜单为路由格式
 * 3. 通过 router.addRoute 动态注册
 */
export async function initDynamicRouter() {
  const authStore = useAuthStore();

  // TODO: 阶段 11 接 Mock 接口，目前模拟一个菜单
  authStore.setAuthMenuList([
    {
      path: '/home/index',
      name: 'home',
      meta: { title: '首页', icon: 'HomeFilled' },
    },
    {
      path: '/proTable',
      name: 'proTable',
      meta: { title: 'Protable演示~', icon: 'Grid' },
    },
  ]);
}
