// build/getEnv.ts

/** 判断是否是开发模式 */
export function isDevFn(mode: string): boolean {
  return mode === 'development';
}

/** 判断是否是生产模式 */
export function isProdFn(mode: string): boolean {
  return mode === 'production';
}

/** 判断是否是测试模式 */
export function isTestFn(mode: string): boolean {
  return mode === 'test';
}

/** 读取所有环境变量配置（从 .env 文件加载的） */
/**
 * 将 .env 中的字符串值转为正确的类型
 * "true"/"false" → boolean
 * "8848" → number
 */
export function wrapperEnv(envConf: Record<string, any>): ViteEnv {
  const ret: any = {};

  for (const key of Object.keys(envConf)) {
    let val = envConf[key];
    if (val === 'true' || val === 'false') {
      ret[key] = val === 'true';
    } else if (key === 'VITE_PORT') {
      ret[key] = Number(val);
    } else if (key === 'VITE_PROXY' && val) {
      try {
        ret[key] = JSON.parse(val);
      } catch {
        ret[key] = val;
      }
    } else {
      ret[key] = val;
    }
  }

  return ret;
}
