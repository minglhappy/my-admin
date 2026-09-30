<script setup lang="ts">
import { useRouter } from 'vue-router';

interface MenuTreeProps {
  menus: Menu.MenuOptions[];
}

defineProps<MenuTreeProps>();

const router = useRouter();

/** 点击叶子菜单跳转 */
const handleSelect = (path: string) => {
  router.push(path);
};
</script>

<template>
  <template v-for="menu in menus" :key="menu.path">
    <!-- 递归出口：没有子菜单 → 普通菜单项 -->
    <el-menu-item v-if="!menu.children?.length" :index="menu.path" @click="handleSelect(menu.path)">
      <el-icon><component :is="menu.meta.icon || 'Menu'" /></el-icon>
      <template #title>{{ menu.meta.title }}</template>
    </el-menu-item>

    <!-- 有子菜单 → 分组，内部递归渲染自己 -->
    <el-sub-menu v-else :index="menu.path">
      <template #title>
        <el-icon><component :is="menu.meta.icon || 'Menu'" /></el-icon>
        <span>{{ menu.meta.title }}</span>
      </template>
      <MenuTree :menus="menu.children!" />
      <!-- ★ 递归：自己渲染自己 -->
    </el-sub-menu>
  </template>
</template>
