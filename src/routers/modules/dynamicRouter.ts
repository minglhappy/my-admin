// src/routers/modules/dynamicRouter.ts
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/modules/auth';
import type { Router } from 'vue-router';
import { getMenuListApi } from '@/api/modules/menu';

const modules = import.meta.glob('@/views/**/**.vue');

export function transformMenuToRoute(menus: Menu.MenuOptions[]): RouteRecordRaw[] {
  console.log(Object.keys(modules).filter((k) => k.includes('virtual')));
  console.log(modules['/src/views/proTable/virtualTable.vue']);
  return menus.map((menu) => ({
    path: menu.path,
    name: menu.name,
    component: modules[`/src/views/${menu.component}.vue`],
    meta: menu.meta,
  }));
}

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
export async function initDynamicRouter(router: Router) {
  const authStore = useAuthStore();

  const res = await getMenuListApi();
  const routes = transformMenuToRoute(res.data);
  const addedRoutes: RouteRecordRaw[] = [];
  routes.forEach((route) => {
    if (route.name && !router.hasRoute(route.name as string)) {
      router.addRoute('layout', route);
      addedRoutes.push(route);
    }
  });

  authStore.setAuthMenuList(res.data);
  authStore.setFlatMenuList(addedRoutes);

  // TODO: 阶段 11 接 Mock 接口，目前模拟一个菜单
  // authStore.setAuthMenuList([
  //   {
  //     path: '/home/index',
  //     name: 'home',
  //     meta: { title: '首页', icon: 'HomeFilled' },
  //   },
  //   {
  //     path: '/proTable',
  //     name: 'proTable',
  //     meta: { title: 'Protable演示~', icon: 'Grid' },
  //   },
  //   {
  //     path: '/directives',
  //     name: 'directives',
  //     meta: { title: '自定义指令演示', icon: 'MagicStick' },
  //   },
  // ]);
}
