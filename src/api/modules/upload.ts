import http from '@/api';

/** 上传单个分片 */
export function uploadChunkApi(formData: FormData, index: number, filename: string, signal?: AbortSignal) {
  // ★ 注意：不要手动设置 Content-Type！
  // axios/浏览器会自动加上 multipart/form-data 和 boundary 参数
  // 手动设置反而会丢掉 boundary → 服务端无法解析
  return http.post(`/geeker/upload/chunk?index=${index}&filename=${encodeURIComponent(filename)}`, formData, { cancel: false, signal });
}

// 查询已传分片（断点续传核心）
export function checkChunkApi(filename: string) {
  return http.get<number[]>(`/geeker/upload/check?filename=${encodeURIComponent(filename)}`);
}

/** 合并分片 */
export function mergeChunksApi(params: { filename: string; totalChunks: number }) {
  return http.post('/geeker/upload/merge', params);
}
