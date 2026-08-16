import vue from '@vitejs/plugin-vue';
import { PluginOption } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import { resolve } from 'path';

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
    compressList.forEach((compress) => {
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

  return plugins;
}
