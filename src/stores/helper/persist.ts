// src/stores/helper/persist.ts
import type { PersistenceOptions } from 'pinia-plugin-persistedstate';

/** 创建 Pinia 持久化配置（localStorage） */
export function createPersistedState(key: string, paths: string[] = []): PersistenceOptions {
  return {
    key, // localStorage 中的 key 名
    storage: localStorage, // 存储介质
    pick: paths, // 只持久化指定的字段（空数组 = 全部持久化）
  };
}
