import http from '@/api';

/** 获取按钮权限码列表（登录后调用） */
export function getAuthButtonsApi() {
  return http.get<string[]>('/geeker/auth/buttons');
}
