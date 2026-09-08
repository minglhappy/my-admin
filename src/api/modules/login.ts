// src/api/modules/login.ts
import http from '@/api';

/** 登录请求参数 */
export interface LoginParams {
  username: string;
  password: string;
}

/** 登录响应（token） */
export interface LoginResult {
  access_token: string;
}

/** 登录接口 */
export function loginApi(params: LoginParams) {
  return http.post<LoginResult>('/geeker/login', params);
}
