import { ref } from 'vue';
import { ElMessage } from 'element-plus';

/**
 * 文件下载
 * @param api - 下载接口（要返回 Blob 流）
 * @param filename - 保存的文件名
 */
export function useDownload(api: (params: any) => Promise<BlobPart>, filename: string) {
  const downloadLoading = ref(false);

  /** 执行下载 */
  const executeDownload = async (params: any = {}) => {
    downloadLoading.value = true;
    try {
      // ① 调接口拿二进制流（responseType: "blob" 已在 api 层配置）
      const data = await api(params);

      // ② 包成 Blob 对象
      const blob = new Blob([data], { type: 'application/vnd.ms-excel;charset=UTF-8' });

      // ③ 生成临时 URL
      const url = window.URL.createObjectURL(blob);

      // ④ 创建隐藏的 a 标签并模拟点击（浏览器才会触发下载）
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // ⑤ 释放 URL（否则临时 URL 一直占内存）
      window.URL.revokeObjectURL(url);
      ElMessage.success('导出成功');
    } finally {
      downloadLoading.value = false;
    }
  };

  return { downloadLoading, executeDownload };
}
