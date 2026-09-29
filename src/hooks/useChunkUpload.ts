import { ref } from 'vue';
import { ElMessage } from 'element-plus';

/** 分片上传配置 */
interface ChunkUploadOptions {
  /** 分片大小（默认 5MB） */
  chunkSize?: number;
  /** 并发数（默认 3，同时最多几个片在传） */
  concurrency?: number;
  /** 上传单片的接口（FormData 形式） */
  uploadChunkApi: (formData: FormData, index: number, filename: string) => Promise<any>;
  checkApi: (filename: string) => Promise<number[]>;
  /** 合并接口 */
  mergeApi: (params: { filename: string; totalChunks: number }) => Promise<any>;
}

export function useChunkUpload(options: ChunkUploadOptions) {
  const { chunkSize = 5 * 1024 * 1024, concurrency = 3, uploadChunkApi, checkApi, mergeApi } = options;

  /** 上传进度（0-100） */
  const progress = ref(0);
  /** 是否上传中 */
  const uploading = ref(false);

  let abortFlag = false;
  let sharedController: AbortController | null = null;

  /** 核心：分片上传 */
  const uploadFile = async (file: File) => {
    uploading.value = true;
    progress.value = 0;
    abortFlag = false; //每次上传重置终止符标志
    sharedController = new AbortController(); // 本次上传的共享取消信号
    try {
      // ── ① 切片 ──
      // File.slice(start, end)：文件对象自带的方法，截取一段返回 Blob
      // 不占新内存——片只是原文件的"视图"
      const chunks: Blob[] = [];
      for (let start = 0; start < file.size; start += chunkSize) {
        chunks.push(file.slice(start, start + chunkSize));
      }
      const totalChunks = chunks.length;
      console.log(`文件 ${file.name}：${(file.size / 1024 / 1024).toFixed(2)}MB，切成 ${totalChunks}
  片`);

      // 断点续传核心：先问服务端“你有哪些片了”
      const res = await checkApi(file.name);
      const uploadedList = res.data ?? [];
      const uploadedSet = new Set(uploadedList);

      const pendingIndexes: number[] = [];
      for (let i = 0; i < totalChunks; i++) {
        if (!uploadedSet.has(i)) pendingIndexes.push(i);
      }

      console.log(`共 ${totalChunks} 片： 服务端已有 ${uploadedSet.size} 片, 待传 ${pendingIndexes.length} 片`);

      // ── ② 并发上传（Promise 池：worker 模式）── 游标指定戴传列表而不是0开始递增；
      let completedCount = uploadedSet.size;
      let cursor = 0;
      // let uploadedCount = 0; // 已完成片数
      // let nextIndex = 0;     // 下一个待上传的片序号（共享游标）

      /**
       * 单个 worker：循环领取任务
       * 所有 worker 共享 nextIndex——谁领完一片就领下一片，
       * 直到全部领完。这就是"并发池"的经典写法
       */
      let inflight = 0;
      const uploadOne = async (): Promise<void> => {
        // 循环条件加 !abortFlag，终止后不再领取新片
        while (cursor < pendingIndexes.length && !abortFlag) {
          const index = pendingIndexes[cursor++]; //从待传列表取序号，可能跳号；
          inflight++;
          console.log(`开始片${index},当前并发=${inflight}`);
          const formData = new FormData();
          formData.append('chunk', chunks[index]);
          await uploadChunkApi(formData, index, file.name, sharedController!.signal);
          completedCount++;
          progress.value = Math.round((completedCount / totalChunks) * 100);
          // progress.value = Math.round(completedCount);

          // formData.append('chunk', chunks[index]);        // 片内容（Blob）
          // formData.append('index', String(index));        // 第几片（服务端拼回时靠它排序）
          // formData.append('filename', file.name);         // 文件名
          // formData.append('totalChunks', String(totalChunks));
          // await uploadChunkApi(formData);
          // inflight--;
          // console.log(`完成片${index},当前并发=${inflight}`);
          // uploadedCount++;
          // // ★ 进度 = 已完成片数 / 总片数（每片一样大，按片数算即可）
          // progress.value = Math.round((uploadedCount / totalChunks) * 100);
        }
      };
      try {
        // 同时起 concurrency 个 worker（片数少时取小值，防止空跑）
        await Promise.all(Array.from({ length: Math.min(concurrency, pendingIndexes.length) }, () => uploadOne()));
      } catch (e) {
        // 终止时正在飞的请求会抛 CancelError ,这是预期行为，友好提示
        if (abortFlag) {
          ElMessage.warning(`已终止上传（已传 ${completedCount}/${totalChunks}片，重传时自动续传`);
          return;
        }
        throw e;
      }

      if (abortFlag) return; //终止时不走 merge

      // ── ③ 全部传完 → 通知服务端合并 ──
      await mergeApi({ filename: file.name, totalChunks });
      progress.value = 100;
      ElMessage.success('上传成功');
    } finally {
      uploading.value = false;
    }
  };

  /** ★ 主动终止上传 */
  const abortUpload = () => {
    abortFlag = true; // ① 阻止新片开始
    sharedController?.abort(); // ② 中断正在飞的请求
  };

  return { progress, uploading, uploadFile, abortUpload };
}
