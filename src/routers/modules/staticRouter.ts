// src/routers/modules/staticRouter.ts
import type { RouteRecordRaw } from 'vue-router';
import { HOME_URL, LOGIN_URL } from '@/config';

/** 静态路由（所有人可访问） */
export const staticRouter: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: HOME_URL,
  },
  {
    path: LOGIN_URL,
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录页' },
  },
  {
    path: '/layout',
    name: 'layout',
    redirect: HOME_URL,
    component: () => import('@/layouts/LayoutClassic/index.vue'),
    children: [
      {
        path: HOME_URL,
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页', icon: 'HomeFilled' },
      },

      {
        path: '/proTable',
        name: 'proTable',
        component: () => import('@/views/proTable/index.vue'),
        meta: { title: 'ProTable演示', icon: 'Grid' },
      },
      {
        path: '/directives',
        name: 'directives',
        component: () => import('@/views/directives/index.vue'),
        meta: { title: '自定义指令演示', icon: 'MagicStick' },
      },
    ],
  },
];

/** 错误页面路由（独立出来，方便后续动态路由兜底） */
export const errorRouter: RouteRecordRaw[] = [
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error/403.vue'),
    meta: { title: '403' },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404' },
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/error/500.vue'),
    meta: { title: '500' },
  },
  // 所有未匹配的路径 → 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
];
