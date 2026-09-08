import type { PluginOption } from 'vite';
import mockServer from 'vite-plugin-mock-server';

/** 本地 Mock 服务器插件（只在开发环境生效） */
export function mockServerPlugin(): PluginOption {
  return mockServer({
    logLevel: 'info',
    urlPrefixes: ['/geeker/'], // 拦截这个前缀的所有请求
    mockRootDir: 'mock', // 处理器文件目录
    mockJsSuffix: '.js',
    noHandlerResponse404: true, // 没有匹配的处理器时返回 404
    middlewares: [
      // ★ 手动解析 JSON 请求体（插件默认不解析，req.body 会是 undefined）
      (req, _res, next) => {
        let raw = '';
        req.on('data', (chunk) => (raw += chunk));
        req.on('end', () => {
          try {
            (req as any).body = raw ? JSON.parse(raw) : {};
          } catch {
            (req as any).body = {};
          }
          next();
        });
      },
    ],
  });
}
