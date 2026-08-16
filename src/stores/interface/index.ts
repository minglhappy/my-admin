// src/stores/interface/index.ts

/** 用户信息 */
export interface UserInfo {
  id: number;
  username: string;
  avatar: string;
}

/** 主题配置 */
export interface ThemeConfig {
  primary: string; // 主题色
  isDark: boolean; // 是否暗黑模式
  isGrey: boolean; // 是否灰色模式
  isWeak: boolean; // 是否色弱模式
  layout: string; // 布局模式（classic/columns/transverse/vertical）
  breadcrumb: boolean; // 是否显示面包屑
  tabs: boolean; // 是否显示标签页
  footer: boolean; // 是否显示页脚
}

/** 标签页项 */
export interface TabsItem {
  path: string;
  title: string;
  icon?: string;
  isKeepAlive?: boolean;
}
