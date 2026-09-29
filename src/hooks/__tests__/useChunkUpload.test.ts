import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useChunkUpload } from '../useChunkUpload';

// ① mock element-plus：纯逻辑测试不需要真实 DOM
vi.mock('element-plus', () => ({
  ElMessage: { success: vi.fn(), warning: vi.fn(), error: vi.fn() },
}));

// ② 造假文件：指定字节数
function createFile(size: number, name = 'test.bin') {
  return new File([new Uint8Array(size)], name);
}

describe('useChunkUpload', () => {
  let uploadChunkApi: any;
  let checkApi: any;
  let mergeApi: any;

  beforeEach(() => {
    uploadChunkApi = vi.fn().mockResolvedValue({ code: 200 });
    checkApi = vi.fn().mockResolvedValue({ code: 200, data: [] });
    mergeApi = vi.fn().mockResolvedValue({ code: 200 });
  });

  function createHook() {
    return useChunkUpload({
      chunkSize: 10, // ★ 测试用小片：10 字节/片（真实项目是 2MB）
      concurrency: 3,
      uploadChunkApi,
      checkApi,
      mergeApi,
    });
  }

  // 第一个用例：最简单
  it('30 字节文件 + 10 字节/片 → 上传 3 片', async () => {
    const { uploadFile } = createHook();
    await uploadFile(createFile(30));
    expect(uploadChunkApi).toHaveBeenCalledTimes(3);
  });

  // 用例 2：完成后 merge + 进度 100
  it('全部传完后调用 merge 且进度为 100', async () => {
    const { uploadFile, progress } = createHook();
    await uploadFile(createFile(20)); // 20 字节 → 2 片

    // 断言 merge 的参数完全正确（文件名 + 总片数）
    expect(mergeApi).toHaveBeenCalledWith({ filename: 'test.bin', totalChunks: 2 });
    // 断言进度到 100（progress 是 ref，读 .value）
    expect(progress.value).toBe(100);
  });

  // 用例 3：断点续传跳过已传片
  it('check 返回已传 [0, 2] → 只传片 1', async () => {
    // ★ 覆盖 checkApi 的返回值：模拟服务端已有片 0 和片 2
    checkApi.mockResolvedValue({ code: 200, data: [0, 2] });

    const { uploadFile } = createHook();
    await uploadFile(createFile(30)); // 3 片，已有 2 片

    expect(uploadChunkApi).toHaveBeenCalledTimes(1); // 只传了 1 片
    expect(uploadChunkApi.mock.calls[0][1]).toBe(1); // 传的是片 1
  });

  // 用例 4：终止后不 merge
  it('终止上传后不调用 merge', async () => {
    let abortUpload: () => void;

    // ★ mockImplementation：自定义假函数的行为（比 mockResolvedValue 更灵活）
    uploadChunkApi.mockImplementation(async () => {
      abortUpload(); // 第一片"上传中"时立刻触发终止
    });

    const hook = createHook();
    abortUpload = hook.abortUpload;
    await hook.uploadFile(createFile(30));

    expect(mergeApi).not.toHaveBeenCalled(); // ★ 否定断言
  });

  //  用例 5：并发上限 3
  it('任意时刻在飞请求数不超过并发数 3', async () => {
    let inflight = 0; // 当前在飞数
    let maxInflight = 0; // 历史峰值

    uploadChunkApi.mockImplementation(async () => {
      inflight++;
      maxInflight = Math.max(maxInflight, inflight);
      await new Promise((r) => setTimeout(r, 5)); // 模拟 5ms 网络耗时
      inflight--;
    });

    const { uploadFile } = createHook();
    await uploadFile(createFile(100)); // 10 片

    expect(maxInflight).toBeLessThanOrEqual(3); // 峰值 ≤ 并发数
  });

  // 用例 6：上传过程中的进度递增（能抓住"过程值"类 bug）
  it('每完成一片，进度按比例递增', async () => {
    const snapshots: number[] = [];
    let callCount = 0;

    uploadChunkApi.mockImplementation(async () => {
      callCount++;
      if (callCount > 1) snapshots.push(progress.value);
    });

    // ★ 并发数设为 1：调用严格串行，时序确定
    const { uploadFile, progress } = useChunkUpload({
      chunkSize: 10,
      concurrency: 1, // ← 关键改动
      uploadChunkApi,
      checkApi,
      mergeApi,
    });

    await uploadFile(createFile(100)); // 10 片

    // 串行时序：片0完成→progress=10→片1开始（快照10）→...
    expect(snapshots[0]).toBe(10);
    expect(snapshots[1]).toBe(20);
    expect(snapshots[8]).toBe(90);
  });
});
