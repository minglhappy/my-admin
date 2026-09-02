import { useGlobalStore } from '@/stores/modules/global';

/** 十六进制颜色 → RGB 数组（#009688 → [0, 150, 136]） */
function hexToRgb(hex: string): number[] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/** 与白色混合（level 越大越浅），生成浅色变体 */
function mixWhite(hex: string, level: number): string {
  const [r, g, b] = hexToRgb(hex);
  const mix = (c: number) => Math.round(c + (255 - c) * level);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

/**
 * 主题切换
 */
export function useTheme() {
  const globalStore = useGlobalStore();

  /** 切换主题色 */
  const changePrimary = (color: string) => {
    // ① 持久化到 store（刷新不丢）
    globalStore.setThemeConfig({ primary: color });

    // ② 修改根元素的 CSS 变量
    const el = document.documentElement;
    el.style.setProperty('--el-color-primary', color);
    // Element 组件用到 8 个浅色变体（hover 态、禁用态等），一并覆盖
    [3, 5, 7, 8, 9].forEach((level) => {
      el.style.setProperty(`--el-color-primary-light-${level}`, mixWhite(color, level * 0.1));
    });
  };

  return { changePrimary };
}
