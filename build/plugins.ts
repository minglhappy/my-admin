import vue from '@vitejs/plugin-vue';
// import { PluginOption } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import { resolve } from 'path';
import type { Plugin, PluginOption } from 'vite';
/**
 * 创建 Vite 插件数组
 * @param viteEnv - 从 .env 解析后的环境变量
 */
export function createVitePlugins(viteEnv: ViteEnv): PluginOption[] {
  const plugins: PluginOption[] = [
    vue(),
    // HTML 注入：把 VITE_GLOB_APP_TITLE 写入 <title>
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: viteEnv.VITE_GLOB_APP_TITLE,
        },
      },
    }),
    // SVG 图标：把 src/assets/icons 下的 SVG 注册为雪碧图
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
  ];

  // 打包压缩（gzip / brotli）
  if (viteEnv.VITE_BUILD_COMPRESS && viteEnv.VITE_BUILD_COMPRESS !== 'none') {
    const compressList = viteEnv.VITE_BUILD_COMPRESS.split(',');
    compressList.forEach((compress: string) => {
      plugins.push(
        viteCompression({
          algorithm: compress as 'gzip' | 'brotliCompress',
          ext: compress === 'gzip' ? '.gz' : '.br',
          deleteOriginFile: viteEnv.VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
        })
      );
    });
  }

  // 打包分析（pnpm build:pro 后打开 stats.html 查看模块体积）
  if (viteEnv.VITE_REPORT) {
    plugins.push(
      visualizer({
        filename: 'stats.html',
        open: true,
        gzipSize: true,
      })
    );
  }

  // PWA（Progressive Web App）
  if (viteEnv.VITE_PWA) {
    plugins.push(
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{html,css,js,ico,png,svg}'],
        },
      })
    );
  }

  // 生产剔除 console（Vite 8 移除了 build.esbuild，用插件实现）
  plugins.push(dropConsolePlugin(viteEnv.VITE_DROP_CONSOLE));

  return plugins;
}

/** 生产环境剔除 console.log 和 debugger（Vite 8 已移除 build.esbuild 配置，改用插件实现） */
function dropConsolePlugin(enabled: boolean): Plugin {
  return {
    name: 'drop-console',
    apply: 'build', // 只在构建时生效，dev 保留 console
    transform(code, id) {
      if (!enabled || id.includes('node_modules')) return;
      // 按行移除整条 console.log / debugger 语句
      return code.replace(/^\s*console\.log\(.*\);?\s*$/gm, '').replace(/^\s*debugger;?\s*$/gm, '');
    },
  };
}
