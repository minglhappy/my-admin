import { createI18n } from 'vue-i18n';
import zh from './modules/zh';
import en from './modules/en';

// 从持久化数据恢复语言（模块加载时 pinia 还没激活，直接读 localStorage）
const persisted = JSON.parse(localStorage.getItem('global') || '{}');

const i18n = createI18n({
  legacy: false, // ★ 使用 Composition API 模式（useI18n）
  locale: persisted.language || 'zh',
  fallbackLocale: 'zh', // 找不到 key 时兜底中文
  messages: { zh, en },
});

export default i18n;
