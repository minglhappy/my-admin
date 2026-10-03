<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/modules/auth';
import { useTabsStore } from '@/stores/modules/tabs';
import { useKeepAliveStore } from '@/stores/modules/keepAlive';
import { useUserStore } from '@/stores/modules/user';
import { HOME_URL, LOGIN_URL } from '@/config';
import { resetRouter } from '@/routers';
import i18n from '@/languages';
import { useI18n } from 'vue-i18n';
import { useGlobalStore } from '@/stores/modules/global';

import MenuTree from '@/layouts/components/MenuTree.vue';

const { t } = useI18n();
const globalStore = useGlobalStore();
const switchLanguage = (lang: string) => {
  globalStore.setLanguage(lang);
  i18n.global.locale.value = lang;
};

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();
const userStore = useUserStore();

/** 侧边栏是否折叠 */
const isCollapse = ref(false);

/** 菜单列表（登录后由 initDynamicRouter 填充） */
const menuList = computed(() => authStore.authMenuList);

/** 当前激活的菜单/标签 */
const activeMenu = computed(() => route.path);

/** 点击菜单跳转 */
const handleMenuClick = (path: string) => {
  if (path === route.path) return;
  router.push(path);
};

/** 切换侧边栏折叠 */
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};

/** 点击标签页切换 */
const handleTabChange = (path: string) => {
  router.push(path);
};

// 自动展开当前菜单组--default-openeds 绑定当前路径的所有父级：
// 当前路径的所有父级分组路径（用于自动展开）
const openedMenus = computed(() => route.matched.filter((r) => r.meta?.title && r.path !== route.path).map((r) => r.path));

/** 关闭标签页 */
const handleTabRemove = (path: string) => {
  tabsStore.removeTabs(path);

  // 标签关了，缓存也要一并清理，否则名单无限增长，内存，只进不出。
  const name = router.resolve(path).name as string;
  keepAliveStore.removeKeepAliveName(name);

  // 如果关闭的是当前页 → 跳到最后一个标签页
  if (path === route.path) {
    const last = tabsStore.tabsMenuList[tabsStore.tabsMenuList.length - 1];
    router.push(last?.path || HOME_URL);
  }
};

/** 下拉菜单命令处理 */
const handleCommand = (command: string) => {
  if (command === 'logout') logout();
};

/** 退出登录 */
const logout = () => {
  userStore.loginOut();
  resetRouter();
  tabsStore.$reset();
  keepAliveStore.setKeepAliveName([]);
  router.replace(LOGIN_URL);
};
</script>

<template>
  <el-container class="layout">
    <!-- ── 左侧：Logo + 菜单 ── -->
    <el-aside class="layout-aside" :class="{ 'is-collapse': isCollapse }">
      <div class="logo">MyAdmin</div>
      <el-menu
        :default-openeds="openedMenus"
        :default-active="activeMenu"
        :collapse="isCollapse"
        :collapse-transition="false"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#ffffff"
        @select="handleMenuClick"
      >
        <!-- <el-menu-item v-for="item in menuList" :key="item.path" :index="item.path">
          <el-icon><component :is="item.meta.icon || 'Menu'" /></el-icon>
          <template #title>
            {{ item.meta.title }}
          </template>
        </el-menu-item> -->

        <MenuTree :menus="menuList" />
      </el-menu>
    </el-aside>

    <el-container>
      <!-- ── 顶部栏 ── -->
      <el-header class="layout-header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="toggleCollapse">
            <Expand v-if="isCollapse" />
            <Fold v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <!-- <el-breadcrumb-item>{{ route.meta.title }}</el-breadcrumb-item> -->
            <el-breadcrumb-item v-for="item in route.matched.filter((r) => r.meta?.title)" :key="item.path">
              {{ item.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown @command="switchLanguage">
            <span class="lang-btn">{{ globalStore.language === 'zh' ? '中文' : 'English' }}</span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="zh">中文</el-dropdown-item>
                <el-dropdown-item command="en">English</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <SwitchDark />
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="30">{{ userStore.userInfo.username?.charAt(0) }}</el-avatar>
              <span class="username">{{ userStore.userInfo.username || '用户' }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout"> {{ t('layout.logout') }} </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- ── 标签页 ── -->
      <div class="layout-tabs">
        <el-tabs v-model="activeMenu" type="card" @tab-change="handleTabChange" @tab-remove="handleTabRemove">
          <el-tab-pane v-for="tab in tabsStore.tabsMenuList" :key="tab.path" :name="tab.path" :label="tab.title" :closable="tab.path !== HOME_URL" />
        </el-tabs>
      </div>

      <!-- ── 主内容区 ── -->
      <el-main class="layout-main">
        <router-view v-slot="{ Component }">
          <keep-alive :include="keepAliveStore.keepAliveName">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </el-main>

      <!-- ── 页脚 ── -->
      <el-footer class="layout-footer"> © 2026 MyAdmin v1.0.0</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;
}

.layout-aside {
  width: $aside-width;
  overflow: hidden;
  background-color: $menu-bg;
  transition: width $transition-duration;

  &.is-collapse {
    width: $aside-collapsed-width;
  }

  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    height: $header-height;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    white-space: nowrap;
  }

  .el-menu {
    border-right: none;
  }
}

.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: $header-height;
  padding: 0 15px;
  border-bottom: 1px solid $border-color-lighter;

  .header-left {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .collapse-btn {
    font-size: 20px;
    cursor: pointer;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    outline: none;
  }
}

.layout-tabs {
  padding: 5px 10px 0;
  border-bottom: 1px solid $border-color-lighter;

  :deep(.el-tabs__header) {
    margin: 0;
  }
}

.layout-main {
  overflow: auto;
  background-color: $bg-color;
}

.layout-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  color: $text-color-secondary;
  font-size: 12px;
}

html.dark .layout-main {
  background-color: #141414;
}
</style>
