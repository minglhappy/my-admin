import { onBeforeUnmount, ref } from 'vue';

interface UsePollingOptions<T> {
  /** 拉取函数（返回要展示的数据本身） */
  fetchFn: () => Promise<T>;
  /** 轮询间隔（毫秒），默认 30 秒 */
  interval?: number;
  /** 开始后是否立即拉一次，默认 true */
  immediate?: boolean;
  /** 页面切后台时自动暂停，默认 true */
  pauseOnHidden?: boolean;
}

export function usePolling<T>(options: UsePollingOptions<T>) {
  const { fetchFn, interval = 30000, immediate = true, pauseOnHidden = true } = options;

  const data = ref<T>();
  const loading = ref(false);
  const isPolling = ref(false);
  const lastUpdate = ref<Date>();

  let timer: ReturnType<typeof setInterval> | null = null;
  let requestSeq = 0; // ★ 请求序号：竞态防护的核心

  /** 拉取一次数据 */
  const fetchOnce = async () => {
    const seq = ++requestSeq; // 领号
    loading.value = true;
    try {
      const result = await fetchFn();
      // ★ 只有最新序号的结果才被采纳——迟到的旧响应直接丢弃
      if (seq === requestSeq) {
        data.value = result;
        lastUpdate.value = new Date();
      }
    } finally {
      if (seq === requestSeq) loading.value = false;
    }
  };

  /** 开始轮询 */
  const start = () => {
    if (isPolling.value) return; // 防重复启动
    isPolling.value = true;
    if (immediate) fetchOnce();
    timer = setInterval(fetchOnce, interval);
  };

  /** 停止轮询 */
  const stop = () => {
    isPolling.value = false;
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  /** 立即手动刷新一次（不影响轮询节奏） */
  const refresh = () => fetchOnce();

  // ★ 页面可见性：切后台暂停、切回恢复
  const handleVisibility = () => {
    if (document.hidden) stop();
    else start();
  };
  if (pauseOnHidden) {
    document.addEventListener('visibilitychange', handleVisibility);
  }

  onBeforeUnmount(() => {
    stop();
    if (pauseOnHidden) {
      document.removeEventListener('visibilitychange', handleVisibility);
    }
  });

  return { data, loading, isPolling, lastUpdate, start, stop, refresh };
}
