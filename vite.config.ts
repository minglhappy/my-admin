import { defineConfig, loadEnv, UserConfig } from 'vite';
import { resolve } from 'path';
import { createVitePlugins } from './build/plugins';
import { createProxy } from './build/proxy';
import { wrapperEnv } from './build/getEnv';
import { mockServerPlugin } from './build/mockServer';

export default defineConfig(({ mode }): UserConfig => {
  // 加载 .env.[mode] 环境变量
  const env = loadEnv(mode, process.cwd());
  const viteEnv = wrapperEnv(env);

  return {
    // 部署的基础路径（.env 中配置）
    base: viteEnv.VITE_PUBLIC_PATH,

    // 路径别名
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
      },
    },

    // CSS 配置
    css: {
      preprocessorOptions: {
        scss: {
          // ★ 关键：全局注入 var.scss，所有组件都能用里面的变量
          additionalData: `@use "@/styles/var.scss" as *;`,
        },
      },
    },

    // 开发服务器
    server: {
      port: viteEnv.VITE_PORT,
      open: viteEnv.VITE_OPEN,
      proxy: createProxy(viteEnv.VITE_PROXY),
    },

    // 插件
    plugins: [...createVitePlugins(viteEnv), mockServerPlugin()],

    // 构建配置
    build: {
      // 根据配置决定是否删除 console 和 debugger
      esbuild: {
        pure: viteEnv.VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : [],
      },
      // 分包策略
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
    },
  };
});
