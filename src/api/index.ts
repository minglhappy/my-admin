// src/api/index.ts
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import { ResultEnum } from '@/enums/httpEnum';
import { checkStatus } from './helper/checkStatus';
import { AxiosCanceler } from './helper/axiosCancel';
import type { ResultData } from '@/api/interface';

// ─── 类型扩展：给 Axios 配置加上自定义字段 ───
export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  loading?: boolean; // 是否显示全局 loading
  cancel?: boolean; // 是否允许取消重复请求
}

const axiosCanceler = new AxiosCanceler();

class RequestHttp {
  service: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.service = axios.create(config);

    /**
     * 请求拦截器
     * 发请求 → [拦截器] → 服务器
     */
    this.service.interceptors.request.use(
      (config: CustomAxiosRequestConfig) => {
        // 1. 需要取消重复请求？（默认开启）
        config.cancel ??= true;
        if (config.cancel) axiosCanceler.addPending(config);

        // 2. 需要 loading？（默认开启）
        config.loading ??= true;
        // config.loading && showFullScreenLoading();  // 后面阶段再加

        // 3. 注入 token
        const token = localStorage.getItem('token') || '';
        if (config.headers && typeof config.headers.set === 'function') {
          config.headers.set('x-access-token', token);
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    /**
     * 响应拦截器
     * 服务器返回 → [拦截器] → 你的代码拿到结果
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse & { config: CustomAxiosRequestConfig }) => {
        const { data, config } = response;

        axiosCanceler.removePending(config);
        // config.loading && tryHideFullScreenLoading();  // 后面阶段再加

        // 登录过期 → 清 token → 跳登录页
        if (data.code === ResultEnum.OVERDUE) {
          localStorage.removeItem('token');
          // router.replace(LOGIN_URL);  // 后面阶段加了路由再用
          ElMessage.error('登录已过期，请重新登录');
          return Promise.reject(data);
        }

        // 业务错误
        if (data.code && data.code !== ResultEnum.SUCCESS) {
          ElMessage.error(data.msg || '请求失败');
          return Promise.reject(data);
        }

        return data;
      },
      async (error: AxiosError) => {
        const { response } = error;

        // 超时 / 网络错误
        if (error.message.includes('timeout')) {
          ElMessage.error('请求超时！请您稍后重试');
        }
        if (error.message.includes('Network Error')) {
          ElMessage.error('网络错误！请您稍后重试');
        }
        if (!window.navigator.onLine) {
          ElMessage.error('网络已断开，请检查网络连接');
        }

        // 根据 HTTP 状态码提示
        if (response) checkStatus(response.status);

        return Promise.reject(error);
      }
    );
  }

  // ─── 5 个请求方法 ───
  get<T>(url: string, params?: object, config = {}): Promise<ResultData<T>> {
    return this.service.get(url, { params, ...config });
  }

  post<T>(url: string, params?: object, config = {}): Promise<ResultData<T>> {
    return this.service.post(url, params, config);
  }

  put<T>(url: string, params?: object, config = {}): Promise<ResultData<T>> {
    return this.service.put(url, params, config);
  }

  delete<T>(url: string, params?: object, config = {}): Promise<ResultData<T>> {
    return this.service.delete(url, { params, ...config });
  }

  /** 文件下载（返回 Blob） */
  download(url: string, params?: object, config = {}): Promise<BlobPart> {
    return this.service.post(url, params, { ...config, responseType: 'blob' });
  }
}

// ─── 导出单例（整个应用共用这一个实例） ───
const http = new RequestHttp({
  baseURL: import.meta.env.VITE_API_URL as string,
  timeout: ResultEnum.TIMEOUT,
  withCredentials: true, // 跨域请求携带 cookie
});

export default http;
