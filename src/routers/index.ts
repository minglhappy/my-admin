// src/routers/index.ts
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import { staticRouter, errorRouter } from './modules/staticRouter';
import { LOGIN_URL, ROUTER_WHITE_LIST, HOME_URL } from '@/config';
import NProgress from '@/config/nprogress';

import { useUserStore } from '@/stores/modules/user';
import { useAuthStore } from '@/stores/modules/auth';
import { initDynamicRouter } from './modules/dynamicRouter';
import { useTabsStore } from '@/stores/modules/tabs';
import { useKeepAliveStore } from '@/stores/modules/keepAlive';

/** 路由模式：hash（#）或 history（无 #），从 .env 读取 */
const routerMode = import.meta.env.VITE_ROUTER_MODE;

const router = createRouter({
  history: routerMode === 'hash' ? createWebHashHistory() : createWebHistory(),
  routes: [...staticRouter, ...errorRouter],
  strict: false, // 不严格区分路径尾部斜杠
});

export default router;

// ─── 全局导航守卫 ───
router.beforeEach(async (to) => {
  // 1. 进度条开始
  NProgress.start();

  // 2. 动态设置页面标题
  document.title = (to.meta.title as string) || 'MyAdmin';

  // 3. 已登录用户访问登录页 → 重定向到首页
  // const token = localStorage.getItem("token");

  const userStore = useUserStore();
  const authStore = useAuthStore();
  const token = userStore.token;

  // 已登录用户访问登录页，重定向到首页
  if (to.path === LOGIN_URL && token) {
    NProgress.done();
    return HOME_URL;
  }

  // 未登录用户访问登录页，放行
  if (to.path === LOGIN_URL && !token) {
    return true;
  }

  // 白名单路径直接放行
  if (ROUTER_WHITE_LIST.includes(to.path)) {
    return true;
  }

  // 未登录 → 重定向到登录页
  if (!token) {
    // next({ path: LOGIN_URL, replace: true });
    NProgress.done();
    return { path: LOGIN_URL, replace: true };
  }

  if (authStore.authMenuList.length === 0) {
    // 初始化动态路由
    // await initDynamicRouter();
    await initDynamicRouter(router);
    // ★ 刷新动态路由页时，初始导航先被兜底重定向到 /404（动态路由尚未注册）
    //   redirectedFrom 记录着用户真正想去的地址——初始化完成后回那里
    const target = to.redirectedFrom?.fullPath || to.fullPath;
    return { path: target, replace: true }; // 重新导航到当前路由，确保动态路由生效
  }

  // 已登录，正常放行（动态路由后续阶段完善）
  return true;
});

router.afterEach((to) => {
  NProgress.done(); // 路由跳转完成，进度条结束

  if (to.path !== LOGIN_URL) {
    const tabsStore = useTabsStore();
    tabsStore.addTabs({ path: to.path, title: (to.meta.title as string) || '页面' });

    //标记了 isKeepAlive的页面，等级进缓存名单
    if (to.name && to.meta.isKeepAlive) {
      useKeepAliveStore().addKeepAliveName(to.name as string);
    }
  }
});

export function resetRouter() {
  const authStore = useAuthStore();
  authStore.flatMenuList.forEach((route) => {
    if (route.name && router.hasRoute(route.name as string)) {
      router.removeRoute(route.name as string);
    }
  });
  authStore.setFlatMenuList([]);
  authStore.setAuthMenuList([]);
}
