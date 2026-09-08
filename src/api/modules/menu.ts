import http from '@/api';

/** 获取菜单列表（登录后调用，返回当前角色的菜单） */
export function getMenuListApi() {
  return http.get<Menu.MenuOptions[]>('/geeker/menu/list');
}
