// src/typings/global.d.ts
declare namespace Menu {
  interface MenuOptions {
    path: string;
    name: string;
    component?: string;
    redirect?: string;
    meta: {
      title: string;
      icon?: string;
      isKeepAlive?: boolean;
      isHide?: boolean;
    };
    children?: MenuOptions[];
  }
}

declare module 'virtual:svg-icons-register';
