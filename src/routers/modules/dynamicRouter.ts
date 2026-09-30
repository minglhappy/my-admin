// src/routers/modules/dynamicRouter.ts
import type { RouteRecordRaw, RouteComponent } from 'vue-router';
import { useAuthStore } from '@/stores/modules/auth';
import type { Router } from 'vue-router';
import { getMenuListApi } from '@/api/modules/menu';

const modules = import.meta.glob('@/views/**/**.vue');

/**
 * 递归转换：菜单树 → 路由树
 * RouteRecordRaw 是判别联合，必须用"分支构造"：
 * 每个分支返回的对象形状确定地匹配某一个变体
 */
export function transformMenuToRoute(menus: Menu.MenuOptions[]): RouteRecordRaw[] {
  return menus.map((menu) => {
    // 分组路由：有 redirect、无 component（重定向变体）
    if (menu.redirect) {
      return {
        path: menu.path,
        name: menu.name,
        redirect: menu.redirect,
        meta: menu.meta,
        ...(menu.children?.length ? { children: transformMenuToRoute(menu.children) } : {}),
      };
    }

    // 叶子路由：有 component、无 redirect（单视图变体）
    return {
      path: menu.path,
      name: menu.name,
      component: modules[`/src/views/${menu.component}.vue`] as RouteComponent,
      meta: menu.meta,
    };
  });
}

// /** 递归注册：父级挂 layout 下，子级挂父级名下 */
// function registerRoutes(router: Router, routes: RouteRecordRaw[], parentName?: string) {
//   routes.forEach((route) => {
//     const target = parentName || 'layout';
//     if (route.name && !router.hasRoute(route.name as string)) {
//       router.addRoute(target, route);
//     }
//     if (route.children?.length) {
//       registerRoutes(router, route.children, route.name as string);
//     }
//   });
// }

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

    // ★ 子级挂到父级名下（子级 path 是绝对路径，挂哪个父级都能正常匹配 URL）
    route.children?.forEach((child) => {
      if (child.name && !router.hasRoute(child.name as string)) {
        router.addRoute(route.name as string, child);
        addedRoutes.push(child);
      }
    });
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
