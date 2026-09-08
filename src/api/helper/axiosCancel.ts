// src/api/helper/axiosCancel.ts
import type { CustomAxiosRequestConfig } from '@/api/index';

/** 存储每个请求的标识和取消函数 */
export class AxiosCanceler {
  private pendingMap = new Map<string, AbortController>();

  /** 生成请求的唯一标识（method + url + 参数） */
  private getKey(config: CustomAxiosRequestConfig): string {
    const { method, url, params, data } = config;
    // GET 请求用 params，POST 用 data
    const key = [method, url, JSON.stringify(params), JSON.stringify(data)].join('&');
    // 如果配置了 cancel: false，说明这个请求不需要去重
    if (config.cancel ?? true) {
      return key;
    }
    return 'no-cancel-' + key;
  }

  /** 发起请求前：取消重复的请求，并将本次请求加入队列 */
  addPending(config: CustomAxiosRequestConfig): void {
    const key = this.getKey(config);
    if (this.pendingMap.has(key)) {
      this.pendingMap.get(key)!.abort(); // 取消前一次请求
      this.pendingMap.delete(key);
    }
    const controller = new AbortController();
    config.signal = controller.signal; // 把取消信号挂到 axios 配置上
    this.pendingMap.set(key, controller);
  }

  /** 请求完成后：从队列中移除 */
  removePending(config: CustomAxiosRequestConfig): void {
    const key = this.getKey(config);
    if (this.pendingMap.has(key)) {
      this.pendingMap.delete(key);
    }
  }
}
