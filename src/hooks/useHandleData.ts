import { ElMessage, ElMessageBox } from 'element-plus';

/**
 * 二次确认删除
 * @param deleteApi - 删除接口
 * @param refreshFn - 删除成功后的回调（通常是刷新列表）
 * @param message - 确认框提示文字
 */
export function useHandleData(deleteApi: (id: number | string) => Promise<any>, refreshFn: () => void, message = '确定删除吗？') {
  /** 确认删除：弹框 → 调接口 → 刷新 */
  const handleDelete = async (id: number | string) => {
    try {
      await ElMessageBox.confirm(message, '提示', { type: 'warning' });
      await deleteApi(id);
      ElMessage.success('删除成功');
      refreshFn();
    } catch (e) {
      // 用户点了"取消"会走这里（confirm 被 reject），静默处理即可
    }
  };

  return { handleDelete };
}
