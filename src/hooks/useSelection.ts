import { computed, ref } from 'vue';

/**
 * 表格多选管理
 * @param rowKey - 行的主键字段名，默认 "id"
 * @returns selectedRows 选中行、selectedIds 选中行主键、handleSelectionChange 事件回调
 */
export function useSelection<T = any>(rowKey = 'id') {
  const selectedRows = ref<T[]>([]);

  /** 传给 el-table 的 @selection-change */
  const handleSelectionChange = (rows: T[]) => {
    selectedRows.value = rows;
  };

  /** 选中行的 id 列表（批量删除等场景直接用） */
  const selectedIds = computed(() => selectedRows.value.map((row: any) => row[rowKey]));

  return { selectedRows, selectedIds, handleSelectionChange };
}
