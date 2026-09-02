import { onMounted, onUnmounted, ref } from 'vue';

/**
 * 网络状态监测
 * @returns isOnline - 当前是否在线（响应式）
 */
export function useOnline() {
  const isOnline = ref(navigator.onLine); // navigator.onLine：浏览器是否联网

  /** 状态变化时同步更新（window 的 online/offline 事件） */
  const updateStatus = () => {
    isOnline.value = navigator.onLine;
  };

  onMounted(() => {
    window.addEventListener('online', updateStatus); // 网络恢复时触发
    window.addEventListener('offline', updateStatus); // 网络断开时触发
  });

  onUnmounted(() => {
    // ★ 组件销毁时移除监听——与指令的 beforeUnmount 同理，防内存泄漏
    window.removeEventListener('online', updateStatus);
    window.removeEventListener('offline', updateStatus);
  });

  return { isOnline };
}
