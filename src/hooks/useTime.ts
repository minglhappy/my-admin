import { ref, onUnmounted } from 'vue';

/** 补零：5 → "05" */
const padZero = (n: number) => String(n).padStart(2, '0');

/**
 * 实时时钟
 * @returns nowTime - 格式化的当前时间（每秒更新）
 */
export function useTime() {
  const nowTime = ref('');

  const updateTime = () => {
    const d = new Date();
    nowTime.value = `${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(d.getDate())}
${padZero(d.getHours())}:${padZero(d.getMinutes())}:${padZero(d.getSeconds())}`;
  };

  updateTime();
  const timer = setInterval(updateTime, 1000); // 每秒刷新

  onUnmounted(() => {
    clearInterval(timer);
  });

  // Hook 里没有组件上下文也能清理：直接在模块里调度即可（演示页可忽略）
  return { nowTime };
}
