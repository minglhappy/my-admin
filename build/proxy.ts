import type { ProxyOptions } from 'vite';

type ProxyItem = [string, string]; // [匹配前缀, 目标地址]
type ProxyList = ProxyItem[]; // 代理列表
type ProxyTargetList = Record<string, ProxyOptions>; // Vite 需要的格式

/** 根据 .env 中的代理配置生成 Vite 代理规则 */
export function createProxy(list: ProxyList = []) {
  const ret: ProxyTargetList = {};
  for (const [prefix, target] of list) {
    const isHttps = target.startsWith('https://');
    ret[prefix] = {
      target, // 目标服务器地址
      changeOrigin: true, // 修改请求头中的 host（伪装成同源）
      ws: true, // 支持 WebSocket 代理
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ''), // 去掉前缀
      // 如果是 https 且有证书问题，跳过验证
      ...(isHttps ? { secure: false } : {}),
    };
  }
  return ret;
}
