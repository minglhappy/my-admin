import http from '@/api';
import type { PageResult } from '@/api/interface';

export interface UserItem {
  id: number;
  username: string;
  nickname: string;
  status: number;
  createTime: string;
}

/** 获取用户列表（分页 + 条件过滤） */
export function getUserListApi(params: any) {
  return http.post<PageResult<UserItem>>('/geeker/user/list', params);
}
